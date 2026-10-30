const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const patterns = require('../patterns/catalog.js').patterns;
const shippo = patterns.find(pattern => pattern.id === 'shippo');
const state = { line: '#2a5db1', accent: '#6f8dcb', bg: '#ffffff', stroke: 1.6, reps: 12, frame: 480 };

// Recover the two generating circles from each serialized two-arc lens.
function lenses(tile) {
  return [...tile.markup.matchAll(/<path d="([^"]+)"\/>/g)].map(match => {
    const tokens = match[1].split(/\s+/);
    assert.equal(tokens.length, 20);
    assert.equal(tokens[0], 'M');
    assert.equal(tokens[3], 'A');
    assert.equal(tokens[11], 'A');
    assert.equal(tokens[19], 'Z');
    const numbers = tokens.filter(token => !['M', 'A', 'Z'].includes(token)).map(Number);
    assert.ok(numbers.every(Number.isFinite));
    const x1 = Number(tokens[1]), y1 = Number(tokens[2]);
    const radius = Number(tokens[4]);
    const x2 = Number(tokens[9]), y2 = Number(tokens[10]);
    for (const i of [5, 12, 13]) assert.equal(Number(tokens[i]), radius);
    for (const i of [6, 7, 14, 15]) assert.equal(tokens[i], '0');
    for (const i of [8, 16]) assert.equal(tokens[i], '1');
    assert.equal(Number(tokens[17]), x1);
    assert.equal(Number(tokens[18]), y1);
    const dx = x2 - x1, dy = y2 - y1;
    const chord = Math.hypot(dx, dy);
    assert.ok(chord > 0 && chord < 2 * radius);
    const offset = Math.sqrt(radius ** 2 - chord ** 2 / 4);
    const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
    return {
      x1, y1, x2, y2, radius,
      circles: [-1, 1].map(sign => ({ x: midX - sign * dy / chord * offset, y: midY + sign * dx / chord * offset }))
    };
  });
}

function filled(shapes, x, y) {
  return shapes.some(lens => lens.circles.every(circle => Math.hypot(x - circle.x, y - circle.y) < lens.radius));
}

// In the independent infinite construction, circle centers occupy odd-parity
// points of a half-unit lattice. Exactly two neighboring disks form each petal.
function infiniteFilled(unit, x, y) {
  const spacing = unit / 2;
  const column = Math.floor(x / spacing);
  const row = Math.floor(y / spacing);
  let count = 0;
  for (let i = column - 2; i <= column + 2; i += 1) {
    for (let j = row - 2; j <= row + 2; j += 1) {
      if (((i + j) % 2 + 2) % 2 !== 1) continue;
      if (Math.hypot(x - i * spacing, y - j * spacing) < unit * 0.48) count += 1;
    }
  }
  return count >= 2;
}

test('four closed diagonal lenses use equal-circle arcs without rotated tiles, clips, or outlines', () => {
  const tile = shippo.tile(100, state);
  const shapes = lenses(tile);
  assert.equal(tile.w, 100);
  assert.equal(tile.h, 100);
  assert.equal(shapes.length, 4);
  assert.ok(shapes.every(lens => lens.radius === 48));
  assert.match(tile.markup, /^<g fill="#2a5db1" stroke="none">/);
  assert.doesNotMatch(tile.markup, /transform=|clipPath|clip-path|<circle|<defs|opacity=|url\(/);
  const centers = shapes.flatMap(lens => lens.circles);
  for (const center of centers) {
    assert.ok([[50, 0], [100, 50], [50, 100], [0, 50]].some(([x, y]) => Math.hypot(x - center.x, y - center.y) < 0.0003));
  }
});

test('petal interiors are filled while central, corner, and edge-midpoint spaces remain open', () => {
  const shapes = lenses(shippo.tile(100, state));
  for (const [x, y] of [[25, 25], [75, 25], [75, 75], [25, 75]]) assert.equal(filled(shapes, x, y), true);
  for (const [x, y] of [[0, 0], [50, 50], [100, 100], [50, 0], [100, 50], [50, 100], [0, 50], [1, 1], [49, 49]]) {
    assert.equal(filled(shapes, x, y), false, `open space at ${x},${y}`);
  }
  assert.ok(shapes[0].x1 > 2 && shapes[0].x1 < 2.1, 'nonzero tip gap approximates the reference');
});

test('serialized tile agrees with an independent infinite circle field, including repeat edges/corners', () => {
  let comparisons = 0;
  for (const unit of [240 / 36, 40, 500]) {
    const tile = shippo.tile(unit, state);
    const shapes = lenses(tile);
    const wrap = (value, period) => ((value % period) + period) % period;
    const samples = [-1.001, -0.999, -0.371, -0.001, 0.001, 0.021, 0.073, 0.131, 0.193, 0.251, 0.317, 0.389, 0.449, 0.499, 0.501, 0.563, 0.631, 0.701, 0.773, 0.839, 0.901, 0.979, 0.999, 1.001, 1.251];
    for (const xr of samples) for (const yr of samples) {
      const x = xr * unit, y = yr * unit;
      assert.equal(filled(shapes, wrap(x, tile.w), wrap(y, tile.h)), infiniteFilled(unit, x, y), `unit=${unit}, sample=${xr},${yr}`);
      comparisons += 1;
    }
  }
  assert.equal(comparisons, 1875);
});

test('supported dimensions are finite and deterministic; unused controls cannot change the filled motif', () => {
  for (const frame of [240, 480, 2000]) for (const reps of [4, 12, 36]) {
    const unit = frame / reps;
    const tile = shippo.tile(unit, { ...state, frame, reps });
    assert.ok(tile.w > 0 && tile.h > 0);
    lenses(tile);
    assert.deepEqual(tile, shippo.tile(unit, { ...state, frame, reps }));
    assert.deepEqual(tile, shippo.tile(unit, { ...state, frame, reps, stroke: 8, accent: '#ffffff', bg: '#102030' }));
  }
  const recolored = shippo.tile(40, { ...state, line: '#abcdef' });
  assert.match(recolored.markup, /fill="#abcdef"/);
  assert.doesNotMatch(recolored.markup, /var\(|url\(|<image|<script|NaN|Infinity/);
});

test('invalid units fail explicitly', () => {
  for (const invalid of [0, -1, NaN, Infinity, -Infinity, undefined, '40']) {
    assert.throws(() => shippo.tile(invalid, state), { name: 'RangeError' });
  }
});

test('generators outside Shippo and the later Karakusa correction retain pre-Shippo output', () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(root, '_docs/data/shippo-2026-10-28/baseline.json'), 'utf8'));
  for (const pattern of patterns.filter(pattern => !['shippo', 'karakusa'].includes(pattern.id))) {
    const before = baseline[pattern.id];
    assert.equal(JSON.stringify(pattern.tile(40, before.state)), JSON.stringify(before.tile), pattern.id);
  }
});

test('formula notes describe direct lenses', () => {
  const notes = require('../patterns/content.js').get('shippo').construction;
  assert.match(notes, /do not rotate the tile/);
  assert.match(notes, /two minor circular arcs/);
  assert.doesNotMatch(notes, /previous accurate|rotate\(45/);
});
