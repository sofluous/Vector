# Japanese reference audit

Reviewed 2026-10-28. Scope: all nine supplied JPGs, existing generator code, and rendered before/after artifacts. This is a visual/construction audit, not historical authentication or permission to redistribute the images.

## Evidence and provenance

- Originals: `_references/Japanese/`. All nine are 1024-by-576 raster images. Preserve these originals.
- [Before/reference comparison](data/reference-audit-2026-10-28/reference-comparison.html) and [captured comparison](data/reference-audit-2026-10-28/reference-comparison.png): reference on the left, baseline output on the right. Outputs use unit 40, frame 480, repetitions 12, stroke 1.6, line `#2a5db1`, accent `#6f8dcb`, white background. Reference images are fit to the panel; density is not normalized. Compare topology and proportions rather than pixel error.
- [Baseline records](data/reference-audit-2026-10-28/baseline.json) contain exact pre-change tile outputs and settings. The adjacent `*-before.svg` files are standalone baseline exports. Their IDs are local artifact IDs, not a new runtime contract.
- Creator, original publication, license, and per-image source URL are unknown for every supplied JPG. Names identify the user's intended motifs, not independently authenticated attribution. Do not infer geography/history from the imagery alone.
- A saved shortcut points to a Living in Japan article (`https://livinginjapan.net/2022/07/00681/`). A fetch during review timed out; the article was not used to verify any claim or connect an image to an author.
- A separate saved Mathematics Stack Exchange link and `Formula.png`, `diagramA.png`, and `DiagramB.png` remain unverified research inputs. This audit does not assert their formula correctness or provenance.
- Mottling, irregular edges, and color variation in the reference images are distinct from the idealized vector geometry. Do not add raster copies to SVG exports to imitate them.

## Pattern inventory

Repeat descriptions below are proposed construction models inferred from the supplied images. They are not historical claims. Existing tile dimensions describe code, not a proof of correct periodicity.

| Entry / local reference | Observed reference structure and candidate repeat | Baseline finding and next action |
| --- | --- | --- |
| Asanoha / `Asanoha.jpg` | Six-direction star/leaf network; triangular/hexagonal lattice, rectangular supercell spanning two staggered rows | User considers it good. Render has recognizable lattice; freeze as regression baseline. Review internal connections and proportions at normalized scale before verification. |
| Yagasuri / `Yagasuri.jpg` | Paired long slanted vanes separated by a shaft gap; neighboring columns reverse direction and shift by half the vertical period. Two columns form a rectangular cell | Baseline bars and separate triangular caps miss the construction. Pilot correction implemented; see specification below. Visual candidate, not user-approved final. |
| Seigaiha / `Seigaiha.jpg` | Nested rounded fans with staggered centers and overlapping/occluded lower portions; rectangular cell spans two rows | Baseline creates dense crossing arcs and small diamond openings. Subsequent [correction](SEIGAIHA_CONSTRUCTION.md) implements fixed four-ring fans and foreground occlusion; final proportions await review. |
| Ichimatsu / `Ichimatsu.jpg` | Alternating light/blue squares; two-by-two square parity cell | Baseline topology is recognizable; current accent fills the reference's light squares. Provide a reference palette, then review scale and parity. Texture/irregularity is out of scope. |
| Shippo / `Shippo.jpg` | Four diagonal lens petals around light circular spaces, repeated on a square lattice | Baseline rotated field produces dense star/diamond shapes and extra outlines. Subsequent [correction](SHIPPO_CONSTRUCTION.md) constructs direct equal-circle lenses with open tips and an unrotated square repeat; final proportions await review. |
| Kikko / `Kikko.jpg` | Concentric hexagonal rings on staggered centers, broad blue ground and light channels; rectangular two-row supercell | User considers it good. Freeze geometry, but exact reference palette, ring count, line widths, and negative-space balance remain unverified. |
| Karakusa / `Karakusa.jpg` | Connected sweeping stems, multiple inward curls, small leaf accents; visible larger repeated composition | Baseline is sparse disconnected rows. The later [reference-fitted spline graph](KARAKUSA_CONSTRUCTION.md) uses the estimated 278:179 cell and measured landmarks. Foreground F1 improves 0.440 to 0.760 versus the intermediate prototype at two-pixel tolerance; exact equivalence and provenance remain unverified. |
| Uroko / `Uroko.jpg` | Filled upright triangles separated by light inverted triangular spaces; staggered triangular lattice | User considers it good. Freeze baseline; review edge padding/negative space and density separately from color variation. |
| Mameshibori / `Mameshibori.jpg` | Approximately uniform small dots on a regular rectangular grid | Baseline introduces periodic larger dots and accent-color hierarchy absent from the dominant reference structure. Add a uniform-dot reference preset; retain hierarchy only as an explicit variation. |

## Priorities and acceptance

1. Finish review of the Yagasuri pilot against the specified geometry and chosen proportions.
2. Seigaiha and Shippo corrections are implemented with tests; review their proportions and external-editor compatibility.
3. Review Karakusa's reference-fitted motif and local residual differences, plus external-editor compatibility. Preserve the earlier prototype and measurements; do not equate tolerance-based improvement with exact authenticity.
4. Add reference palettes/presets for Ichimatsu and Mameshibori. Do not silently change the three user-favored baselines.

No entry is certified historically accurate or production-compatible across SVG editors. Geometry candidates must pass repeat tests, visual reference review, and independent export checks. Cultural context and rights metadata require further research.

## Validation and artifacts

- `node --test _Vectors/tests/yagasuri.test.cjs`: five tests passed, including byte-identical pre-change output for the other eight patterns at baseline settings.
- Inline application JavaScript parsed using Node's `vm.Script`; no syntax error.
- Ten standalone audit SVGs parsed using Python's standard XML parser.
- Edge headless rendered the comparison artifacts and actual `index.html`. Initial page smoke test found nine pattern cards, twenty static cards, and twenty-seven project logo cards; [record](data/reference-audit-2026-10-28/browser-smoke.json).
- No project build/lint configuration exists. Syntax parsing and focused tests are the available code checks, not a claim of a configured lint pass.
- Clipboard/download interactions, non-Chromium rendering, external design-tool imports, and theme/accessibility acceptance were not tested in this pilot. Shell and controls are unchanged. Browser diagnostics included background sync/device errors; those do not establish an application failure, but this is not a console-clean browser certification.

Artifacts are local research/review material; do not publish reference images or screenshots containing them without establishing rights. See [Yagasuri construction](YAGASURI_CONSTRUCTION.md) for equations, parameter interpretation, limitations, and validation commands.

Subsequent Seigaiha validation is recorded in [its construction specification](SEIGAIHA_CONSTRUCTION.md) and [QA](QA.md). The original audit captures and baseline records remain unchanged; current generator acceptance uses both the original baseline for untouched entries and the later pre-Seigaiha snapshot for corrected Yagasuri.

Subsequent [Shippo validation](SHIPPO_CONSTRUCTION.md) adds a pre-Shippo snapshot preserving corrected Yagasuri/Seigaiha. The original audit baseline now applies to six untouched generators. All prior artifact snapshots remain unchanged.

Subsequent [Karakusa work](KARAKUSA_CONSTRUCTION.md) adds a pre-change snapshot preserving all eight other generators, plus a repeat estimate and tested connected-vine candidate. Five untouched generators retain the original audit outputs. Prior snapshots remain unchanged; Karakusa visual acceptance is still open.
