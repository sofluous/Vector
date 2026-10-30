// App-specific, dependency-free Edge acceptance runner. See _docs/QA.md.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--out')) throw Error('Usage: node tests/browser-workspace.cjs [--out _docs/data/NAME]');
const out = path.resolve(root, args[1] || '_docs/data/browser-workspace');
const artifactRoot = path.resolve(root, '_docs/data') + path.sep;
if (!out.startsWith(artifactRoot)) throw Error('Output must be a child of this project\'s _docs/data directory.');
const browser = process.env.BROWSER_PATH || path.join(process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe');
if (!fs.existsSync(browser)) throw Error('Edge not found. Set BROWSER_PATH to the browser executable.');

async function probe(expected, baseline, referenceDataUrl) {
  const checks = [];
  const check = (ok, message) => { if (!ok) throw Error(message); checks.push(message); };
  const result = {passed:false,checks,theme:new URLSearchParams(location.search).get('theme'),width:innerWidth};
  const el = id => document.getElementById(id);
  const choose = id => {const button=document.querySelector(`[data-pattern="${id}"]`);button.focus();button.click();return button;};
  const svg = () => el('selectedPreview').innerHTML;
  const input = (name,value) => {const field=el(`edit-${name}`);field.value=value;field.dispatchEvent(new Event('input',{bubbles:true}));return field;};
  try {
    const theme=el('themeSelect');theme.value=result.theme;theme.dispatchEvent(new Event('change',{bubbles:true}));
    check(document.documentElement.dataset.theme===result.theme,'Theme applies');
    check(document.documentElement.scrollHeight<=innerHeight+1,'Initial workspace fits viewport without page scrolling');
    check(!el('patternInfo').open,'Descriptions stay out of the default workspace');
    document.querySelector('.library').open=true;document.querySelector('.inspector').open=true;

    check(document.querySelectorAll('[data-pattern]').length===9,'Nine pattern buttons render');
    const thumbs=[...document.querySelectorAll('.pattern-choice svg')];
    check(thumbs.every(svg=>svg.dataset.density==='2'),'All gallery previews use visible density two');
    el('patternInfo').querySelector('summary').click();
    check(el('patternInfo').open&&el('selectedDescription').textContent.length>0,'Info exposes the selected construction details');
    await new Promise(resolve=>setTimeout(resolve,10));
    const infoBox=el('patternInfo').querySelector('.info-content').getBoundingClientRect();
    check(infoBox.left>=0&&infoBox.right<=innerWidth&&infoBox.bottom<=innerHeight,'Info stays inside viewport');

    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    check(!el('patternInfo').open,'Escape closes Info');

    check(document.querySelectorAll('[data-group]').length===4,'Four construction groups render');
    const search=el('patternSearch');const filter=value=>{search.value=value;search.dispatchEvent(new Event('input',{bubbles:true}));};
    filter('karakusa');check(document.querySelectorAll('[data-pattern]:not([hidden])').length===1&&el('selectedName').textContent==='Asanoha','Search filters without changing selection');
    filter('no-such-pattern');check(el('libraryCount').textContent.includes('No matches'),'Empty search result explains recovery');
    filter('');check(document.querySelectorAll('[data-pattern]:not([hidden])').length===9,'Clearing search restores collection');

    for(const [id,expectedSVG] of Object.entries(expected)) {
      const button=choose(id);
      const expectedDOM=document.createElement('div');expectedDOM.innerHTML=expectedSVG;
      check(el('selectedPreview').querySelector('svg').isEqualNode(expectedDOM.firstElementChild),`${id} matches frozen default SVG`);
      check(button===document.activeElement&&button.getAttribute('aria-pressed')==='true',`${id} selection keeps focus and state`);
      input('reps','1');
      const field=el('selectedPreview').querySelector('svg'), cell=field.querySelector('pattern');
      const size=field.getAttribute('viewBox').split(' ').map(Number);
      const native=PatternSVG.repeatLayout(PatternCatalog.patterns.find(pattern=>pattern.id===id),{...PatternSession.defaults,reps:1});
      check(Math.abs(size[3]/size[2]-native.height/native.width)<1e-8,`${id} preserves true lattice proportions`);
      const span=PatternPresentation.span(PatternCatalog.patterns.find(pattern=>pattern.id===id));
      check(Math.abs(Number(cell.getAttribute('width'))*span.columns-size[2])<1e-8&&Math.abs(Number(cell.getAttribute('height'))*span.rows-size[3])<1e-8,`${id} density one fills one display tile`);
      check(!el('downloadSelected').disabled&&el('slider-reps').min==='1',`${id} density one is valid in numeric and slider controls`);
      input('reps','12');
      document.querySelector('input[name="previewMode"][value="motif"]').click();
      const motif=el('selectedPreview').querySelector('svg'),box=motif.viewBox.baseVal;
      check(!motif.querySelector('pattern,clipPath'),`${id} motif uses direct uncropped geometry`);
      check([...motif.querySelectorAll('path,polygon,circle,rect')].filter(shape=>shape!==motif.firstElementChild).every(shape=>{const b=shape.getBBox();return b.x>box.x&&b.y>box.y&&b.x+b.width<box.x+box.width&&b.y+b.height<box.y+box.height;}),`${id} motif bounds leave breathing room`);
      const singleMotif=svg();input('reps','3');check(svg()===singleMotif,`${id} motif ignores density`);input('reps','12');
      document.querySelector('input[name="previewMode"][value="tile"]').click();
      const tile=svg();check(el('downloadSelected').getAttribute('aria-label').includes('tile'),`${id} export names displayed tile`);
      input('reps','1');document.querySelector('input[name="previewMode"][value="field"]').click();
      check(svg()===tile,`${id} density one pattern equals Tile view`);input('reps','12');


    }
    choose('shippo');check(!el('edit-stroke')&&!el('edit-accent'),'Unsupported controls omitted');
    choose('kikko');check(!!el('edit-stroke')&&!!el('edit-accent'),'Kikko stroke and secondary available');
    input('accent','#123456');
    check(el('picker-accent').value==='#123456','Hex edit synchronizes color picker');
    const validColorSVG=svg();input('accent','oops');check(el('downloadSelected').disabled&&svg()===validColorSVG,'Invalid hex blocks export without changing artwork');
    const picker=el('picker-accent');picker.value='#123456';picker.dispatchEvent(new Event('input',{bubbles:true}));
    check(el('edit-accent').value==='#123456'&&!el('downloadSelected').disabled,'Picker corrects an invalid hex draft');
    const slider=el('slider-reps');slider.value='18';slider.dispatchEvent(new Event('input',{bubbles:true}));
    check(el('edit-reps').value==='18','Density slider updates exact value');input('reps','12');
    check(el('slider-reps').value==='12','Exact value updates density slider');
    check(!!el('workspaceFields').querySelector('fieldset legend'),'Inspector uses named control groups');
    const unshifted=svg();input('shiftX','25');input('shiftY','-50');
    check(svg()!==unshifted,'Shift controls translate the original lattice');
    const shifted=svg();choose('ichimatsu');check(el('edit-shiftX').value==='0','Other pattern starts with independent shifts');
    choose('kikko');check(svg()===shifted&&el('edit-shiftX').value==='25','Pattern selection retains its arrangement');
    input('shiftX','100');input('shiftY','-100');check(svg()===unshifted,'Full-period UI shifts return to default phase');
    input('shiftX','101');check(el('downloadSelected').disabled,'Invalid arrangement shift blocks export');
    document.querySelector('[data-center-arrangement]').click();
    check(svg()===unshifted&&!el('downloadSelected').disabled&&el('edit-shiftX').value==='0','Center resets invalid shifts and restores default arrangement');
    const kikko=svg();
    choose('ichimatsu');const original=svg();
    input('variant','reference');check(!el('edit-accent')&&svg()!==original,'Reference variant changes preview and hides secondary');
    check(document.activeElement===el('edit-variant'),'Variant switch restores focus');
    input('variant','default');check(svg()===original,'Original variant restores SVG');
    input('line','#abcdef');const changed=svg();
    input('frame','2001');check(svg()===changed&&el('downloadSelected').disabled&&el('copySelected').disabled,'Invalid draft preserves preview and blocks export');
    check(el('edit-frame').getAttribute('aria-invalid')==='true'&&el('error-frame').textContent.length>0,'Inline error is associated with invalid field');
    choose('kikko');check(svg()===kikko&&!el('downloadSelected').disabled,'Other pattern retains independent edits and valid export');
    choose('ichimatsu');check(el('edit-frame').value==='2001'&&el('downloadSelected').disabled,'Invalid draft survives switching patterns');
    input('frame','600');check(!el('downloadSelected').disabled&&el('selectedPreview').querySelector('svg').getAttribute('viewBox')==='0 0 600 600','Corrected draft commits and enables export');
    input('reps','4.5');check(el('downloadSelected').disabled,'Fractional repetitions rejected');
    el('resetSelected').click();check(svg()===original&&!el('downloadSelected').disabled&&el('edit-reps').value==='12','Reset clears drafts and restores selected defaults');
    choose('kikko');check(svg()===kikko,'Reset preserves other artwork');
    check(thumbs.every((node,index)=>node===document.querySelectorAll('.pattern-choice svg')[index]),'Editing does not rebuild gallery thumbnails');
    const before=svg();input('frame','');check(el('copySelected').disabled&&svg()===before,'Empty required number preserves valid preview');input('frame','480');
    let copied='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{copied=text;}}});
    el('copySelected').click();await Promise.resolve();check(copied.length>0&&copied.includes('#123456'),'Copy receives current artwork SVG');
    const unzoomed = copied, originalViewBox=el('selectedPreview').firstElementChild.getAttribute('viewBox');
    el('zoomIn').click();
    check(el('zoomValue').textContent==='200%'&&el('selectedPreview').firstElementChild.getAttribute('viewBox')!==originalViewBox,'Zoom changes preview framing');
    el('copySelected').click();await Promise.resolve();check(copied===unzoomed,'Zoom never changes SVG export bytes');
    el('zoomIn').click();check(el('zoomIn').disabled&&el('zoomValue').textContent==='400%','Zoom upper bound is enforced');
    for(let i=0;i<4;i++)el('zoomOut').click();
    check(el('zoomOut').disabled&&el('zoomValue').textContent==='25%','Zoom lower bound is enforced');
    el('zoomFit').click();check(svg()===before&&el('zoomValue').textContent==='100%','Fit restores the original preview exactly');
    const tabKey=key=>el('workspaceTabs').dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));
    el('tab-preview').focus();tabKey('ArrowRight');
    check(document.activeElement===el('tab-construction')&&!el('panel-construction').hidden&&el('panel-preview').hidden,'ArrowRight activates and focuses Construction');
    check(el('tab-construction').getAttribute('aria-selected')==='true'&&el('tab-preview').tabIndex===-1&&el('copySelected').hidden,'Tab state and hidden export controls match content');
    check(el('constructionNotes').textContent.includes('derivation pending'),'Unspecified derivations are explicit');
    choose('karakusa');check(el('constructionNotes').textContent.includes('C1 =')&&el('constructionDiagram').querySelector('pattern'),'Construction follows selection using real generator diagram');
    check(!el('panel-construction').hidden,'Selection retains the active inspection tab');
    check(el('constructionDiagram').querySelector('pattern').id!==el('selectedPreview').querySelector('pattern').id,'Construction uses unique SVG definition IDs outside hidden Preview');
    el('tab-construction').focus();tabKey('End');
    check(document.activeElement===el('tab-context')&&!el('panel-context').hidden&&el('contextProvenance').textContent.includes('unverified'),'End selects Context with explicit provenance');
    check(el('contextReview').textContent.includes('pending')&&el('contextReference').getAttribute('href').includes('Karakusa.jpg'),'Context exposes selected reference and review status');
    tabKey('ArrowRight');check(document.activeElement===el('tab-preview'),'Right arrow wraps tabs');
    tabKey('ArrowLeft');check(document.activeElement===el('tab-context'),'Left arrow wraps tabs');
    tabKey('Home');check(document.activeElement===el('tab-preview')&&!el('panel-preview').hidden,'Home restores Preview');
    choose('kikko');input('frame','2001');el('tab-context').click();el('tab-preview').click();
    check(el('downloadSelected').disabled&&el('edit-frame').value==='2001','Inspection changes preserve invalid drafts and export blocking');input('frame','480');
    navigator.clipboard.writeText=async()=>{throw Error('denied');};el('copySelected').click();await Promise.resolve();check(el('workspaceStatus').textContent.includes('unavailable'),'Clipboard failure gives recovery message');
    const blobs=[],revoked=[],names=[];const create=URL.createObjectURL,revoke=URL.revokeObjectURL,click=HTMLAnchorElement.prototype.click;
    try {
      URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:workspace-probe';};URL.revokeObjectURL=url=>revoked.push(url);HTMLAnchorElement.prototype.click=function(){names.push(this.download);};
      el('downloadSelected').click();await new Promise(resolve=>setTimeout(resolve,10));
      check(names[0]==='kikko.svg'&&await blobs[0].text()===copied,'Download supplies named current SVG blob');
      check(revoked.length===1,'Download releases object URL');
      navigator.clipboard.writeText=async text=>{copied=text;};
      for(const mode of ['motif','tile']) {
        document.querySelector(`input[name="previewMode"][value="${mode}"]`).click();
        el('copySelected').click();await Promise.resolve();
        const copiedDOM=document.createElement('div');copiedDOM.innerHTML=copied;
        check(copiedDOM.firstElementChild.isEqualNode(el('selectedPreview').firstElementChild),`${mode} copy equals displayed view`);
        el('downloadSelected').click();await new Promise(resolve=>setTimeout(resolve,10));
        check(names.at(-1)===`kikko-${mode}.svg`&&await blobs.at(-1).text()===copied,`${mode} download uses named matching SVG`);
      }
      document.querySelector('input[name="previewMode"][value="field"]').click();

    } finally {URL.createObjectURL=create;URL.revokeObjectURL=revoke;HTMLAnchorElement.prototype.click=click;}
    check(!document.getElementById('staticGallery')&&!document.getElementById('projectGallery')&&!document.getElementById('patternGallery'),'Primary entry contains no legacy galleries');
    check(document.documentElement.scrollWidth<=innerWidth,'No horizontal page overflow');
    check(document.documentElement.scrollHeight<=innerHeight+1,'Expanded panels do not cause page scrolling');
    const stage=el('selectedPreview').getBoundingClientRect();
    check(stage.height>0&&stage.bottom<=innerHeight,'Preview stays inside available workspace');
    check(el('selectedPreview').scrollHeight<=el('selectedPreview').clientHeight+1,'Preview does not need an internal scrollbar');

    check(document.querySelectorAll('.pattern-choice[aria-pressed="true"]').length===1,'Exactly one pattern selected');
    check(window.__probeErrors.length===0,'No page errors or unhandled rejections');

    {
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
    function fitMask(data, white) {
      const result = new Uint8Array(data.length / 4);
      for (let i = 0; i < result.length; i++) result[i] = white ? (data[4*i] > 180 && data[4*i+1] > 180 && data[4*i+2] > 180 ? 1 : 0) : (255-data[4*i] > 48 ? 1 : 0);
      return result;
    }
    function near(mask, x, y, w, h, radius) {
      for (let yy = Math.max(0,y-radius); yy <= Math.min(h-1,y+radius); yy++) for (let xx = Math.max(0,x-radius); xx <= Math.min(w-1,x+radius); xx++) if (mask[yy*w+xx]) return true;
      return false;
    }
    function fitAgreement(candidate, reference, w, h, radius) {
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
    const reference = fitMask(ctx.getImageData(0,0,278,179).data,true);
    const beforeFit=fitAgreement(fitMask(await pixels(svg(before,before.w,before.h,'before'),278,179),true),reference,278,179,2);
    const afterFit=fitAgreement(fitMask(await pixels(svg(t,278,179,'after'),278,179),true),reference,278,179,2);
    result.referenceFit={before:beforeFit,after:afterFit,f1Gain:afterFit.f1-beforeFit.f1,tolerance:'2-pixel square neighborhood on white foreground at the reference-cell scale; not exact agreement'};
    check(afterFit.f1 > beforeFit.f1+0.15,'Reference-mask F1 improves by at least 15 percentage points over the v2 prototype');

    }
    async function raster(svg,size) {
      const image=new Image();const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
      try {await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
        const canvas=document.createElement('canvas');canvas.width=canvas.height=size;canvas.getContext('2d').drawImage(image,0,0,size,size);return canvas;
      } finally {URL.revokeObjectURL(url);}
    }
    function mask(canvas) {const data=canvas.getContext('2d').getImageData(0,0,256,256).data;return Array.from({length:256*256},(_,i)=>data[i*4]>data[i*4+1]+40&&data[i*4]>data[i*4+2]+40);}
    function agreement(a,b) {let count=0,matched=0;for(let y=0;y<256;y++)for(let x=0;x<256;x++){if(!a[y*256+x])continue;count++;let hit=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<256&&yy>=0&&yy<256&&b[yy*256+xx])hit=true;}if(hit)matched++;}return count?matched/count:0;}
    result.repeatCoverage=[];
    for(const [index,pattern] of PatternCatalog.patterns.entries()) for(const variant of PatternCapabilities.get(pattern.id).variants) {
      for(const [shiftX,shiftY] of [[0,0],[25,-50]]) {
      const state={...PatternSession.defaults,frame:240,reps:1,line:'#ff0000',accent:'#ff0000',bg:'#ffffff',stroke:2,shiftX,shiftY};
      const single=await raster(PatternPresentation.render(pattern,index,state,variant,'tile').svg,128);
      const tiled=document.createElement('canvas');tiled.width=tiled.height=256;
      for(let row=0;row<2;row++)for(let col=0;col<2;col++)tiled.getContext('2d').drawImage(single,col*128,row*128);
      const direct=await raster(PatternPresentation.render(pattern,index,{...state,frame:480,reps:2},variant,'field').svg,256);
      const a=mask(tiled),b=mask(direct);const precision=agreement(a,b),recall=agreement(b,a);
      result.repeatCoverage.push({id:pattern.id,variant,shiftX,shiftY,precision,recall});
      check(precision>0.995&&recall>0.995,`${pattern.id}/${variant}/${shiftX},${shiftY} whole export repeats without a new seam`);
      const [fx,fy]=pattern.repeat[variant];
      if(shiftX===0&&shiftY===0&&(fx!==1||fy!==1)) {
        const layout=PatternSVG.repeatLayout(pattern,{...state,reps:3},variant);
        const native=`<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}"><defs><pattern id="native" patternUnits="userSpaceOnUse" width="${layout.cellWidth/fx}" height="${layout.cellHeight/fy}" viewBox="0 0 ${layout.tile.w/fx} ${layout.tile.h/fy}">${layout.tile.markup}</pattern></defs><rect width="100%" height="100%" fill="white"/><rect width="100%" height="100%" fill="url(#native)"/></svg>`;
        const full=mask(await raster(native,256)),minimal=mask(await raster(PatternSVG.serializeField(pattern,index,{...state,reps:3},variant),256));
        const match=Math.min(agreement(full,minimal),agreement(minimal,full));
        check(match>0.995,`${pattern.id}/${variant} reduced repeat cell preserves the original field`);
      }

      }
    }
    // Capture a clean default Asanoha field after the interaction checks.
    choose('asanoha');
  } catch(error) { result.error=String(error); }
  result.errors=window.__probeErrors;result.passed=!result.error;
  const report=document.createElement('pre');report.id='karakusa-probe-report';report.hidden=true;report.textContent=JSON.stringify(result);document.body.append(report);
}

