// Single source of truth for version strings referenced across the docs AND the Algolia
// index generator (scripts/ci/sync_algolia_developer_center_index.py).
//
// Canonical values live in versions.json so both consumers read identical data and cannot
// drift: the remark plugin (src/remark/substituteVersions.cjs) renders the published pages,
// and the Python index generator substitutes the same tokens so search content matches.
//
// Bump versions.json (or set PLATFORM_VERSION in the build env) to update everything at once.
const defaults = require('./versions.json');

module.exports = {
  platform_version: process.env.PLATFORM_VERSION || defaults.platform_version,
};
