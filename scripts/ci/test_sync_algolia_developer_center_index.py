#!/usr/bin/env python3
"""Regression tests for localized Hardware Algolia record generation."""

from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock


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

    def test_generated_routes_exclude_deployment_base_path(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docs_dir = root / "docs"
            docs_dir.mkdir()
            (docs_dir / "guide.md").write_text("# Guide\nEnglish body.\n", encoding="utf-8")

            records, _ = MODULE.generate_records(
                docs_dir,
                "https://build.neat.sima.ai/docs/",
                MODULE.DEFAULT_MAX_RECORD_BYTES,
                root / "i18n",
            )

            self.assertEqual(records[0]["url"], "https://build.neat.sima.ai/docs/hardware/guide")
            self.assertEqual(records[0]["route"], "/hardware/guide")

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

    def test_finds_all_untagged_legacy_records(self) -> None:
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
            client.browse_untagged_object_ids(),
            ["software-legacy", "examples-legacy", "hardware-legacy"],
        )
        self.assertIn("language", client.assert_payload["attributesToRetrieve"])

    def test_sync_uploads_replacements_before_deleting_stale_records(self) -> None:
        client = mock.Mock()
        client.browse_untagged_object_ids.return_value = []
        client.browse_source_object_ids.return_value = ["hardware:legacy"]
        args = SimpleNamespace(
            app_id="app",
            api_key="key",
            index_name="docs",
            batch_size=100,
        )
        records = [{"objectID": "hardware:replacement", "source": MODULE.SOURCE}]

        with mock.patch.object(MODULE, "AlgoliaClient", return_value=client):
            MODULE.sync_records(args, records)

        self.assertEqual(
            client.batch.call_args_list,
            [
                mock.call([{"action": "addObject", "body": records[0]}]),
                mock.call(
                    [
                        {
                            "action": "deleteObject",
                            "body": {"objectID": "hardware:legacy"},
                        }
                    ]
                ),
            ],
        )

    def test_sync_preserves_stale_records_when_replacement_upload_fails(self) -> None:
        client = mock.Mock()
        client.browse_untagged_object_ids.return_value = []
        client.browse_source_object_ids.return_value = ["hardware:legacy"]
        client.batch.side_effect = RuntimeError("upload failed")
        args = SimpleNamespace(
            app_id="app",
            api_key="key",
            index_name="docs",
            batch_size=100,
        )
        records = [{"objectID": "hardware:replacement", "source": MODULE.SOURCE}]

        with mock.patch.object(MODULE, "AlgoliaClient", return_value=client):
            with self.assertRaisesRegex(RuntimeError, "upload failed"):
                MODULE.sync_records(args, records)

        client.batch.assert_called_once_with(
            [{"action": "addObject", "body": records[0]}]
        )

    def test_configures_language_facet_and_backfills_legacy_records(self) -> None:
        client = mock.Mock()
        client.browse_untagged_object_ids.return_value = ["hardware:legacy"]
        args = SimpleNamespace(app_id="app", api_key="key", index_name="docs", batch_size=100)

        with mock.patch.object(MODULE, "AlgoliaClient", return_value=client):
            MODULE.configure_language_facet(args)

        client.ensure_language_filter.assert_called_once_with()
        client.browse_untagged_object_ids.assert_called_once_with()
        client.batch.assert_called_once_with(
            [
                {
                    "action": "partialUpdateObject",
                    "body": {"objectID": "hardware:legacy", "language": MODULE.DEFAULT_LOCALE},
                }
            ]
        )
        client.browse_source_object_ids.assert_not_called()


SITE = "https://build.neat.sima.ai"
I18N_DOCS = Path("docusaurus-plugin-content-docs") / "current"

