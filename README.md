# SiMa.ai System Documentation

This repository contains the Docusaurus-based system documentation portal for SiMa.ai hardware platform content.

## Local Development

```bash
npm install
npm run start
```

To preview the shared shell, Hardware docs, Core Software docs, and all
documentation locales through one production-like local origin, install nginx
and run:

```bash
brew install nginx # once, if nginx is not already installed
npm run start:developer-center
```

The launcher expects the Core website at `../core/website`, builds both sites,
and serves the combined Developer Center at `http://localhost:3100/`. Override
the Core location with `NEAT_CORE_WEBSITE=/path/to/core/website` when needed.
Press `Ctrl+C` to stop the gateway and both backing servers.
After the first successful build, use
`npm run start:developer-center -- --skip-build` to reuse unchanged build
output.

Build the static site:

```bash
npm run build
```

## Translation tooling

Documentation translation and structural validation use the shared
`@sima-neat/i18n` CLI. Install it once, then use the repository configuration:

```bash
sima-cli neat install i18n
npm run check:i18n
npm run translate:i18n -- --locale ja --source docs/index.mdx
```

Translation is a preview unless `--write` is supplied. Locale terminology,
source scope, output layout, and the Ollama provider live in
`sima-i18n.config.json`; translation behavior belongs in the shared i18n
repository.

Clean the build artifacts (removes the generated `build/` output and the `.docusaurus/` cache):

```bash
npm run clean
```

## Vulcan Publishing

`.github/workflows/vulcan-docs.yml` builds the site on Vulcan and publishes the generated static output to the sysdoc S3 bucket for the selected environment.

- Successful builds from pushes to `develop` and `main` publish to staging automatically. Pushes to `vulcan-dev-sysdoc` publish to development.
- To release to production, open **Actions → Vulcan SysDoc → Run workflow**, select the `main` branch, and choose `prod`. This builds the selected revision with production configuration and publishes it after the build succeeds.
- Manual runs also support `dev` and `stg` for previewing a branch.
