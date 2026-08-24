# Developer Center Shell

This directory owns the shared Developer Center behavior for the canonical
`build.{env}.neat.sima.ai` experience.

The shell defines:

- canonical section routes for Hardware, Software, and Examples
- external destinations for Models and Community
- common theme persistence keys and cookie behavior
- global documentation-language persistence and localized section routes
- localized shell branding and navigation labels
- language-filtered Algolia search across localized documentation records
- CloudFront-routed section navigation behavior
- navbar active-state normalization

`static/developer-center-shell.json`, `static/developer-center-shell.js`, and
`static/developer-center-shell.css` are the public contract for non-Docusaurus
sites mounted under `build.{env}.neat.sima.ai`. Those sites should mount the
runtime shell and use local fallback values only for development or standalone
origin debugging.

The language control lives in this shell rather than in an individual docs
site. It writes `sima-neat-locale` as a parent-domain cookie so Hardware and
Software share one preference. Local standalone Software builds can use
`DOCS_PREFERRED_LOCALE=<locale>` instead of rendering their own selector.

Keep this code framework-light. Docusaurus consumes it directly today, and the
same config/runtime should be reusable by the apps portal and future cross-site
search without making those sites depend on Docusaurus internals.

Search producers add a `language` attribute to every Algolia record. The
shared shell filters each query to the selected documentation locale, while
language-neutral Examples records advertise all supported locales. Sync jobs
preserve existing index settings when adding `filterOnly(language)`.
