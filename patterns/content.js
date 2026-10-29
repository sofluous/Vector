(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./catalog.js"));
  else root.PatternContent = factory(root.PatternCatalog);
})(typeof globalThis !== "undefined" ? globalThis : this, function (catalog) {
  "use strict";
  const notes = Object.freeze({
  "asanoha": "Regular hex vertex network (your supplied primitive):\ndx = sqrt(3)r, dy = 3r/2\nFor each center C, build hex vertices at pi/6 + k*pi/3.\nDraw the explicit line set inside each connected hex.\nTile centers on hex lattice with alternating row offset.",
  "shippo": "Reference-based diagonal lens petals (idealized reconstruction):\nSquare tile: u by u. Circle radius r = 0.48u.\nCircle centers are the four edge midpoints.\nEach adjacent circle pair intersects in one diagonal lens.\nTip inset t = u/4 - sqrt(r*r - u*u/8)/sqrt(2).\nFor the top-left lens, endpoints are (t,t) and (u/2-t,u/2-t).\nJoin them with two minor circular arcs of radius r.\nConstruct the other three lenses symmetrically; do not rotate the tile.\nFill in the line color, without guide circles, outlines, or background masks.\nStroke and accent controls do not affect this filled motif.\nRadius and tip gaps are reference estimates, not historical constants.",
  "seigaiha": "Reference-based four-ring fans (idealized reconstruction):\nR = u/2; radii = R * [1, 0.76, 0.52, 0.28]\nC(i,j) = (2Ri + (j mod 2)R, jR/2)\nDraw upper semicircles, sweeping left to right.\nPaint rows back to front: a background-filled outer fan\nhides the lower arcs behind it. Do not stroke its baseline.\nRectangular repeat: width 2R, height R (two rows).\nEffective stroke = min(requested stroke, 0.45 * 0.24R).\nRing count stays fixed when repetition changes.\nRatios are estimated from the supplied reference, not historical constants.",
  "karakusa": "Reference-fitted spline reconstruction; not an exact tracing.\nW = 4u; H = W * 179/278 (estimated reference proportions).\nSixteen branching curl paths follow measured composition landmarks.\nFor neighboring knots P[i-1], P[i], P[i+1], P[i+2]:\nC1 = P[i] + (P[i+1] - P[i-1])/6\nC2 = P[i+1] - (P[i+2] - P[i])/6\nDraw cubic Bezier P[i], C1, C2, P[i+1].\nInternal joins are C1 continuous. Branches share positions, not tangents.\nThree branch joins connect translated copies across the vertical period.\nEight pointed leaves share their base points with the fitted paths.\nEffective stroke = min(requested stroke, 0.018W); accent is unused.\nLocal curves remain estimates; texture and historical context are unverified."
});
  const candidates = new Set(["yagasuri", "seigaiha", "shippo", "karakusa"]);
  function get(id) {
    const pattern = catalog.patterns.find(pattern => pattern.id === id);
    if (!pattern) throw new RangeError("Unknown pattern content.");
    return Object.freeze({
      name: pattern.name,
      construction: notes[id] || "Detailed derivation pending. The diagram shows the current generator output; it is not an independently verified construction proof.",
      hasDerivation: Boolean(notes[id]),
      review: candidates.has(id) ? "Reference reconstruction; final visual review pending." : "Retained baseline; reference accuracy review pending.",
      context: pattern.desc,
      provenance: "Local reference images have no verified creator, original publication or license. Historical attribution remains unverified.",
      reference: `./_references/Japanese/${pattern.name}.jpg`
    });
  }
  return Object.freeze({ get });
});
