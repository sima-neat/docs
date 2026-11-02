# Release announcements

Standalone, versioned release marketing pages. These files are separate from the
Docusaurus hardware documentation and its Vulcan/S3 publishing workflow.

## Layout

```text
release-announcement/
  3.0.0/
    index.html
    styles.css
    app.js
    encoder.js
    assets/
```

The future GitHub Pages artifact root should be `release-announcement/`, so
`3.0.0/index.html` is served at `https://releases.neat.sima.ai/3.0.0/`.
Publish the entire root to retain previously published release directories.
Asset and download links are relative, so each release works under its version
path without a build step or a Docusaurus dependency.

## Preview

From the repository root:

```sh
python3 -m http.server 4183 --directory release-announcement
```

Open `http://localhost:4183/3.0.0/`. Use a static HTTP server rather than opening
HTML directly from the filesystem. No dependency installation is needed.

## Validation

```sh
node --check release-announcement/3.0.0/app.js
node --check release-announcement/3.0.0/encoder.js
python3 scripts/check-release-announcements.py
git diff --check
```

Verify feature tabs, benchmark filters, the exact-measurement table, video
preview selection/close, and the upgrade checklist in a browser. Check narrow
and wide layouts and keyboard navigation. Google Drive playback is subject to
the viewer's existing Drive permissions; the page also links directly to each
original video. Google Fonts are loaded externally, with local font fallbacks.

## Publishing follow-up

This source addition does not enable GitHub Pages or change DNS. The planned
publication needs:

1. A GitHub Actions workflow that validates and uploads `release-announcement/`
   as the Pages artifact, then deploys with GitHub's Pages actions.
2. Repository Pages configuration using GitHub Actions, and a protected
   deployment environment with the appropriate release approval policy.
3. Custom-domain configuration and DNS for `releases.neat.sima.ai`, plus HTTPS
   verification. Confirm that no existing Pages site/domain is displaced.
4. A publication trigger chosen for release approval. The 3.0 announcement
   supplied with this page requests no broad publicity before November 17,
   2026; do not enable automatic public deployment before launch approval.

Do not include Sites hosting metadata or credentials in the Pages artifact.
The existing private preview is independent of this repository source.
