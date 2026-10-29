# Complete motif and repeat-tile review

2026-10-28. [review.html](review.html) compares Motif, Tile and Pattern for all nine patterns and both reference variants. Thirty-three standalone SVGs and [manifest.json](manifest.json) preserve the current definitions, notes, square/rectangular status and parameters. Pattern uses density 12. Tile/Motif ignore density.

Square tiles: Yagasuri, Seigaiha, Ichimatsu, Shippo, Mameshibori. Rectangular exceptions: Asanoha, Kikko, Uroko, Karakusa. The exceptions are intentional; see [construction contract](../../MOTIF_TILE_PATTERN.md). Motif is not a claim of tileability or historical verification.

53 Node tests pass. [Browser results](browser/browser-results.json): 140 checks per exact viewport/theme combination (three widths, three themes). The runner exercises uncropped bounds, density independence, Tile/Pattern equivalence, mode labels, view-specific copy/download, native radio keyboard behavior, eleven exported-tile repeat comparisons and original field regression checks. A one-pixel neighborhood and >0.995 foreground precision/recall threshold accommodate raster antialiasing; geometry/attachment checks are separate.

Captures: `browser/workspace-THEME-WIDTH.png` shows Pattern; `-motif.png` and `-tile.png` show those modes for Asanoha. The artifact comparison page includes every pattern. Native OS permissions, external editors, non-Chromium, complete accessibility and reference acceptance remain open.

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/preview-modes-2026-10-28/browser
```

Earlier grouped and density-one artifacts remain unchanged. Existing native geometry/string baselines still pass. Presentation changes Yagasuri/Seigaiha to small square composites without stretching their motifs.
