# Palette SDK 3.0 release announcement

The standalone marketing page is `index.html`; shared hosting guidance lives in
[the release-announcement README](../README.md).

## Content and assets

- Release copy comes from the supplied Palette SDK 3.0 release announcement.
- All eight demonstration links and preview IDs use the publicly shared
  [3.0.0 video folder](https://drive.google.com/drive/folders/1v0ximz2_IA89h4tPqc15ZBCRtrxHeATa).
  Use these public copies when updating the page; the internal originals are
  not suitable for a public release announcement.
- The SiMa.ai logo and Modalix image were obtained from the corporate website.
- The encoder explorer transcribes all 16 configurations from the supplied
  Encoder Benchmark Results table. The original image is retained as
  `assets/encoder-benchmark-source.png`.
- `assets/encoder-benchmarks.json` is the structured data export;
  `assets/encoder-benchmarks.csv` is the downloadable table. `encoder.js`
  contains the same data for synchronous, buildless rendering. Keep all three
  representations aligned; the repository check verifies this.

Eight-stream throughput is aggregate, not per stream. Unreported values remain
null in JSON, empty in CSV, and “—” in the UI. Codec measurements do not represent
complete AI-application throughput. The supplied table does not specify the full
hardware/test methodology.

The visual capability maps are conceptual; the demonstration gallery points to
original recordings. Checklist completion records planning progress in browser
local storage and does not validate a device.


## eLxr platform highlights

Sections 03 and 04 summarize the supplied *SDK 3.0.0 Platform Updates* deck
(October 27, 2026). Content references: development stack (slides 2-5), signed
A/B updates and USB recovery (11-13), secure boot signing, OP-TEE and firewall
support (15), idle clock gating (21), Docker support (22), memory and PCIe model
loading (23), camera and host support (25-30), connectivity (31), and AV1 decode
(33-35). The source deck and its internal links are not included in site assets.

Keep the full-reflash/rebuild migration notice and workload limitations alongside
the benefits. Secure boot support does not assert that it is enabled on every
device. RAM-disk loading is not an inference-speed benchmark. HDR and custom
SWUpdate bundles are omitted because the deck does not describe them as released
in 3.0.0.
