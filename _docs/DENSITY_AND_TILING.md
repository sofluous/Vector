# Density and seamless output

Implemented 2026-10-28 following the user's choice to preserve each repeat cell's natural aspect ratio.

## Current square-arrangement contract
Tile and Pattern preserve the original tessellations and native rectangular periods. Density counts real repeat cells; Shift X/Y translates their phase. The square packing experiment was rejected. See [current contract](TESSELLATION.md). The natural-period formulas below govern current exports.

## Earlier clarification
The user distinguished complete motif from repeat tile. [Motif/Tile/Pattern](MOTIF_TILE_PATTERN.md) now provides independent views. The natural period APIs below remain the low-level contract; the later geometry rule removes square-only composites for Yagasuri and Seigaiha; displayed tiles use one validated native rectangular period. Density counts displayed tiles in Pattern, not uncropped motifs.

## Meaning of the controls

Density is now an integer from 1 to 36 in the workspace. Density 1 shows one complete rectangular repeat cell; N fills an N-by-N grid. A repeat cell is a complete repeating construction, which can contain several parts (paired arrows, alternating checks, branching curves). It is not necessarily a single isolated leaf or a single path.

Output width is the selected size, 240-2000 SVG units. Height follows the cell's natural ratio and is displayed below the export toolbar. Patterns are not stretched into squares. For example, Yagasuri's 1:2 cell makes a 480-by-960 output; Seigaiha's 2:1 cell makes 480-by-240. Density changes the count/scale, not the output aspect. The uniform-dot reference at density 1 exposes one dot.

The field contains whole cells at both outer edges. Exporting an N-by-N field and repeating it therefore retains the same repeat phase. SVG pattern viewBoxes clip padded neighboring geometry to the repeat cell; background is painted once and no guides enter exports. Fractional SVG dimensions are retained to avoid accumulated seam errors.

## Repeat periods

Existing drawing tiles sometimes include duplicate periods. Frozen `repeat.default` / `repeat.reference` factors on catalog entries declare the rectangular period relative to those drawing bounds. Asanoha and Kikko use half the original drawing width. Original Mameshibori uses half both dimensions; its reference uses one eighth of both dimensions. Other periods use the existing full tile. Drawing paths and earlier baseline artifacts are unchanged.

Reduced periods are checked against the original larger drawing tile's rendered field. These are rectangular periods for SVG repetition; they are not a claim to the smallest possible oblique lattice basis or to a universal historical motif.

## APIs

`PatternSVG.repeatLayout(pattern, state, variant)` returns width, height, cell dimensions and clipped drawing tile. `PatternSVG.serializeField(pattern, index, state, variant)` creates the workspace's proportion-preserving standalone export with explicit width, height and viewBox. Density is validated before geometry generation.

Geometry uses a stable 100-unit construction scale. Pattern viewBox scaling fits each cell to output width/density; requested stroke is compensated before generation so it remains in output units, subject to existing generator caps. Both axes use the same scale. A very small floating-point height difference is retained rather than snapping fractional boundaries to pixels.

The older `serialize` remains available only for the temporary square lab and historical regression tests. Its old size-divisor semantics are unchanged; it is not the workspace density contract. This compatibility path can be removed when the old lab is retired. Session field `reps` keeps its name but means complete cell count in the workspace.

## Compatibility and evidence

The same numeric density now has a different visual scale from the old size divisor. Existing downloaded SVGs are unchanged; there are no saved presets to migrate. Default artwork parameters remain 480/12/1.6 with the existing palette, while workspace export dimensions/scale intentionally follow this new contract. Original geometry snapshots still pass. Current exports at densities 1, 3 and 12 are recorded in [review artifacts](data/density-one-2026-10-28/README.md).

Tests cover counts/proportions at sizes 240/480/2000 and densities 1/2/3/12/36, all variants, stroke compensation, deterministic output, strict validation, and equivalence between a repeated single-cell export and a two-density larger field. Browser checks compare raster foreground coverage within a one-pixel antialias neighborhood, requiring precision/recall above 0.995. Reduced-period fields are compared with original drawing periods. These tests detect added export seams; independent generator geometry/repeat tests remain necessary and do not establish reference-image or historical acceptance.

The new test captures do not certify native save/clipboard permissions, non-Chromium behavior or vector-editor import compatibility. Tall output is intentional; the UI fits the SVG proportionally within the preview area.
