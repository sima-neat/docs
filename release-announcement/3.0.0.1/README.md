# Palette SDK 3.0.0.1 announcement

The Insight feature story uses six screenshots supplied on November 7, 2026.
The release date is November 7, 2026. Visible draft labels and empty placeholders
have been removed; publication metadata remains staged until final publication.

## Insight carousel

The manual carousel starts with SDK Launchpad, then covers vision output, GenAI output, GenAI Models and
system stats and local peripherals. Captions describe the supplied screens and their role in a
developer's workflow; screenshot measurements are not release benchmarks.
Navigation supports buttons and Left/Right/Home/End on the feature selectors.
Transitions slide screenshots in the navigation direction, then reveal captions.
Only transform and opacity are animated. Inactive slides are inert and hidden
from assistive technology, with stable layout height. Rapid navigation cancels
previous animations. Reduced-motion preferences disable transition animations.
There is no autoplay. Without JavaScript, all six figures remain readable.
Images link to their larger JPEG for inspection.

## Screenshot assets

Original PNGs are not included in the website. Mapping from the supplied screenshot time to the asset prefix:

| Screenshot | Asset prefix |
| --- | --- |
| Clipboard SDK Launchpad screenshot | insight-launchpad |
| 3.16.47 PM | insight-vision |
| Replacement GenAI clipboard screenshot | insight-genai |
| Replacement GenAI Models clipboard screenshot | insight-models |
| Replacement System stats clipboard screenshot | insight-stats |

Each full screenshot is resized proportionally to widths of 1440 and 2400 pixels
and saved with Pillow as RGB JPEG, quality 85, progressive, optimized, chroma
subsampling disabled to keep UI text readable. No cropping or content changes.
The page selects the appropriate asset with `srcset`; the first four screenshots total about 2.3 MB for both sizes compared with
8.3 MB for their original PNGs. SDK Launchpad uses the same JPEG settings.

Preview: `http://127.0.0.1:4183/3.0.0.1/#insight`.

The GenAI output image was replaced with the later supplied clipboard screenshot,
showing the prompt, response metrics and coding-agent model explanation.

The GenAI Models image uses the replacement clipboard screenshot showing a
Gemma catalog search. The screenshot does not establish model compatibility.

The System stats image uses the replacement clipboard screenshot showing the
Power view and a coding-agent workload summary. JPEGs are not upscaled when
the supplied image is smaller than the target width.

The Local peripherals tab uses the supplied camera-inspection clipboard screenshot
(`insight-peripherals` assets), with the same 1440/2400px JPEG settings. Captions
describe camera detection, input format/resolution and preview, not a claim of
support for every peripheral device.

## Model Compiler section

Reviewed the live GitHub draft release `v3.0.0.1` in `sima-neat/model-compiler`
on November 7, 2026. The section summarizes Qwen3.5 recompilation, Whisper GELU
and decoder-cache input-order fixes. Component-version details are omitted from
the announcement. It retains
the draft's hardware-validation caveat. Packaging/install status is deliberately
not repeated because the draft contains time-sensitive build progress.

Source draft: https://github.com/sima-neat/model-compiler/releases/tag/untagged-71a359d09caa4ffef9ef
Upstream fixes: https://github.com/sima-neat/llima/pull/351 and https://github.com/sima-neat/llima/pull/358

## Apps and Neat Library highlights

Added developer-focused summaries from the branch review on November 7, 2026:

- Apps: `main` a9dcabffaec4dcb114167a5d4ddbdcbf01a2061c to `develop`
  7fd063e914182f08137d337b1290a16b1d7fc0ac. Sources: Apps PRs #685, #677,
  #695, #698 and #690. No Apps v0.6.1 GitHub release was present at review time;
  confirm these changes are included in the final release package before publishing.
- Core: v0.6.0 to `main` 896551a25d4ca1772c804980864b127f17fb5ec1.
  `develop` 80073726ae24bc25c12b4e5a1a086955c69e368d had the same tree.
  Sources: Core PRs #1288, #1274, #1296, #1285 and #1299.

No broad FPS/speedup claims are made from the targeted development-stack results.
The tensor-output migration and pending-request deadline notes are retained.
The release page includes the confirmed highlights and application upgrade actions.

## LLiMa GPT-OSS highlight

Added the approved headline “Run GPT-OSS 20B with NVMe embedding offload.”
The allocation fix is included in the LLiMa 0.6.1 draft release. Scope is the
recorded A16W4, 4096-token-context, local-NVMe configuration. The release-page
scope is 16 GB Modalix DevKits only, as confirmed by the user on November 7,
2026. No concurrent-model or broad reasoning-accuracy claim is made.

Sources reviewed November 7, 2026:
- https://github.com/sima-neat/llima/pull/347
- https://github.com/sima-neat/llima/issues/348

The GPT-OSS feature follows Insight, then Neat Library, Apps and Model Compiler.
The artwork uses the supplied Modalix SoM photo and a conceptual NVMe/data-flow
illustration. It is not a wiring guide. Labels are live HTML in Manrope, matching
the page headings. Current background plates are
`assets/gpt-oss-unlabelled-{836,1440}.jpg`; built-in generation and edit prompts
are recorded in `assets/gpt-oss-design-prompt.md` and
`assets/gpt-oss-unlabelled-prompt.md`. The figure has an accessible description.

## Screenshot magnifier

Fine-pointer hover activates a 2.5x lens after two continuous seconds over the
image. Leaving, changing slides, blur, resize or Escape cancels it. The lens loads
the full-resolution JPEG on demand. Arrow keys on a focused screenshot link
activate and move the lens; Enter or a click still opens the full-size image.
Touch users retain the full-size link. The intro recommends Chrome, Safari or
Edge for the code-server web interface.
