# Tessellation restoration

Status: current, 2026-10-28. Supersedes the rejected square motif-packing experiment.

Tile and Pattern use the original catalog lattice generators and their smallest validated rectangular periods. Complete isolated motifs are for Motif view only. Packing those motifs into a square changed the tessellation, even though the resulting square repeated without boundary seams. That implementation was incorrect and has been removed.

Density counts genuine repeat cells across and down. Density 1 is exactly Tile. Width determines a uniform scale; height follows the native period aspect ratio. Asanoha, Kikko and Uroko retain their regular triangular/hexagonal lattices; Karakusa retains its periodic connected vine graph. No extra gaps, independent branches or rescaled axes are introduced.

Shift X/Y translate the entire existing lattice by percentages of its native cell width/height. Both signed whole-period shifts equal zero. Center clears shifts only. Isolated motifs and gallery thumbnails ignore these shifts. Gallery thumbnails are square viewing crops of the infinite field, not square export tiles.

Square export remains unresolved where the native lattice does not admit a square period. Rotating or translating a regular triangular/hexagonal lattice cannot supply an exact square translation cell. A square crop of such a field is not necessarily seamless. The app currently exports truthful rectangular repeats rather than changing spacing or deforming geometry. Future square options must establish both boundary periodicity and equivalence to the intended tessellation before shipping.

`patterns/presentation.js` delegates Tile/Pattern to `PatternSVG.serializeField`; `repeatLayout` determines the native cell dimensions. Zero-shift exports match the earlier minimal-repeat fixtures byte for byte. `serializeField` applies phase through SVG pattern x/y only; generator geometry and spacing remain unchanged. The rejected square-layout module has been removed.

Validation combines frozen native-field equivalence, independent generator geometry/seam tests, phase wrap/state tests and browser raster comparisons of repeated tiles against larger fields. Raster periodicity alone is insufficient: an incorrect motif grid can also repeat perfectly.
