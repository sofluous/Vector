const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
test('primary entry loads the workspace and every declared runtime resource exists and parses', () => {
  const html = read('index.html');
  assert.match(html, /id="workspaceTabs"/);
  assert.match(html, /src=".\/workspace.js"/);
  assert.doesNotMatch(html, /id="(?:staticGallery|projectGallery|patternGallery|formulaModal)"/);
  for (const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+\.(?:js|css))"/g)) {
    const file = path.resolve(root, match[1]);
    assert.ok(file.startsWith(root + path.sep));
    assert.ok(fs.existsSync(file), match[1]);
    if (file.endsWith('.js')) new vm.Script(fs.readFileSync(file, 'utf8'), { filename: file });
  }
});
test('main landing is the only application entry', () => {
  assert.equal(fs.existsSync(path.join(root, 'workspace.html')), false);
  assert.doesNotMatch(read('index.html'), /workspace\.html|location\.replace|http-equiv="refresh"/);
  assert.match(read('index.html'), /<title>Vectors \| Pattern Library<\/title>/);
});
