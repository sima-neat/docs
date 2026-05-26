# Developer Center Shell

This directory owns the shared Developer Center behavior for the canonical
`build.{env}.neat.sima.ai` experience.

The shell defines:

- canonical section routes for Hardware, Software, and Examples
- external destinations for Models and Community
- common theme persistence keys and cookie behavior
- CloudFront-routed section navigation behavior
- navbar active-state normalization

`static/developer-center-shell.json`, `static/developer-center-shell.js`, and
`static/developer-center-shell.css` are the public contract for non-Docusaurus
sites mounted under `build.{env}.neat.sima.ai`. Those sites should mount the
runtime shell and use local fallback values only for development or standalone
origin debugging.

Keep this code framework-light. Docusaurus consumes it directly today, and the
same config/runtime should be reusable by the apps portal and future cross-site
search without making those sites depend on Docusaurus internals.
