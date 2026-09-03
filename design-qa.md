# Design QA — WINE25+ PLUS 발표 플로우

## Comparison Target

- Presentation sequence references: `../slide1/01.png` through `../slide1/13.png`
- Student idea screen references: `../team2 app sample/01.png` through `../team2 app sample/07.png`
- Entry references: `../team2 app sample/폰진입.png`, `스플래시.png`, `우리동네gs.png`
- Implementation: `index.html`, `presentation.css`, `presentation.js`, plus the live app in `app.html`
- Browser QA viewport: 1280 × 720 CSS px. The layout is fluid for larger presentation screens.

## Combined Visual Comparison Evidence

- The final integration-map browser view was inspected as a combined comparison surface: the live implemented WINE25+ app appears on the left while the seven exact supplied student screen images appear on the right at the same time.
- The complete student screens use `object-fit: contain`, so the provided 390 × 844 sources remain uncropped in the summary board.
- The selected-state browser view was inspected with the live MY DRINK ID entry point focused on the left, its exact source screen highlighted on the right, and the dashed connector visible between them.
- The four-stage entry screen was compared directly against the supplied phone-entry, splash, Our GS, and WINE25+ home sources. No placeholder imagery or recreated screen art is used.

## Required Fidelity Surfaces

- Typography: existing Pretendard/system stack, navy hierarchy, compact blue overlines, and Korean two-line headings are consistent with the existing WINE25+ presentation language.
- Layout: desktop presentation is viewport-locked with no outer page scroll; phone frames and idea board remain inside a 1280 × 720 viewport and expand at larger resolutions.
- Assets: all ten supplied entry/idea PNG files are copied into `assets/flow/` and referenced directly.
- Responsive separation: presentation overlay is desktop-only (`min-width: 768px` behavior); mobile keeps the direct app route with no mockup or presentation overlay.
- Existing app fidelity: PC iframe keeps the simulated status bar; `display=mobile` hides it.

## Interaction And Runtime Checks

- Entry sequence: phone home → splash (automatic) → Our GS → redesigned WINE25+ home → integration map.
- All seven right-side cards select the correct title, enable the detail action, and render a visible connector.
- Mapping verified:
  - profile → 나만의 술장
  - 공동 장바구니 → 공동 장바구니
  - categories → 주류 탐색
  - MY DRINK ID banner → MY DRINK ID
  - carousel 2 → 인생 첫 술
  - carousel 3 → 주류 카드
  - carousel 4 → 조합 찾기
- Bidirectional behavior verified: clicking the live app profile control selects `나만의 술장`; moving the parent selection to pairing changes the embedded carousel count to `4`.
- The selected detail action opens the exact supplied 390 × 844 screen and returns to the map.
- Keyboard controls implemented: Space/ArrowRight, 1–7, Escape, L, and R.
- Direct mobile mode reports `.w25-real-mobile`, hides the simulated status bar, and keeps the 390 px app shell scrollable.
- JavaScript syntax checks and `git diff --check` passed. The browser inspection environment reported one URL-less MutationObserver error unrelated to application code; no application runtime failure was observed.

## Comparison History

### Pass 1

- P1: Intro primary-button text inherited the host page color and disappeared against its navy fill.
- P2: Idea preview images used `cover`, cropping the lower part of the supplied student screens.

Fixes:

- Increased presentation selector specificity so primary button labels remain white inside the host page.
- Changed idea previews to `contain` so every supplied student screen is shown in full.

### Pass 2

- Rechecked the first entry screen, full integration map, selected connector state, detail state, all seven mappings, reverse live-app selection, and direct mobile mode.
- No remaining actionable P0/P1/P2 issue was found.

### Pass 3 — phone-fit correction

- P1: At reduced presentation heights, the embedded 390 px app viewport overflowed the smaller phone frame and clipped the right-side navigation and carousel content.
- The embedded app now always renders at its native 390 × 844 layout and is uniformly scaled to fit the available phone screen. The resulting frame has balanced side insets and no horizontal clipping in both the intro and integration-map phones.

### Pass 4 — presentation density and connector correction

