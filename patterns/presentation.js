(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./motifs.js"), require("./validation.js"), require("./capabilities.js"), require("./svg.js"));
  else root.PatternPresentation = factory(root.PatternMotifs, root.PatternValidation, root.PatternCapabilities, root.PatternSVG);
})(typeof globalThis !== "undefined" ? globalThis : this, function (motifs, validation, capabilities, svg) {
  "use strict";
  function span() {
    // One genuine rectangular lattice period, without repacking motifs.
    return { columns: 1, rows: 1 };
  }
  function render(pattern, index, state, variant = "default", mode = "field") {
    validation.validate(state); capabilities.get(pattern.id, variant);
    if (!Number.isSafeInteger(index) || index < 0) throw new RangeError("Invalid presentation index.");
    if (!["motif", "tile", "field"].includes(mode)) throw new RangeError("Unknown presentation mode.");
    if (mode === "motif") {
      const probe = motifs.build(pattern, state, variant);
      const pad = Math.max(probe.w, probe.h) * 0.12;
      const scale = state.frame / (probe.w + 2 * pad);
      const motif = motifs.build(pattern, { ...state, stroke: state.stroke / scale }, variant);
      const x = motif.x - pad, y = motif.y - pad;
      const w = motif.w + 2 * pad, h = motif.h + 2 * pad;
      const height = state.frame * h / w;
      return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${state.frame}" height="${height}" viewBox="${x} ${y} ${w} ${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${state.bg}"/>${motif.markup}</svg>`, note: motif.note, square: false };
    }
    const settings = { ...state, reps: mode === "tile" ? 1 : state.reps };
    const layout = svg.repeatLayout(pattern, settings, variant);
    const square = Math.abs(layout.width - layout.height) < 1e-8;
    return { svg: svg.serializeField(pattern, index, settings, variant), square,
      note: `${square ? "Square" : "Rectangular"} repeat unit. Preserves the original tessellation and spacing. Edge fragments complete when adjacent copies meet.` };

  }
  function thumbnail(pattern, index, state, variant = "default") {
    capabilities.get(pattern.id, variant);
    if (!Number.isSafeInteger(index) || index < 0) throw new RangeError("Invalid thumbnail index.");
    // Browse-only square crop: fill it from the repeat, never stretch the motif.
    const browseState = { ...state, frame: 480, reps: 2, stroke: Math.max(state.stroke, 6) };
    const field = svg.serializeField(pattern, index, { ...browseState, shiftX: 0, shiftY: 0 }, variant);
    const height = svg.repeatLayout(pattern, browseState, variant).height;
    return field.replace(`viewBox="0 0 480 ${height}" width="480" height="${height}"`, 'data-density="2" viewBox="0 0 480 480" width="480" height="480"')
      .replaceAll(`height="${height}"`, 'height="480"');

  }
  return Object.freeze({ render, span, thumbnail });
});
