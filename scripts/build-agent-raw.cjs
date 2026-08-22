#!/usr/bin/env node
// Emit the agent-facing page as raw Markdown endpoints after `docusaurus build`:
//
//   build/agents.md  — src/pages/agents.md with frontmatter stripped and %key%
//                      version tokens substituted (same values as the rendered site)
//   build/llms.txt   — llms.txt-style entrypoint: short site header + the full
//                      agents.md content inlined, so one curl is self-sufficient
//
// Wired as the `postbuild` npm script. Token substitution is shared with the
// remark plugin via src/versions.cjs, so raw and rendered output cannot drift.
const fs = require('fs');
const path = require('path');
const { substitute } = require('../src/versions.cjs');

const repoRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(repoRoot, 'src', 'pages', 'agents.md');
const buildDir = path.join(repoRoot, 'build');
// Self-referencing links use the public Developer Center domain (developer.sima.ai),
// not the sysdoc origin, so agents that re-fetch land on the canonical URL.
const siteUrl = process.env.DEVELOPER_CENTER_URL || 'https://developer.sima.ai';

if (!fs.existsSync(buildDir)) {
  console.error(
    '[build-agent-raw] build/ not found — run `npm run build` first (this script runs as postbuild).'
  );
  process.exit(1);
}

let content = fs.readFileSync(sourcePath, 'utf8');

// Strip YAML frontmatter (the page carries its own H1).
content = content.replace(/^---\n[\s\S]*?\n---\n/, '');
// Strip HTML comments (contributor-facing notes, noise for agents).
content = content.replace(/<!--[\s\S]*?-->\n?/g, '');
content = substitute(content).trimStart();

const agentsOut = path.join(buildDir, 'agents.md');
fs.writeFileSync(agentsOut, content);

const llms = [
  '# SiMa.ai Developer Documentation',
  '',
  '> One-shot onboarding for AI agents: install sima-cli, authenticate, install the',
  '> Palette Neat SDK and Model Compiler, connect a Modalix DevKit, compile a model,',
  '> and build and run NEAT applications including GenAI.',
  '',
  `Canonical raw guide: ${siteUrl}/agents.md`,
  `Rendered version: ${siteUrl}/agents`,
  `Developer Center: https://developer.sima.ai`,
  '',
  '---',
  '',
  content,
].join('\n');
fs.writeFileSync(path.join(buildDir, 'llms.txt'), llms);

console.log(`[build-agent-raw] wrote ${agentsOut} and ${path.join(buildDir, 'llms.txt')}`);
