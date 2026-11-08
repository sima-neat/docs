#!/usr/bin/env python3
"""Validate static release assets and benchmark data before Pages packaging."""

import csv
import json
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / 'release-announcement'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.ids = set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs['id'])
        for key in ('src', 'href'):
            if attrs.get(key):
                self.links.append(attrs[key])


def validate_page(path):
    page = Page(path.read_text())
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        assert not url.path.startswith('/'), f'{path}: root-relative URL: {link}'
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        assert target.is_relative_to(ROOT.resolve()), f'{path}: escaping asset: {link}'
        if target.is_dir():
            target = target / 'index.html'
        assert target.is_file(), f'{path}: missing asset: {link}'
        if url.fragment and target.suffix == '.html':
            target_page = page if target == path else Page(target.read_text())
            assert unquote(url.fragment) in target_page.ids, f'{path}: missing anchor: {link}'


def validate_encoder(release):
    data_path = release / 'assets/encoder-benchmarks.json'
    if not data_path.exists():
        return
    rows = json.loads(data_path.read_text())
    script = (release / 'encoder.js').read_text()
    embedded, _ = json.JSONDecoder().raw_decode(script.split('const encoderData=', 1)[1])
    assert embedded == rows, f'{release.name}: encoder.js differs from JSON export'
    with (release / 'assets/encoder-benchmarks.csv').open(newline='') as source:
        csv_rows = list(csv.reader(source))
    expected = []
    for row in rows:
        expected.append([
            row['resolution'], row['codec'], row['chroma'], row['frames'],
            str(row['gop']) if row['gop'] is not None else 'N/A', row['target'],
            *['' if row[key] is None else f'{row[key]:.2f}' for key in (
                'singleFps', 'aggregateFps', 'singleMiB', 'aggregateMiB')],
        ])
    assert csv_rows[1:] == expected, f'{release.name}: CSV differs from JSON export'
    assert len(rows) == 16, f'{release.name}: expected 16 supplied configurations'
    assert [sum(row['resolution'] == resolution for row in rows)
            for resolution in ('720p', '1080p', '4K')] == [10, 3, 3]
    assert all(row['aggregateFps'] is None and row['aggregateMiB'] is None
               for row in rows if row['resolution'] == '4K')


def validate_release_map():
    data = json.loads((ROOT / 'release-map.json').read_text())
    assert data['schema_version'] == 1, 'Unsupported release-map schema'
    components = [component['id'] for component in data['components']]
    assert components and len(set(components)) == len(components), 'Duplicate or empty components'
    assert all(component['label'].strip() for component in data['components'])
    assert data['releases'], 'Empty release map'
    ids = set()
    for release in data['releases']:
        assert release['id'] not in ids, 'Duplicate bundle ID'
        ids.add(release['id'])
        assert release.get('status', 'released') in ('draft', 'released'), 'Unknown bundle status'
        assert date.fromisoformat(release['release_date']).isoformat() == release['release_date']
        assert set(release['versions']) == set(components), 'Missing or unknown component'
        for versions in release['versions'].values():
            if versions is None:
                assert release.get('status') == 'draft', 'Only draft bundles may have unconfirmed versions'
                continue
            assert isinstance(versions, list) and versions, 'Versions must be nonempty arrays'
            assert all(isinstance(version, str) and version.strip() for version in versions)
        url = urlsplit(release['announcement'])
        assert not url.scheme and not url.netloc and not url.path.startswith('/')
        target = (ROOT / url.path).resolve()
        assert target.is_relative_to(ROOT.resolve()), 'Announcement escapes website'
        assert (target / 'index.html').is_file(), 'Missing bundle announcement'
    print('release-map.json: schema, versions, dates and announcement links verified')


def main():
    validate_release_map()
    pages = sorted(ROOT.rglob('index.html'))
    assert pages, 'No release announcement pages found'
    assert not list(ROOT.rglob('.openai')), 'Sites metadata must not be published'
    for page in pages:
        validate_page(page.resolve())
        validate_encoder(page.parent)
        print(f'{page.relative_to(ROOT)}: local links and encoder exports verified')


if __name__ == '__main__':
    main()
