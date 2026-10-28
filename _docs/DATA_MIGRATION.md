# Data Migration

No saved user-preset format or migration mechanism is currently implemented. Generators and static records live in `index.html`; research files live in `_references/Japanese/`. SVG downloads are output artifacts, not application presets.

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
