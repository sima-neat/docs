// Single source of truth for version strings referenced across the docs AND the Algolia
// index generator (scripts/ci/sync_algolia_developer_center_index.py).
//
// Canonical values live in versions.json so all consumers read identical data and cannot
// drift: the remark plugin (src/remark/substituteVersions.cjs) renders the published pages,
// the raw agent endpoint generator (scripts/build-agent-raw.cjs) emits /agents.md + /llms.txt,
// and the Python index generator substitutes the same tokens so search content matches.
//
// Bump versions.json (or set the matching SCREAMING_SNAKE env var, e.g. PLATFORM_VERSION,
// in the build env) to update everything at once.
const defaults = require('./versions.json');

const versions = {};
for (const key of Object.keys(defaults)) {
  versions[key] = process.env[key.toUpperCase()] || defaults[key];
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Shared `%key%` substitution used by the remark plugin and build-agent-raw.cjs.
// Only keys defined in versions.json are substituted, so printf-style `%s` / `%d`
// in code samples are left untouched.
const TOKEN = new RegExp(
  '%(' + Object.keys(versions).map(escapeRegExp).join('|') + ')%',
  'g'
);

function substitute(value) {
  return value.replace(TOKEN, (_match, key) => versions[key]);
}

module.exports = { versions, TOKEN, substitute };
