(function () {
  "use strict";
  const { patterns } = PatternCatalog;
  let session = PatternSession.create();
  const drafts = new Map();
  const gallery = document.getElementById("workspaceGallery");
  const fields = document.getElementById("workspaceFields");
  const preview = document.getElementById("selectedPreview");
  const copy = document.getElementById("copySelected");
  const download = document.getElementById("downloadSelected");
  const status = document.getElementById("workspaceStatus");
  const labels = { frame: "Width", reps: "Density", stroke: "Stroke", line: "Primary", accent: "Secondary", bg: "Background", variant: "Variant", shiftX: "Shift X %", shiftY: "Shift Y %" };
  const bounds = { frame: [240, 2000, 1], reps: [1, 36, 1], stroke: [0.4, 8, 0.1], shiftX: [-100, 100, 1], shiftY: [-100, 100, 1] };
  let currentSVG = "";

  function selected() { return session.artwork[session.selectedId]; }
  function renderPreview() {
    const index = patterns.findIndex(p => p.id === session.selectedId);
    const presentation = PatternPresentation.render(patterns[index], index, selected(), selected().variant, session.mode);
    currentSVG = presentation.svg;
    preview.innerHTML = currentSVG;
    applyZoom();
    const layout = { width: Number(preview.firstElementChild.getAttribute("width")), height: Number(preview.firstElementChild.getAttribute("height")) };
    const modeName = { field: "Pattern", tile: "Tile", motif: "Motif" }[session.mode];
    const count = session.mode === "field" ? ` | ${selected().reps} x ${selected().reps}` : "";
    document.getElementById("outputSummary").textContent = `${layout.width} x ${Number(layout.height.toFixed(2))}${count}`;
    document.getElementById("outputSummary").title = `${modeName} dimensions in SVG units`;
    document.getElementById("viewExplanation").textContent = presentation.note;
    const cap = PatternCapabilities.get(session.selectedId, selected().variant).strokeLimit;
    document.getElementById("strokeLimit").textContent = cap ? (session.mode === "motif" ? `Tile and Pattern stroke is capped at ${cap}; Motif shows the requested stroke.` : `Effective stroke is capped at ${cap}.`) : "";

    copy.setAttribute("aria-label", `Copy ${modeName.toLowerCase()} SVG`);
    download.setAttribute("aria-label", `Export ${modeName.toLowerCase()} SVG`);
    copy.title = `Copy ${modeName.toLowerCase()} SVG`; download.title = `Export ${modeName.toLowerCase()} SVG`;
    preview.setAttribute("aria-label", `${patterns[index].name} ${modeName.toLowerCase()}`);

  }

  function renderInspector() {
    const artwork = selected();
    const caps = PatternCapabilities.get(session.selectedId, artwork.variant);
    fields.replaceChildren();
    const sections = [
      ["Variation", caps.variants.length > 1 ? ["variant"] : []],
      ["Layout", ["frame", "reps"]],
      ["Arrangement", ["shiftX", "shiftY"]],
      ["Palette", ["line", ...(caps.secondary ? ["accent"] : []), "bg"]],
      ["Linework", caps.stroke ? ["stroke"] : []]
    ];
    for (const [title, keys] of sections) {
      if (!keys.length) continue;
      const section = document.createElement("fieldset");
      const legend = document.createElement("legend"); legend.textContent = title;
      section.append(legend); fields.append(section);
      if (title === "Arrangement") {
        const center = document.createElement("button"); center.type = "button"; center.textContent = "Center";
        center.dataset.centerArrangement = ""; center.setAttribute("aria-label", "Reset arrangement shifts"); center.className = "center-arrangement";
        section.append(center);
      }

      for (const key of keys) {
        const row = document.createElement("div"); row.className = "field";
        const label = document.createElement("label"); label.htmlFor = `edit-${key}`; label.textContent = labels[key];
        const pair = document.createElement("div"); pair.className = "control-pair";
        const input = document.createElement(key === "variant" ? "select" : "input");
        input.id = `edit-${key}`; input.name = key; input.dataset.artworkControl = "";
        if (key === "variant") {
          for (const variant of caps.variants) { const option = document.createElement("option"); option.value = variant; option.textContent = variant === "default" ? "Original variation" : "Reference variant"; input.append(option); }
          pair.classList.add("single-control");
        } else if (bounds[key]) {
          input.type = "number"; [input.min, input.max, input.step] = bounds[key].map(String); input.required = true;
          if (key !== "frame") {
            const slider = document.createElement("input"); slider.type = "range"; slider.dataset.pairedControl = key;
            [slider.min, slider.max, slider.step] = bounds[key].map(String);
            slider.value = artwork[key]; slider.setAttribute("aria-label", `${labels[key]} slider`);
            slider.id = `slider-${key}`; pair.append(slider);
          } else pair.classList.add("single-control");
        } else {
          input.type = "text"; input.spellcheck = false; input.autocomplete = "off"; input.required = true;
          const swatch = document.createElement("input"); swatch.type = "color"; swatch.dataset.pairedControl = key;
          swatch.value = artwork[key]; swatch.setAttribute("aria-label", `${labels[key]} picker`);
          swatch.id = `picker-${key}`; pair.classList.add("color-pair"); pair.append(swatch);
        }
        input.value = drafts.get(session.selectedId)?.[key] ?? artwork[key];
        input.setAttribute("aria-describedby", `error-${key}`);
        const error = document.createElement("span"); error.id = `error-${key}`; error.className = "error";
        pair.append(input); row.append(label, pair, error); section.append(row);
      }

    }
    validateDraft();
  }

  function validateDraft() {
    let valid = true;
    for (const input of fields.querySelectorAll("[data-artwork-control]")) {
      let message = "";
      if (bounds[input.name] && !input.validity.valid) {
        const [min, max, step] = bounds[input.name];
        message = `Enter ${min} to ${max}${step === 1 ? " as a whole number" : " in steps of 0.1"}.`;
      }
      if (["line", "accent", "bg"].includes(input.name) && !/^#[0-9a-f]{6}$/i.test(input.value)) message = "Enter a six-digit hex color, such as #2a5db1.";
      const paired = fields.querySelector(`[data-paired-control="${input.name}"]`);
      if (paired) {
        paired.setAttribute("aria-describedby", `error-${input.name}`);
        if (!message) paired.value = input.value;
      }
      input.setAttribute("aria-invalid", String(Boolean(message)));
      document.getElementById(`error-${input.name}`).textContent = message;
      if (message) valid = false;
    }
    copy.disabled = download.disabled = !valid;
    status.textContent = valid ? "" : "Correct the highlighted values to update the preview and enable export.";
    return valid;
  }

  function renderSelection() {
    const pattern = patterns.find(p => p.id === session.selectedId);
    document.getElementById("selectedName").textContent = pattern.name;
    document.getElementById("selectedDescription").textContent = pattern.desc;
    for (const button of gallery.querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.dataset.pattern === pattern.id));
    renderPreview(); renderInspector(); renderContent();
  }

  function renderContent() {
    const content = PatternContent.get(session.selectedId);
    document.getElementById("constructionTitle").textContent = `${content.name} construction`;
    document.getElementById("constructionNotes").textContent = content.construction;
    const diagram = document.getElementById("constructionDiagram");
    const pattern = patterns.find(pattern => pattern.id === session.selectedId);
    // Use the real repeat generator so diagrams cannot drift from exported construction.
    diagram.innerHTML = PatternPresentation.render(pattern, patterns.indexOf(pattern) + 100, { ...selected(), reps: 2 }, selected().variant, "field").svg;
    diagram.setAttribute("aria-label", `${content.name} generated two-by-two repeat diagram`);
    document.getElementById("contextTitle").textContent = content.name;
    document.getElementById("contextDescription").textContent = content.context;
    document.getElementById("contextReview").textContent = content.review + (selected().variant === "reference" ? " Reference variant selected." : "");
    document.getElementById("contextProvenance").textContent = content.provenance;
    document.getElementById("contextReference").setAttribute("href", content.reference);
  }
  function applyZoom() {
    const svg = preview.firstElementChild;
    if (svg && session.zoom !== 1) {
      const [x, y, w, h] = svg.getAttribute("viewBox").split(" ").map(Number);
      const width = w / session.zoom, height = h / session.zoom;
      svg.setAttribute("viewBox", `${x + (w - width) / 2} ${y + (h - height) / 2} ${width} ${height}`);
    }
    document.getElementById("zoomValue").textContent = `${Math.round(session.zoom * 100)}%`;
    document.getElementById("zoomOut").disabled = session.zoom <= 0.25;
    document.getElementById("zoomIn").disabled = session.zoom >= 4;
  }
  function selectTab(tab, focus = false) {
    session = PatternSession.view(session, { tab });
    for (const button of document.querySelectorAll("[data-tab]")) {
      const active = button.dataset.tab === tab;
      button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1;
      document.getElementById(button.getAttribute("aria-controls")).hidden = !active;
      if (active && focus) button.focus();
    }
    for (const id of ["previewModes", "zoomControls"]) document.getElementById(id).hidden = tab !== "preview";
    copy.hidden = download.hidden = tab !== "preview";
    renderContent();
  }
  const tabs = document.getElementById("workspaceTabs");
  tabs.addEventListener("click", event => {
    const button = event.target.closest("[data-tab]"); if (button) selectTab(button.dataset.tab);
  });
  tabs.addEventListener("keydown", event => {
    const buttons = [...tabs.querySelectorAll("[data-tab]")];
    const index = buttons.indexOf(document.activeElement);
    if (index < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    selectTab(buttons[next].dataset.tab, true);
  });
  for (const [id, change] of [["zoomOut", -1], ["zoomIn", 1], ["zoomFit", 0]]) {
    document.getElementById(id).addEventListener("click", () => {
      session = PatternSession.view(session, { zoom: change ? Math.max(0.25, Math.min(4, session.zoom * (change > 0 ? 2 : 0.5))) : 1 });
      renderPreview(); validateDraft();
    });
  }

  for (const group of PatternLibrary.groups) {
    const section = document.createElement("details"); section.className = "library-group"; section.open = true; section.dataset.group = group.id;
    const summary = document.createElement("summary"); summary.textContent = `${group.name} (${group.patterns.length})`;
    const list = document.createElement("div"); list.className = "group-patterns";
    section.append(summary, list); gallery.append(section);
    for (const id of group.patterns) {
      const index = patterns.findIndex(pattern => pattern.id === id); const pattern = patterns[index];
      const button = document.createElement("button"); button.type = "button"; button.className = "pattern-choice"; button.dataset.pattern = pattern.id;
      const thumb = document.createElement("span"); thumb.setAttribute("aria-hidden", "true");
      thumb.innerHTML = PatternPresentation.thumbnail(pattern, index + patterns.length, PatternSession.defaults);
      const name = document.createElement("span"); name.textContent = pattern.name;
      button.append(thumb, name); list.append(button);
      button.addEventListener("click", () => { session = PatternSession.select(session, pattern.id); renderSelection(); });
    }
  }
  const search = document.getElementById("patternSearch");
  function filterLibrary() {
    const matches = PatternLibrary.browse(search.value);
    const visible = new Set(matches.flatMap(group => group.patterns.map(pattern => pattern.id)));
    for (const section of gallery.querySelectorAll("[data-group]")) {
      section.hidden = !matches.some(group => group.id === section.dataset.group);
      if (search.value.trim()) section.open = true;
    }
    for (const button of gallery.querySelectorAll("[data-pattern]")) button.hidden = !visible.has(button.dataset.pattern);
    document.getElementById("libraryCount").textContent = visible.size ? `${visible.size} of ${patterns.length} patterns` : "No matches. Clear search to see all patterns.";
  }
  search.addEventListener("input", filterLibrary);
  filterLibrary();

  document.getElementById("previewModes").addEventListener("change", event => {
    if (event.target.name !== "previewMode") return;
    session = PatternSession.view(session, { mode: event.target.value });
    renderPreview(); validateDraft();
  });

  fields.addEventListener("click", event => {
    if (!event.target.closest("[data-center-arrangement]")) return;
    session = PatternSession.edit(session, { shiftX: 0, shiftY: 0 });
    const draft = { ...(drafts.get(session.selectedId) || {}) }; delete draft.shiftX; delete draft.shiftY;
    if (Object.keys(draft).length) drafts.set(session.selectedId, draft); else drafts.delete(session.selectedId);
    renderPreview(); renderInspector(); renderContent();
    fields.querySelector("[data-center-arrangement]").focus();
  });

  document.getElementById("workspaceForm").addEventListener("submit", event => event.preventDefault());
  fields.addEventListener("input", editInput);
  fields.addEventListener("change", editInput);
  function editInput(event) {
    let input = event.target;
    if (input.dataset.pairedControl) {
      const canonical = document.getElementById(`edit-${input.dataset.pairedControl}`);
      canonical.value = input.value; input = canonical;
    }
    if (!input.name) return;
    const draft = { ...(drafts.get(session.selectedId) || {}), [input.name]: input.value };
    drafts.set(session.selectedId, draft);
    if (!validateDraft()) return;
    const patch = {};
    for (const control of fields.querySelectorAll("[data-artwork-control]")) {
      // A variant switch retains inactive values in the model rather than editing them.
      if (control.name === "accent" && draft.variant === "reference") continue;
      patch[control.name] = bounds[control.name] ? Number(control.value) : control.value;
    }
    try {
      session = PatternSession.edit(session, patch);
      drafts.delete(session.selectedId);
      renderPreview(); renderContent();
      if (input.name === "variant") { renderInspector(); document.getElementById("edit-variant").focus(); }
    } catch (error) {
      input.setAttribute("aria-invalid", "true");
      document.getElementById(`error-${input.name}`).textContent = error.message;
      copy.disabled = download.disabled = true;
      status.textContent = "Correct the highlighted value to enable export.";
    }
  }

  document.getElementById("resetSelected").addEventListener("click", () => {
    session = PatternSession.reset(session); drafts.delete(session.selectedId); renderSelection(); status.textContent = "Pattern reset.";
  });
  copy.addEventListener("click", async () => {
    if (copy.disabled) return;
    try { await navigator.clipboard.writeText(currentSVG); status.textContent = "SVG copied."; }
    catch { status.textContent = "Clipboard access is unavailable. Use Download SVG to save the pattern."; }
  });
  download.addEventListener("click", () => {
    if (download.disabled) return;
    let url;
    try {
      url = URL.createObjectURL(new Blob([currentSVG], { type: "image/svg+xml;charset=utf-8" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${session.selectedId}${session.mode === "field" ? "" : "-" + session.mode}.svg`; anchor.click();
      status.textContent = "SVG download requested.";
    } catch { status.textContent = "Download could not start. Try copying the SVG."; }
    finally { if (url) setTimeout(() => URL.revokeObjectURL(url), 0); }
  });
  const info = document.getElementById("patternInfo");
  info.addEventListener("toggle", () => {
    if (!info.open) return;
    const trigger = info.querySelector("summary").getBoundingClientRect();
    const content = info.querySelector(".info-content");
    const box = content.getBoundingClientRect();
    content.style.left = `${Math.max(8, Math.min(trigger.right - box.width, innerWidth - box.width - 8))}px`;
    content.style.top = `${Math.max(8, Math.min(trigger.bottom + 8, innerHeight - box.height - 8))}px`;
  });
  addEventListener("resize", () => { info.open = false; });
  document.addEventListener("click", event => { if (!info.contains(event.target)) info.open = false; });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && info.open) { info.open = false; info.querySelector("summary").focus(); }
  });
  if (matchMedia("(max-width: 1000px)").matches) document.querySelector(".library").open = false;
  if (matchMedia("(max-width: 600px)").matches) document.querySelector(".inspector").open = false;
  renderSelection();
})();
