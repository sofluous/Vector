> REJECTED / HISTORICAL: This experiment packed motifs into squares and changed the intended tessellations. Its passing seam tests established periodicity only. Runtime implementation removed; [current contract](../../TESSELLATION.md) restores native geometry. Content below records the superseded experiment.

# Square arrangement acceptance evidence

2026-10-28. [review.html](review.html) compares complete Motif, square Tile and square Pattern for all nine patterns and two reference variants. Thirty-three standalone SVGs and [manifest.json](manifest.json) record default output. Pattern uses density 12; Tile uses one square; shifts start at zero. All eleven motif exports remain equal to prior snapshots.

60 Node tests pass. [Browser results](browser/browser-results.json) record 175 checks per nine responsive theme combinations (Steel Night, Paper Mint, Neon Grid; 360x780, 768x800, 1440x900). Added checks cover every square tile, independent shift state, signed whole-period wrap, invalid shift blocking, Center recovery and shifted export seams. Twenty-two default/shifted tile-to-field comparisons cover all eleven pattern/variant combinations at phases (0,0) and (25,-50).

Raster coverage requires >0.995 precision/recall within a one-pixel antialias neighborhood. It compares repeated exported tiles with directly generated 2-by-2 output; geometry equality and equal axis scaling are tested separately. This does not certify historical accuracy or global packing optimality.

Captures `workspace-THEME-WIDTH.png`, `-motif.png` and `-tile.png` show the default Asanoha workspace modes. Additional `workspace-paper-mint-1440-PATTERN-tile.png` files show every square tile for review. Motif-based square layouts deliberately change native spacing/placement; the finite Karakusa branch no longer preserves the original continuous inter-cell graph. See [arrangement contract](../../SQUARE_ARRANGEMENTS.md).

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/square-arrangements-2026-10-28/browser
```

Native OS permissions, external SVG editor import, non-Chromium and full accessibility/contrast certification remain open. Existing downloaded SVGs, prior native-period artifacts and motif snapshots are preserved. No saved preset migration exists.
