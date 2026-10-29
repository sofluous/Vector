# Compact workspace acceptance evidence

2026-10-28. [browser-results.json](browser-results.json) records 149 passing checks for each of nine theme/viewport combinations: Steel Night, Paper Mint, Neon Grid at 360x780, 768x800 and 1440x900 CSS pixels. Captures `workspace-THEME-WIDTH.png`, `-motif.png`, and `-tile.png` show all three view modes after interaction checks.

Desktop captures include the complete compact gallery and Properties. Tablet starts Library collapsed; phone starts Library and Properties collapsed. This is intentional so the stage receives available space. The runner expands panels for interactions and verifies no page/preview scrollbar is needed. Necessary panel content scrolling remains allowed.

New coverage includes gallery density two, default-hidden Info, disclosure/Escape recovery and viewport placement, root/stage/preview bounds, plus retained search, per-pattern state, modes, invalid drafts, native keyboard interaction, matching exports and repeat seam checks. All earlier export fixtures still match. 54 Node tests pass, including fixed thumbnail density/source size and independence from editor density/output size.

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/compact-workspace-2026-10-28
```

See [layout and thumbnail contract](../../COMPACT_WORKSPACE.md). Browse-only stroke/density/cropping does not redefine exported tiles. Captures certify the tested layouts, not OS clipboard/save permissions, non-Chromium, external editors or full accessibility/contrast. Prior geometry, grouped and mode reports remain unchanged.
