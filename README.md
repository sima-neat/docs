# SiMa.ai System Documentation

This repository contains the Docusaurus-based system documentation portal for SiMa.ai hardware platform content.

## Local Development

```bash
npm install
npm run start
```

Build the static site:

```bash
npm run build
```

## Vulcan Publishing

`.github/workflows/vulcan-docs.yml` builds the site on Vulcan and publishes the generated static output to the sysdoc S3 bucket for the selected environment.

- Pushes to `develop` and `main` deploy to staging.
- Manual workflow dispatch supports `dev`, `stg`, and `prod`.
- Production deployment is restricted to `main`.
