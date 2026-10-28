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
