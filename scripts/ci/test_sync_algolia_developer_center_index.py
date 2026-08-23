#!/usr/bin/env python3
"""Regression tests for localized Hardware Algolia record generation."""

from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).with_name("sync_algolia_developer_center_index.py")
SPEC = importlib.util.spec_from_file_location("hardware_algolia_index", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class LocalizedRecordTests(unittest.TestCase):
    def test_localizes_section_metadata(self) -> None:
        docs_dir = Path("/tmp/docs")

        self.assertEqual(
            MODULE.section_for_path(docs_dir / "reference/bsp.md", docs_dir, "ja"),
            "リファレンス",
        )
        self.assertEqual(
            MODULE.section_for_path(docs_dir / "tools/serial.mdx", docs_dir, "ko"),
            "도구",
        )
        self.assertEqual(
            MODULE.section_for_path(docs_dir / "index.mdx", docs_dir, "uk"),
            "Апаратне забезпечення",
        )

    def test_generates_language_specific_records_and_routes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docs_dir = root / "docs"
            localized_dir = (
                root
                / "i18n"
                / "ja"
                / "docusaurus-plugin-content-docs"
                / "current"
            )
            (docs_dir / "hardware").mkdir(parents=True)
            (localized_dir / "hardware").mkdir(parents=True)
            (docs_dir / "hardware" / "guide.md").write_text(
                "# Guide\nEnglish body.\n",
                encoding="utf-8",
            )
            (localized_dir / "hardware" / "guide.md").write_text(
                "# ガイド\n日本語本文。\n",
                encoding="utf-8",
            )

            records, summary = MODULE.generate_records(
                docs_dir,
                "https://build.neat.sima.ai",
                MODULE.DEFAULT_MAX_RECORD_BYTES,
                root / "i18n",
            )

            self.assertEqual(summary["by_language"], {"en": 1, "ja": 1})
            by_language = {record["language"]: record for record in records}
            self.assertEqual(by_language["en"]["route"], "/hardware/guide")
            self.assertEqual(by_language["ja"]["route"], "/ja/hardware/guide")
            self.assertNotEqual(by_language["en"]["objectID"], by_language["ja"]["objectID"])

    def test_language_filter_setting_preserves_existing_facets(self) -> None:
        class RecordingClient(MODULE.AlgoliaClient):
            def __init__(self) -> None:
                self.index = "docs"
                self.calls = []

            def request(self, method: str, path: str, payload: dict | None = None) -> dict:
                self.calls.append((method, path, payload))
                if method == "GET" and path.endswith("/settings"):
                    return {"attributesForFaceting": ["source"]}
                if method == "PUT":
                    return {"taskID": 42}
                return {"status": "published"}

        client = RecordingClient()
        client.ensure_language_filter()

        self.assertEqual(
            client.calls[-2],
            (
                "PUT",
                "/1/indexes/docs/settings",
                {"attributesForFaceting": ["source", "filterOnly(language)"]},
            ),
        )
        self.assertEqual(
            client.calls[-1],
            ("GET", "/1/indexes/docs/task/42", None),
        )

    def test_waits_until_algolia_task_is_published(self) -> None:
        class TaskClient(MODULE.AlgoliaClient):
            def __init__(self) -> None:
                self.index = "docs"
                self.statuses = iter(["notPublished", "published"])
                self.calls = []

            def request(self, method: str, path: str, payload: dict | None = None) -> dict:
                self.calls.append((method, path, payload))
                return {"status": next(self.statuses)}

        client = TaskClient()
        client.wait_for_task(123, timeout_seconds=1, poll_interval_seconds=0)

        self.assertEqual(
            client.calls,
            [
                ("GET", "/1/indexes/docs/task/123", None),
                ("GET", "/1/indexes/docs/task/123", None),
            ],
        )

    def test_batch_waits_for_algolia_task(self) -> None:
        class BatchClient(MODULE.AlgoliaClient):
            def __init__(self) -> None:
                self.index = "docs"
                self.waited_for = None

            def post(self, path: str, payload: dict) -> dict:
                self.batch_call = (path, payload)
                return {"taskID": 84}

            def wait_for_task(self, task_id, **kwargs) -> None:
                self.waited_for = task_id

        client = BatchClient()
        requests = [{"action": "deleteObject", "body": {"objectID": "stale"}}]
        client.batch(requests)

        self.assertEqual(client.batch_call, ("/1/indexes/docs/batch", {"requests": requests}))
        self.assertEqual(client.waited_for, 84)

    def test_finds_only_untagged_legacy_cross_source_records(self) -> None:
        class BrowseClient(MODULE.AlgoliaClient):
            def __init__(self) -> None:
                self.index = "docs"

            def post(self, path: str, payload: dict) -> dict:
                self.assert_payload = payload
                return {
                    "hits": [
                        {"objectID": "software-legacy", "source": "Software"},
                        {"objectID": "examples-legacy", "source": "examples", "language": ""},
                        {"objectID": "software-ja", "source": "software", "language": "ja"},
                        {"objectID": "hardware-legacy", "source": "hardware"},
                    ]
                }

        client = BrowseClient()

        self.assertEqual(
            client.browse_untagged_cross_source_object_ids(),
            ["software-legacy", "examples-legacy"],
        )
        self.assertIn("language", client.assert_payload["attributesToRetrieve"])


if __name__ == "__main__":
    unittest.main()
