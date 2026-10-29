(function (root, factory) {
  const pattern = factory();
  if (typeof module === 'object' && module.exports) module.exports = pattern;
  else root.KarakusaPattern = pattern;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const referenceWidth = 278;
  const referenceHeight = 179;
  // Measured composition landmarks, hand-fitted as spline knots. These are
  // reference-specific estimates, not a universal Karakusa construction.
  const paths = [
    { id: 'curl-0', parent: 'curl-12', knot: 2, shift: [0, -179], points: [[145,27],[135,74],[119,85],[98,87],[82,76],[81,61],[91,47],[108,44],[121,51],[124,61],[116,69],[105,66],[103,60],[108,55],[112,57]] },
    { id: 'curl-1', parent: 'curl-0', knot: 2, points: [[119,85],[110,107],[112,128],[126,145],[149,153],[169,145],[175,128],[167,115],[151,110],[140,119],[142,130],[153,134],[160,129],[155,123]] },
    { id: 'curl-2', parent: 'curl-0', knot: 1, points: [[135,74],[151,91],[173,92],[183,80],[177,67],[165,63],[155,71],[157,80],[166,82],[171,76],[165,71],[161,74]] },
    { id: 'curl-3', parent: 'curl-2', knot: 2, points: [[173,92],[198,100],[218,120],[225,143],[214,160],[204,164],[188,160],[181,147],[186,136],[197,133],[207,140],[206,149],[198,154],[192,149],[194,145]] },
    { id: 'curl-4', parent: 'curl-3', knot: 2, points: [[218,120],[239,116],[259,128],[270,146],[264,163],[250,169],[236,163],[232,150],[240,139],[251,140],[257,150],[252,158],[243,158],[238,152],[242,147]] },
    { id: 'curl-5', parent: 'curl-1', knot: 2, points: [[112,128],[88,134],[71,150],[65,171],[76,190],[98,197],[117,188],[121,171],[111,157],[97,155],[90,165],[97,175],[107,174],[109,169],[104,166]] },
    { id: 'curl-6', parent: 'curl-5', knot: 3, shift: [0, -179], points: [[65,-8],[45,2],[40,22],[48,41],[68,48],[82,38],[84,25],[74,19],[64,23],[64,31],[71,34],[75,30]] },
    { id: 'curl-7', parent: 'curl-6', knot: 3, points: [[48,41],[34,53],[29,73],[39,92],[59,98],[71,88],[70,75],[59,69],[50,74],[50,81],[57,83],[61,79]] },
    { id: 'curl-8', parent: 'curl-5', knot: 3, points: [[65,171],[39,177],[16,170],[5,153],[5,135],[18,122],[33,122],[43,134],[39,145],[29,146],[23,138],[26,132],[32,133],[34,137]] },
    { id: 'curl-9', parent: 'curl-5', knot: 1, points: [[88,134],[65,143],[51,137],[49,123],[59,114],[70,118],[73,127],[66,133],[61,130],[64,125]] },
    { id: 'curl-10', parent: 'curl-2', knot: 2, points: [[173,92],[192,94],[205,90],[218,82],[221,63],[209,60],[199,67],[198,80],[206,90],[216,86],[216,78],[210,75],[207,79]] },
    { id: 'curl-11', parent: 'curl-10', knot: 4, points: [[221,63],[232,62],[234,61],[239,54],[237,44],[227,42],[220,47],[222,55],[231,55],[233,50],[229,48]] },
    { id: 'curl-12', parent: 'curl-1', knot: 4, points: [[149,153],[176,173],[145,206],[128,199],[122,184],[130,171],[145,169],[156,178],[154,190],[143,194],[137,187],[143,180],[148,184]] },
    { id: 'curl-13', parent: 'curl-3', knot: 5, points: [[204,164],[222,177],[224,190],[223,201],[209,211],[193,210],[179,199],[177,182],[185,175],[196,178],[199,188],[193,193],[188,188]] },
    { id: 'curl-14', parent: 'curl-13', knot: 3, shift: [0, -179], points: [[223,22],[251,8],[277,1],[300,9],[305,29],[292,45],[272,48],[258,39],[260,25],[273,21],[281,27],[278,35],[272,34]] },
    { id: 'curl-15', parent: 'curl-11', knot: 2, points: [[234,61],[236,83],[248,101],[269,109],[287,102],[294,88],[288,73],[277,69],[267,76],[269,85],[279,90],[287,84],[284,77],[278,78]] }
  ];
  const leaves = [
    { parent: 'curl-0', knot: 3, tip: [89,103], width: 4 },
    { parent: 'curl-1', knot: 1, tip: [125,115], width: 4 },
    { parent: 'curl-2', knot: 1, tip: [142,104], width: 4 },
    { parent: 'curl-3', knot: 1, tip: [192,116], width: 4 },
    { parent: 'curl-5', knot: 1, tip: [90,148], width: 3.5 },
    { parent: 'curl-8', knot: 1, tip: [35,157], width: 4 },
    { parent: 'curl-13', knot: 1, tip: [228,165], width: 4 },
    { parent: 'curl-14', knot: 1, tip: [262,-3], width: 3.5 }
  ];

  function freeze(value) {
    Object.values(value).forEach(child => {
      if (child && typeof child === 'object') freeze(child);
    });
    return Object.freeze(value);
  }
  freeze(paths);
  freeze(leaves);

  // Uniform Catmull-Rom knots converted to cubic Beziers. Endpoint tangents
  // are one-sided; internal tangents are centered differences, yielding C1 joins.
  function spline(points) {
    return points.slice(0, -1).map((a, index) => {
      const b = points[index + 1];
      const previous = points[index - 1] || a;
      const next = points[index + 2] || b;
      return [a.slice(), a.map((v, axis) => v + (b[axis] - previous[axis]) / 6), b.map((v, axis) => v - (next[axis] - a[axis]) / 6), b.slice()];
    });
  }

  function buildGeometry() {
    const geometry = paths.map(path => ({ id: path.id, curves: spline(path.points), filled: false }));
    leaves.forEach((leaf, index) => {
      const base = paths.find(path => path.id === leaf.parent).points[leaf.knot];
      const dx = leaf.tip[0] - base[0], dy = leaf.tip[1] - base[1];
      const length = Math.hypot(dx, dy);
      const mid = base.map((v, axis) => (v + leaf.tip[axis]) / 2);
      const normal = [-dy / length * leaf.width, dx / length * leaf.width];
      geometry.push({ id: 'leaf-' + index, filled: true, curves: [
        [base.slice(), mid.map((v, axis) => v + normal[axis]), leaf.tip.slice()],
        [leaf.tip.slice(), mid.map((v, axis) => v - normal[axis]), base.slice()]
      ] });
    });
    return geometry;
  }

  function tile(unit, state) {
    if (!Number.isFinite(unit) || unit <= 0 || !Number.isFinite(state.stroke) || state.stroke <= 0) {
      throw new RangeError('Karakusa unit and stroke must be positive finite numbers.');
    }
    const width = 4 * unit;
    const scale = width / referenceWidth;
    const height = referenceHeight * scale;
    const stroke = Math.min(state.stroke, width * 0.018);
    const n = value => Number(value.toFixed(4));
    const point = p => n(p[0] * scale) + ' ' + n(p[1] * scale);
    const copies = new Map();
    buildGeometry().forEach(part => {
      const points = part.curves.flat();
      const padding = part.filled ? 0 : stroke / (2 * scale);
      const minX = Math.min(...points.map(p => p[0])), maxX = Math.max(...points.map(p => p[0]));
      const minY = Math.min(...points.map(p => p[1])), maxY = Math.max(...points.map(p => p[1]));
      let d = 'M ' + point(part.curves[0][0]) + ' ';
      d += part.curves.map(curve => (curve.length === 4 ? 'C ' : 'Q ') + curve.slice(1).map(point).join(' ')).join(' ');
      if (part.filled) d += ' Z';
      const markup = '<path data-part="' + part.id + '"' + (part.filled ? ' fill="' + state.line + '" stroke="none"' : '') + ' d="' + d + '"/>';
      for (let row = Math.ceil((-maxY - padding) / referenceHeight); row <= Math.floor((referenceHeight - minY + padding) / referenceHeight); row += 1) {
        for (let col = Math.ceil((-maxX - padding) / referenceWidth); col <= Math.floor((referenceWidth - minX + padding) / referenceWidth); col += 1) {
          const key = col + ',' + row;
          if (!copies.has(key)) copies.set(key, []);
          copies.get(key).push(markup);
        }
      }
    });
    const content = [...copies].map(([key, parts]) => {
      const [col, row] = key.split(',').map(Number);
      return '<g data-motif="' + key + '" transform="translate(' + n(col * width) + ' ' + n(row * height) + ')">' + parts.join('') + '</g>';
    }).join('');
    return { w: n(width), h: n(height), markup: '<g fill="none" stroke="' + state.line + '" stroke-width="' + n(stroke) + '" stroke-linecap="round" stroke-linejoin="round">' + content + '</g>' };
  }

  return Object.freeze({ version: 'karakusa-3', referenceWidth, referenceHeight, paths, leaves, spline, buildGeometry, tile });
});