async function capture(url,width,screenshot,profile) {
  const height=width===1440?900:width===768?800:780;
  const child=spawn(browser,['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking',`--user-data-dir=${profile}`,'--remote-debugging-pipe','about:blank'],{windowsHide:true,stdio:['ignore','pipe','pipe','pipe','pipe']});
  let sequence=0,buffer='';const pending=new Map();let stderr='';
  child.stderr.on('data',chunk=>{stderr=(stderr+chunk).slice(-1500);});
  function fail(error){for(const {reject} of pending.values())reject(error);pending.clear();}
  child.on('error',fail);child.on('exit',code=>fail(Error(`Browser exited ${code}: ${stderr}`)));
  child.stdio[4].on('data',chunk=>{buffer+=chunk.toString();let end;while((end=buffer.indexOf('\0'))>=0){const message=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);const request=pending.get(message.id);if(request){pending.delete(message.id);message.error?request.reject(Error(JSON.stringify(message.error))):request.resolve(message.result);}}});
  function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});child.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');});}
  let stage='startup';
  const timer=setTimeout(()=>{fail(Error(`Browser test timed out after 90 seconds (${stage})`));child.kill();},90000);
  try {
    const {targetId}=await send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false},sessionId);

    stage='main landing';
    const landing=new URL('index.html',url);landing.search=new URL(url).search;landing.hash='inspection';
    await send('Page.navigate',{url:landing.href},sessionId);
    let landingLoaded=false;
    for(let attempt=0;attempt<50;attempt++) {
      const loaded=await send('Runtime.evaluate',{expression:`location.pathname.endsWith('/index.html')&&location.search===${JSON.stringify(new URL(url).search)}&&location.hash==='#inspection'&&document.querySelectorAll('[data-pattern]').length===9`,returnByValue:true},sessionId);
      if(loaded.result?.value){landingLoaded=true;break;}
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    if(!landingLoaded)throw Error('Main landing did not load with query/fragment');
    stage='workspace probe';
    await send('Page.navigate',{url},sessionId);
    let report;
    const deadline=Date.now()+60000;
    while(Date.now()<deadline){
      const value=await send('Runtime.evaluate',{expression:'document.getElementById("karakusa-probe-report")?.outerHTML || ""',returnByValue:true},sessionId);
      report=value.result?.value;if(report)break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    if(!report)throw Error('Missing browser probe report');
    stage='keyboard and screenshots';
    await send('Page.bringToFront',{},sessionId);
    await send('Emulation.setFocusEmulationEnabled',{enabled:true},sessionId);
    const keys=async(key,code)=>{const windowsVirtualKeyCode={Tab:9,Enter:13,ArrowRight:39}[key];await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode,text:key==='Enter'?'\r':''},sessionId);await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode},sessionId);};
    await send('Runtime.evaluate',{expression:'document.querySelector("[data-pattern=asanoha]").focus()'},sessionId);
    await keys('Tab','Tab');await keys('Enter','Enter');
    const keyboard=await send('Runtime.evaluate',{expression:'JSON.stringify({name:document.getElementById("selectedName").textContent,active:document.activeElement.outerHTML.slice(0,200),focus:document.hasFocus()})',returnByValue:true},sessionId);
    if(JSON.parse(keyboard.result.value).name!=='Ichimatsu')throw Error('Native Tab/Enter gallery selection failed: '+JSON.stringify(keyboard));
    const record=JSON.parse(report.match(/>([^<]*)<\/pre>/)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
    record.checks.push('Native Tab and Enter select next gallery pattern');
    if(record.width!==width)throw Error(`Expected viewport ${width}, got ${record.width}`);
    record.checks.push('Emulated viewport matches requested CSS width');
    record.checks.push('Main landing loads directly and preserves query/fragment');
    await send('Runtime.evaluate',{expression:"document.getElementById('tab-preview').focus()"},sessionId);
    await keys('ArrowRight','ArrowRight');
    const tab=await send('Runtime.evaluate',{expression:"document.activeElement.id==='tab-construction'&&!document.getElementById('panel-construction').hidden",returnByValue:true},sessionId);
    if(!tab.result.value)throw Error('Native tab ArrowRight did not activate Construction');
    record.checks.push('Native ArrowRight activates Construction tab');
    await keys('ArrowRight','ArrowRight');await keys('ArrowRight','ArrowRight');

    await send('Runtime.evaluate',{expression:'document.querySelector("input[name=previewMode][value=motif]").click();document.querySelector("input[name=previewMode][value=motif]").focus()'},sessionId);
    await keys('ArrowRight','ArrowRight');
    const mode=await send('Runtime.evaluate',{expression:'document.querySelector("input[name=previewMode]:checked").value',returnByValue:true},sessionId);
    if(mode.result.value!=='tile')throw Error('Native radio navigation did not select Tile');
    record.checks.push('Native ArrowRight changes Motif to Tile view');
    await send('Runtime.evaluate',{expression:'document.querySelector("input[name=previewMode][value=field]").click()'},sessionId);

    await send('Runtime.evaluate',{expression:'document.querySelector("[data-pattern=asanoha]").click();document.getElementById("slider-reps").focus()'},sessionId);
    await keys('ArrowRight','ArrowRight');
    const density=await send('Runtime.evaluate',{expression:'document.getElementById("edit-reps").value',returnByValue:true},sessionId);
    if(density.result.value!=='13')throw Error('Native slider ArrowRight did not update exact density');
    record.checks.push('Native ArrowRight adjusts density slider and exact value');
    await send('Runtime.evaluate',{expression:'document.getElementById("resetSelected").click()'},sessionId);

    await send('Runtime.evaluate',{expression:'document.querySelector("[data-pattern=asanoha]").click();document.querySelector(".library summary").focus()'},sessionId);
    await keys('Enter','Enter');
    const collapsed=await send('Runtime.evaluate',{expression:'document.querySelector(".library").open',returnByValue:true},sessionId);
    if(collapsed.result.value!==false)throw Error('Native Enter did not collapse library');
    record.checks.push('Native Enter collapses library');
    await keys('Enter','Enter');
    // Keep the complete library visible in the captured evidence.
    await send('Runtime.evaluate',{expression:'document.querySelector(".library").open=innerWidth>1000;document.querySelector(".inspector").open=innerWidth>600;scrollTo(0,0)'},sessionId);
    report='<pre id="karakusa-probe-report">'+JSON.stringify(record).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</pre>';
    const picture=await send('Page.captureScreenshot',{format:'png'},sessionId);
    fs.writeFileSync(screenshot,Buffer.from(picture.data,'base64'));
    for(const mode of ['motif','tile']) {
      await send('Runtime.evaluate',{expression:`document.querySelector('input[name="previewMode"][value="${mode}"]').click()`},sessionId);
      const modePicture=await send('Page.captureScreenshot',{format:'png'},sessionId);
      fs.writeFileSync(screenshot.replace(/\.png$/,`-${mode}.png`),Buffer.from(modePicture.data,'base64'));
    }

    for(const tab of ['construction','context']) {
      await send('Runtime.evaluate',{expression:`document.getElementById('tab-${tab}').click()`},sessionId);
      const contentPicture=await send('Page.captureScreenshot',{format:'png'},sessionId);
      fs.writeFileSync(screenshot.replace(/\.png$/,`-${tab}.png`),Buffer.from(contentPicture.data,'base64'));
    }
    await send('Runtime.evaluate',{expression:"document.getElementById('tab-preview').click()"},sessionId);
    if(width===1440&&url.includes('paper-mint')) {
      for(const id of ['asanoha','yagasuri','seigaiha','ichimatsu','shippo','kikko','karakusa','uroko','mameshibori']) {
        await send('Runtime.evaluate',{expression:`document.querySelector('[data-pattern="${id}"]').click();document.querySelector('input[name="previewMode"][value="tile"]').click()`},sessionId);
        const tilePicture=await send('Page.captureScreenshot',{format:'png'},sessionId);
        fs.writeFileSync(screenshot.replace(/\.png$/,`-${id}-tile.png`),Buffer.from(tilePicture.data,'base64'));
      }
    }
    return report;
  } finally {clearTimeout(timer);child.kill();}
}
async function run() {
  fs.mkdirSync(out,{recursive:true});
  const profiles=fs.mkdtempSync(path.join(os.tmpdir(),'vectors-karakusa-qa-'));
  const scratch=path.join(root,`.workspace-qa-${process.pid}.html`);
  let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  html=html.replace('<head>','<head><script>window.__probeErrors=[];addEventListener("error",e=>window.__probeErrors.push(e.message));addEventListener("unhandledrejection",e=>window.__probeErrors.push(String(e.reason)));</script>');
  const expected=Object.fromEntries(JSON.parse(fs.readFileSync(path.join(root,'_docs/data/minimal-repeat-2026-10-28/manifest.json'),'utf8')).records.filter(record=>record.variant==='default'&&record.mode==='field').map(record=>[record.id,fs.readFileSync(path.join(root,'_docs/data/minimal-repeat-2026-10-28',record.filename),'utf8')]));
  const baseline=JSON.parse(fs.readFileSync(path.join(root,'_docs/data/karakusa-refinement-2026-10-28/baseline.json'),'utf8')).karakusa;
  const referenceDataUrl='data:image/jpeg;base64,'+fs.readFileSync(path.join(root,'_references/Japanese/Karakusa.jpg')).toString('base64');
  html=html.replace('</body>',`<script>addEventListener("DOMContentLoaded",()=>(${probe.toString()})(${JSON.stringify(expected).replaceAll('<','\\u003c')},${JSON.stringify(baseline).replaceAll('<','\\u003c')},${JSON.stringify(referenceDataUrl)}))</script></body>`);
  fs.writeFileSync(scratch,html,{flag:'wx'});
  const results=[];
  try {
    for(const theme of ['steel-night','paper-mint','neon-grid']) for(const width of [360,768,1440]) {
      const url=pathToFileURL(scratch); url.searchParams.set('theme',theme);
      const stdout=await capture(url.href,width,path.join(out,`workspace-${theme}-${width}.png`),path.join(profiles,`${theme}-${width}`));
      const match=stdout.match(/<pre id="karakusa-probe-report"[^>]*>([^<]*)<\/pre>/);
      if(!match)throw Error(`Missing probe report for ${theme}`);
      const result=JSON.parse(match[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
      results.push(result);
      console.log(`${theme}/${width}: ${result.passed?'PASS':'FAIL'}; ${result.checks.length} checks`);
      fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({browser:'Microsoft Edge headless',results},null,2)+'\n');
      if(!result.passed)throw Error(result.error);
    }
  } finally {fs.unlinkSync(scratch);}
  console.log(`Artifacts: ${out}`);
}
run().catch(error=>{console.error(error.message);process.exitCode=1;});
