# Workspace session model

Implemented 2026-10-28: workspace plan slice 1. The current lab remains independent. These modules are now connected to [the opt-in workspace](WORKSPACE_UI.md), not loaded by `index.html`.

## Modules and contracts

`patterns/capabilities.js` exports `get(patternId, variant = "default")`. The frozen result declares supported controls, available variants, stroke support/cap description, and secondary-color support. Common controls are frame, repetitions, shiftX/shiftY, primary and background. Metadata is checked against generator behavior in tests. Reference variants omit the secondary-color control.

`patterns/session.js` exports `defaults`, `create`, `select`, `edit`, `reset`, and `view`. Each operation returns a frozen session without changing its input. Session shape:

```js
{
  selectedId: "asanoha",
  tab: "preview", // preview | construction | context
  mode: "field", // field | tile | motif (repeat reserved for compatibility)
  zoom: 1,       // 0.25 to 4, presentation only
  artwork: { /* pattern ID -> validated parameters plus variant */ }
}
```

Each artwork entry starts with frame 480, repetitions 12, stroke 1.6, primary `#2a5db1`, secondary `#6f8dcb`, background `#ffffff`, variant `default`, and shifts `shiftX: 0`, `shiftY: 0`. Entries are independent; untouched entries can safely share references between immutable session revisions.

| Operation | Behavior |
| --- | --- |
| `create(id?)` | New session for all nine patterns; selects Asanoha unless an ID is supplied |
| `select(session, id)` | Change selection; preserve all artwork and view settings |
| `edit(session, patch)` | Validate and replace only selected artwork; reject unknown or unsupported controls |
| `reset(session)` | Restore selected artwork and default variant; preserve selection, view, and other artwork |
| `view(session, patch)` | Change tab, mode, or zoom; reject other keys and invalid values |

`edit` evaluates supported controls for the resulting variant. Switching to reference while also setting secondary color is rejected. Existing secondary color remains stored while inactive, so returning to the original variation restores it. Unsupported stroke values also remain stored defaults without appearing as editable controls. Generator-specific effective stroke caps remain generator behavior.

Unknown IDs/variants, unsupported controls and invalid view values throw `RangeError`. Malformed patch arguments throw `TypeError`; artwork bounds/colors use the existing validation module. No implicit string-to-number coercion occurs. Call these APIs with sessions created by this module, not imported/untrusted objects. There is no persisted session format, theme state, DOM access, or subscription mechanism.

## Usage

```js
const Session = require('../patterns/session.js');
const { patterns } = require('../patterns/catalog.js');
const { serializeField } = require('../patterns/svg.js');

let session = Session.create('ichimatsu');
session = Session.edit(session, { variant: 'reference', line: '#123456' });
session = Session.view(session, { mode: 'tile', zoom: 2 });
const index = patterns.findIndex(p => p.id === session.selectedId);
const artwork = session.artwork[session.selectedId];
const svg = serializeField(patterns[index], index, artwork, artwork.variant);
// Export is the natural-aspect repeated field, independent of inspection mode and zoom.
```

For classic browser scripts, load Karakusa, catalog, validation, capabilities, then session. Globals are `PatternCapabilities` and `PatternSession`; the existing SVG serializer is loaded separately. No build step or new package is needed.

## UI integration responsibilities

The workspace inspector catches validation errors; other consumers must also catch them. It must associate messages with fields, keep invalid draft input separate from validated artwork, and disable copy/download until the draft is corrected or reset. The model does not track invalid input or disable exports itself. Assign a returned session only on success; thrown errors leave the prior session intact.

Render only the selected preview on an edit. Keep gallery thumbnails at fixed defaults. Theme belongs to the existing theme system and is unaffected by artwork reset. Reload creates a fresh session; saving/importing is deferred.

## Validation

`node --test _Vectors/tests/*.test.cjs` passes 40 tests. Eight new tests cover eleven frozen export snapshots, independent state, reset scope, invalid IDs/variants/controls, atomic failures, inactive secondary retention, capabilities versus generator behavior, view/export invariance, and classic browser-global execution in a DOM-free VM. Node syntax checks pass for both modules. Subsequent workspace UI integration and browser checks are documented in [WORKSPACE_UI.md](WORKSPACE_UI.md).

Density now accepts 1-36. Workspace repeats use complete cell counts; see [density contract](DENSITY_AND_TILING.md). The session API and default parameters remain unchanged.

Workspace view mode now accepts motif and uses PatternPresentation.render for view-specific exports; the radio choices are Motif, Tile and Pattern (field). Legacy repeat mode remains model-compatible but is not a UI option.

Native repeat shifts are validated finite percentages (-100 to 100). They are artwork parameters, retained per pattern and reset with that artwork. Motif ignores them; Tile/Pattern wrap the phase. See [tessellation behavior](TESSELLATION.md).
