// Single source of truth for version strings referenced across the docs.
// Bump `platform_version` here (or set PLATFORM_VERSION in the build env) to update
// every doc page that uses the `%platform_version%` token. Substitution is performed
// at build time by src/remark/substituteVersions.cjs.
module.exports = {
  platform_version: process.env.PLATFORM_VERSION || '2.1.2',
};
