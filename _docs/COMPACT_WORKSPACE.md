# Compact workspace and gallery previews

Implemented 2026-10-28 following user feedback to remove excessive descriptions, use standard control bars, and make library patterns visible.

## Working layout

- A compact Vectors/theme bar replaces the large heading and introductory copy.
- The canvas toolbar combines selected pattern name, Motif/Tile/Pattern segmented radio controls, Copy, Export and Info. Visible actions stay short; accessible names and tooltips include the active view and SVG format.
- Explanations, motif/tile limitations, stroke caps and session guidance live in Info. The native disclosure is closed by default, positioned next to its trigger with viewport clamping, and closes on Escape, outside click or resize. Escape returns focus to the trigger.
- Output dimensions and Pattern density occupy one status bar. Error/status feedback remains visible when needed, rather than reserving a descriptive block.
- Properties use aligned compact label/control rows. Slider/exact-value pairs and picker/hex pairs stay intact. Validation messages expand only when needed.
- The preview SVG fits its available stage with its natural aspect ratio. Page and preview scrollbars are unnecessary; library/property panels can scroll when actual content exceeds their available space.

Desktop has Library, stage and Properties columns. Tablet starts Library collapsed above stage/Properties columns. Phone starts both Library and Properties collapsed around the stage. These are native disclosures, not modal drawers; users can expand either without losing artwork or view state. Expanded panels are height-bounded to preserve stage space. Breakpoint defaults are set at page load; later resizing preserves the user's disclosure choices.

## Visible gallery density

`PatternPresentation.thumbnail(pattern,index,state,variant)` makes a browse-only square crop of the repeated field. All thumbnails use two display tiles across a fixed 480-unit source canvas, preserving the construction's native cell proportions. Height is filled by the repeat instead of showing blank letterboxing for rectangular tiles. A thumbnail crop is not presented as an exportable seamless square tile.

Browse stroke has a six-unit minimum at the source scale, subject to existing motif stroke caps. This makes line constructions readable at 48/64-pixel thumbnail sizes beside solid fills. Palette remains model data. Editor density, output width and changes to artwork do not rebuild or alter library thumbnails; the workspace supplies fixed defaults. Actual motif/tile/pattern exports retain their exact existing geometry, stroke, dimensions and colors.

The library uses compact two-column cards inside the existing construction groups. Search remains labeled for assistive technology, with a short placeholder and result count. Thumbnails are decorative; button names identify each pattern. Selection remains keyboard-accessible and visible.

## Files and Design System

`workspace.html`, `workspace.js`, `css/workspace.css`, and the thumbnail helper in `patterns/presentation.js` implement this refinement. Typography, spacing, surfaces, borders, focus, controls and status colors use the bundled DS tokens. The control bar uses native form controls with accessible names; no new icons or dependencies were added. Left native disclosure arrows remain the previously documented initial exception to terminal/right collapse placement.

The compact layout preserves proportions. The square motif-packing experiment was rejected; [native tessellations](TESSELLATION.md) now govern Tile/Pattern and gallery content. Motif/Tile/Pattern explanations are available on demand. Subsequent geometry clarification removes square-only repeat composites while keeping motif proportions and the square browse crop intact. Construction/Context content, zoom and default-entry/old-gallery retirement remain separate roadmap work.

## Validation

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-workspace.cjs --out _docs/data/compact-workspace-2026-10-28
```

54 Node tests pass, including fixed thumbnail density/crop, independence from editor density, and prior geometry/export/state checks. Edge passes 149 checks per theme/viewport combination under Steel Night, Paper Mint and Neon Grid at 360x780, 768x800 and 1440x900 CSS pixels. Added checks cover viewport fit before/after panel expansion, visible-density metadata, default-hidden Info, Info bounds/recovery, stage bounds and lack of preview scrolling. Existing all-pattern modes, native keyboard selection, invalid drafts, export payloads and seam checks remain passing.

[Evidence and captures](data/compact-workspace-2026-10-28/README.md) retain current layout snapshots. Native OS save/clipboard permissions, non-Chromium, external editors and full accessibility/contrast certification remain open. No build/lint command is configured; syntax, whitespace, local resources and referenced DS tokens are checked separately.
