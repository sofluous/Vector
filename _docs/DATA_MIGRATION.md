# Data Migration

No saved user-preset format or migration mechanism is currently implemented. Generators live in `patterns/`; research files live in `_references/Japanese/`. The primary workspace is `index.html`. SVG downloads are output artifacts, not application presets.

## Proposed compatibility rules
- Preserve existing IDs during extraction; version generators when corrected geometry changes output.
- Retain research originals and update catalog links if paths move.
- Preserve legacy galleries until placement is agreed; keep static records distinct from tile generators.
- Before persistence, define schema/generator versions, validated parameters, unknown-version behavior, import errors, backup/rollback, and export/rebuild examples.
- Separate source parameters from derived SVG. Do not promise exact regeneration after corrections without the original generator version.

No data migration is performed by this documentation update.

## Yagasuri pilot (2026-10-28)
The existing `yagasuri` ID is retained. New exports use corrected vane geometry and a `u` by `2u` repeat instead of the previous `2u` square; the same repetition setting therefore has different visual density. Existing SVG files remain unchanged. `yagasuri-2` names the construction in documentation only; runtime versioned presets are not implemented. A pre-change baseline is retained in `_docs/data/reference-audit-2026-10-28/` for comparison.

## Seigaiha correction (2026-10-28)
The `seigaiha` ID is retained. New exports use a `u` by `u/2` two-row repeat and four fixed rings, replacing the compressed crossing-arc lattice and density-dependent ring count. Effective stroke is capped at 45% of ring spacing, and filled silhouettes use the selected background to hide rear arcs. Existing SVG downloads remain unchanged. `seigaiha-2` is documentation-only; no saved preset migration is needed. The immediate pre-change baseline (including corrected Yagasuri) and before/after SVGs are retained in `_docs/data/seigaiha-2026-10-28/`. Transparent output needs a future clipping/trimmed-geometry solution.

## Shippo correction (2026-10-28)
The `shippo` ID and `u` by `u` tile dimensions remain. New exports contain four direct diagonal equal-circle lens paths instead of a rotated clipped-circle field and guide outlines. Radius `0.48u` leaves small tip gaps; stroke/accent controls are now unused, as stated in the UI. Existing SVG downloads are unchanged. `shippo-2` is documentation-only; there are no saved presets to migrate. Immediate pre-change outputs (including corrected Yagasuri/Seigaiha) and comparison artifacts are retained in `_docs/data/shippo-2026-10-28/`.

## Karakusa experimental reconstruction (2026-10-28)
The `karakusa` ID remains. New output replaces disconnected curves in a `2u` square with a connected composition of width `4u` and height `4u*179/278`; the same repetition value therefore has different visual density. Stroke is capped at 1.8% of composition width, leaves share the line color, and accent is unused. Existing SVG downloads remain unchanged. `karakusa-2` is documentation-only; there is no saved preset migration. `_docs/data/karakusa-2026-10-28/baseline.json` preserves all immediate pre-change outputs. The new motif is experimental and still requires reference fitting.

## Karakusa reference fit (2026-10-28)
`karakusa-3` replaces the v2 procedural spine/spiral construction with a reference-fitted spline graph. The `karakusa` catalog ID, tile dimensions, line/background semantics, and stroke cap remain unchanged. Runtime module `patterns/karakusa.js` must be included beside `index.html`; classic script loading keeps local-file use supported. The module's version describes its fit, not a versioned saved-preset schema. Existing SVG downloads remain untouched. The v2 output and all other pre-refinement outputs are retained in `_docs/data/karakusa-refinement-2026-10-28/baseline.json`. Native fit-data edits must preserve shared anchor/period relationships, checked by tests; there is no runtime shape editor or preset migration.

## Module extraction and variants (2026-10-28)
No persisted data migration. Default tile output remains unchanged. Reference selections are memory-only per-card values and reset on reload; exports capture the selected variant. No preset file schema is introduced.

