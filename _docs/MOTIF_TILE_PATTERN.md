# Motif, tile and pattern

Implemented 2026-10-28 after the user clarified that a complete shape is not the same thing as a cropped repeat unit. This supersedes the earlier use of density 1 as a stand-in for an isolated motif.

## Governing geometry rule
Preserve the complete tessellation, including spacing and interlocking connections. Tile/Pattern use native repeat periods; isolated motifs remain exclusive to Motif view. The square packing experiment was rejected. See [current contract](TESSELLATION.md).

## Three views

- **Motif:** a complete uncropped construction with padding. It does not need to tile. Density does not change it.
- **Tile:** one actual repeat unit, including edge fragments that reconstruct motifs when adjacent tiles meet. It ignores density.
- **Pattern:** the displayed tile repeated N-by-N, where density N ranges from 1 to 36. Density 1 is exactly Tile view.

The native radio group supports keyboard navigation. View selection stays in session state when changing patterns. Copy/download match the displayed view and use explicit labels. Motif and tile filenames add `-motif` and `-tile`; pattern retains the pattern ID filename. Invalid artwork drafts continue to block all three export actions. Changing views does not reset artwork or clear drafts.

Output width applies to every view; height follows the current construction and padding. Density affects Pattern only. This is explained in the inspector, rather than conflating density with complete-shape inspection.

## Per-pattern definitions

| Pattern | Complete motif | Displayed repeat tile |
| --- | --- | --- |
| Asanoha | Six-sector hemp-leaf rosette assembled from centroid-subdivided equilateral triangles | Square placement of the complete rosette |
| Yagasuri | One complete paired arrow feather | Square composition of two native columns |
| Seigaiha | One complete four-ring fan before overlap | Square composition of two native rows |
| Ichimatsu | One full primary-color square | Square four-check parity arrangement |
| Shippo | One complete four-lens composition | Square native repeat |
| Kikko | One complete outer/inner hexagon pair | Square placement of the complete nested hexagons |
| Karakusa | One connected vine branch, periodic stem opened once, all sixteen fitted paths and eight leaves unwrapped | Square placement of one complete finite branch |
| Uroko | One complete equilateral triangular scale | Square alternating/staggered motif arrangement |
| Mameshibori | One full dot | Square size/color hierarchy, or one uniform reference dot |

These are explicit app construction definitions, not verified historical claims. Motif colors need not expose every field color: alternating colors and secondary dot hierarchies belong to Tile/Pattern. Karakusa is an infinite connected construction with no unique isolated closed motif. The chosen branch is finite, connected and unclipped; opening its periodic stem is stated in the UI rather than inventing a closed emblem.

## Square arrangement versus original lattice

The original rectangular translation lattices remain available in native generator APIs. They are not stretched into squares. Instead the workspace uses [new square placements](SQUARE_ARRANGEMENTS.md) where needed, as the user authorized. Square crops alone were insufficient; deliberately changing relative placement solves that constraint while retaining each motif's internal shape.

Regular motif parameters remain analytic before finite SVG rounding; equal sides, radii and uniform scale are tested. Karakusa remains an explicit fitted cubic branch, not a universal idealized/historical formula. Arrangement shifts translate the repeat phase without changing those definitions.

## Modules

- `patterns/motifs.js`: explicit single constructions, with curve/control-hull bounds and no repeat clipping. Reuses shared hexagon/arc primitives. Asanoha assembles the full six-sector rosette instead of showing only one lattice contribution.
- `patterns/presentation.js`: `render(pattern, index, state, variant, mode)` returns `{svg,note,square}`; modes are `motif`, `tile`, `field`. Validates inputs and delegates repeated geometry to the existing serializer. Native repeat dimensions and phase translation are handled by patterns/svg.js.
- `patterns/svg.js`: optional `{columns,rows}` span in repeatLayout/serializeField supports composition for compatibility, for the square-compatible native compositions while compensating stroke scale. Default calls retain the earlier natural-cell contract for compatibility.
- Karakusa motif unwrapping walks parent attachments from curl-0, shifting each descendant to the parent's actual anchor. One periodic cycle is cut; leaves use their parent's offset. Bounds include all cubic/quadratic control hulls so no path is clipped.

Background is explicit; motif padding is outside the shape and stroke remains in output units. Tile/Pattern stroke caps remain generator behavior; isolated Motif uses requested stroke, with the inspector explaining the distinction. Tile clipping belongs to SVG pattern viewBoxes, not motif markup. No external assets, generated raster substitution or new packages enter exports.

## Validation and limitations

Node checks retain prior generator baselines and add motif bounds/independence, native-period/square declarations, density-one tile equality, full rosette sectors, unwrapped vine attachment/hulls, and motif stroke compensation. Browser checks cover all three views for all nine patterns, geometric breathing room, density independence, view labels, named matching clipboard/download content, native radio keyboard selection, and displayed-tile-versus-repeated-field raster coverage. Reference variants remain covered.

[Review artifacts](data/preview-modes-2026-10-28/README.md) contain all three views for every pattern/variant. Native OS save/clipboard permission, external SVG editors, non-Chromium, full accessibility certification and historical/reference acceptance remain open. Construction/Context tabs, zoom and retirement of the temporary old entry remain later work.

## Compact toolbar and browse previews
The [compact workspace](COMPACT_WORKSPACE.md) keeps the three view controls in one bar and moves explanations to Info. Copy/Export visible labels are short; accessible names identify each view. Gallery thumbnails use a fixed two-tile square crop solely for browsing, with stronger preview-only line visibility; they do not redefine the export tile or alter motif geometry.

Current tessellation and phase controls are documented in [TESSELLATION.md](TESSELLATION.md).
