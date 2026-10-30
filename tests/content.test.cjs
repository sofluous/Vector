const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const content = require('../patterns/content.js');
const {patterns} = require('../patterns/catalog.js');
test('all patterns have bounded explicit review content and existing local references', () => {
  for (const pattern of patterns) {
    const entry = content.get(pattern.id);
    assert.ok(Object.isFrozen(entry));
    assert.equal(entry.name, pattern.name);
    assert.match(entry.provenance, /unverified/);
    assert.match(entry.review, /pending/);
    assert.ok(fs.existsSync(path.join(__dirname, '..', entry.reference)));
    assert.equal(entry.hasDerivation, ['asanoha','shippo','seigaiha','karakusa'].includes(pattern.id));
    if (!entry.hasDerivation) assert.match(entry.construction, /derivation pending/);
  }
  assert.throws(() => content.get('missing'), RangeError);
});
test('construction notes preserve the transferred formula contract', () => {
  const notes = require('./fixtures/construction-notes.json');
  for (const [id, text] of Object.entries(notes)) assert.equal(content.get(id).construction, text);
});