PLAIN_DOC = (
    "---\ntitle: Plain\n---\n\nimport Tabs from '@theme/Tabs';\n\n# Plain Page\n\n"
    "Prose with `code`, a [link](./x.md), and <Tabs>tabs</Tabs>.\n"
)
PLAIN_DOC_JA = "import Tabs from '@theme/Tabs';\n\n# 普通のページ\n\n本文です。\n"
# Output of generate_records() for the two plain docs above, captured from the script before
# it indexed JSON-backed tables. A doc that imports no data-driven component must still
# produce exactly these bytes.
PLAIN_RECORDS_BASELINE = (
    '[{"objectID": "hardware:a43251b7bd9b35a93cac9b7b4a5b4f606e37666c", "source": "hardware", '
    '"language": "en", "url": "https://build.neat.sima.ai/hardware/interfaces/plain", '
    '"route": "/hardware/interfaces/plain", "path": "interfaces/plain.mdx", "section": "Hardware", '
    '"category": "Hardware", "title": "Plain Page", '
    '"content": "import Tabs from \'@theme/Tabs\'; # Plain Page Prose with code, a link, and tabs .", '
    '"hierarchy": {"lvl0": "Hardware", "lvl1": "Plain Page"}}, '
    '{"objectID": "hardware:6a1f01b6cf6dd4b0b61ed4c4aecc40f957f23872", "source": "hardware", '
    '"language": "ja", "url": "https://build.neat.sima.ai/ja/hardware/interfaces/plain", '
    '"route": "/ja/hardware/interfaces/plain", "path": "interfaces/plain.mdx", "section": "ハードウェア", '
    '"category": "ハードウェア", "title": "普通のページ", '
    '"content": "import Tabs from \'@theme/Tabs\'; # 普通のページ 本文です。", '
    '"hierarchy": {"lvl0": "ハードウェア", "lvl1": "普通のページ"}}]'
)

CARRIERS_DOC = (
    "import {CarrierBoardList, CarrierBoardSpecs} from '@site/src/components/CarrierBoards';\n\n"
    "# Carriers\n\nCarrier prose.\n\n<CarrierBoardList />\n\n<CarrierBoardSpecs />\n"
)
CAMERAS_DOC = (
    "import {\n  CameraList,\n  CameraOverlays,\n  CameraModes,\n} from \"@site/src/components/Cameras\";\n\n"
    "# Cameras\n\nCamera prose.\n\n<CameraList />\n\n<CameraOverlays />\n\n<CameraModes />\n"
)
SUPPORT_DOC = (
    "import {BoardSupportTable} from '@site/src/components/BoardSupport';\n\n"
    "# Interface Support\n\nSupport prose.\n\n<BoardSupportTable />\n"
)
DATA_DOCS = {
    "design/carriers.mdx": CARRIERS_DOC,
    "interfaces/cameras.mdx": CAMERAS_DOC,
    "reference/support.mdx": SUPPORT_DOC,
}
PROSE = {
    "design/carriers.mdx": (
        "import {CarrierBoardList, CarrierBoardSpecs} from '@site/src/components/CarrierBoards'; "
        "# Carriers Carrier prose."
    ),
    "interfaces/cameras.mdx": (
        'import { CameraList, CameraOverlays, CameraModes, } from "@site/src/components/Cameras"; '
        "# Cameras Camera prose."
    ),
    "reference/support.mdx": (
        "import {BoardSupportTable} from '@site/src/components/BoardSupport'; "
        "# Interface Support Support prose."
    ),
}

# File names are chosen so that file order differs from the order the pages show.
BOARDS = {
    "a-acme.json": {
        "id": "acme",
        "vendor": "acme",
        "model": "AX-9",
        "reference": False,
        "temperatureGrade": "-40 °C to +85 °C",
        "interfaces": {
            "ethernet": {"en": "2 with PoE", "ja": "2（PoE 対応）"},
            "m2KeyE": {"en": "1 with an expansion card"},
            "notShown": 7,
        },
    },
    "b-zeta.json": {
        "id": "zeta",
        "vendor": "Zeta Boards",
        "model": "ZB-1",
        "reference": True,
        "ordering": {"partNumber": "ZB1-REF", "url": "https://example.com/zb1"},
        "cooling": {"en": "Fan", "ja": "ファン"},
        "interfaces": {"hdmi": 1, "can": 2},
    },
    "c-bolt.json": {"id": "bolt", "vendor": "Bolt", "model": "B7", "reference": False},
}
SOM_SUPPORT = {
    "hdmi": {"status": "supported"},
    "csi4Lane": {
        "status": "unsupported",
        "note": {"en": "Two paths cannot be combined", "ja": "まとめることはできません"},
    },
    "can": {"status": "unsupported"},
}
CAMERAS = {
    "a-lumen.json": {
        "order": 2,
        "id": "lumen",
        "vendor": "Lumen",
        "sensor": "Sony IMX000",
        "overlay": "LUM-IMX000",
        "ordering": {"status": "vendor-listed", "partNumber": "LUM-IMX000-MIPI-1"},
        "modes": [{"width": 1920, "height": 1080, "fps": 29.4, "bitDepth": 12}],
        "overlays": {"waveshare": ["1CAM", "DUAL"]},
    },
    "b-optix.json": {
        "order": 1,
        "id": "optix",
        "vendor": "Optix",
        "sensor": "onsemi AR0000",
        "variant": {"en": "Standard camera", "ja": "標準カメラ"},
        "overlay": "OPT-AR0000",
        "ordering": {"status": "unconfirmed", "partNumber": "HIDDEN-PN"},
        "modes": [{"width": 4056, "height": 3040, "fps": 30, "bitDepth": 10}],
        "overlays": {"connectech": ["0CAM", "3CAM"]},
    },
}
BOARD_SUPPORT = {
    "id": "devkit",
    "release": "9.9.9",
    "rows": [
        {
            "id": "nvme",
            "name": {"en": "NVMe storage", "ja": "NVMe ストレージ"},
            "connector": "M.2 Key M slot",
            "som": "`PCIe0`",
            "deviceTree": "`pcie0_rc`",
            "status": "supported",
        },
        {
            "id": "can",
            "name": "CAN",
            "connector": "—",
            "deviceTree": "—",
            "status": "unsupported",
            "note": {"en": "Not wired on this board.", "ja": "このボードでは配線されていません。"},
        },
        {"id": "csi", "name": "MIPI CSI-2", "deviceTree": "`csi1`, `csi2`", "status": "overlay"},
    ],
}


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def write_docs(root: Path, docs: dict[str, str], locale: str = "en") -> None:
    base = root / "docs" if locale == "en" else root / "i18n" / locale / I18N_DOCS
    for rel, text in docs.items():
        (base / rel).parent.mkdir(parents=True, exist_ok=True)
        (base / rel).write_text(text, encoding="utf-8")


