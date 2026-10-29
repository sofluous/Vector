// App-specific, dependency-free Edge acceptance runner. See _docs/QA.md.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--out')) throw Error('Usage: node tests/browser-karakusa.cjs [--out _docs/data/NAME]');
const out = path.resolve(root, args[1] || '_docs/data/browser-karakusa');
const artifactRoot = path.resolve(root, '_docs/data') + path.sep;
if (!out.startsWith(artifactRoot)) throw Error('Output must be a child of this project\'s _docs/data directory.');
const browser = process.env.BROWSER_PATH || path.join(process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe');
if (!fs.existsSync(browser)) throw Error('Edge not found. Set BROWSER_PATH to the browser executable.');
const baseline = JSON.parse(fs.readFileSync(path.join(root, '_docs/data/karakusa-refinement-2026-10-28/baseline.json'), 'utf8')).karakusa;

async function probe(baseline, referenceDataUrl) {
  if (document.readyState === 'loading') await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  const checks = [], times = [];
  const check = (condition, message) => { if (!condition) throw Error(message); checks.push(message); };
  const card = () => document.querySelector('#patternGallery [data-id="karakusa"]');
  const input = (id, value) => {
    const el = document.getElementById(id);
    el.value = String(value);
    const start = performance.now();
    el.dispatchEvent(new Event('input', { bubbles: true }));
    times.push(performance.now() - start);
  };
  const result = { passed: false, checks };
  try {
    check(document.querySelectorAll('#patternGallery article').length === 9, 'Nine pattern cards render');
    for (const id of ['ichimatsu', 'mameshibori']) {
      const target = () => document.querySelector(`#patternGallery [data-id="${id}"]`);
      const original = target().dataset.svg;
      const other = document.querySelector('#patternGallery [data-id="asanoha"]').dataset.svg;
      let variant = target().querySelector('select');
      variant.value = 'reference'; variant.dispatchEvent(new Event('change', { bubbles: true }));
      check(target().dataset.svg !== original, `${id} reference changes preview and export`);
      check(target().querySelector('select') === document.activeElement, `${id} variant retains keyboard focus`);
      check(document.querySelector('#patternGallery [data-id="asanoha"]').dataset.svg === other, `${id} preset preserves other patterns`);
      if (id === 'mameshibori') check(target().querySelectorAll('pattern circle').length === 64, 'Uniform dot reference has 64 circles');
      variant = target().querySelector('select'); variant.value = 'default'; variant.dispatchEvent(new Event('change', { bubbles: true }));
      check(target().dataset.svg === original, `${id} original output restores exactly`);
    }

    check(document.querySelectorAll('#staticGallery article').length === 20, 'Twenty static cards remain');
    check(document.querySelectorAll('#projectLogoGallery article').length === 27, 'Twenty-seven logo cards remain');
    for (const frame of [240, 480, 2000]) for (const reps of [4, 12, 36]) for (const stroke of [0.4, 8]) {
      input('frameSize', frame); input('reps', reps); input('stroke', stroke);
      const xml = new DOMParser().parseFromString(card().dataset.svg, 'image/svg+xml');
      check(!xml.querySelector('parsererror') && xml.documentElement.getAttribute('viewBox') === `0 0 ${frame} ${frame}`, `Valid live SVG: ${frame}/${reps}/${stroke}`);
      check(new Set([...xml.querySelectorAll('[data-part]')].map(el => el.getAttribute('data-part'))).size === 24, `All fitted branches and leaves remain: ${frame}/${reps}/${stroke}`);
    }
    async function pixels(text, w, h) {
      const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
      try {
        const img = new Image();
        await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = () => reject(Error('SVG failed to load')); img.src = url; });
        const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
        return ctx.getImageData(0, 0, w, h).data;
      } finally { URL.revokeObjectURL(url); }
    }
    function mask(data, white) {
      const result = new Uint8Array(data.length / 4);
      for (let i = 0; i < result.length; i++) result[i] = white ? (data[4*i] > 180 && data[4*i+1] > 180 && data[4*i+2] > 180 ? 1 : 0) : (255-data[4*i] > 48 ? 1 : 0);
      return result;
    }
    function near(mask, x, y, w, h, radius) {
      for (let yy = Math.max(0,y-radius); yy <= Math.min(h-1,y+radius); yy++) for (let xx = Math.max(0,x-radius); xx <= Math.min(w-1,x+radius); xx++) if (mask[yy*w+xx]) return true;
      return false;
    }
    function agreement(candidate, reference, w, h, radius) {
      let a = 0, b = 0, hitA = 0, hitB = 0, intersection = 0, union = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = y*w+x;
        if (candidate[i]) { a++; if (near(reference,x,y,w,h,radius)) hitA++; }
        if (reference[i]) { b++; if (near(candidate,x,y,w,h,radius)) hitB++; }
        if (candidate[i] && reference[i]) intersection++;
        if (candidate[i] || reference[i]) union++;
      }
      const precision = hitA / Math.max(a,1), recall = hitB / Math.max(b,1);
      return { precision, recall, f1: 2*precision*recall/Math.max(precision+recall,1e-12), rawIoU: intersection/Math.max(union,1), candidatePixels:a, referencePixels:b };
    }
    // Compare pattern rendering with explicit unpruned copies of the same curves.
    input('frameSize',240); input('reps',12); input('stroke',1.6);
    const actual = card().dataset.svg.replace('<svg', '<svg width="240" height="240"');
    const parsed = new DOMParser().parseFromString(actual,'image/svg+xml');
    const pattern = parsed.querySelector('pattern'), group = pattern.firstElementChild;
    const w = Number(pattern.getAttribute('width')), h = Number(pattern.getAttribute('height'));
    const parts = new Map();
    parsed.querySelectorAll('[data-part]').forEach(el => parts.set(el.getAttribute('data-part'),new XMLSerializer().serializeToString(el)));
    let copies = '';
    for (let row = -2; row <= Math.ceil(240/h)+1; row++) for (let col = -2; col <= Math.ceil(240/w)+1; col++) copies += `<g transform="translate(${col*w} ${row*h})">${[...parts.values()].join('')}</g>`;
    const explicit = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="white"/><g fill="none" stroke="#2a5db1" stroke-width="${group.getAttribute('stroke-width')}" stroke-linecap="round" stroke-linejoin="round">${copies}</g></svg>`;
    const aa = await pixels(actual,240,240), bb = await pixels(explicit,240,240);
    const coverage = agreement(mask(aa,false),mask(bb,false),240,240,1);
    check(coverage.precision > 0.995 && coverage.recall > 0.995,'Pattern agrees with unpruned field within one-pixel antialias tolerance');
    result.repeatCoverage = coverage;

    // Reference comparison is a measured improvement over the preserved v2
    // prototype, not a historical-authenticity or exact image-match assertion.
    const model = window.KarakusaPattern;
    const t = model.tile(69.5,{line:'#ffffff',stroke:3.8});
    const svg = (tile,viewW,viewH,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="278" height="179" viewBox="0 0 ${viewW} ${viewH}"><defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="${tile.w}" height="${tile.h}">${tile.markup}</pattern></defs><rect width="${viewW}" height="${viewH}" fill="#2a5db1"/><rect width="${viewW}" height="${viewH}" fill="url(#${id})"/></svg>`;
    const before = {...baseline.tile,markup:baseline.tile.markup.replaceAll('#2a5db1','#ffffff').replace(/stroke-width="[^"]+"/,`stroke-width="${3.8*baseline.tile.w/278}"`)};
    const image = new Image();
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('Reference image failed to load'));image.src=referenceDataUrl;});
    const canvas = document.createElement('canvas'); canvas.width=278; canvas.height=179;
    const ctx=canvas.getContext('2d'); ctx.drawImage(image,0,0,278,179,0,0,278,179);
    const reference = mask(ctx.getImageData(0,0,278,179).data,true);
    const beforeFit=agreement(mask(await pixels(svg(before,before.w,before.h,'before'),278,179),true),reference,278,179,2);
    const afterFit=agreement(mask(await pixels(svg(t,278,179,'after'),278,179),true),reference,278,179,2);
    result.referenceFit={before:beforeFit,after:afterFit,f1Gain:afterFit.f1-beforeFit.f1,tolerance:'2-pixel square neighborhood on white foreground at the reference-cell scale; not exact agreement'};
    check(afterFit.f1 > beforeFit.f1+0.15,'Reference-mask F1 improves by at least 15 percentage points over the v2 prototype');

    input('lineColor','#abcdef'); input('bgColor','#203040');
    check(card().querySelector('pattern > g').getAttribute('stroke')==='#abcdef','Line color recolors fitted branches');
    check(card().querySelector('[data-part^="leaf-"]').getAttribute('fill')==='#abcdef','Line color recolors leaves');
    const unchanged=card().querySelector('pattern').innerHTML; input('accentColor','#ff0000');
    check(card().querySelector('pattern').innerHTML===unchanged,'Accent remains unused');
    check(card().querySelector('svg > rect').getAttribute('fill')==='#203040','Background remains an exporter frame property');
    const blobs=[],downloads=[],revoked=[];
    const oldCreate=URL.createObjectURL,oldRevoke=URL.revokeObjectURL,oldClick=HTMLAnchorElement.prototype.click;
    try {
      URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:karakusa-probe';}; URL.revokeObjectURL=url=>revoked.push(url);
      HTMLAnchorElement.prototype.click=function(){downloads.push(this.download);};
      card().querySelector('[data-action="download"]').click();
      check(downloads[0]==='karakusa.svg'&&blobs.length===1,'Download supplies a named SVG blob (navigation intercepted)');
      check(await blobs[0].text()===card().dataset.svg,'Download blob equals displayed export');
      check(revoked.length===1,'Download object URL is revoked');
    } finally {URL.createObjectURL=oldCreate;URL.revokeObjectURL=oldRevoke;HTMLAnchorElement.prototype.click=oldClick;}
    const descriptor=Object.getOwnPropertyDescriptor(navigator,'clipboard'); let copied;
    try {
      Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{copied=text;}}});
      card().querySelector('[data-action="copy"]').click(); await Promise.resolve();
      check(copied===card().dataset.svg,'Copy supplies displayed SVG (clipboard stubbed)');
    } finally {if(descriptor)Object.defineProperty(navigator,'clipboard',descriptor);else delete navigator.clipboard;}
    input('frameSize',480); input('reps',12); input('stroke',1.6); input('bgColor','#ffffff'); input('lineColor','#2a5db1'); input('accentColor','#6f8dcb');
    document.getElementById('openFormula').click(); document.querySelector('[data-formula="karakusa"]').click();
    check(document.querySelector('[data-formula-body="karakusa"]').classList.contains('active'),'Karakusa formula tab opens');
    check(document.querySelector('[data-formula-body="karakusa"] pre').textContent.includes('Reference-fitted spline'),'Formula explains the fitted spline model');
    check(new Set([...document.querySelectorAll('#karakusaDiagram [data-part]')].map(el=>el.getAttribute('data-part'))).size===24,'Formula schematic uses the actual fitted generator');
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));
    check(!document.getElementById('formulaModal').classList.contains('show'),'Escape closes formula panel');
    document.getElementById('openFormula').click();
    result.theme=new URLSearchParams(location.search).get('theme')||'steel-night';
    const select=document.getElementById('themeSelect'); select.value=result.theme; select.dispatchEvent(new Event('change',{bubbles:true}));
    check(select.value===result.theme&&document.documentElement.getAttribute('data-theme')===result.theme,'Theme selector applies requested theme');
    check(window.__probeErrors.length===0,'No captured page errors or unhandled rejections');
    const sorted=[...times].sort((a,b)=>a-b);
    result.rerenderMilliseconds={count:times.length,median:sorted[Math.floor(sorted.length/2)],max:Math.max(...times)};
    result.limits='Native save/clipboard permissions and non-Chromium behavior untested. Timings cover synchronous gallery rebuilds, not paint/frame latency.';
    result.passed=true;
  } catch(error) { result.error=String(error); }
  result.errors=window.__probeErrors;
  const report=document.createElement('pre'); report.id='karakusa-probe-report'; report.textContent=JSON.stringify(result); document.body.append(report);
}

