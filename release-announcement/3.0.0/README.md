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
