# Density one and seamless repeat evidence

2026-10-28. Open [review.html](review.html) for density 1 versus density 3 across all nine patterns and both reference variants. Thirty-three standalone SVGs cover densities 1, 3 and 12. [manifest.json](manifest.json) records output dimensions and source parameters. Width is 480 and height follows each declared rectangular repeat period.

[Browser results](browser/browser-results.json): 90 checks pass for each of nine theme/viewport combinations, including one-cell UI behavior, eleven whole-export seam comparisons, and four reduced-period comparisons against original drawing tiles. Coverage requires precision/recall above 0.995 within a one-pixel antialias neighborhood; full mask measurements are retained in the JSON. Raster comparisons normalize both sides to matching cell pixels and do not replace separate aspect-ratio assertions.

47 Node tests pass, including layout counts, natural proportions, stroke compensation, strict low-density validation, deterministic output, minimal-period metadata and a single-dot reference cell. Previous geometry and square-lab snapshots remain unchanged. New workspace output differs intentionally in density scale and aspect ratio; no saved presets exist.

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/density-one-2026-10-28/browser
```

Native save/clipboard permissions, external-editor imports, non-Chromium and reference approval remain open. Browser captures show the default workspace after checks; use review.html to inspect the actual density-one snapshots. See [contract](../../DENSITY_AND_TILING.md).
