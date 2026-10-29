const test = require('node:test');
const assert = require('node:assert/strict');
const { patterns } = require('../patterns/catalog.js');
const session = require('../patterns/session.js');
const presentation = require('../patterns/presentation.js');
test('phase wraps at a whole tile in either direction and never changes the motif', () => {
  for (const pattern of patterns) {
    const base = presentation.render(pattern, 0, session.defaults);
    for (const shift of [-100, 100]) {
      assert.equal(presentation.render(pattern, 0, { ...session.defaults, shiftX: shift, shiftY: shift }).svg, base.svg);
    }
    const moved = { ...session.defaults, shiftX: 25, shiftY: -50 };
    assert.notEqual(presentation.render(pattern, 0, moved).svg, base.svg);
    assert.equal(presentation.render(pattern, 0, moved, 'default', 'motif').svg,
      presentation.render(pattern, 0, session.defaults, 'default', 'motif').svg);
    assert.equal(presentation.thumbnail(pattern, 0, moved), presentation.thumbnail(pattern, 0, session.defaults));
  }
});

test('shift edits are independent, validated atomically, and cleared by scoped reset', () => {
  const initial = session.create('asanoha');
  const edited = session.edit(initial, { shiftX: 25, shiftY: -50 });
  assert.equal(initial.artwork.asanoha.shiftX, 0);
  const other = session.edit(session.select(edited, 'kikko'), { shiftX: 75 });
  const reset = session.reset(other);
  assert.equal(reset.artwork.kikko.shiftX, 0);
  assert.equal(reset.artwork.asanoha.shiftX, 25);
  for (const value of [101, -101, NaN, Infinity, '25']) assert.throws(() => session.edit(edited, { shiftX: value }));
  assert.equal(edited.artwork.asanoha.shiftX, 25);
});

test('repeat fields exactly preserve the validated tessellation fixtures', () => {
  const fs = require('node:fs'), path = require('node:path');
  const dir = path.join(__dirname, '../_docs/data/minimal-repeat-2026-10-28');
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  for (const record of manifest.records.filter(record => record.mode === 'field')) {
    const pattern = patterns.find(pattern => pattern.id === record.id);
    const index = patterns.indexOf(pattern);
    assert.equal(presentation.render(pattern, index, session.defaults, record.variant).svg,
      fs.readFileSync(path.join(dir, record.filename), 'utf8'), `${record.id}/${record.variant}`);
  }
});
