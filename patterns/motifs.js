(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./catalog.js"), require("./karakusa.js"));
  else root.PatternMotifs = factory(root.PatternCatalog, root.KarakusaPattern);
})(typeof globalThis !== "undefined" ? globalThis : this, function (catalog, karakusa) {
  "use strict";
  const n = value => Number(value.toFixed(4));

  function vine(state) {
    const offsets = new Map([["curl-0", [0, 0]]]);
    // Open the periodic stem once; unwrap every other branch onto its parent.
    while (offsets.size < karakusa.paths.length) {
      let progress = false;
      for (const path of karakusa.paths) {
        if (offsets.has(path.id) || !offsets.has(path.parent)) continue;
        const parent = karakusa.paths.find(candidate => candidate.id === path.parent);
        const offset = offsets.get(parent.id);
        offsets.set(path.id, parent.points[path.knot].map((value, axis) => value + offset[axis] - path.points[0][axis]));
        progress = true;
      }
      if (!progress) throw new Error("Cannot unwrap vine branches.");
    }
    const parts = karakusa.buildGeometry().map(part => {
      const parent = part.filled ? karakusa.leaves[Number(part.id.slice(5))].parent : part.id;
      const offset = offsets.get(parent);
      return { ...part, curves: part.curves.map(curve => curve.map(point => point.map((value, axis) => value + offset[axis]))) };
    });
    const points = parts.flatMap(part => part.curves.flat());
    const xs = points.map(point => point[0]), ys = points.map(point => point[1]);
    const markup = parts.map(part => {
      const point = p => p.map(n).join(" ");
      const d = `M ${point(part.curves[0][0])} ` + part.curves.map(curve => `${curve.length === 4 ? "C" : "Q"} ${curve.slice(1).map(point).join(" ")}`).join(" ") + (part.filled ? " Z" : "");
      return `<path data-part="${part.id}" d="${d}"${part.filled ? ` fill="${state.line}" stroke="none"` : ""}/>`;
    }).join("");
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys),
      markup: `<g fill="none" stroke="${state.line}" stroke-width="${state.stroke}" stroke-linecap="round" stroke-linejoin="round">${markup}</g>`,
      note: "One connected vine branch, with the periodic stem opened once. The continuous pattern has no unique isolated motif.", parts };
  }

  function build(pattern, state, variant = "default") {
    const linework = markup => `<g fill="none" stroke="${state.line}" stroke-width="${state.stroke}">${markup}</g>`;
    switch (pattern.id) {
      case "asanoha": {
        const vertices = Array.from({ length: 6 }, (_, index) => {
          const angle = -Math.PI / 2 + index * Math.PI / 3;
          return [100 * Math.cos(angle), 100 * Math.sin(angle)];
        });
        const point = p => p.map(n).join(" ");
        let branches = "";
        for (let index = 0; index < 6; index += 1) {
          const a = vertices[index], b = vertices[(index + 1) % 6];
          const centroid = a.map((value, axis) => (value + b[axis]) / 3);
          branches += `M 0 0 L ${point(a)} M ${point(centroid)} L 0 0 M ${point(centroid)} L ${point(a)} M ${point(centroid)} L ${point(b)} `;
        }
        return { x: -Math.sqrt(3) * 50, y: -100, w: Math.sqrt(3) * 100, h: 200,
          markup: linework(catalog.glyphs.hex(0, 0, 100) + `<path d="${branches.trim()}"/>`), note: "One complete six-sector hemp-leaf rosette, assembled from the lattice's subdivided triangles." };
      }
      case "kikko": return { x: -Math.sqrt(3) * 21, y: -42, w: Math.sqrt(3) * 42, h: 84,
        markup: linework(catalog.glyphs.hex(0, 0, 42)) + `<g fill="none" stroke="${state.accent}" stroke-width="${n(state.stroke * 0.8)}">${catalog.glyphs.hex(0, 0, 42 * 0.56)}</g>`, note: "One complete pair of nested hexagons." };
      case "yagasuri": return { x: 2, y: 0, w: 46, h: 119, markup: `<g fill="${state.line}"><polygon points="2,0 23,25 23,119 2,94"/><polygon points="27,25 48,0 48,94 27,119"/></g>`, note: "One complete arrow-feather pair; alternating direction and stagger belong to the repeat." };
      case "seigaiha": {
        const arcs = Array.from({ length: 4 }, (_, index) => catalog.glyphs.arcPath(50, 50, 50 - index * 12, true)).join(" ");
        return { x: 0, y: 0, w: 100, h: 50, markup: linework(`<path d="${arcs}"/>`), note: "One complete four-ring fan, before neighboring fans overlap it." };
      }
      case "ichimatsu": return { x: 0, y: 0, w: 100, h: 100, markup: `<rect width="100" height="100" fill="${state.line}"/>`, note: "One complete square. Alternating colors belong to the tile." };
      case "shippo": return { x: 0, y: 0, w: 100, h: 100, markup: pattern.tile(100, state).markup, note: "One complete four-lens composition." };
      case "uroko": return { x: 0, y: 0, w: 100, h: Math.sqrt(3) * 50, markup: `<polygon points="0,${n(Math.sqrt(3) * 50)} 50,0 100,${n(Math.sqrt(3) * 50)}" fill="${state.line}"/>`, note: "One complete equilateral scale. Alternating color and row offsets belong to the repeat." };
      case "mameshibori": {
        const r = variant === "reference" ? 5.5 : 8;
        return { x: -r, y: -r, w: r * 2, h: r * 2, markup: `<circle r="${r}" fill="${state.line}"/>`, note: "One complete dot; the original variant's size hierarchy belongs to the tile." };
      }
      case "karakusa": return vine(state);
      default: throw new RangeError("No motif definition for this pattern.");
    }
  }
  return Object.freeze({ build });
});