def write_data(root: Path, boards: dict | None = None) -> None:
    data = root / "src" / "data"
    for name, board in (BOARDS if boards is None else boards).items():
        write_json(data / "carrier-boards" / name, board)
    write_json(data / "modalix-som-interface-support.json", SOM_SUPPORT)
    for name, camera in CAMERAS.items():
        write_json(data / "cameras" / name, camera)
    write_json(data / "board-support" / "modalix-devkit.json", BOARD_SUPPORT)


def generate(root: Path, max_record_bytes: int = MODULE.DEFAULT_MAX_RECORD_BYTES) -> dict[tuple[str, str], dict]:
    records, _ = MODULE.generate_records(root / "docs", SITE, max_record_bytes, root / "i18n")
    return {(record["language"], record["path"]): record for record in records}


class DataComponentRecordTests(unittest.TestCase):
    def assert_in_order(self, text: str, *terms: str) -> None:
        positions = [text.find(term) for term in terms]
        self.assertNotIn(-1, positions, f"missing one of {terms!r} in {text!r}")
        self.assertEqual(positions, sorted(positions), f"{terms!r} out of order in {text!r}")

    def test_component_table_names_a_describe_function_and_relative_sources(self) -> None:
        for module, component in MODULE.DATA_COMPONENTS.items():
            self.assertTrue(callable(getattr(MODULE, component["describe"])), module)
            for pattern in component["sources"].values():
                self.assertTrue(pattern.startswith("src/data/") and pattern.endswith(".json"), pattern)

    def test_english_records_contain_the_table_text(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            write_docs(root, DATA_DOCS)
            write_data(root)
            records = generate(root)
            again = generate(root)

        self.assertEqual(records, again)
        derived = {}
        for rel, prose in PROSE.items():
            content = records[("en", rel)]["content"]
            self.assertTrue(content.startswith(prose + " "), content)
            self.assertNotIn("content_truncated", records[("en", rel)])
            derived[rel] = content[len(prose) + 1 :]
            # Plain text: no JSON syntax, no code backticks, no URLs or internal keys.
            for noise in ('{"', '":', "`", "https://", "notShown", "m2KeyE", "bitDepth"):
                self.assertNotIn(noise, derived[rel])

        carriers = derived["design/carriers.mdx"]
        # The reference board first, then by vendor without regard to case.
        self.assert_in_order(carriers, "Zeta Boards ZB-1, ZB1-REF, Reference board", "acme AX-9, Not tested", "Bolt B7, Not tested")
        self.assert_in_order(
            carriers,
            "Modalix SoM: HDMI Supported; MIPI CSI 4-lane Not supported, Two paths cannot be combined; CAN Not supported",
            "Zeta Boards ZB-1: Fan, HDMI 1, CAN 2",
            "acme AX-9: -40 °C to +85 °C, Ethernet 2 with PoE, M.2 Key E 1 with an expansion card",
        )

        cameras = derived["interfaces/cameras.mdx"]
        # Cameras by their "order" field, not by file name.
        self.assert_in_order(
            cameras,
            "Optix onsemi AR0000, Standard camera, OPT-AR0000;",
            "Lumen Sony IMX000, LUM-IMX000, LUM-IMX000-MIPI-1.",
            "OPT-AR0000: connectech 0CAM 3CAM;",
            "LUM-IMX000: waveshare 1CAM DUAL.",
            "OPT-AR0000: 4056 × 3040 30 fps 10-bit;",
            "LUM-IMX000: 1920 × 1080 29.4 fps 12-bit",
        )
        # The page hides a part number that the vendor does not list.
        self.assertNotIn("HIDDEN-PN", cameras)

        # Rows in file order; code marks and empty-cell dashes are dropped.
        self.assertEqual(
            derived["reference/support.mdx"],
            "NVMe storage: M.2 Key M slot, PCIe0, pcie0_rc, Supported; "
            "CAN: Not supported, Not wired on this board; "
            "MIPI CSI-2: csi1, csi2, Needs an overlay",
        )

    def test_translated_records_use_the_page_locale_and_fall_back_to_english(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            write_docs(root, DATA_DOCS)
            write_docs(root, DATA_DOCS, "ja")
            write_data(root)
            records = generate(root)

        carriers = records[("ja", "design/carriers.mdx")]["content"]
        self.assertEqual(records[("ja", "design/carriers.mdx")]["language"], "ja")
        for term in (
            "Zeta Boards ZB-1, ZB1-REF, リファレンスボード",
            "acme AX-9, 未確認",
            "Ethernet 2（PoE 対応）",
            "ファン",
            "CAN 非対応",
            "まとめることはできません",
            # No Japanese value in the data: the English one is used.
            "M.2 Key E 1 with an expansion card",
        ):
            self.assertIn(term, carriers)
        for english in ("2 with PoE", "Not supported", "Reference board", "Two paths"):
            self.assertNotIn(english, carriers)

        cameras = records[("ja", "interfaces/cameras.mdx")]["content"]
        self.assertIn("Optix onsemi AR0000, 標準カメラ, OPT-AR0000", cameras)
        self.assertIn("LUM-IMX000-MIPI-1", cameras)
        self.assertNotIn("Standard camera", cameras)

        support = records[("ja", "reference/support.mdx")]["content"]
        self.assertTrue(
            support.endswith(
                "NVMe ストレージ: M.2 Key M slot, PCIe0, pcie0_rc, 対応; "
                "CAN: 非対応, このボードでは配線されていません; "
                "MIPI CSI-2: csi1, csi2, オーバーレイが必要"
            ),
            support,
        )
        # The English page keeps the English values.
        self.assertIn("NVMe storage: M.2 Key M slot", records[("en", "reference/support.mdx")]["content"])
        self.assertNotIn("ストレージ", records[("en", "reference/support.mdx")]["content"])

    def test_doc_without_component_import_matches_the_baseline_bytes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            write_docs(root, {"interfaces/plain.mdx": PLAIN_DOC})
            write_docs(root, {"interfaces/plain.mdx": PLAIN_DOC_JA}, "ja")
            records, _ = MODULE.generate_records(
                root / "docs", SITE, MODULE.DEFAULT_MAX_RECORD_BYTES, root / "i18n"
            )
            self.assertEqual(json.dumps(records, ensure_ascii=False), PLAIN_RECORDS_BASELINE)

            # The data and the data-driven pages next to it change nothing for this doc.
            write_data(root)
            write_docs(root, DATA_DOCS)
            write_docs(root, DATA_DOCS, "ja")
            records, _ = MODULE.generate_records(
                root / "docs", SITE, MODULE.DEFAULT_MAX_RECORD_BYTES, root / "i18n"
            )
            plain = [record for record in records if record["path"] == "interfaces/plain.mdx"]
            self.assertEqual(json.dumps(plain, ensure_ascii=False), PLAIN_RECORDS_BASELINE)

    def test_component_named_only_in_a_code_fence_or_unknown_is_ignored(self) -> None:
        fenced = "# Authoring\n\n```mdx\nimport {CameraList} from '@site/src/components/Cameras';\n```\n\nBody.\n"
        unknown = "import {Widget} from '@site/src/components/Widget';\n\n# Widget\n\nBody.\n"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            write_docs(root, {"fenced.mdx": fenced, "unknown.mdx": unknown})
            write_data(root)
            records = generate(root)

        self.assertEqual(records[("en", "fenced.mdx")]["content"], "# Authoring Body.")
        self.assertEqual(
            records[("en", "unknown.mdx")]["content"],
            "import {Widget} from '@site/src/components/Widget'; # Widget Body.",
        )

    def test_large_data_is_cut_before_the_prose(self) -> None:
        limit = MODULE.DEFAULT_MAX_RECORD_BYTES
        boards = {
            f"board-{index:04d}.json": {
                "id": f"board-{index}",
                "vendor": f"Vendor{index:04d}",
                "model": f"Model-{index:04d}",
                "reference": index == 0,
                "interfaces": {"ethernet": {"en": "2 with PoE " * 20}, "can": index},
            }
            for index in range(400)
        }
        short_prose = "Short carrier prose. " * 20
        long_prose = "Long carrier prose that fills the record. " * 400
        docs = {
            "short.mdx": CARRIERS_DOC.replace("Carrier prose.", short_prose),
            "long.mdx": CARRIERS_DOC.replace("Carrier prose.", long_prose),
        }
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            write_docs(root, docs)
            without_data = generate(root)
            write_data(root, boards)
            with_data = generate(root)

        for record in with_data.values():
            self.assertLessEqual(MODULE.record_size(record), limit)

        # Room left after the prose is filled with table text, starting with the first item.
        short = with_data[("en", "short.mdx")]
        prose = without_data[("en", "short.mdx")]["content"]
        self.assertNotIn("content_truncated", without_data[("en", "short.mdx")])
        self.assertTrue(short["content"].startswith(prose + " Vendor0000 Model-0000, Reference board; "))
        self.assertTrue(short["content_truncated"])
        self.assertGreater(MODULE.record_size(short), limit - 8)
        self.assertNotIn("Vendor0399 Model-0399", short["content"])

        # Prose that already fills the record keeps every byte it had; no table text displaces it.
        self.assertTrue(without_data[("en", "long.mdx")]["content_truncated"])
        self.assertEqual(with_data[("en", "long.mdx")], without_data[("en", "long.mdx")])

    def test_missing_data_leaves_records_as_before(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            write_docs(root, DATA_DOCS)
            write_docs(root, DATA_DOCS, "ja")
            records = generate(root)

            for (language, rel), record in records.items():
                self.assertEqual(record["content"], PROSE[rel], (language, rel))
                self.assertNotIn("content_truncated", record)

            # One source of a component missing: the other is still indexed.
            write_json(root / "src" / "data" / "carrier-boards" / "b-zeta.json", BOARDS["b-zeta.json"])
            records = generate(root)

        self.assertEqual(
            records[("en", "design/carriers.mdx")]["content"],
            PROSE["design/carriers.mdx"] + " Zeta Boards ZB-1, ZB1-REF, Reference board. Zeta Boards ZB-1: Fan, HDMI 1, CAN 2",
        )
        self.assertEqual(records[("en", "interfaces/cameras.mdx")]["content"], PROSE["interfaces/cameras.mdx"])

    def test_status_words_match_the_components(self) -> None:
        # The script does not read the components, so this guards its copy of their status
        # words against drift. It reads the real tree and is skipped where that is absent.
        components = SCRIPT.resolve().parents[2] / "src" / "components"
        sources = [components / module / "index.js" for module in MODULE.DATA_COMPONENTS]
        if not all(path.is_file() for path in sources):
            self.skipTest("component sources not found")
        text = "\n".join(path.read_text(encoding="utf-8") for path in sources)
        for language, labels in MODULE.STATUS_LABELS.items():
            self.assertEqual(set(labels), set(MODULE.STATUS_LABELS["en"]), language)
            for key, label in labels.items():
                self.assertIn(f'"{label}"', text, f"{language}.{key}")


class CameraShutterTextTest(unittest.TestCase):
    def test_shutter_type_is_indexed_in_the_page_language(self):
        camera = {"order": 1, "vendor": "Acme", "sensor": "S1", "shutter": "global", "overlay": "ACME-S1", "modes": []}
        english = " ".join(MODULE.describe_cameras({"cameras": [camera]}, "en"))
        japanese = " ".join(MODULE.describe_cameras({"cameras": [camera]}, "ja"))
        self.assertIn("Acme S1, Global shutter, ACME-S1", english)
        self.assertIn("グローバルシャッター", japanese)

    def test_camera_without_a_shutter_field_is_unchanged(self):
        camera = {"order": 1, "vendor": "Acme", "sensor": "S1", "overlay": "ACME-S1", "modes": []}
        self.assertIn("Acme S1, ACME-S1", " ".join(MODULE.describe_cameras({"cameras": [camera]}, "en")))


if __name__ == "__main__":
    unittest.main()
