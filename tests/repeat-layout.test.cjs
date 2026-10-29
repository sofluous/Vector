const test = require('node:test');
const assert = require('node:assert/strict');
const { patterns } = require('../patterns/catalog.js');
const { defaults, create, edit } = require('../patterns/session.js');
const { repeatLayout, serializeField } = require('../patterns/svg.js');

test('density one is one complete repeat cell and higher integer densities fill both axes', () => {
  for (const pattern of patterns) for (const frame of [240, 480, 2000]) for (const reps of [1, 2, 3, 12, 36]) {
    for (const variant of ['default', ...(['ichimatsu', 'mameshibori'].includes(pattern.id) ? ['reference'] : [])]) {
      const state = { ...defaults, frame, reps };
      const layout = repeatLayout(pattern, state, variant);
      assert.equal(layout.width, frame);
      assert.ok(Math.abs(layout.cellWidth * reps - frame) < 1e-9);
      assert.ok(Math.abs(layout.cellHeight * reps - layout.height) < 1e-9);
      assert.ok(Math.abs(layout.cellWidth / layout.cellHeight - layout.tile.w / layout.tile.h) < 1e-9);
      const svg = serializeField(pattern, 0, state, variant);
      assert.doesNotMatch(svg, /NaN|Infinity|undefined/);
      assert.equal(svg, serializeField(pattern, 0, state, variant));
    }
  }
});

test('output aspect is independent of density and stroke remains in output units', () => {
  for (const pattern of patterns) {
    const layouts = [1, 3, 36].map(reps => repeatLayout(pattern, { ...defaults, reps }));
    for (const layout of layouts) assert.ok(Math.abs(layout.height - layouts[0].height) < 1e-9);
  }
  const asanoha = patterns.find(pattern => pattern.id === 'asanoha');
  for (const reps of [1, 12, 36]) {
    const layout = repeatLayout(asanoha, { ...defaults, reps, stroke: 2 });
    const localStroke = Number(layout.tile.markup.match(/stroke-width="([^"]+)"/)[1]);
    assert.ok(Math.abs(localStroke * layout.cellWidth / layout.tile.w - 2) < 1e-8);
  }
});

test('a field repeated twice has exactly the same cell scale as a two-density larger field', () => {
  for (const pattern of patterns) {
    const single = repeatLayout(pattern, { ...defaults, frame: 240, reps: 1 });
    const doubled = repeatLayout(pattern, { ...defaults, frame: 480, reps: 2 });
    assert.equal(single.cellWidth, doubled.cellWidth);
    assert.equal(single.cellHeight, doubled.cellHeight);
    assert.equal(single.tile.markup, doubled.tile.markup);
    assert.equal(doubled.height, 2 * single.height);
  }
});

test('session accepts densities one through three and rejects fractional or out-of-range values', () => {
  for (const reps of [1, 2, 3]) assert.equal(edit(create(), { reps }).artwork.asanoha.reps, reps);
  for (const reps of [0, 1.5, 37, Infinity, NaN]) assert.throws(() => edit(create(), { reps }));
  assert.throws(() => repeatLayout({ tile: () => ({ w: 0, h: 1 }) }, defaults));
  assert.throws(() => serializeField(patterns[0], -1, defaults));
  assert.throws(() => serializeField(patterns[0], 0, defaults, 'unknown'));
});

test('repeat periods remove duplicate drawing cells and uniform dot reference exposes one dot', () => {
  for (const pattern of patterns) {
    for (const factor of pattern.repeat.default) assert.ok(factor > 0 && factor <= 1);
    assert.ok(Object.isFrozen(pattern.repeat) && Object.isFrozen(pattern.repeat.default));
  }
  const dots = patterns.find(pattern => pattern.id === 'mameshibori');
  const layout = repeatLayout(dots, { ...defaults, reps: 1 }, 'reference');
  const centers = [...layout.tile.markup.matchAll(/cx="([^"]+)" cy="([^"]+)"/g)];
  assert.equal(centers.filter(([, x, y]) => +x < layout.tile.w && +y < layout.tile.h).length, 1);
});