- Removed the duplicated large integration-map headline from the flow layout and overlaid the compact kicker/group controls, returning the vertical space to the live phone.
- Phone and embedded-screen corner radii are now calculated from the rendered phone width, so the scaled iframe clips to the same curvature as the outer frame.
- Connector origins now read the actual live element rectangles inside the iframe. Category and MY DRINK ID arrows therefore originate from those rendered controls instead of fixed approximate percentages.

### Pass 5 — presentation spotlight and connector routing

- Connector paths now share one fixed vertical routing rail between the phone and idea board; choosing a farther-right card no longer shifts the bend by hundreds of pixels.
- Both `주류 탐색` and `MY DRINK ID` use their actual right edge as the horizontal origin while retaining their true rendered vertical center.
- Hovering or selecting an entry point applies a 60% black surround inside the app, leaving only the active control undimmed and outlined for projector visibility.

### Pass 6 — fixed connector points and live-mode input

- `주류 탐색` and `MY DRINK ID` now use explicit normalized connector origins measured from the final rendered phone: `(0.963, 0.740)` and `(0.932, 0.503)`.
- Repeated selection before and after other carousel states produced byte-identical SVG paths for both ideas.
- The dismissed presentation overlay now uses `display: none`; invisible child panels can no longer capture input above the live app.
- Live-mode verification passed: carousel button advanced `1 → 2`, PageDown moved the embedded app to `scrollY 346.67`, and the presentation layer reported `display: none`.

## Final Result

final result: passed

---

# Design QA — 기프트 CTA·선택 슬롯·픽업 QR 보정 (2026-09-02)

## Comparison Target

- Source problem captures:
  - `/var/folders/w_/3vv3ts0x77x7j5c628ltrvy00000gn/T/codex-clipboard-fe311e23-5020-48a4-9eed-3b1907246b98.png`
  - `/var/folders/w_/3vv3ts0x77x7j5c628ltrvy00000gn/T/codex-clipboard-25c78691-0ec6-4efe-a595-34f659690bab.png`
  - `/var/folders/w_/3vv3ts0x77x7j5c628ltrvy00000gn/T/codex-clipboard-dbc6d19a-5303-41ab-999a-7282a42e7226.png`
- Browser-rendered implementations:
  - `qa/gift-cta-border-final.jpg`
  - `qa/gift-absolut-slot-final.jpg`
  - `qa/gift-pickup-qr-final.jpg`
- Combined focused comparison evidence:
  - `qa/gift-cta-comparison.jpg`
  - `qa/gift-absolut-slot-comparison.jpg`
  - `qa/gift-pickup-qr-comparison.jpg`
- Browser viewport: 1280 × 720 CSS px with a centered 390 px app shell; screenshot output is normalized to 1280 × 720 pixels at density 1.
- Source pixels: 465 × 185, 149 × 228, and 226 × 220. Focused implementation crops were proportionally fit beside each source without stretching.
- States: `#gift/event` with fixed CTA visible, `#gift/order` with Absolut selected in slot 1, and `#gift/pickup` with the pickup QR visible.

## Required Fidelity Surfaces

- Fonts and typography: existing button, product, and pickup text family, weights, sizes, line heights, and Korean wrapping remain unchanged.
- Spacing and layout rhythm: the CTA keeps its original 15 px horizontal inset but no longer has an artificial outer ring; the selected bottle stays contained inside the slot; the QR sits centered in a square card with an even quiet zone.
- Colors and visual tokens: the yellow-to-cyan CTA, navy selection slots, and white QR card retain the established palette without extra borders or dark halos.
- Image quality and asset fidelity: the Absolut slot now uses a tightly cropped transparent source asset rather than magnifying its 600 px transparent canvas. The pickup screen uses a standalone vector QR generated from the pickup order payload, so no edge is clipped.
- Copy and content: all CTA, product, pickup-number, order-number, and deadline text remains unchanged.

## Findings And Comparison History

### Pass 1

- P1: The CTA had an 18 px dark `box-shadow` ring that read as an unintended button container.
- P2: The Absolut bottle's large transparent canvas made the visible bottle much smaller than adjacent products in the selection slot.
- P1: The pickup QR was positioned by cropping a much larger reference image, clipping the code along the right edge.

