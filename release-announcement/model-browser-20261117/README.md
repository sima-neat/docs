# Model Browser 2026.11 announcement, November 17, 2026

Draft announcement of the Palette Model Browser. Model Browser releases are named
by date, `<year>.<month>`, because nothing is packaged or installed. The same
name is a git tag on `sima-neat/models` that marks the scripts and declarations
behind the numbers of the announcement. The page keeps `noindex` until
it is published, and the release timeline does not link to it yet.

## Where the numbers come from

Every number was read from the customer view of the
[Model Browser](https://developer.sima.ai/models/) on November 17, 2026. Read
them again before publishing, because the catalog changes with every merge to
`main` of `sima-neat/models`.

| On the page | Source |
| --- | --- |
| 141 models, 48 model families | the counts above the catalog in the Cards and Table views |
| 17 tasks, models by task | the task groups of the Table view; a model with two tasks counts in both |
| 269 variants | the precisions listed for each model in the Table view, summed |
| models by type | `model_type` of each catalog model |
| result tiles, detection chart, language model chart | the Table view, which shows the first variant listed for each model |
| YOLO26n-det power figures | the Performance section of its model page |

The detection chart leaves out YOLO-World, because its page reports the detector
and the text encoder separately.

## Screenshots

`assets/` holds three screenshots of the live site at 1440 and 2400 pixels wide:
the catalog, the results on the YOLO26n-det page, and the Compare view for
Object Detection.

## Before publishing

- Create the tag `2026.11` on `sima-neat/models`, on the commit the live site was
  built from when the numbers were read. On November 17 that was `d0b3f921` on
  `main`. The page links to the tag, and the link is broken until it exists.
- Confirm the Model Zoo wording with the owner of the Model Zoo page.
- Add the entry to the release timeline in `../index.html`.
- Remove `<meta name="robots" content="noindex">`.
