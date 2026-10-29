# Minimal native repeat verification

2026-10-28. [review.html](review.html) shows complete Motif, native Tile and Pattern for all nine patterns and both reference variants. [manifest.json](manifest.json) and 33 standalone SVGs record current exports. Yagasuri uses its native 1:2 rectangle; Seigaiha uses its native 2:1 rectangle. No extra periods are added merely to force a square.

All eleven motif snapshots match the previous preview-modes artifacts byte-for-byte. Native generator baseline tests remain passing. This change affects Yagasuri/Seigaiha tile/field aspect and count, not their motifs or curves.

56 Node tests pass. New equal-side/radius checks cover ideal regular hexagons and the equilateral scale within four-decimal SVG precision. Uniform-axis scaling is checked for all nine motifs at size limits. Tile exports equal one native serializer period, and prior state/motif/seam coverage remains in place.

[Edge results](browser/browser-results.json): 149 checks pass for each of nine responsive theme/viewport combinations. Existing complete-motif bounds, view-specific exports, compact layout and whole-export tiling comparisons pass. Seam coverage uses >0.995 foreground precision/recall within a one-pixel antialias neighborhood; this is separate from analytic geometry checks.

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/minimal-repeat-2026-10-28/browser
```

"Smallest validated" refers to the specified axis-aligned rectangular repeat. A globally minimal oblique lattice basis is not certified. Karakusa remains a reference-fitted curve construction; idealized historical accuracy is not claimed. Native OS permissions, external editors, non-Chromium and complete accessibility certification remain open. See [governing geometry contract](../../MOTIF_TILE_PATTERN.md).