Fixes:

- Removed the CTA's artificial shadow ring while preserving its fixed position and gradient.
- Added a dedicated, transparency-preserving slot crop for the Absolut bottle and kept the product-card asset unchanged.
- Replaced the background-position crop with a standalone 256 × 256 QR asset and `object-fit: contain` rendering.

### Pass 2

- The first Absolut adjustment used a transform on the padded source, which enlarged the canvas and clipped the bottle inside the slot.
- Replaced that transform with the dedicated slot image and re-captured at the correct scroll position.
- Post-fix combined evidence shows a clean CTA, a fully contained larger bottle, and an uncropped square QR. No actionable P0/P1/P2 findings remain.

## Interaction And Runtime Checks

- Event CTA routes to `#gift/order`: passed.
- Completion CTA routes to `#gift/pickup`: passed.
- Standalone QR asset loads at 256 × 256 intrinsic pixels and renders at 168 × 168 CSS px: passed.
- Browser console errors/warnings: none.
- JavaScript syntax and whitespace validation: passed.

## Follow-up Polish

- No remaining P3 visual polish is required for the requested areas.

## Final Result

final result: passed

---

# Design QA — 커스텀 기프트세트 보정 (2026-09-02)

## Comparison Target

- Source visual truth: `/var/folders/w_/3vv3ts0x77x7j5c628ltrvy00000gn/T/codex-clipboard-047f581b-9419-458d-9445-d2537c00d42d.png`
- Product-image source detail: `/var/folders/w_/3vv3ts0x77x7j5c628ltrvy00000gn/T/codex-clipboard-3578005e-e9dc-48e6-b5ad-cc11b0d3079a.png`
- Browser-rendered event implementation: `qa/gift-event-after-scrolled.jpg`
- Browser-rendered order implementation: `qa/gift-order-after.jpg`
- Combined event evidence: `qa/gift-event-comparison.png`
- Combined product evidence: `qa/gift-product-comparison.png`
- Browser viewport: 394 × 848 CSS px, device scale 1, matching the live phone mockup's inner iframe.
- Source pixels: 437 × 797 and 195 × 209. Implementation pixels: 394 × 848.
- State: `#gift/event` at the corresponding scrolled hero state, plus `#gift/order` default product grid.

## Required Fidelity Surfaces

- Fonts and typography: event title is visually centered across the full viewport; existing Pretendard hierarchy, weights, line heights, and Korean wrapping are preserved.
- Spacing and layout rhythm: the real-mobile app shell now fills the entire mockup iframe width, eliminating the white side gutters. The event CTA remains 15 px from each side and is fixed above the safe-area bottom.
- Colors and visual tokens: the original black, slate, cyan, navy, and yellow-to-cyan CTA palette remains unchanged. The fixed CTA uses the dark page tone behind it so scrolling copy does not show through.
- Image quality and asset fidelity: the Absolut product uses the transparent Figma source variant and is scaled to match the neighboring bottle silhouettes; no white raster rectangle remains.
- Copy and content: all event, order, completion, and pickup copy remains unchanged.

## Interaction And Runtime Checks

- Event CTA stays fixed while the event content scrolls: passed.
- Four-category selection flow remains functional after the image substitution: passed.
- `픽업 QR보기` is enabled and routes from `#gift/complete` to `#gift/pickup`: passed.
- Browser console error/warning check: passed with no application errors.
- JavaScript syntax and whitespace validation: passed.

## Comparison History

### Pass 1

- P1: The event heading appeared offset because the event header used unequal left/right grid tracks.
- P1: A 390 px shell inside the 394 px mockup iframe left visible white side gutters.
- P1: The completion CTA was disabled, blocking access to the implemented pickup QR screen.
- P2: The first product image contained a visible white raster rectangle and did not match the transparent neighboring bottles.
- P2: The event CTA scrolled with the document instead of remaining in the presentation-safe bottom position.

Fixes:

- Balanced the event header to 72 px / flexible / 72 px tracks.
- Let the real-mobile shell fill the iframe width without outer shadow or margins.
- Connected the active QR button to `#gift/pickup`.
- Swapped the first product to the transparent Figma source and normalized its bottle scale.
- Fixed the event CTA above the bottom safe area with a matching dark background surround.

