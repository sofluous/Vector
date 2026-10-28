# Changelog

## 2026-03-03
- Created `_Vectors/index.html` geometric SVG gallery page.
- Added 12 reusable placeholder logo vector concepts.
- Added per-card `Copy SVG` and `Download` actions.
- Added `_Vectors/_docs` baseline documentation structure and `data/` folder.
- Expanded gallery with 8 Japanese crest/pattern-inspired vector concepts.
- Rebuilt `_Vectors/index.html` into a parametric tileable Japanese pattern lab.
- Added mathematically repeating generators for: Asanoha, Yagasuri, Seigaiha, Ichimatsu, Shippo, Kikko, Karakusa, Uroko, and Mameshibori.
- Added live controls for repetitions per frame, line thickness, line color, accent color, background color, and frame size.
- Merged the original static vector concepts back into the page as a dedicated `Static Vector Gallery` section.
- Reworked tile generators against `_Vectors/_references/*.jpg` to better match pattern structure and repeat geometry.
- Corrected `Yagasuri` to a clean geometric arrow tessellation with consistent repeat spacing.
- Fixed `Shippo` blank rendering by replacing non-stroked arc paths with explicit interlocking circle strokes.
- Rebuilt `Seigaiha` using constant radial increments for complete, uniformly spaced wave arcs.
- Refined `Asanoha` with denser internal construction geometry (triangular centroid lines) for fuller traditional structure.
- Updated `Seigaiha` again to enforce stronger row interlock (offset centers + shared-radius cadence).
- Updated `Shippo` again to a tighter circle lattice construction for canonical linked-circle appearance.
- Reworked `Asanoha` to a stricter lattice + six-direction spoke construction for closer reference matching.
- Reworked `Seigaiha` tile height/center offsets to create interlocked wave rows instead of visually separated bands.
- Reworked `Shippo` into lens-petal geometry with corner circle interplay for a closer filled motif look.
- Rebuilt `Asanoha` again using explicit regular-hexagon vertex connection logic (vertex-to-vertex network).
- Rebuilt `Shippo` again from quarter-offset circle stacks, rendering overlap regions directly as lens petals.
- Rebuilt `Seigaiha` using a triangular-lattice center model and variable opening-angle arcs based on the provided formula reference.
- Replaced `Asanoha` generator with the explicit per-hex line construction (matching the provided 4-connected-hex drawing logic).
- Updated `Shippo` to diagonal-overlap lens construction so center negative space reads as rotated-diamond instead of square.
- Reduced Seigaiha visual density at low repeat counts by lowering center/ring sampling and scaling ring count with repeats.
- Added an in-page formula info popout with base construction notes for Asanoha, Shippo, and Seigaiha.
- Reworked formula popout into a pattern-specific tabbed panel with mini construction diagrams.
- Updated `Shippo` to use the previous side-overlap lens construction and rotate the motif orientation by 45 degrees.
- Tuned Seigaiha ring scaling again to improve legibility at lower repetition settings.
- Added `Project Logo Starters` section with simple generated SVG logo cards for each top-level `_Code` project folder.
- Replaced generic project logo generation with purpose-led per-project logo profiles (intent + motif + palette) for stronger brand distinctiveness.

## 2026-10-28
- Reviewed scratchpad and source structure; updated product direction from placeholder logos to a proposed worldwide pattern/texture repository with mathematical construction, contextual information, editing, and SVG export.
- Replaced outdated roadmap with reference audit, generator corrections, selected-pattern workspace, curated collection, and later expansion stages.
- Recorded user-reported accuracy concerns separately from verified visual findings; added proposed data contracts, Design System guidance, quality gates, migration considerations, and open decisions.
- Updated documentation index; left the scratchpad unchanged; its date was corrected to `20261028` during review. No application code changed or runtime checks performed.
- Proceeded with an initial nine-pattern reference audit, captured original tile outputs/settings and rendered comparisons, and documented provenance/rights gaps plus specific construction issues. This subsequent work includes rendered validation and application changes.
- Replaced Yagasuri bars/caps with paired slanted feather vanes, opposing columns, a half-period stagger, wrapped tips, and explicit invalid-unit handling. Preserved ID and colors; other eight generators retain byte-identical baseline output.
- Added the Yagasuri construction specification and five passing dependency-free Node tests. Parsed inline JavaScript and ten SVG artifacts; inspected Edge captures and confirmed initial rendering of all three galleries. External editor, clipboard/download interaction, cross-browser, and theme acceptance remain open.
- Updated product, roadmap, QA, migration notes, and index; next scoped correction is Seigaiha. Workspace overhaul remains planned.

