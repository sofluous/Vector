const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const patterns = require('../patterns/catalog.js').patterns;
const yagasuri = patterns.find(pattern => pattern.id === 'yagasuri');
const state = { line: '#2a5db1', accent: '#6f8dcb', bg: '#ffffff', stroke: 1.6, reps: 12, frame: 480 };

function polygons(tile) {
  return [...tile.markup.matchAll(/points="([^"]+)"/g)].map(match =>
    match[1].trim().split(/\s+/).map(point => point.split(',').map(Number)));
}

function contains(polygon, x, y) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

test('reference construction has paired slanted vanes, opposing columns, and open shafts', () => {
  const tile = yagasuri.tile(100, state);
  const shapes = polygons(tile);
  assert.equal(tile.w, 100);
  assert.equal(tile.h, 200);
  assert.equal(shapes.length, 8);
  assert.ok(shapes.every(shape => shape.length === 4));
  assert.doesNotMatch(tile.markup, /<(rect|image|script)\b/);
  const filled = (x, y) => shapes.some(shape => contains(shape, x, y));
  assert.equal(filled(25, 50), false, 'downward feather center must remain open');
  assert.equal(filled(75, 50), false, 'upward feather center must remain open');
  assert.equal(filled(50, 50), false, 'columns must have an open gap');
  assert.equal(filled(10, 50), false, 'downward column has a half-period blank interval');
  assert.equal(filled(40, 50), false);
  assert.equal(filled(10, 150), true);
  assert.equal(filled(40, 150), true);
  assert.equal(filled(60, 50), true);
  assert.equal(filled(90, 50), true);
  assert.equal(filled(60, 150), false, 'adjacent columns are staggered');
  const down = shapes[4];
  const up = shapes[6];
  assert.ok(down[1][1] > down[0][1], 'first column slopes toward a lower center');
  assert.ok(up[1][1] < up[0][1], 'second column reverses direction');
  assert.equal(down[2][1] - down[1][1], 94, 'preserve long feather body');
});

test('wrapped tile matches an independently repeated infinite feather field at seams', () => {
  for (const unit of [240 / 36, 40, 2000 / 4]) {
    const tile = yagasuri.tile(unit, state);
    const shapes = polygons(tile);
    const wrap = (value, period) => ((value % period) + period) % period;
    const tileFilled = (x, y) => shapes.some(shape => contains(shape, wrap(x, unit), wrap(y, 2 * unit)));
    // Analytic occupancy: each vane spans 94% of a vertical period, with a
    // linear 25%-period slope; the opposing column reverses that slope.
    function fieldFilled(x, y) {
      const col = Math.floor(x / (unit / 2));
      const local = x / unit - col / 2;
      const left = local >= 0.02 && local <= 0.23;
      const right = local >= 0.27 && local <= 0.48;
      if (!left && !right) return false;
      const rise = left ? (local - 0.02) / 0.21 : (0.48 - local) / 0.21;
      const down = ((col % 2) + 2) % 2 === 0;
      const start = unit * ((down ? 1 : 0) + 0.25 * (down ? rise : 1 - rise));
      return wrap(y - start, 2 * unit) < unit * 0.94;
    }
    for (const xRatio of [-0.999, -0.89, -0.53, -0.001, 0.001, 0.11, 0.31, 0.61, 0.91, 0.999, 1.001]) {
      for (const yRatio of [-1.001, -0.999, -0.001, 0.001, 0.13, 0.51, 0.93, 0.999, 1.001, 2.001]) {
        const x = xRatio * unit;
        const y = yRatio * unit;
        assert.equal(tileFilled(x, y), fieldFilled(x, y), `unit=${unit}, sample=${xRatio},${yRatio}`);
      }
    }
  }
});

test('supported sizes remain finite, deterministic, and retain explicit artwork color', () => {
  for (const frame of [240, 480, 2000]) {
    for (const reps of [4, 12, 36]) {
      const unit = frame / reps;
      const current = { ...state, frame, reps, line: '#123456' };
      const tile = yagasuri.tile(unit, current);
      assert.deepEqual(tile, yagasuri.tile(unit, current));
      assert.ok(tile.w > 0 && tile.h > 0);
      assert.ok(polygons(tile).flat(2).every(Number.isFinite));
      assert.match(tile.markup, /fill="#123456" stroke="none"/);
      assert.doesNotMatch(tile.markup, /NaN|Infinity|var\(|url\(/);
    }
  }
});

test('invalid units fail explicitly', () => {
  for (const value of [0, -1, NaN, Infinity, -Infinity, undefined, '40']) {
    assert.throws(() => yagasuri.tile(value, state), { name: 'RangeError' });
  }
});

test('five untouched generators retain their original audit baseline', () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(root, '_docs/data/reference-audit-2026-10-28/baseline.json'), 'utf8'));
  assert.equal(patterns.length, 9);
  for (const pattern of patterns.filter(pattern => !['yagasuri', 'seigaiha', 'shippo', 'karakusa'].includes(pattern.id))) {
    const previous = baseline[pattern.id];
    assert.equal(JSON.stringify(pattern.tile(40, previous.state)), JSON.stringify(previous.tile), pattern.id);
  }
});
