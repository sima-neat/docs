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
                if method == "GET":
                    return {"attributesForFaceting": ["source"]}
                return {}

        client = RecordingClient()
        client.ensure_language_filter()

        self.assertEqual(
            client.calls[-1],
            (
                "PUT",
                "/1/indexes/docs/settings",
                {"attributesForFaceting": ["source", "filterOnly(language)"]},
            ),
        )


if __name__ == "__main__":
    unittest.main()
