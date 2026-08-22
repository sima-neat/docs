// Remark plugin: replace `%key%` tokens with values from src/versions.cjs at build time.
//
// Why a remark plugin instead of MDX `import {V} from '@site/...'` + `{V}`:
// MDX does NOT interpolate expressions inside fenced code blocks, which is exactly where
// the version strings live (e.g. `sima-cli install drivers/linux -v %platform_version%`).
// Operating on the mdast lets us substitute inside `code`/`inlineCode` as well as prose.
//
// Why `%key%` and not `{{key}}`: brace tokens are parsed as JSX expressions in MDX prose
// and break the build; `%key%` is inert in both prose and code.
//
// The token regex and substitution live in src/versions.cjs, shared with the raw agent
// endpoint generator (scripts/build-agent-raw.cjs) so the two cannot drift.
const { versions, substitute } = require('../versions.cjs');

const SUBSTITUTABLE = new Set(['text', 'inlineCode', 'code']);

function walk(node) {
  if (!node || typeof node !== 'object') {
    return;
  }
  if (SUBSTITUTABLE.has(node.type) && typeof node.value === 'string') {
    node.value = substitute(node.value);
  }
  if (Array.isArray(node.children)) {
    node.children.forEach(walk);
  }
}

module.exports = function substituteVersions() {
  return (tree) => {
    if (Object.keys(versions).length > 0) {
      walk(tree);
    }
  };
};