### Pass 2

- Re-captured the event at the matching scroll state and the focused first product card.
- The title centerline, edge-to-edge content, fixed CTA, transparent product image, and active QR route show no remaining actionable P0/P1/P2 mismatch.

## Follow-up Polish

- P3: The source event screenshot includes the physical phone bezel while browser evidence captures only app-owned content; this is an expected comparison-frame difference.

## Final Result

final result: passed

---

# Design QA — MY DRINK ID 추천 카드 및 상담 연결 (2026-08-30)

## Comparison Target

- Source visual truth: `/var/folders/w_/3vv3ts0x77x7j5c628ltrvy00000gn/T/codex-clipboard-4656f57e-aa52-4866-bfd1-ea66b42867f7.png`
- Source problem capture: `/var/folders/w_/3vv3ts0x77x7j5c628ltrvy00000gn/T/codex-clipboard-5ff46fc0-2ffa-483d-a831-65c9705f1a3e.png`
- Browser-rendered implementation: `qa/drink-id-result-final.png`
- Focused implementation crop: `qa/drink-id-card-implementation-final.png`
- Combined comparison evidence: `qa/drink-id-card-comparison-final.png`
- Browser viewport: 1200 × 760 CSS px; WINE25+ app shell remains 390 CSS px wide.
- Source pixels: 554 × 578. Focused implementation pixels: 526 × 554 after a proportional comparison resize from the 390 px app capture; device density 1.
- State: `#drink-id/result`, recommendation section scrolled into view.

## Required Fidelity Surfaces

- Fonts and typography: Korean hierarchy, weights, wrapping, and CTA emphasis now follow the source. Titles remain on one line and supporting copy retains the intended two-line rhythm.
- Spacing and layout rhythm: two equal top cards, the full-width AI card, 12 px grid gap, 15 px radii, and card padding align with the source composition.
- Colors and visual tokens: coral, yellow, and WINE25 blue card colors are preserved; white type contrast passes visually.
- Image quality and asset fidelity: incorrect stretched card graphics were replaced with the supplied Figma SVG assets. The AI sprite was losslessly cropped to the exact seated pose and remains a transparent PNG.
- Copy and content: 친구 플러스, 유형 둘러보기, 나만의 개인 소믈리에, supporting descriptions, and the active sommelier CTA match the intended content.

## Interaction And Runtime Checks

- 친구 플러스 → header back → `#drink-id/result`: passed.
- 유형 둘러보기 → header back → `#drink-id/result`: passed.
- AI 소믈리에 landing → header back → `#drink-id/result`: passed.
- AI suggestion button → `#drink-id/ai-chat` with the selected question: passed.
- Free-text AI question → `#drink-id/ai-chat` with typed content: passed.
- AI chat header back → `#drink-id/result`: passed.
- JavaScript syntax, whitespace validation, and browser console error check: passed with no application errors.

## Comparison History

### Pass 1

- P1: Card graphics were mapped to the wrong source assets, causing an oversized polygon, missing type shapes, and a blank AI card.
- P1: The AI suggestion buttons only filled the input and did not open a consultation sample.
- P2: Supporting screens did not have an explicitly verified return route to the DRINK ID result.

Fixes:

- Reassigned the exact Figma card graphics, extracted the seated AI sommelier pose, and restored the intended type hierarchy.
- Added a complete AI consultation sample screen and connected both suggestion buttons and typed questions.
- Verified every sub-screen back button returns to `#drink-id/result`.

### Pass 2

- Focused source/implementation comparison found the type decoration grouping too centered and the AI mascot underscaled.
- Repositioned the green, blue, and coral source shapes and increased the AI title/mascot scale.
- Post-fix evidence in `qa/drink-id-card-comparison-final.png` shows no remaining actionable P0/P1/P2 mismatch.

## Follow-up Polish

- P3: The lower-right coral type mark uses the closest supplied individual Figma shape; its points differ slightly from the combined reference artwork but does not affect hierarchy or recognition.

## Final Result

final result: passed
