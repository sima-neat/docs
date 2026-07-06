#!/usr/bin/env python3
"""Generate and sync Developer Center Algolia records for the docs repo."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


SOURCE = "hardware"
DEFAULT_MAX_RECORD_BYTES = 9_500
DEFAULT_BATCH_SIZE = 500
SKIP_PARTS = {"build", "node_modules", ".git"}
EXTENSIONS = {".md", ".mdx"}

# A record's URL is pruned only when the live site gives a DEFINITIVE "gone" response.
# 403 covers the S3 "AccessDenied" pages this reaper was built to remove; 404/410 are the
# canonical missing statuses. Every other non-200 (5xx, 429, 408, 401, ...) is treated as
# transient/ambiguous and must never trigger deletion.
DEAD_HTTP_STATUSES = frozenset({403, 404, 410})
# HEAD is unreliable for these statuses; confirm the real status with a follow-up GET.
HEAD_RETRY_STATUSES = frozenset({403, 405, 501})


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate or sync hardware docs records in the shared Developer Center Algolia index.",
    )
    parser.add_argument("--docs-dir", default="docs", help="Docs root directory.")
    parser.add_argument("--site-base-url", required=True, help="Public sysdoc base URL.")
    parser.add_argument("--records-json", help="Write generated records to this JSON file.")
    parser.add_argument("--input-records-json", help="Read records from this JSON file instead of generating them.")
    parser.add_argument("--summary-json", help="Write generation summary to this JSON file.")
    parser.add_argument("--app-id", help="Algolia app ID.")
    parser.add_argument("--api-key", help="Algolia write API key.")
    parser.add_argument("--index-name", help="Algolia index name.")
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE)
    parser.add_argument("--max-record-bytes", type=int, default=DEFAULT_MAX_RECORD_BYTES)
    parser.add_argument("--generate-only", action="store_true", help="Only generate records; do not upload.")
    parser.add_argument("--sync", action="store_true", help="Upload records and remove stale records for this source.")
    parser.add_argument(
        "--prune-dead-links",
        action="store_true",
        help="Browse every record in the shared index, HEAD-check each URL, and delete records whose URL is not reachable (HTTP 200). Runs independently of generation/sync.",
    )
    parser.add_argument("--prune-timeout", type=float, default=10.0, help="Per-URL timeout (seconds) for --prune-dead-links checks.")
    parser.add_argument("--prune-concurrency", type=int, default=16, help="Number of URL checks to run in parallel for --prune-dead-links (bounded thread pool).")
    parser.add_argument("--dry-run", action="store_true", help="With --prune-dead-links, report what would be deleted without deleting.")
    parser.add_argument("--versions-json", help="Path to versions.json; its %%key%% tokens are substituted into record content so the index matches the rendered site. Defaults to <repo>/src/versions.json.")
    return parser.parse_args()


def default_versions_path() -> Path:
    # scripts/ci/sync_algolia_developer_center_index.py -> repo root is parents[2].
    return Path(__file__).resolve().parents[2] / "src" / "versions.json"


def load_versions(versions_json: str | None) -> dict[str, str]:
    """Load %key% -> value substitutions, mirroring src/versions.cjs: versions.json provides
    the defaults and the matching SCREAMING_SNAKE env var (e.g. PLATFORM_VERSION) overrides
    each key at build time, so the indexed content stays identical to what the Docusaurus
    remark plugin renders."""
    path = Path(versions_json) if versions_json else default_versions_path()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"[algolia-index] versions file not found ({path}); skipping token substitution")
        return {}
    if not isinstance(data, dict):
        raise SystemExit(f"versions file must contain a JSON object: {path}")
    versions = {str(key): str(value) for key, value in data.items()}
    for key in versions:
        env_override = os.environ.get(key.upper())
        if env_override:
            versions[key] = env_override
    return versions


def substitute_versions(text: str, versions: dict[str, str]) -> str:
    """Replace %key% tokens (only keys defined in versions) with their values. Mirrors
    src/remark/substituteVersions.cjs so search content/snippets never show a raw token and
    version queries match the rendered pages."""
    if not versions:
        return text
    pattern = re.compile("%(" + "|".join(re.escape(key) for key in versions) + ")%")
    return pattern.sub(lambda match: versions[match.group(1)], text)


def strip_frontmatter(text: str) -> str:
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            return text[end + 5 :]
    return text


def clean_markdown(text: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def title_from_markdown(path: Path, text: str) -> str:
    for line in text.splitlines():
        match = re.match(r"^#\s+(.+?)\s*$", line.strip())
        if match:
            return clean_markdown(match.group(1))
    return path.stem.replace("-", " ").replace("_", " ").title()


def section_for_path(path: Path, docs_dir: Path) -> str:
    rel = path.relative_to(docs_dir).as_posix()
    if rel.startswith("hardware/"):
        return "Hardware"
    if rel.startswith("reference/"):
        return "References"
    if rel.startswith("tools/"):
        return "Tools"
    return "Hardware"


def route_for_path(path: Path, docs_dir: Path, site_base_url: str) -> str:
    rel = path.relative_to(docs_dir).as_posix()
    stem = rel.rsplit(".", 1)[0]
    if stem.endswith("/index"):
        stem = stem[: -len("/index")]
    if stem == "index":
        stem = ""
    if not stem.startswith("hardware"):
        stem = f"hardware/{stem}" if stem else "hardware"
    route = f"/{stem}".rstrip("/")
    if route == "":
        route = "/hardware"
    return f"{site_base_url.rstrip('/')}{route}"


def record_size(record: dict) -> int:
    return len(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))


def fit_record(record: dict, max_record_bytes: int) -> tuple[dict, bool]:
    if record_size(record) <= max_record_bytes:
        return record, False

    content = str(record.get("content", ""))
    lo = 0
    hi = len(content)
    best = ""
    while lo <= hi:
        mid = (lo + hi) // 2
        candidate = dict(record)
        candidate["content"] = content[:mid]
        candidate["content_truncated"] = True
        if record_size(candidate) <= max_record_bytes:
            best = candidate["content"]
            lo = mid + 1
        else:
            hi = mid - 1

    record["content"] = best
    record["content_truncated"] = True
    if record_size(record) > max_record_bytes:
        record["title"] = str(record.get("title", ""))[:120]
        record["content"] = str(record.get("content", ""))[:400]
        record["content_truncated"] = True
    if record_size(record) > max_record_bytes:
        raise RuntimeError(f"unable to fit record under {max_record_bytes} bytes: {record.get('path')}")
    return record, True


def generate_records(docs_dir: Path, site_base_url: str, max_record_bytes: int, versions: dict[str, str]) -> tuple[list[dict], dict]:
    docs_dir = docs_dir.resolve()
    records: list[dict] = []
    by_section: dict[str, int] = {}
    trimmed = 0
    max_seen = 0

    # (path, rel, section, url) sources: every markdown file under docs/ (served under
    # /hardware), plus the agent onboarding page which lives in src/pages/ and is served
    # at the site root (/agents) because it spans the hardware AND software pillars.
    sources: list[tuple[Path, str, str, str]] = []
    for path in sorted(docs_dir.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in EXTENSIONS:
            continue
        if any(part in SKIP_PARTS for part in path.relative_to(docs_dir).parts):
            continue
        rel = path.relative_to(docs_dir).as_posix()
        sources.append((path, rel, section_for_path(path, docs_dir), route_for_path(path, docs_dir, site_base_url)))

    agents_page = docs_dir.parent / "src" / "pages" / "agents.md"
    if agents_page.is_file():
        sources.append((agents_page, "src/pages/agents.md", "Agents", f"{site_base_url.rstrip('/')}/agents"))

    for path, rel, section, url in sources:
        # Substitute %platform_version% (and any other versions.json key) up front so both the
        # title and the cleaned body carry real values — matching the rendered, remark-processed
        # page instead of indexing the literal token.
        raw = substitute_versions(strip_frontmatter(path.read_text(encoding="utf-8")), versions)
        body = clean_markdown(raw)
        if not body:
            continue

        title = title_from_markdown(path, raw)
        route = urllib.parse.urlparse(url).path or "/hardware"
        record = {
            "objectID": f"{SOURCE}:{hashlib.sha1(rel.encode('utf-8')).hexdigest()}",
            "source": SOURCE,
            "url": url,
            "route": route,
            "path": rel,
            "section": section,
            "category": section,
            "title": title,
            "content": body[:20_000],
            "hierarchy": {"lvl0": section, "lvl1": title},
        }
        record, was_trimmed = fit_record(record, max_record_bytes)
        trimmed += int(was_trimmed)
        max_seen = max(max_seen, record_size(record))
        records.append(record)
        by_section[section] = by_section.get(section, 0) + 1

    summary = {
        "source": SOURCE,
        "count": len(records),
        "by_section": by_section,
        "trimmed_records": trimmed,
        "max_record_bytes": max_seen,
    }
    return records, summary


class AlgoliaClient:
    def __init__(self, app_id: str, api_key: str, index_name: str) -> None:
        self.host = f"https://{app_id}.algolia.net"
        self.index = urllib.parse.quote(index_name, safe="")
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Algolia-Application-Id": app_id,
            "X-Algolia-API-Key": api_key,
        }

    def post(self, path: str, payload: dict) -> dict:
        request = urllib.request.Request(
            self.host + path,
            data=json.dumps(payload).encode("utf-8"),
            headers=self.headers,
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            body = error.read().decode("utf-8", errors="replace")
            if error.code == 404 and path.endswith("/browse"):
                return {"hits": []}
            raise SystemExit(f"Algolia API error: HTTP {error.code} on {path}\n{body}") from error

    def browse_source_object_ids(self, source: str) -> list[str]:
        object_ids: list[str] = []
        payload = {"query": "", "attributesToRetrieve": ["objectID", "source"], "hitsPerPage": 1000}
        while True:
            result = self.post(f"/1/indexes/{self.index}/browse", payload)
            for hit in result.get("hits", []):
                if hit.get("source") == source and hit.get("objectID"):
                    object_ids.append(hit["objectID"])
            cursor = result.get("cursor")
            if not cursor:
                return object_ids
            payload = {"cursor": cursor}

    def browse_all_records(self) -> list[dict]:
        """Return every record in the shared index (all sources) with its objectID, url, and source."""
        records: list[dict] = []
        payload = {
            "query": "",
            "attributesToRetrieve": ["objectID", "url", "route", "source"],
            "hitsPerPage": 1000,
        }
        while True:
            result = self.post(f"/1/indexes/{self.index}/browse", payload)
            for hit in result.get("hits", []):
                if hit.get("objectID"):
                    records.append(hit)
            cursor = result.get("cursor")
            if not cursor:
                return records
            payload = {"cursor": cursor}

    def batch(self, requests: list[dict]) -> None:
        if not requests:
            return
        result = self.post(f"/1/indexes/{self.index}/batch", {"requests": requests})
        print(f"[algolia-index] taskID={result.get('taskID')} requests={len(requests)}")


def url_is_accessible(url: str, timeout: float) -> bool | None:
    """Return True if the URL returns HTTP 200, False if it returns a definitive "gone" status
    (403 AccessDenied / 404 / 410), or None when the result is ambiguous and must NOT trigger
    deletion: transient HTTP statuses (5xx, 429, 408, 401, ...) and network errors (timeout,
    DNS, connection reset). Callers must treat None as "do not delete" so a temporary
    origin/CDN/throttling blip never prunes a live page from the index.
    """
    headers = {"User-Agent": "developer-center-index-reaper/1.0"}

    def probe(method: str) -> str:
        # Verdict is one of: "ok" (200), "dead" (definitive gone), "retry" (HEAD rejected,
        # confirm with GET), or "skip" (transient HTTP status or network error — do not delete).
        request = urllib.request.Request(url, headers=headers, method=method)
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return "ok" if response.status == 200 else "skip"
        except urllib.error.HTTPError as error:
            if method == "HEAD" and error.code in HEAD_RETRY_STATUSES:
                return "retry"
            if error.code in DEAD_HTTP_STATUSES:
                return "dead"
            return "skip"  # transient (5xx, 429, 408, ...) or otherwise non-definitive
        except (urllib.error.URLError, TimeoutError, OSError):
            return "skip"  # timeout, DNS, connection reset

    verdict = probe("HEAD")
    if verdict == "retry":
        # HEAD was rejected at the method level — confirm the real status with a GET.
        verdict = probe("GET")
    return {"ok": True, "dead": False}.get(verdict)  # "skip"/"retry" -> None


def prune_dead_links(args: argparse.Namespace) -> None:
    if not args.app_id or not args.api_key or not args.index_name:
        raise SystemExit("--app-id, --api-key, and --index-name are required for --prune-dead-links")

    client = AlgoliaClient(args.app_id, args.api_key, args.index_name)
    records = client.browse_all_records()
    # Skip this pipeline's OWN source. The --sync step that runs just before this reconciles
    # every "hardware" record deterministically against the freshly-built record set (objectID
    # set-diff, no HTTP), so re-probing them here is both redundant AND the only thing exposed to
    # the stale-CDN race: a page we just deployed may not have propagated through CloudFront yet,
    # and probing its still-cached 404/403 would wrongly delete it. We have no such local source
    # of truth for cross-source records (software/examples), so those still need a live probe.
    own_source = sum(1 for record in records if record.get("source") == SOURCE)
    candidates = [
        record
        for record in records
        if record.get("url") and record.get("source") != SOURCE
    ]
    workers = max(1, args.prune_concurrency)
    print(
        f"[algolia-reaper] browsing shared index: {len(records)} records "
        f"(skip {own_source} own-source '{SOURCE}', checking {len(candidates)} cross-source URLs "
        f"with {workers} workers)"
    )

    def classify(record: dict) -> tuple[dict, bool | None, str]:
        # Never let a single malformed URL or unexpected error abort the whole prune; an
        # unexpected failure is treated as ambiguous (None) so it is skipped, never deleted.
        try:
            return record, url_is_accessible(record["url"], args.prune_timeout), "ambiguous"
        except Exception as error:  # noqa: BLE001 - fail safe over fail loud during a destructive prune
            return record, None, f"probe error: {error}"

    dead: list[dict] = []
    skipped = 0
    checked = 0
    # Bounded concurrency: URL checks are I/O-bound and independent, so a small thread pool
    # cuts wall-clock from minutes to seconds without hammering the origin. executor.map yields
    # results in submission order, keeping the per-URL log deterministic.
    with ThreadPoolExecutor(max_workers=workers) as pool:
        for record, accessible, reason in pool.map(classify, candidates):
            checked += 1
            if accessible is True:
                continue
            if accessible is None:
                skipped += 1
                print(f"[algolia-reaper] skip ({reason}, not deleting): {record['url']}")
                continue
            dead.append(record)
            print(f"[algolia-reaper] dead ({record.get('source', '?')}): {record['url']}")

    print(f"[algolia-reaper] checked={checked} dead={len(dead)} skipped={skipped}")
    if not dead:
        print("[algolia-reaper] no dead links found")
        return

    if args.dry_run:
        print(f"[algolia-reaper] dry-run: would delete {len(dead)} records:")
        for record in dead:
            print(f"  - {record['objectID']} {record.get('url')}")
        return

    dead_ids = [record["objectID"] for record in dead]
    for start in range(0, len(dead_ids), args.batch_size):
        chunk = dead_ids[start : start + args.batch_size]
        client.batch([{"action": "deleteObject", "body": {"objectID": object_id}} for object_id in chunk])
    print(f"[algolia-reaper] deleted {len(dead_ids)} dead records")


def sync_records(args: argparse.Namespace, records: list[dict]) -> None:
    if not args.app_id or not args.api_key or not args.index_name:
        raise SystemExit("--app-id, --api-key, and --index-name are required for --sync")

    client = AlgoliaClient(args.app_id, args.api_key, args.index_name)
    desired_ids = {record["objectID"] for record in records}
    existing_ids = set(client.browse_source_object_ids(SOURCE))
    stale_ids = sorted(existing_ids - desired_ids)

    print(f"[algolia-index] existing {SOURCE} records={len(existing_ids)} stale={len(stale_ids)}")
    for start in range(0, len(stale_ids), args.batch_size):
        chunk = stale_ids[start : start + args.batch_size]
        client.batch([{"action": "deleteObject", "body": {"objectID": object_id}} for object_id in chunk])

    print(f"[algolia-index] uploading {len(records)} {SOURCE} records...")
    for start in range(0, len(records), args.batch_size):
        chunk = records[start : start + args.batch_size]
        client.batch([{"action": "addObject", "body": record} for record in chunk])


def main() -> int:
    args = parse_args()
    if args.batch_size < 1:
        raise SystemExit("--batch-size must be positive")
    if args.max_record_bytes < 2_000:
        raise SystemExit("--max-record-bytes must be at least 2000")

    if args.prune_dead_links:
        prune_dead_links(args)
        return 0

    if not args.generate_only and not args.sync:
        args.generate_only = True

    if args.input_records_json:
        records = json.loads(Path(args.input_records_json).read_text(encoding="utf-8"))
        if not isinstance(records, list):
            raise SystemExit("--input-records-json must contain a JSON list")
        summary = {
            "source": SOURCE,
            "count": len(records),
            "from": args.input_records_json,
        }
        print("[algolia-index] loaded records:")
    else:
        versions = load_versions(args.versions_json)
        records, summary = generate_records(Path(args.docs_dir), args.site_base_url, args.max_record_bytes, versions)
        print("[algolia-index] generated records:")
    print(json.dumps(summary, indent=2))

    if args.records_json and not args.input_records_json:
        Path(args.records_json).write_text(json.dumps(records, ensure_ascii=True), encoding="utf-8")
    if args.summary_json:
        Path(args.summary_json).write_text(json.dumps(summary, indent=2), encoding="utf-8")
    if args.sync:
        sync_records(args, records)
    return 0


if __name__ == "__main__":
    sys.exit(main())
