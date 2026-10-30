> Current entry (2026-10-29): open `index.html`; the separate `workspace.html` entry has been removed. Legacy galleries are retired. Earlier opt-in/entry references below describe implementation history. External-editor acceptance remains pending.

# Pattern workspace

Updated 2026-10-28. Open `index.html` directly or serve the project root. The workspace remains the new UI under development; the lab is a temporary entry/reference for construction notes.

## Library organization

The current Japanese collection has four construction groups: Grids and scales (5), Waves and lenses (2), Branching vines (1), and Directional repeats (1). These are browsing categories, not historical or cultural attribution claims. `patterns/library.js` owns the frozen membership metadata and pure search function, independently of generator order and geometry. Each current pattern has one primary group. Future collections can extend this model when their content is added.

Compact named thumbnail cards sit inside collapsible groups. Each uses a fixed readable two-tile density rather than the editor default. Search matches names, descriptions, collection and group names. Search opens matching groups, hides unmatched items and groups, reports the result count, and provides an empty-state recovery message. Filtering does not select a different pattern or discard artwork/drafts. Clearing search restores all nine entries; groups opened by search remain open. Gallery SVGs are generated once and are not rebuilt while editing or filtering.

The workspace no longer links to the legacy galleries. The user has confirmed they are unnecessary in the updated product. The old files remain temporarily while existing construction notes move to the workspace; no new legacy-gallery work is planned.

## Editing and export

- Layout groups exact output width with density 1-36. Density N means N-by-N displayed tiles; Tile and Motif inspection are independent of density. Tile/Pattern output height follows the native repeat aspect ratio; Motif retains its own padded proportions. See [density and tiling](DENSITY_AND_TILING.md). Density and supported stroke controls pair a native range slider with an exact numeric value.
- Palette rows pair color pickers with editable six-digit hex values. Both stay synchronized; invalid hex drafts show field errors, preserve the last valid preview and disable export.
- Variation and Linework sections appear only when meaningful. Secondary color disappears for reference variants; effective stroke caps are explained for Seigaiha and Karakusa.
- Each pattern retains independent artwork settings and invalid drafts when switching selection. Reset restores only the selected pattern's defaults and original variation. Reload resets session state.
- Native numeric validation checks required values, bounds, whole-number output width/density and stroke steps. Correcting input or resetting enables export again. Inline errors are associated with controls; export is blocked while the selected draft is invalid.
- Preview, copy and download use the existing serializer. Copy failure provides a download fallback; downloads release object URLs. Export uses the displayed Motif, Tile or Pattern, with explicit artwork colors.

## Layout and Design System

The [compact workspace refinement](COMPACT_WORKSPACE.md) replaces stacked descriptions with a single canvas toolbar, Info disclosure and status bar, and aligns property rows. `index.html` owns semantic structure and classic-script loading. `workspace.js` binds the session/capability model and library metadata to the DOM without duplicating generators. `css/workspace.css` consumes bundled Design System semantic colors, type and spacing tokens. Scoped range-thumb component tokens use the semantic accent for visibility. Artwork colors remain model data.

At desktop widths, library, stage and inspector occupy the viewport. At tablet widths Library starts collapsed; at phone widths both side panels start collapsed. Native disclosures expand in place with bounded content scrolling. The stage fits the current SVG without page/preview scrolling. See [current layout contract](COMPACT_WORKSPACE.md).

[Motif, Tile and Pattern views](MOTIF_TILE_PATTERN.md) now separate the complete shape from repeat construction. Copy/download follow the displayed view. Construction/Context tabs and centered zoom are implemented; persistence and transparent export remain later work. Reference/historical approval and external-editor imports are still open. Legacy galleries will be retired once the workspace replaces the needed pattern/construction workflow.

## Validation

```powershell
node --test _Vectors/tests/*.test.cjs
node --check _Vectors/workspace.js
node _Vectors/tests/browser-workspace.cjs --out _docs/data/compact-workspace-2026-10-28
```

The Edge runner uses its debugging pipe for exact 360/768/1440 CSS-pixel viewport emulation under Steel Night, Paper Mint and Neon Grid. It creates and removes a bounded temporary instrumented page in the project; isolated browser profiles remain in OS temp. `BROWSER_PATH` can override Edge. Output must stay under project `_docs/data/`.

Grouped-layout validation: 42 Node tests and 57 browser checks per theme/viewport combination (before the subsequent density change). New coverage checks grouping completeness, search, empty-result recovery, stable selection, paired numeric/range and hex/picker controls, invalid hex recovery, grouped inspector structure and native ArrowRight slider adjustment. Existing default SVGs, independent edits, validation/reset, intercepted copy/download, cleanup, focus, native Tab/Enter/disclosure behavior and overflow checks remain covered. [Current evidence](data/grouped-workspace-2026-10-28/README.md); [prior workspace/lab evidence](data/workspace-ui-2026-10-28/README.md) is preserved.

No build/lint configuration exists. Native clipboard/save permissions, non-Chromium rendering, full accessibility/contrast certification and external-editor interoperability remain unverified.

Subsequent density implementation uses [natural-aspect repeat fields](DENSITY_AND_TILING.md) rather than the earlier square field. Current browser fixtures and seam checks are in density-one-2026-10-28.

Current three-view behavior and geometry exceptions are specified in [MOTIF_TILE_PATTERN.md](MOTIF_TILE_PATTERN.md). Older grouped/density evidence remains historical; current mode fixtures are in preview-modes-2026-10-28.

Current compact-layout validation is recorded in [COMPACT_WORKSPACE.md](COMPACT_WORKSPACE.md). Earlier browser reports remain historical evidence.

## Minimal repeat priority
Motif geometry/proportions now explicitly take precedence over square tiles. Yagasuri and Seigaiha use their smaller native rectangular periods again. Info describes the smallest validated rectangular repeat; gallery windows remain square browse-only crops. See [governing contract](MOTIF_TILE_PATTERN.md).

## Square arrangements and shifts (rejected historical experiment)
All Tile/Pattern exports now use [square arrangements](SQUARE_ARRANGEMENTS.md). User explicitly authorized new placement/spacing with unchanged motif proportions. Arrangement adds Shift X %, Shift Y % and Center. Controls affect wrapped tile phase; Motif remains unchanged. This supersedes the earlier native-period-only priority.

## Tessellation correction - 2026-10-28

Square motif packing was rejected because it broke lattice spacing and connectivity. Native repeat exports are restored; phase controls remain. See [current contract](TESSELLATION.md).

## Selected-pattern inspection implemented - 2026-10-28

[Inspection tabs and Fit/zoom](WORKSPACE_INSPECTION.md) now complement Motif/Tile/Pattern. Selection and draft errors survive tab changes; preview framing never changes export bytes. Native tessellation dimensions govern all output; earlier all-square statements are historical.
