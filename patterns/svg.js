(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./catalog.js"), require("./validation.js"));
  else root.PatternSVG = factory(root.PatternCatalog, root.PatternValidation);
})(typeof globalThis !== "undefined" ? globalThis : this, function (catalog, validation) {
  "use strict";
  const validate = validation.validate;
    function serialize(pattern, idx, state, preset = "default") {
      validate(state);
      if (!/^[a-z][a-z0-9-]*$/.test(pattern.id) || !Number.isSafeInteger(idx) || idx < 0) throw new RangeError("Invalid SVG identifier.");
      if (preset !== "default" && preset !== "reference") throw new RangeError("Unknown preset.");
      const frame = state.frame;
      const unit = frame / state.reps;
      const tile = (preset === "reference" ? catalog.referenceTile(pattern, unit, state) : pattern.tile(unit, state));
      const pid = `p_${pattern.id}_${idx}`;
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${frame} ${frame}">
          <defs>
            <pattern id="${pid}" patternUnits="userSpaceOnUse" width="${tile.w}" height="${tile.h}">
              ${tile.markup}
            </pattern>
          </defs>
          <rect width="${frame}" height="${frame}" fill="${state.bg}"/>
          <rect width="${frame}" height="${frame}" fill="url(#${pid})"/>
        </svg>
      `.trim();
    }

  function repeatLayout(pattern, state, preset = "default", span = { columns: 1, rows: 1 }) {
    validate(state);
    if (preset !== "default" && preset !== "reference") throw new RangeError("Unknown preset.");
    const generate = settings => preset === "reference" ? catalog.referenceTile(pattern, 100, settings) : pattern.tile(100, settings);
    const probe = generate(state);
    if (![probe.w, probe.h].every(value => Number.isFinite(value) && value > 0)) throw new RangeError("Invalid repeat dimensions.");
    const [widthFactor, heightFactor] = pattern.repeat?.[preset] || [1, 1];
    if (![span.columns, span.rows].every(value => Number.isSafeInteger(value) && value > 0 && value <= 2)) throw new RangeError("Invalid repeat span.");
    const cellWidth = state.frame / (state.reps * span.columns);
    const scale = cellWidth / (probe.w * widthFactor);
    // Compensate viewBox scaling so requested stroke stays in output units.
    const drawing = generate({ ...state, stroke: state.stroke / scale });
    const tile = { ...drawing, w: drawing.w * widthFactor, h: drawing.h * heightFactor };
    const cellHeight = cellWidth * tile.h / tile.w;
    return Object.freeze({ width: state.frame, height: cellHeight * state.reps * span.rows, cellWidth, cellHeight, tile });
  }

  function serializeField(pattern, idx, state, preset = "default", span = { columns: 1, rows: 1 }) {
    if (!/^[a-z][a-z0-9-]*$/.test(pattern.id) || !Number.isSafeInteger(idx) || idx < 0) throw new RangeError("Invalid SVG identifier.");
    const { width, height, cellWidth, cellHeight, tile } = repeatLayout(pattern, state, preset, span);
    const pid = `field_${pattern.id}_${idx}`;
    const phase = value => (((value || 0) % 100 + 100) % 100) / 100;
    const x = phase(state.shiftX) * cellWidth, y = phase(state.shiftY) * cellHeight;
    const offset = x || y ? ` x="${x}" y="${y}"` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs><pattern id="${pid}"${offset} patternUnits="userSpaceOnUse" width="${cellWidth}" height="${cellHeight}" viewBox="0 0 ${tile.w} ${tile.h}">
        ${tile.markup}
      </pattern></defs>
      <rect width="${width}" height="${height}" fill="${state.bg}"/>
      <rect width="${width}" height="${height}" fill="url(#${pid})"/>
    </svg>`;
  }

  return Object.freeze({ serialize, repeatLayout, serializeField });
});