async function run() {
  fs.mkdirSync(out,{recursive:true});
  const profiles=fs.mkdtempSync(path.join(os.tmpdir(),'vectors-karakusa-qa-'));
  const scratch=path.join(root,`.karakusa-qa-${process.pid}.html`);
  let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  html=html.replace('<head>','<head><script>window.__probeErrors=[];addEventListener("error",e=>window.__probeErrors.push(e.message));addEventListener("unhandledrejection",e=>window.__probeErrors.push(String(e.reason)));</script>');
  // A data URL keeps the local JPEG canvas origin-clean without weakening
  // browser file-access rules. Read the original once for all three runs.
  const referenceDataUrl='data:image/jpeg;base64,'+fs.readFileSync(path.join(root,'_references/Japanese/Karakusa.jpg')).toString('base64');
  html=html.replace('</body>',`<script>(${probe.toString()})(${JSON.stringify(baseline).replaceAll('<','\\u003c')},${JSON.stringify(referenceDataUrl)})</script></body>`);
  fs.writeFileSync(scratch,html,{flag:'wx'});
  const results=[];
  try {
    for(const theme of ['steel-night','paper-mint','neon-grid']) {
      const url=pathToFileURL(scratch); url.searchParams.set('theme',theme);
      const stdout=await new Promise((resolve,reject)=>{
        const child=spawn(browser,['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking',`--user-data-dir=${path.join(profiles,theme)}`,'--hide-scrollbars','--virtual-time-budget=5000','--window-size=1100,1000',`--screenshot=${path.join(out,`formula-${theme}.png`)}`,'--dump-dom',url.href],{windowsHide:true});
        const chunks=[]; let stderr='';
        const timer=setTimeout(()=>{child.kill();reject(Error('Headless browser timed out after 30 seconds'));},30000);
        child.stdout.on('data',chunk=>chunks.push(chunk)); child.stderr.on('data',chunk=>{stderr+=chunk;});
        child.on('error',error=>{clearTimeout(timer);reject(error);});
        child.on('close',code=>{clearTimeout(timer);if(code)reject(Error(`Browser exited ${code}: ${stderr.slice(-1000)}`));else resolve(Buffer.concat(chunks).toString('utf8'));});
      });
      const match=stdout.match(/<pre id="karakusa-probe-report">([^<]*)<\/pre>/);
      if(!match)throw Error(`Missing probe report for ${theme}`);
      const result=JSON.parse(match[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
      results.push(result);
      console.log(`${theme}: ${result.passed?'PASS':'FAIL'}; ${result.checks.length} checks; fit F1 ${result.referenceFit?.before.f1.toFixed(3)} -> ${result.referenceFit?.after.f1.toFixed(3)}`);
      fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({browser:'Microsoft Edge headless',results},null,2)+'\n');
      if(!result.passed)throw Error(result.error);
    }
  } finally {fs.unlinkSync(scratch);}
  console.log(`Artifacts: ${out}`);
}
run().catch(error=>{console.error(error.message);process.exitCode=1;});
