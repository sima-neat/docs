# Release announcements

A Palette marketing landing page and versioned release timeline, with standalone
release detail pages. These files are separate from the
Docusaurus hardware documentation and its Vulcan/S3 publishing workflow.

## Layout

```text
release-announcement/
  index.html
  brand.css
  landing.css
  landing.js
  release-map.json
  3.0.0/
    index.html
    styles.css
    app.js
    encoder.js
    assets/
```

The GitHub Pages artifact root is `release-announcement/`, so
`3.0.0/index.html` is served at `https://releases.neat.sima.ai/3.0.0/`.
Publish the entire root to retain previously published release directories.
Asset and download links are relative, so each release works under its version
path without a build step or a Docusaurus dependency.

## Preview

From the repository root:

```sh
python3 -m http.server 4183 --directory release-announcement
```

Open `http://localhost:4183/` for the landing page and release timeline. The
3.0.0 entry is dated October 31, 2026, and opens its detailed page in a new tab
at `http://localhost:4183/3.0.0/`. Use a static HTTP server rather than opening
HTML directly from the filesystem. No dependency installation is needed.

## Maintaining the full release map

The November 7, 2026 SDK 3.0.0.1 / Neat 0.6.1 announcement is at
`3.0.0.1/index.html` and is featured as the latest release. It includes Insight,
GPT-OSS, Neat Library, Apps and Model Compiler highlights. Visible draft labels
and empty placeholders have been removed. The JSON status remains `draft` and
the announcement retains `noindex` until publication is finalized. All eight
component versions are confirmed. Publication uses the existing manual workflow.

The timeline's **Full release map** dialog loads `release-map.json` on each open.
This website-owned file is the source of component versions; do not duplicate
version rows in HTML or JavaScript. It contains the November 7 and October 31
bundles. October 31 uses the confirmed sima-cli 2.1.20 pin. The timeline stories
remain editorial content in `index.html`.

To add a bundle, append a release with a unique `id`, ISO `release_date`, relative
`announcement` directory, and `versions` for every component ID. Versions are
arrays so one component can list multiple versions. Preserve compatibility
ranges explicitly when supplied; use exact shipped versions when confirmed.
The dialog sorts bundles newest first. Add older entries when their data is
ready; no historical versions are inferred. The existing announcement validation
checks the JSON structure, dates, component coverage and local announcement links.

## Validation

```sh
node --check release-announcement/landing.js
node --check release-announcement/3.0.0/app.js
node --check release-announcement/3.0.0/encoder.js
python3 scripts/check-release-announcements.py
git diff --check
```

Verify feature tabs, benchmark filters, the exact-measurement table, video
preview selection/close, and the upgrade checklist in a browser. Check narrow
and wide layouts and keyboard navigation. The release gallery must use the
publicly shared Drive copies documented in the release README; verify anonymous
access when replacing videos. Each preview also has a direct Drive link. Google
Fonts are loaded externally, with local font fallbacks.

## GitHub Pages workflow

`.github/workflows/release-announcement-pages.yml` validates changes in pull
requests and pushes to `develop` and `main`. A push to `main` that changes
release content, the validation script, or this workflow automatically publishes
the site after validation. Merging a PR into `main` triggers this push event;
direct pushes to `main` behave the same way. PRs and pushes to `develop` only
validate. Merge release content into `main` when it is ready to be public.

Manual publication with **Run workflow** / `workflow_dispatch` remains available
from `develop` or `main`. Other branches and tags are rejected.

The workflow checks local asset links, benchmark export consistency and all
release JavaScript syntax before uploading the entire `release-announcement/`
directory. Deployment uses the `github-pages` environment and a shared
concurrency group so publications from both branches cannot run simultaneously.
No Docusaurus build, Node package installation, AWS credentials or custom token
is required. Pages write and OIDC permissions are restricted to the deploy job.

### One-time repository and domain setup

1. Merge the workflow into the repository's default branch (`main`) so GitHub
   registers the manual workflow. Keep it available on `develop` as well when
   publishing from that branch.
2. Under **Settings → Pages**, select **GitHub Actions** as the publishing source.
   Confirm this repository is not already hosting another Pages site.
3. Configure the `github-pages` environment to allow both `develop` and `main`.
   Existing environment protection rules still apply to automatic and manual
   publication; required reviewers will pause deployment until approval.
4. Verify ownership of the custom domain, then set the Pages custom domain to
   `releases.neat.sima.ai` before adding DNS. Create a DNS CNAME for `releases`
   pointing to `sima-neat.github.io` (not a repository URL or a version path).
   Once GitHub provisions the certificate, enable **Enforce HTTPS**.

The custom domain is configured in repository Pages settings. GitHub ignores
`CNAME` artifact files with custom Actions publishing, so this source does not
use a `CNAME` file. See GitHub's [custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and [custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

### Publish an approved release

Merge release changes into `main` to publish automatically after validation.
Changes outside the workflow's path filters do not trigger a publication.

To publish manually, open **Actions → Release Announcement Pages → Run workflow**,
choose `develop` or `main`, then run it. The equivalent CLI command is:

```sh
gh workflow run release-announcement-pages.yml --repo sima-neat/docs --ref main
# Use --ref develop to publish that branch manually instead.
```

Both branches publish to the **same site**. The selected branch must contain all
release directories intended to remain public: each deployment replaces the
site's complete artifact; it does not merge files with the previous deployment.
Keep release content synchronized before switching the publication branch.
After deployment, verify `https://releases.neat.sima.ai/3.0.0/`, including its
assets and downloads. The domain root serves the Palette introduction and release timeline; each
release entry links to its versioned detail page in a new tab. To roll back, restore the approved files on one of the allowed branches and
manually rerun publication from that branch.

The workflow does not enable Pages or change DNS. Merging workflow changes into
`main` triggers automatic publication, just like merging release-content changes.
Do not include Sites hosting metadata or credentials in the Pages artifact.
The existing private preview is independent of this repository source.

## Maintaining the release timeline

The root `index.html` introduces Palette and contains the release timeline.
Add each new released version as a semantic list entry with its release date,
benefits summary, and a relative link to its version directory. The detail
link must use `target="_blank"` and `rel="noopener"`, and tell visitors it opens
in a new tab. Update the latest-release badge and hero shortcut together.
The journal currently starts with 3.0.0 on October 31, 2026; this does not imply
that earlier Palette versions did not exist.

## Corporate colors

`brand.css` defines the shared color tokens for the landing page and release
detail pages, using the palette from [sima.ai](https://sima.ai/): white and light
gray surfaces, dark navy text, corporate blue, and secondary green, lime and
purple accents. Darker blue variants are used for small text and hover states.
Keep palette changes in this shared file and retain the brand stylesheet before
each page's component stylesheet.
