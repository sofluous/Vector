# Restored tessellation evidence ? 2026-10-28

Current implementation uses native lattice periods, not isolated motif packing. [Contract](../../TESSELLATION.md).

59 Node tests pass, including exact parity with all eleven earlier native field fixtures in `minimal-repeat-2026-10-28`. [Browser results](browser-results.json) record 175 passing checks for each of nine theme/viewport combinations. Raster comparisons include all eleven variants at zero and shifted phase. Screenshots include all three modes across those combinations and each pattern's Tile view at desktop Paper Mint.

Asanoha, Kikko and Karakusa Tile screenshots were visually reviewed. Native rectangular output is intentional; exact square exports remain unresolved where the intended lattice cannot support a square period. Earlier square arrangement artifacts are rejected historical evidence.

Validation: `node --test _Vectors/tests/*.test.cjs`; `node _Vectors/tests/browser-workspace.cjs --out _docs/data/tessellation-restored-2026-10-28` from the workspace parent. Edge is required for browser checks.
