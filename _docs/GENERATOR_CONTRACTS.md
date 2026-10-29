# Generator contracts and reference variants

Implemented 2026-10-28. The page still opens directly from disk without installation or a build step.

## Modules
- `patterns/catalog.js`: ordered, frozen nine-entry catalog and pure tile generators. Karakusa delegates to its fitted module. CommonJS exports and classic browser globals share the same implementation.
- `patterns/karakusa.js`: unchanged fitted curve data and geometry.
- `patterns/validation.js`: strict export-state validation. Frame 240?2000, integer repetitions 4?36, stroke 0.4?8; colors are six-digit hex. Invalid values throw before serialization. UI frame input clamps to its advertised bounds, falling back to 480 when empty.
- `patterns/svg.js`: `serialize(pattern, index, state, preset = "default")` produces standalone square SVG; validates state and identifiers. Catalog entries are trusted application code, not an SVG sanitization boundary for third-party generators.

Browser load order: Karakusa, catalog, validation, SVG, then page code. The page owns DOM interactions and session state; modules do not access the DOM.

```js
const { patterns } = require('../patterns/catalog.js');
const { serialize } = require('../patterns/svg.js');
const state = { frame:480, reps:12, stroke:1.6,
  line:'#2a5db1', accent:'#6f8dcb', bg:'#ffffff' };
const svg = serialize(patterns.find(p => p.id === 'ichimatsu'), 0, state, 'reference');
```

Low-level `tile(unit, state)` returns `{w,h,markup}` and retains existing pattern-specific checks. Use validated serialization for exports; the tile API is not a universal validation boundary. Helpers round coordinates to four decimals as before. Existing geometry/default tile strings remain covered by frozen baselines.

## Reference variants
Ichimatsu and Mameshibori cards expose a native labeled Variant select. Original variation remains the default. Reference variant is scoped to that card, survives global control edits, and resets on page reload. Preview, copy and download use the same selection. Switching retains keyboard focus. No saved preset format is introduced.

- Ichimatsu: primary/background checkerboard instead of primary/secondary.
- Mameshibori: 8-by-8 equal dots per two-unit square, radius 0.055 unit, pitch 0.25 unit, primary fill. Centers sit half a pitch inside the repeat, preserving spacing across all boundaries without clipped boundary copies.
- Both follow the global primary/background colors and ignore secondary. These are clean geometric readings of the local reference images, not reproductions of textile irregularity or verified historical claims. Provenance and rights remain unresolved.

## Validation and limitations
Run from the workspace root:

```powershell
node --test _Vectors/tests/*.test.cjs
node _Vectors/tests/browser-karakusa.cjs --out _docs/data/contracts-2026-10-28
```

Node tests cover existing baseline geometry, export bounds/determinism, reference colors and dot spacing. Browser checks additionally cover native selectors, focus restoration, isolated changes, exact original restoration, controls and intercepted export actions across three themes. The existing app chrome remains a Design System migration item; this task adds native controls without redesigning the shell. Final visual acceptance and external editor checks remain open. No build or lint configuration exists.

## Workspace foundation
The [session and capabilities modules](WORKSPACE_SESSION.md) now wrap validated per-pattern editing and control metadata. They do not alter generators, SVG serialization, or the current lab. They are now integrated in the [opt-in workspace](WORKSPACE_UI.md); the original lab remains independent.

## Current workspace repeat contract
The workspace now uses [serializeField/repeatLayout](DENSITY_AND_TILING.md): integer density 1-36, complete cell counts, natural output aspect ratio and compensated stroke. The older square serialize API remains for the temporary lab and historical tests only. Catalog repeat factors describe reduced rectangular periods independently of drawing markup.

## Presentation contract
[PatternPresentation.render](MOTIF_TILE_PATTERN.md) is the workspace entry point for motif/tile/field serialization. It uses one validated native rectangular repeat (no extra square-only spans), and separate uncropped motif definitions. Default low-level serializeField behavior is retained for compatibility.

## Browse-only thumbnail contract
PatternPresentation.thumbnail renders a square repeated-field crop at fixed source width 480, density 2, and minimum source stroke 6 (with normal generator caps). It is a library presentation, independent of editor density/output size. It does not modify view/export serializers. See [compact workspace](COMPACT_WORKSPACE.md).

## Current tessellation presentation
PatternPresentation delegates Tile/Pattern to PatternSVG.serializeField using native repeatLayout dimensions. Wrapped shiftX/shiftY translate the pattern origin only. The rejected square-layout module was removed. See [API/compatibility](TESSELLATION.md).
