> REJECTED / HISTORICAL: This experiment packed motifs into squares and changed the intended tessellations. Its passing seam tests established periodicity only. Runtime implementation removed; [current contract](TESSELLATION.md) restores native geometry. Content below records the superseded experiment.

# Square arrangements with preserved motifs

Implemented 2026-10-28 after explicit user authorization to change tile arrangement while preserving each motif's proportions. This supersedes the earlier restriction to native rectangular lattice arrangements.

## Working behavior

All Tile and Pattern exports are square. Motif view remains the same complete mathematical construction, with exactly the previous geometry and padded export. Density 1 in Pattern equals Tile; density N repeats that square N-by-N at the selected output size.

Square format is achieved by placement, uniform scale and repeat composition. No motif receives separate X/Y scaling, shearing or new curve geometry. Native rectangular construction APIs remain available for regression/research; the workspace defaults to the square arrangement.

| Pattern | Default square arrangement |
| --- | --- |
| Asanoha | One centered complete six-sector rosette per square, fitted uniformly to its larger dimension |
| Kikko | One centered pair of regular hexagons per square, fitted uniformly |
| Uroko | Four equal equilateral scales with alternating colors and staggered second row, using square row/column spacing |
| Karakusa | One complete unwrapped vine branch per square with a small protective gutter |
| Yagasuri | Two native columns and one native row, preserving the original feather geometry |
| Seigaiha | One native column and two native rows, preserving the original overlapping wave construction |
| Ichimatsu | Existing square checker repeat |
| Shippo | Existing square lens repeat |
| Mameshibori | Existing square dot hierarchy or single uniform reference dot |

These are compact deterministic defaults. They are not a proof of globally optimal packing. Uroko retains its color/stagger cycle rather than discarding it to reduce motif count. Complete hexagonal motifs now have different spacing from the original continuous lattice. Karakusa repeats the finite opened branch from Motif view; it does not preserve the original infinite inter-cell vine connectivity. Those are arrangement changes, not motif distortions, and are stated in Info.

## Arrangement controls

Shift X % and Shift Y % move the entire repeat phase, from -100 to 100 percent of a square tile. Native SVG pattern coordinates wrap fragments at the boundaries. A shift of -100 or 100 is identical to zero. Fractional numbers are supported by the model; the initial inspector uses one-percent steps with a slider and exact value.

Shifts affect Tile and Pattern, not Motif. They are independent per pattern and survive switching selection. Center restores only the two shifts to zero and keeps other edits/drafts. Reset pattern restores artwork and shifts to defaults. Invalid shift drafts retain the last valid preview and block export; Center can recover invalid shifts without discarding unrelated drafts.

Shifting changes where the same arrangement is cut, not its relative spacing or individual motif rotations. Future row-stagger, spacing and per-motif placement controls are proposals, not implemented features.

## Implementation

`patterns/square-layout.js` constructs and serializes square tiles. Native square-compatible cases reuse the existing generator and span composition. Other cases use the existing complete motif definitions with one scalar scale and translations. Geometry remains shared with Motif view.

Neighbor copies are bounded using the complete motif's dimensions and stroke/join padding before cropping the square. This includes dense-stroke cases where additional neighbors are needed. Default complete branches can stay inside a cell, while shifted exports wrap by changing the outer SVG pattern's X/Y phase. Background is explicit and IDs remain unique per rendered instance.

`PatternPresentation.render` is the validated UI/export entry point. Tile uses one square; Pattern uses session density. The gallery uses the same square arrangement at its fixed browse density and resets shifts to zero. Browse-only line visibility does not alter artwork settings or exports.

Session defaults now contain `shiftX: 0` and `shiftY: 0`. Capability metadata exposes both controls. Validation accepts finite -100..100 values; omitted keys mean zero for earlier callers. The low-level native serializers remain unchanged.

## Compatibility and validation

Current motif exports remain byte-for-byte equal to earlier snapshots. Tile/Pattern output intentionally changes for arrangements that previously used native rectangles. Existing downloaded SVGs and prior artifacts are preserved. There is no stored preset migration.

60 Node tests pass, including all-square output at size/density limits, uniform motif scales, geometry equality, signed whole-period wrap, motif/gallery independence from shifts, atomic validation and per-pattern reset. [Square arrangement evidence](data/square-arrangements-2026-10-28/README.md) includes 33 standalone views plus browser results.

Edge passes 175 checks per theme/viewport combination, including square dimensions for all patterns, independent phase controls, full-period equivalence, invalid-shift recovery, and default/shifted export seams. Raster tests compare a repeated exported tile with a direct 2-by-2 field using a one-pixel antialias neighborhood and >0.995 foreground precision/recall. Original native-period checks remain covered independently.

Native OS clipboard/save permissions, external editor imports, non-Chromium, full accessibility/contrast certification and historical/reference approval remain open. Construction/Context content and default-entry retirement remain roadmap work.
