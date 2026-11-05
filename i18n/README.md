# Hardware documentation localization

The Developer Center shell owns the visible language selector and persists the
choice across Hardware and Software. Hardware supports `en`, `ko`, `ja`,
`zh-Hant`, and `uk`; localized Docusaurus content lives below this directory.

## Translation conventions

- Keep product names, API symbols, commands, paths, environment variables,
  filenames, literal output, URLs, JSX/HTML structure, and code unchanged.
- Korean uses a consistent formal instructional style.
- Japanese uses a concise `です・ます` instructional style.
- Traditional Chinese targets Taiwan (`zh-Hant-TW`) terminology.
- Ukrainian targets Ukraine (`uk-UA`) terminology and spelling.
- Follow the canonical choices in `terminology.md`.
- Treat generated text as a draft until a native technical reviewer approves it.

`translation-sources.json` records the SHA-256 hash of the English source used
for each translation. This makes stale translations fail validation when an
English page changes.

Run the structural and freshness checks during translation work:

```bash
npm run check:i18n
npm run check:i18n-complete
```

## Remote Ollama drafting

The translator sends protected prose blocks to an Ollama server through SSH.
Code, commands, inline identifiers, links, MDX/HTML tags, and canonical product
names are replaced with verified placeholders before each request. The command
aborts if the model changes or drops protected content.

Preview one page without writing files:

```bash
npm run translate:i18n -- \
  --locale zh-Hant \
  --source docs/getting-started/setup-serial.mdx \
  --ssh-host macstudio \
  --model translategemma:27b
```

Add `--write` after inspecting representative output. Use `--all --write` to
fill every missing page for one locale. Existing translations are skipped
unless `--overwrite` is supplied. Reapply terminology normalization to existing
Traditional Chinese pages without contacting Ollama with:

```bash
npm run translate:i18n -- \
  --locale zh-Hant \
  --all \
  --write \
  --normalize-existing
```

After a batch, run `npm run check:i18n` and build the relevant Docusaurus locale.
