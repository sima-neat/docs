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
and wide layouts and keyboard navigation. The release gallery must use the
publicly shared Drive copies documented in the release README; verify anonymous
access when replacing videos. Each preview also has a direct Drive link. Google
Fonts are loaded externally, with local font fallbacks.

## GitHub Pages workflow

`.github/workflows/release-announcement-pages.yml` validates changes in pull
requests and pushes to `develop` and `main`. It publishes only when explicitly
started with **Run workflow** / `workflow_dispatch`, from either branch.
Merging or pushing does not deploy the public site. This preserves an explicit
publication decision for embargoed announcements, including 3.0.0's November
17, 2026 public announcement date.

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
   Add required reviewers if publication needs an approval in addition to the
   manual workflow dispatch.
4. Verify ownership of the custom domain, then set the Pages custom domain to
   `releases.neat.sima.ai` before adding DNS. Create a DNS CNAME for `releases`
   pointing to `sima-neat.github.io` (not a repository URL or a version path).
   Once GitHub provisions the certificate, enable **Enforce HTTPS**.

The custom domain is configured in repository Pages settings. GitHub ignores
`CNAME` artifact files with custom Actions publishing, so this source does not
use a `CNAME` file. See GitHub's [custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and [custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

### Publish an approved release

Open **Actions → Release Announcement Pages → Run workflow**, choose `develop`
or `main`, then run it. Other branches and tags are rejected. The equivalent
CLI command is:

```sh
gh workflow run release-announcement-pages.yml --repo sima-neat/docs --ref develop
# Use --ref main to publish the main branch instead.
```

Both branches publish to the **same site**. The selected branch must contain all
release directories intended to remain public: each deployment replaces the
site's complete artifact; it does not merge files with the previous deployment.
Keep release content synchronized before switching the publication branch.
After deployment, verify `https://releases.neat.sima.ai/3.0.0/`, including its
assets and downloads. The domain root has no landing page yet; use the versioned
URL. To roll back, restore the approved files on one of the allowed branches and
manually rerun publication from that branch.

Adding the workflow does not enable Pages, change DNS or trigger publication.
Do not include Sites hosting metadata or credentials in the Pages artifact.
The existing private preview is independent of this repository source.
