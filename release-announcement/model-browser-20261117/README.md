# Model Browser announcement, November 17, 2026

Draft announcement of the Palette Model Browser. The Model Browser has no
version numbers or tags, because its catalog is updated continuously. An
announcement is named by its date and can group models added at different times.
The page keeps `noindex` until
it is published, and the release timeline does not link to it yet.

## Where the numbers come from

Every number was read from the customer view of the
[Model Browser](https://developer.sima.ai/models/) on November 17, 2026. Read
them again before publishing, because the catalog changes with every merge to
`main` of `sima-neat/models`.

| On the page | Source |
| --- | --- |
| 141 models, 48 model families | the counts above the catalog in the Cards and Table views |
| 17 tasks | the task groups of the Table view |
| 269 variants | the precisions listed for each model in the Table view, summed |
| headline results | the Performance and Accuracy sections of each model page, for the variant named on the tile |
| detection chart, language model chart | the Table view, which shows the first variant listed for each model |

The detection chart leaves out YOLO-World, because its page reports the detector
and the text encoder separately.

## Screenshots

`assets/` holds one screenshot of the live catalog at 1440 and 2400 pixels wide.

`assets/hero-illustration.png` is a crop of a screenshot, 866 pixels wide. Replace
it with the original illustration file before publishing.

## Before publishing

- Replace `assets/hero-illustration.png` with the original illustration.
- Confirm the Model Zoo wording with the owner of the Model Zoo page.
- Add the entry to the release timeline in `../index.html`.
- Remove `<meta name="robots" content="noindex">`.