## Workspace session foundation (2026-10-28)
No migration is required. New session state is memory-only and not yet connected to the page. It is not a versioned import/export schema. Defaults and eleven frozen SVG snapshots remain unchanged.

## Opt-in workspace integration (2026-10-28)
No stored-data migration. Workspace sessions and invalid drafts live only in the workspace document; reload resets them. The lab keeps its separate global state. The legacy link opens a new tab to preserve the workspace session. Both views use the existing serializer and defaults; shared theme storage is unchanged.

## Grouped library refinement (2026-10-28)
No persisted-data or geometry migration. Primary browsing groups live in patterns/library.js independently of generator order; catalog IDs, SVG IDs and snapshots remain stable. Search/group disclosure state is UI-only. The legacy link is removed from the workspace; source files are retained during construction-content transfer.

## Density cell-count contract (2026-10-28)
Workspace density 1-36 now counts whole cells in both axes. User chose natural aspect: frame is output width, height follows repeat proportions. Same numeric density changes visual scale versus the earlier divisor; SVG exports intentionally change dimensions/layout. Geometry and existing SVG files remain unchanged. No persisted presets exist. Legacy serialize remains for old lab snapshots; workspace uses serializeField. New evidence is under density-one-2026-10-28.

## Motif/Tile/Pattern views (2026-10-28)
No stored preset migration. Session mode adds motif; existing default field remains Pattern. Density now counts displayed tiles, with square composites for Yagasuri (two native columns) and Seigaiha (two native rows). Their export aspect/visual count changes intentionally; other repeat geometry is retained. Exports follow the displayed view; motif/tile names add a suffix. Existing saved SVGs and prior snapshots remain unchanged.

## Compact workspace and thumbnails (2026-10-28)
No data, geometry or export migration. Library preview density/source width/stroke are browse-only settings and are not written into session artwork. Description content remains available under Info. Page-load disclosure defaults depend on viewport width; later user choices remain in the document only.

## Minimal repeat correction (2026-10-28)
Removed square-only composites from the workspace: Yagasuri returns to width:height 1:2 and Seigaiha to 2:1. Density counts native validated tiles again, changing their field scale/aspect from the previous square-composite exports. Motif SVGs remain byte-for-byte unchanged and old downloads/artifacts are preserved. No stored presets exist. New acceptance evidence is under minimal-repeat-2026-10-28.

## Square arrangement contract (2026-10-28)
User authorizes new square placements/spacings. Tile/Pattern now use square arrangements; original native APIs and motif geometry remain unchanged. Session defaults add shiftX/shiftY zero, finite -100..100 percent. Omitted shifts remain backward-compatible as zero; no stored presets exist. Current exports have new square layout and optional phase, while all previous files remain preserved.

## 2026-10-28 ? Restore authentic tessellations

The square arrangement experiment above was rejected. Tile/Pattern exports again use native repeat aspect ratios and spacing; shift state remains valid and translates the native lattice. Existing exported files remain unchanged. No persisted presets or data migration exists. Historical square artifacts are retained and marked rejected.

## Inspection tabs and zoom - 2026-10-28

No artwork, SVG format or persisted data changes. Session tab/zoom settings already existed and now have UI bindings. Formula content is copied into the independent content module; the old lab remains temporarily for entry migration and source comparison.

## 2026-10-29 - Primary entry migration

The former `workspace.html` application markup now lives at `index.html`; runtime relative paths are unchanged because both entries share a directory. `workspace.html` redirects with query/fragment preservation and a no-script link fallback. The previous gallery/lab UI and its lab-only browser harness are retired. Four formula notes remain in `patterns/content.js`, protected by `tests/fixtures/construction-notes.json`. Legacy SVG serialization remains for required regression tests; existing downloaded SVGs and state contracts are unchanged. Reload still resets the editing session; no stored user-preset migration exists.

## 2026-10-29 - Remove secondary entry

The temporary `workspace.html` redirect is removed at user request. Use the served project root or `index.html`; old workspace bookmarks must be updated. No runtime modules, artwork contracts, presets or SVG formats changed. Earlier redirect notes above are historical.
