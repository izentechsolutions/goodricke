# Goodricke Homepage: Shopify handoff

This repo holds the **approved** Goodricke homepage, reorganized for handoff to a Shopify developer.
The reorganization is structural only: no design, layout, copy, class names, IDs or JS logic changed.
Rebuilding the original single-file page from these files gives it back byte for byte. The only
differences are the asset paths (see [Verification](#8-verification-results)).

- Open `index.html` through a local server (e.g. `python3 -m http.server`), not `file://`.
- The untouched original is at git tag **`original-approved-version`** (commit "Original approved version").
  A single-file copy is also kept at `_review/pages/goodricke-homepage-original-single-file.html`.

---

## 1. Final folder tree

```
index.html                 ← the homepage (was "Goodricke Homepage.html")
css/                       ← 23 stylesheets (fonts.css, main.css, 01…21 overrides)
js/                        ← 21 scripts (01…21, in execution order)
assets/
  fonts/                   ← 11 font files (Arpona OTF ×9, Inter variable TTF ×2)
  images/                  ← 33 images used by the page (incl. the extracted hero background)
  media/                   ← 4 videos used by the page
_review/                   ← unused / uncertain files, NOT used by the page (see §6)
  pages/                   ← old drafts + the original single-file page
  images/                  ← unused images
  dev-screenshots/         ← screenshots made during design iterations
  design-source/           ← khaass-pack.psd (23 MB Photoshop source)
  misc/                    ← .thumbnail (bundler thumbnail)
docs/                      ← baseline inventory, link checker, verification screenshots
Dockerfile, nginx.conf, CNAME, .github/workflows/   ← existing demo hosting (Cloud Run / GitHub Pages)
```

<details><summary>Full file list (excluding <code>_review/</code>)</summary>

```
.
./.github
./.github/workflows
./.github/workflows/deploy-cloud-run.yml
./.github/workflows/pages.yml
./CNAME
./Dockerfile
./README.md
./assets
./assets/fonts
./assets/fonts/arpona-black.otf
./assets/fonts/arpona-bold-italic.otf
./assets/fonts/arpona-bold.otf
./assets/fonts/arpona-extrabold.otf
./assets/fonts/arpona-italic.otf
./assets/fonts/arpona-medium-italic.otf
./assets/fonts/arpona-medium.otf
./assets/fonts/arpona-regular.otf
./assets/fonts/arpona-semibold.otf
./assets/fonts/inter-variable-italic.ttf
./assets/fonts/inter-variable.ttf
./assets/images
./assets/images/assam.png
./assets/images/darjeeling.png
./assets/images/dooars.png
./assets/images/goodricke-icon-green.png
./assets/images/goodricke-wordmark-green.png
./assets/images/hero-bg-embedded.jpg
./assets/images/hero-garden.png
./assets/images/hero-slide-2.jpg
./assets/images/hero-slide-3.jpg
./assets/images/hero-slide-4.jpg
./assets/images/hero-tea-cup.jpeg
./assets/images/khaass-pack-2.jpg
./assets/images/khaass-pack-3.jpg
./assets/images/khaass-pack-4.jpg
./assets/images/range-product-1.png
./assets/images/range-product-2.png
./assets/images/range-product-3.png
./assets/images/range-product-4.png
./assets/images/reel-poster-1.png
./assets/images/reel-poster-2.png
./assets/images/reel-poster-3.png
./assets/images/reel-poster-4.png
./assets/images/region-bg.png
./assets/images/region-section-bg.jpeg
./assets/images/secondary-logo-white.png
./assets/images/shop-chai-leaf.png
./assets/images/shop-roasted-darjeeling.png
./assets/images/shop-supercup-gold.png
./assets/images/shop-thurbo-whole-leaf.png
./assets/images/team-portrait.png
./assets/images/unbox-garden.jpeg
./assets/images/unbox-slide-1.jpg
./assets/images/unbox-slide-2.png
./assets/media
./assets/media/goodway-hero-video.mp4
./assets/media/instagram-reel-a.mp4
./assets/media/instagram-reel-b.mp4
./assets/media/story-video.mp4
./css
./css/01-goodricke-product-section-overrides.css
./css/02-goodricke-range-hover-overrides.css
./css/03-hover-only-options.css
./css/04-weight-bottom-margin.css
./css/05-keep-badge-and-product-name.css
./css/06-goodricke-click-only-interaction.css
./css/07-goodricke-final-click-only-products.css
./css/08-instagram-mobile-one-reel-slider.css
./css/09-desktop-hover-mobile-click.css
./css/10-gk-final-interaction.css
./css/11-gk-hero-overlap.css
./css/12-gk-final-fixed-interaction.css
./css/13-isolated-both-product-sections-final.css
./css/14-gk-range-reskin.css
./css/15-gk-range-cart-reposition.css
./css/16-gk-shop-reskin.css
./css/17-gk-shop-hide-arrows.css
./css/18-gk-voice-leaves.css
./css/19-gk-unbox-range-overlap.css
./css/20-gk-header-dropdowns.css
./css/21-gk-nav-panels.css
./css/fonts.css
./css/main.css
./docs
./docs/baseline-inventory.tsv
./docs/baseline-references.txt
./docs/check-links.py
./docs/verification
./docs/verification/new-desktop.jpg
./docs/verification/new-mobile.jpg
./docs/verification/orig-desktop.jpg
./docs/verification/orig-mobile.jpg
./index.html
./js
./js/01-goodricke-click-only-script.js
./js/02-goodricke-final-click-script.js
./js/03-mobile-product-tap-only.js
./js/04-gk-mobile-click-script.js
./js/05-promo-overlap-crossfade.js
./js/06-mobile-menu-toggle.js
./js/07-story-video-modal.js
./js/08-unbox-slider.js
./js/09-team-row-autoscroll-a.js
./js/10-team-row-autoscroll-b.js
./js/11-instagram-reel-autoplay.js
./js/12-gk-product-carousel-script.js
./js/13-gk-mobile-click-final.js
./js/14-isolated-both-product-sections-click.js
./js/15-gk-smooth-scroll.js
./js/16-gk-header-expand.js
./js/17-gk-sticky-menu.js
./js/18-gk-cursor.js
./js/19-gk-scroll-expand.js
./js/20-gk-unbox-range-overlap-driver.js
./js/21-gk-nav-panels-driver.js
./nginx.conf
```
</details>

## 2. CSS and JS files, in load order

Every inline `<style>` and `<script>` block was moved to its own file and linked **where the block used to be**.
That keeps the cascade order and script execution order exactly as they were. The original `id` attributes are kept
on the `<link>` / `<script>` tags. No script had `defer`, `async` or `type="module"`, and none were added:
they are all classic, blocking scripts, as before. Four scripts (01–04) are in `<head>`, the rest are in `<body>`.

| # | Type | File | In | Size | Contents |
|---|------|------|----|------|----------|
| 1 | CSS | `css/fonts.css` | head | 2 KB | All `@font-face` rules (Arpona ×9, Inter variable ×2). Loaded first. |
| 2 | CSS | `css/main.css` | head | 86 KB | The base stylesheet: design tokens (`:root`), layout and every section (hero, unbox, range, story, shop, region, team, quality, promo, voices, Instagram, footer), plus responsive rules. |
| 3 | CSS | `css/01-goodricke-product-section-overrides.css` | head | 7 KB | Product section overrides (card layout, badges, prices). |
| 4 | CSS | `css/02-goodricke-range-hover-overrides.css` | head | 3 KB | Range card hover effect. |
| 5 | CSS | `css/03-hover-only-options.css` | head | 1 KB | On hover, keeps product image and controls and hides other card content. |
| 6 | CSS | `css/04-weight-bottom-margin.css` | head | 2 KB | Spacing below weight/size options; hover options hidden to begin with. |
| 7 | CSS | `css/05-keep-badge-and-product-name.css` | head | <1 KB | Keeps the Bestseller/New badge and product name visible on hover. |
| 8 | CSS | `css/06-goodricke-click-only-interaction.css` | head | 3 KB | Click-only product actions (no hover trigger, no image zoom). |
| 9 | JS | `js/01-goodricke-click-only-script.js` | head | 1 KB | Toggles product card open/closed on click. |
| 10 | CSS | `css/07-goodricke-final-click-only-products.css` | head | 5 KB | Final click-only rules for range and shop cards. |
| 11 | JS | `js/02-goodricke-final-click-script.js` | head | 1 KB | Product options: close on outside click or Escape. |
| 12 | CSS | `css/08-instagram-mobile-one-reel-slider.css` | head | 2 KB | Instagram section on mobile: one reel per swipe. |
| 13 | CSS | `css/09-desktop-hover-mobile-click.css` | head | 3 KB | Hover opens product options on desktop; tap on mobile. |
| 14 | JS | `js/03-mobile-product-tap-only.js` | head | 1 KB | Tap-to-open product cards on mobile. |
| 15 | CSS | `css/10-gk-final-interaction.css` | head | 3 KB | Product controls: hidden by default, shown on hover (desktop only). |
| 16 | JS | `js/04-gk-mobile-click-script.js` | head | <1 KB | Mobile click toggle for GK cards. |
| 17 | CSS | `css/11-gk-hero-overlap.css` | head | 16 KB | Hero/unbox overlap and scroll-scene layout; disables native smooth scroll (the JS handles it). |
| 18 | JS | `js/05-promo-overlap-crossfade.js` | body | 1 KB | Scroll-driven crossfade in the promo section (`#promoOvl`). |
| 19 | JS | `js/06-mobile-menu-toggle.js` | body | <1 KB | Hero `.menu-toggle` opens and closes `.pillnav` (runs on DOMContentLoaded). |
| 20 | JS | `js/07-story-video-modal.js` | body | <1 KB | “Watch story” button opens the video modal. |
| 21 | JS | `js/08-unbox-slider.js` | body | 1 KB | Unbox section image and text slider. |
| 22 | JS | `js/09-team-row-autoscroll-a.js` | body | 2 KB | `.team-row` auto-scroll plus mouse drag (first copy). |
| 23 | JS | `js/10-team-row-autoscroll-b.js` | body | 1 KB | `.team-row` auto-scroll, drag and pause-on-hover (second copy; **both 09 and 10 run** in the approved page, left as is). |
| 24 | JS | `js/11-instagram-reel-autoplay.js` | body | 1 KB | Plays/pauses Instagram reels by viewport visibility (IntersectionObserver). |
| 25 | JS | `js/12-gk-product-carousel-script.js` | body | 2 KB | Product carousel behavior. |
| 26 | CSS | `css/12-gk-final-fixed-interaction.css` | body | 3 KB | Fixed interaction rules for product cards. |
| 27 | JS | `js/13-gk-mobile-click-final.js` | body | 1 KB | Final mobile click toggle for GK cards. |
| 28 | CSS | `css/13-isolated-both-product-sections-final.css` | body | 4 KB | Keeps the range and bestseller sections' interactions separate. |
| 29 | JS | `js/14-isolated-both-product-sections-click.js` | body | 2 KB | Mobile click handling per section (range and bestsellers kept separate). |
| 30 | JS | `js/15-gk-smooth-scroll.js` | body | 5 KB | Custom smooth-scroll loop (wheel easing) that other drivers subscribe to. |
| 31 | JS | `js/16-gk-header-expand.js` | body | 3 KB | Turns the hero pill into the sticky header as you scroll. |
| 32 | JS | `js/17-gk-sticky-menu.js` | body | <1 KB | Sticky header mobile menu open/close. |
| 33 | JS | `js/18-gk-cursor.js` | body | 4 KB | Custom cursor. |
| 34 | JS | `js/19-gk-scroll-expand.js` | body | 5 KB | ScrollExpand (vanilla port of React Bits): media expands on scroll. |
| 35 | CSS | `css/14-gk-range-reskin.css` | body | 3 KB | Range section reskin. |
| 36 | CSS | `css/15-gk-range-cart-reposition.css` | body | 2 KB | Range cart button moves beside the price. |
| 37 | CSS | `css/16-gk-shop-reskin.css` | body | 4 KB | Shop (bestsellers) section reskin; price and size chips stay visible. |
| 38 | CSS | `css/17-gk-shop-hide-arrows.css` | body | <1 KB | Hides the shop slider prev/next arrows. |
| 39 | CSS | `css/18-gk-voice-leaves.css` | body | <1 KB | Testimonials: 5-leaf rating badges instead of stars. |
| 40 | CSS | `css/19-gk-unbox-range-overlap.css` | body | 1 KB | Unbox → range overlap and dimmer. |
| 41 | JS | `js/20-gk-unbox-range-overlap-driver.js` | body | <1 KB | Drives the unbox/range overlap dimmer on scroll. |
| 42 | CSS | `css/20-gk-header-dropdowns.css` | body | 2 KB | Header dropdown and caret alignment (hero header and sticky header). |
| 43 | CSS | `css/21-gk-nav-panels.css` | body | 3 KB | Shop / Our Gardens floating mega-menu panels. |
| 44 | JS | `js/21-gk-nav-panels-driver.js` | body | 4 KB | Opens Shop / Our Gardens panels on hover and swaps the preview image. |

Notes for the developer (behavior preserved, **not** changed):
- Many override files stack on top of one another (`01…13`, then `14…21`). Later files win. Keep the order if you merge them.
- `js/09` and `js/10` are two versions of the `.team-row` auto-scroller and **both run**. That's how the approved page behaves.
- Several scripts use `DOMContentLoaded`. External blocking scripts still run before that event, so the timing hasn't changed.

## 3. Fonts

The fonts were embedded in the page as base64 `data:` URIs. They were decoded into files **byte for byte**:
no conversion, subsetting or new formats. Only OTF/TTF exist (no woff2/woff was supplied), so each `@font-face`
lists the one real file, with the same `format()` hint as before.
Family names, weights, styles and `font-display:swap` (already present) are unchanged. Everything is in `css/fonts.css`.

| Family | Weight | Style | File | Size |
|--------|--------|-------|------|------|
| Arpona | 400 | normal | `assets/fonts/arpona-regular.otf` | 20 KB |
| Arpona | 400 | italic | `assets/fonts/arpona-italic.otf` | 19 KB |
| Arpona | 500 | normal | `assets/fonts/arpona-medium.otf` | 20 KB |
| Arpona | 500 | italic | `assets/fonts/arpona-medium-italic.otf` | 20 KB |
| Arpona | 600 | normal | `assets/fonts/arpona-semibold.otf` | 20 KB |
| Arpona | 700 | normal | `assets/fonts/arpona-bold.otf` | 20 KB |
| Arpona | 700 | italic | `assets/fonts/arpona-bold-italic.otf` | 20 KB |
| Arpona | 800 | normal | `assets/fonts/arpona-extrabold.otf` | 20 KB |
| Arpona | 900 | normal | `assets/fonts/arpona-black.otf` | 19 KB |
| Inter | 100 900 | normal | `assets/fonts/inter-variable.ttf` | 854 KB |
| Inter | 100 900 | italic | `assets/fonts/inter-variable-italic.ttf` | 883 KB |

On the page, only Arpona 400/600 and Inter (normal and italic) are used. The other Arpona weights are declared,
but the browser never downloads them.

## 4. Files moved or renamed (used by the page)

| Old path | New path |
|----------|----------|
| `001.png` | `assets/images/reel-poster-1.png` |
| `002.png` | `assets/images/reel-poster-2.png` |
| `003.png` | `assets/images/reel-poster-3.png` |
| `004.png` | `assets/images/reel-poster-4.png` |
| `chatgpt-image-sep-18-2026-11_50_25-am-mu6phmwl-srck.png` | `assets/images/range-product-1.png` |
| `chatgpt-image-sep-18-2026-11_48_08-am-mu6phsg3-lay4.png` | `assets/images/range-product-2.png` |
| `296dcfbd-870e-4b69-b790-fa2555fab349-mu6hn54k-pbmq.png` | `assets/images/range-product-3.png` |
| `chatgpt-image-sep-18-2026-11_53_30-am-mu6pi71r-ip4a.png` | `assets/images/range-product-4.png` |
| `chatgpt-image-sep-18-2026-11_51_51-am-mu6pt1qv-ey9o.png` | `assets/images/shop-supercup-gold.png` |
| `chatgpt-image-sep-18-2026-11_48_08-am-mu6pys2u-ikqg.png` | `assets/images/shop-chai-leaf.png` |
| `chatgpt-image-sep-18-2026-11_50_25-am-mu6q0s0i-1b90.png` | `assets/images/shop-roasted-darjeeling.png` |
| `chatgpt-image-sep-18--2026--02_25_58-pm-mu6qf62a-albw.png` | `assets/images/shop-thurbo-whole-leaf.png` |
| `adobestock_492737037-1-mu6qnz5d-73gu.jpg` | `assets/images/unbox-slide-1.jpg` |
| `adobestock_273992410-mu5xail7-6fxi.png` | `assets/images/unbox-slide-2.png` |
| `adobestock_459255987-mu5ip3ue-7947.jpeg` | `assets/images/region-section-bg.jpeg` |
| `goodricke-icon-green.png` | `assets/images/goodricke-icon-green.png` |
| `goodricke-wordmark-green.png` | `assets/images/goodricke-wordmark-green.png` |
| `hero-garden.png` | `assets/images/hero-garden.png` |
| `hero-tea-cup.jpeg` | `assets/images/hero-tea-cup.jpeg` |
| `khaass-pack2.jpg` | `assets/images/khaass-pack-2.jpg` |
| `khaass-pack3.jpg` | `assets/images/khaass-pack-3.jpg` |
| `khaass-pack4.jpg` | `assets/images/khaass-pack-4.jpg` |
| `secondary-logo_white-mu5rs8bf-ngry.png` | `assets/images/secondary-logo-white.png` |
| `team-portrait.png` | `assets/images/team-portrait.png` |
| `unbox-garden.jpeg` | `assets/images/unbox-garden.jpeg` |
| `images/assam.png` | `assets/images/assam.png` |
| `images/darjeeling.png` | `assets/images/darjeeling.png` |
| `images/dooars.png` | `assets/images/dooars.png` |
| `images/region-bg.png` | `assets/images/region-bg.png` |
| `uploads/adobestock_1003230309-mu6iyxtp-l08b.jpg` | `assets/images/hero-slide-2.jpg` |
| `uploads/slide-3.jpg` | `assets/images/hero-slide-3.jpg` |
| `uploads/slide3.jpg` | `assets/images/hero-slide-4.jpg` |
| `Video-32674.mp4` | `assets/media/instagram-reel-a.mp4` |
| `Video-53785.mp4` | `assets/media/instagram-reel-b.mp4` |
| `uploads/goodway-hero-video.mp4` | `assets/media/goodway-hero-video.mp4` |
| `uploads/story-video.mp4` | `assets/media/story-video.mp4` |
| `Goodricke Homepage.html` | `index.html` (inline CSS/JS extracted) |
| `index.html` (meta-refresh redirect to the homepage) | `_review/pages/index-redirect.html` |
| *(base64 JPEG inside the `.hero` CSS rule)* | `assets/images/hero-bg-embedded.jpg` |
| *(11 base64 fonts inside `@font-face`)* | `assets/fonts/*.otf / *.ttf` |

Paths inside HTML stay document-relative (`./assets/images/…`, keeping the original `./` where it was used).
The nav-panel script compares `getAttribute('src')` to `data-img` strings, so both were rewritten identically.
Paths inside CSS are relative to the CSS file (`../assets/images/…`, `../assets/fonts/…`).
No JS file contains an asset path (they read paths from `data-img` / `src` in the HTML).

## 5. What was extracted from inline code

| Original line | Original block | New file |
|---------------|----------------|----------|
| 10 | head <style> (the @font-face rules) | `css/fonts.css` |
| 10 | head <style> (everything after @font-face) | `css/main.css` |
| 3953 | <style id="goodricke-product-section-overrides"> | `css/01-goodricke-product-section-overrides.css` |
| 4207 | <style id="goodricke-range-hover-overrides"> | `css/02-goodricke-range-hover-overrides.css` |
| 4358 | <style id="hover-only-options"> | `css/03-hover-only-options.css` |
| 4407 | <style id="weight-bottom-margin"> | `css/04-weight-bottom-margin.css` |
| 4498 | <style id="keep-badge-and-product-name"> | `css/05-keep-badge-and-product-name.css` |
| 4512 | <style id="goodricke-click-only-interaction"> | `css/06-goodricke-click-only-interaction.css` |
| 4639 | <script id="goodricke-click-only-script"> | `js/01-goodricke-click-only-script.js` |
| 4690 | <style id="goodricke-final-click-only-products"> | `css/07-goodricke-final-click-only-products.css` |
| 4878 | <script id="goodricke-final-click-script"> | `js/02-goodricke-final-click-script.js` |
| 4934 | <style id="instagram-mobile-one-reel-slider"> | `css/08-instagram-mobile-one-reel-slider.css` |
| 5023 | <style id="desktop-hover-mobile-click"> | `css/09-desktop-hover-mobile-click.css` |
| 5147 | <script id="mobile-product-tap-only"> | `js/03-mobile-product-tap-only.js` |
| 5190 | <style id="gk-final-interaction"> | `css/10-gk-final-interaction.css` |
| 5288 | <script id="gk-mobile-click-script"> | `js/04-gk-mobile-click-script.js` |
| 5318 | <style id="gk-hero-overlap"> | `css/11-gk-hero-overlap.css` |
| 6297 | <script> (no id) | `js/05-promo-overlap-crossfade.js` |
| 6471 | <script> (no id) | `js/06-mobile-menu-toggle.js` |
| 6497 | <script> (no id) | `js/07-story-video-modal.js` |
| 6534 | <script> (no id) | `js/08-unbox-slider.js` |
| 6594 | <script> (no id) | `js/09-team-row-autoscroll-a.js` |
| 6672 | <script> (no id) | `js/10-team-row-autoscroll-b.js` |
| 6749 | <script> (no id) | `js/11-instagram-reel-autoplay.js` |
| 6791 | <script id="gk-product-carousel-script"> | `js/12-gk-product-carousel-script.js` |
| 6843 | <style id="gk-final-fixed-interaction"> | `css/12-gk-final-fixed-interaction.css` |
| 6966 | <script id="gk-mobile-click-final"> | `js/13-gk-mobile-click-final.js` |
| 7013 | <style id="ISOLATED-BOTH-PRODUCT-SECTIONS-FINAL"> | `css/13-isolated-both-product-sections-final.css` |
| 7194 | <script id="ISOLATED-BOTH-PRODUCT-SECTIONS-CLICK"> | `js/14-isolated-both-product-sections-click.js` |
| 7266 | <script id="gk-smooth-scroll"> | `js/15-gk-smooth-scroll.js` |
| 7395 | <script id="gk-header-expand"> | `js/16-gk-header-expand.js` |
| 7461 | <script id="gk-sticky-menu"> | `js/17-gk-sticky-menu.js` |
| 7478 | <script id="gk-cursor"> | `js/18-gk-cursor.js` |
| 7557 | <script id="gk-scroll-expand"> | `js/19-gk-scroll-expand.js` |
| 7677 | <style id="gk-range-reskin"> | `css/14-gk-range-reskin.css` |
| 7776 | <style id="gk-range-cart-reposition"> | `css/15-gk-range-cart-reposition.css` |
| 7831 | <style id="gk-shop-reskin"> | `css/16-gk-shop-reskin.css` |
| 7975 | <style id="gk-shop-hide-arrows"> | `css/17-gk-shop-hide-arrows.css` |
| 7984 | <style id="gk-voice-leaves"> | `css/18-gk-voice-leaves.css` |
| 8005 | <style id="gk-unbox-range-overlap"> | `css/19-gk-unbox-range-overlap.css` |
| 8040 | <script id="gk-unbox-range-overlap-driver"> | `js/20-gk-unbox-range-overlap-driver.js` |
| 8068 | <style id="gk-header-dropdowns"> | `css/20-gk-header-dropdowns.css` |
| 8131 | <style id="gk-nav-panels"> | `css/21-gk-nav-panels.css` |
| 8253 | <script id="gk-nav-panels-driver"> | `js/21-gk-nav-panels-driver.js` |

Also extracted: 11 base64 fonts → `assets/fonts/`, and one 339 KB base64 JPEG (`.hero` background in `main.css`)
→ `assets/images/hero-bg-embedded.jpg`.

**Left in place on purpose:**
- `<template id="__bundler_thumbnail">` in `<head>` (an SVG thumbnail from the design tool; harmless).
- All inline SVG icons.
- **86 inline `style=""` attributes**, listed below (line numbers refer to the new `index.html`). You may want to move these into section CSS in Shopify.

<details><summary>Inline <code>style=""</code> attributes (86)</summary>

| Line | Element | Style |
|------|---------|-------|
| 87 | `<svg>` | `enable-background:new 0 0 512 512` |
| 91 | `<a>` | `--i:0` |
| 91 | `<a>` | `--i:1` |
| 91 | `<a>` | `--i:2` |
| 91 | `<a>` | `--i:3` |
| 91 | `<a>` | `--i:4` |
| 97 | `<section.hero>` | `position:relative;width:100%;display:flex;flex-direction:column;height:1189px;` |
| 99 | `<div.hero-slide>` | `background-image:url('./assets/images/hero-garden.png');` |
| 100 | `<div.hero-slide>` | `background-image:url('assets/images/hero-slide-2.jpg');` |
| 101 | `<div.hero-slide>` | `background-image:url('assets/images/hero-slide-3.jpg');` |
| 102 | `<div.hero-slide>` | `background-image:url('assets/images/hero-slide-4.jpg');` |
| 104 | `<div.hero-scrim>` | `height:100%;width:100%;left:0px;top:0px;position:absolute;` |
| 105 | `<div.topline>` | `background-color:#2F4E0E;` |
| 105 | `<strong>` | `font-weight:400;` |
| 108 | `<img>` | `width:100%;height:auto;aspect-ratio:1155/179;max-width:202px;` |
| 130 | `<div.pillnav>` | `background-color:#0000003B;` |
| 131 | `<a.active>` | `background-color:#4172112A;color:#FFFFFF;font-weight:400;font-size:13px;` |
| 132 | `<a>` | `font-weight:400;font-size:13px;` |
| 133 | `<a>` | `font-weight:400;font-size:13px;` |
| 134 | `<a>` | `font-weight:400;font-size:13px;` |
| 135 | `<a>` | `font-weight:400;font-size:13px;` |
| 140 | `<svg>` | `enable-background:new 0 0 512 512` |
| 140 | `<span>` | `font-size:13px;font-weight:400;` |
| 143 | `<a.login-btn>` | `background-color:#485547d4;` |
| 144 | `<span>` | `color:#FFFFFF;font-family:inter;font-size:13px;font-weight:400;` |
| 152 | `<div.hero-copy>` | `transform:translateY(clamp(-150px,-12vh,-60px));` |
| 153 | `<h1>` | `font-weight:300;` |
| 163 | `<section.unbox>` | `background-color:#F6F2E7;padding-top:200px;padding-bottom:535px;` |
| 166 | `<span.u-light>` | `color:#333333;` |
| 167 | `<p.unbox-sub>` | `font-family:inter;font-weight:400;font-size:16px;color:#969696;` |
| 173 | `<div.unbox-slide>` | `background-image:url('./assets/images/unbox-slide-1.jpg');` |
| 178 | `<div.unbox-slide>` | `background-image:url('./assets/images/unbox-slide-2.png');` |
| 183 | `<div.unbox-slide>` | `background-image:url('./adobestock_1003230309-mu6iyxtp-l08b.jpg');` |
| 208 | `<section.range>` | `background-color:#2A5126;padding:200px 0;position:relative;width:100%;max-width:100%;` |
| 209 | `<div.range-head>` | `display:block;width:100%;max-width:100%;padding-bottom:23px;` |
| 210 | `<h2>` | `color:#FFFFFF;width:100%;position:static;max-width:646px;font-size:clamp(30px,4vw,52px);te…` |
| 211 | `<p>` | `color:#FFFFFF;max-width:426px;font-weight:300;font-family:inter;` |
| 212 | `<a.range-buttonn>` | `color:#2A5126; background: #fff;` |
| 215 | `<div.range-card>` | `background-color:#3B6230;` |
| 231 | `<h3>` | `font-family:arpona;font-weight:400;font-size:21px;color:#FFFFFF;` |
| 242 | `<p.range-price>` | `color:#FFFFFF;` |
| 247 | `<div.range-card>` | `background-color:#3B6230;` |
| 262 | `<h3>` | `font-family:arpona;font-weight:400;font-size:21px;color:#FFFFFF;` |
| 273 | `<p.range-price>` | `color:#FFFFFF;` |
| 277 | `<div.range-card>` | `background-color:#3B6230;` |
| 292 | `<h3>` | `font-family:arpona;font-weight:400;font-size:21px;color:#FFFFFF;` |
| 303 | `<p.range-price>` | `color:#FFFFFF;` |
| 307 | `<div.range-card>` | `background-color:#3B6230;` |
| 322 | `<h3>` | `font-family:arpona;font-weight:400;font-size:21px;color:#FFFFFF;` |
| 333 | `<p.range-price>` | `color:#FFFFFF;` |
| 340 | `<section.story>` | `background-color:#FFFEF5;width:100%;` |
| 341 | `<div.story-media>` | `overflow:hidden;` |
| 341 | `<video>` | `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;` |
| 342 | `<div.story-content>` | `background-color:#FFFEF5;max-width:876px;` |
| 346 | `<p>` | `font-size:16px;font-weight:300;max-width:100%;` |
| 358 | `<h2>` | `text-transform:uppercase;` |
| 361 | `<div.shop-filters>` | `padding-top:0px;` |
| 374 | `<div.shop-card-media>` | `background-color:#FAF8E3;` |
| 390 | `<div.shop-card-media>` | `background-color:#FAF8E3;` |
| 406 | `<div.shop-card-media>` | `background-color:#FAF8E3;` |
| 422 | `<div.shop-card-media>` | `background-color:#FAF8E3;` |
| 444 | `<section.region>` | `background:url('./assets/images/region-section-bg.jpeg') center/cover no-repeat;display:gr…` |
| 445 | `<h2>` | `text-align:center;width:100%;max-width:1062px;display:block;padding-top:0px;text-transform…` |
| 446 | `<div.region-row>` | `display:flex;justify-content:center;align-items:stretch;align-self:center;position:static;…` |
| 468 | `<section.team>` | `background-color:#FFFEF5;` |
| 470 | `<h2>` | `text-transform:uppercase;` |
| 555 | `<section.quality>` | `padding-top:324px;padding-bottom:324px;background-color:#2A5126;position:relative;z-index:…` |
| 556 | `<video>` | `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;` |
| 557 | `<div>` | `position:absolute;inset:0;background:rgba(42,81,38,0.72);z-index:1;` |
| 558 | `<div.quality-inner>` | `position:relative;z-index:2;` |
| 559 | `<h2>` | `font-weight:400;font-size:30px;color:#FFFFFF;` |
| 560 | `<p>` | `font-weight:300;color:#FFFFFF;` |
| 561 | `<p>` | `font-weight:300;color:#FFFFFF;` |
| 566 | `<section.promo>` | `padding-top:0;padding-bottom:0;background-color:#FFFFF4;` |
| 571 | `<section.voices>` | `background-color:#FFFFF4;position:relative;z-index:2; box-shadow:0 -30px 60px rgba(20,30,1…` |
| 573 | `<h2>` | `text-transform:uppercase;` |
| 576 | `<figure.voice-card>` | `background-color:#FAF8E3;` |
| 581 | `<p.voice-foot>` | `width:336px;height:47px;` |
| 583 | `<figure.voice-card>` | `background-color:#FAF8E3;` |
| 588 | `<p.voice-foot>` | `width:336px;height:47px;` |
| 599 | `<video>` | `width:100%;height:100%;display:block;background:#000;` |
| 638 | `<a.range-button>` | `background-color:#2A5126;color:#fff;` |
| 655 | `<footer.site-footer>` | `padding-bottom:10px;padding-top:150px;` |
| 671 | `<h3>` | `cursor:pointer;` |
| 682 | `<h3>` | `cursor:pointer;` |
| 693 | `<h3>` | `cursor:pointer;` |
</details>

## 6. Deleted files and `_review/`

**Deleted (33 files).** Only macOS junk, plus files that are byte-identical to a file that was kept **and** are
referenced by nothing (not by the page, and not by any draft). Everything is still in git history
(tag `original-approved-version`).

| Deleted | Reason |
|---------|--------|
| `.DS_Store` | macOS junk file |
| `296dcfbd-870e-4b69-b790-fa2555fab349-mu6hmwcv-iykq.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `296dcfbd-870e-4b69-b790-fa2555fab349-mu6hn0pp-ccl0.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `296dcfbd-870e-4b69-b790-fa2555fab349-mu6hnan5-rwjb.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `296dcfbd-870e-4b69-b790-fa2555fab349-mu6q1edw-vcq6.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `adobestock_273992041-mu6rjjt5-ol4k.jpeg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `adobestock_273992041-mu6rlbu6-gwb7.jpeg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `adobestock_273992041-mu6rmft5-8yl7.jpeg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `adobestock_74532598-mu6nasnk-df98.jpeg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `chatgpt-image-sep-18-2026-01_53_59-pm-mu6riqhr-ong7.png` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `chatgpt-image-sep-18-2026-10_22_53-am-mu6hgsy9-5ppw.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `chatgpt-image-sep-18-2026-11_48_08-am-mu6ovo3a-325w.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `chatgpt-image-sep-18-2026-11_57_22-am-mu6q3q7v-9wuz.png` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `goodricke-icon_white-mu70ejz3-gx0y.png` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `khaass-pack.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/AdobeStock_1003230309.jpeg` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/AdobeStock_1003230309.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/AdobeStock_1512151696.jpeg` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/ChatGPT Image Sep 17, 2026, 05_34_32 PM.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/ChatGPT Image Sep 17, 2026, 05_35_59 PM.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/ChatGPT Image Sep 17, 2026, 05_37_07 PM.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/ChatGPT Image Sep 18, 2026, 08_01_19 AM.png` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `uploads/ChatGPT Image Sep 18, 2026, 10_22_53 AM-1ed197b0.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/ChatGPT Image Sep 18, 2026, 10_22_53 AM.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/Goodricke Icon_Green.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/Mask group.jpg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `uploads/Tertiary Logo_Green.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/Tertiary Logo_White.svg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `uploads/pasted-1789646258263-0.png` | byte-identical duplicate, unreferenced; kept a copy in assets/ (used by the page) |
| `uploads/product-48(1).jpg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `uploads/product-49.jpg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `uploads/product-50.jpg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |
| `uploads/product-51.jpg` | byte-identical duplicate, unreferenced; kept the copy kept in _review |

**Moved to `_review/` (176 files).** Nothing here is used by `index.html`. It's kept because it might matter
(older page versions, source artwork, unused images). The draft pages in `_review/pages/` are archived as they were,
and their image links no longer resolve from there. Review, then delete what you don't need:

- `_review/pages/`: `goodricke-homepage-final.html` ("Goodricke Homepage (final).html"), `goodricke-homepage-old.html`,
  `goodricke-homepage-header.html` + `goodricke-homepage-header-files/`, `designoverlap.html`,
  `doctype-html-draft.html` (was `<!doctype html>.html`, a filename that's invalid on Windows), `uploads-index.html`,
  the old redirect `index-redirect.html`, and the original single-file page.
  The live/deployed page was `Goodricke Homepage.html` (Dockerfile and the old index redirect both pointed to it), so that's the one reorganized here.
- `_review/images/`: 132 images not referenced by the page (the `uploads-` prefix marks files from the old `uploads/` folder).
- `_review/dev-screenshots/`: screenshots from design iterations.
- `_review/design-source/khaass-pack.psd`: Photoshop source.

<details><summary>Every move into <code>_review/</code></summary>

| Old path | New path |
|----------|----------|
| `Goodricke Homepage Header_files/296dcfbd-870e-4b69-b790-fa2555fab349-mu6hn54k-pbmq_KHC2.png` | `_review/pages/goodricke-homepage-header-files/296dcfbd-870e-4b69-b790-fa2555fab349-mu6hn54k-pbmq-khc2.png` |
| `Goodricke Homepage Header_files/Tertiary Logo_Green-d3d24e6f_KHC2.png` | `_review/pages/goodricke-homepage-header-files/tertiary-logo-green-d3d24e6f-khc2.png` |
| `Goodricke Homepage Header_files/assam_KHC2.png` | `_review/pages/goodricke-homepage-header-files/assam-khc2.png` |
| `Goodricke Homepage Header_files/chatgpt-image-sep-18--2026--02_25_58-pm-mu6qf62a-albw_KHC2.png` | `_review/pages/goodricke-homepage-header-files/chatgpt-image-sep-18-2026-02-25-58-pm-mu6qf62a-albw-khc2.png` |
| `Goodricke Homepage Header_files/chatgpt-image-sep-18-2026-11_48_08-am-mu6phsg3-lay4_KHC2.png` | `_review/pages/goodricke-homepage-header-files/chatgpt-image-sep-18-2026-11-48-08-am-mu6phsg3-lay4-khc2.png` |
| `Goodricke Homepage Header_files/chatgpt-image-sep-18-2026-11_48_08-am-mu6pys2u-ikqg_KHC2.png` | `_review/pages/goodricke-homepage-header-files/chatgpt-image-sep-18-2026-11-48-08-am-mu6pys2u-ikqg-khc2.png` |
| `Goodricke Homepage Header_files/chatgpt-image-sep-18-2026-11_50_25-am-mu6phmwl-srck_KHC2.png` | `_review/pages/goodricke-homepage-header-files/chatgpt-image-sep-18-2026-11-50-25-am-mu6phmwl-srck-khc2.png` |
| `Goodricke Homepage Header_files/chatgpt-image-sep-18-2026-11_50_25-am-mu6q0s0i-1b90_KHC2.png` | `_review/pages/goodricke-homepage-header-files/chatgpt-image-sep-18-2026-11-50-25-am-mu6q0s0i-1b90-khc2.png` |
| `Goodricke Homepage Header_files/chatgpt-image-sep-18-2026-11_51_51-am-mu6pt1qv-ey9o_KHC2.png` | `_review/pages/goodricke-homepage-header-files/chatgpt-image-sep-18-2026-11-51-51-am-mu6pt1qv-ey9o-khc2.png` |
| `Goodricke Homepage Header_files/chatgpt-image-sep-18-2026-11_53_30-am-mu6pi71r-ip4a_KHC2.png` | `_review/pages/goodricke-homepage-header-files/chatgpt-image-sep-18-2026-11-53-30-am-mu6pi71r-ip4a-khc2.png` |
| `Goodricke Homepage Header_files/darjeeling_KHC2.png` | `_review/pages/goodricke-homepage-header-files/darjeeling-khc2.png` |
| `Goodricke Homepage Header_files/dooars_KHC2.png` | `_review/pages/goodricke-homepage-header-files/dooars-khc2.png` |
| `Goodricke Homepage Header_files/goodricke-icon-green_KHC2.png` | `_review/pages/goodricke-homepage-header-files/goodricke-icon-green-khc2.png` |
| `Goodricke Homepage Header_files/goodricke-icon_white-mu70ejz3-gx0y_KHC2.png` | `_review/pages/goodricke-homepage-header-files/goodricke-icon-white-mu70ejz3-gx0y-khc2.png` |
| `Goodricke Homepage Header_files/goodricke-wordmark-green_KHC2.png` | `_review/pages/goodricke-homepage-header-files/goodricke-wordmark-green-khc2.png` |
| `Goodricke Homepage Header_files/goodway-hero-video_KHC2.mp4` | `_review/pages/goodricke-homepage-header-files/goodway-hero-video-khc2.mp4` |
| `Goodricke Homepage Header_files/khaass-pack2_KHC2.jpg` | `_review/pages/goodricke-homepage-header-files/khaass-pack2-khc2.jpg` |
| `Goodricke Homepage Header_files/khaass-pack3_KHC2.jpg` | `_review/pages/goodricke-homepage-header-files/khaass-pack3-khc2.jpg` |
| `Goodricke Homepage Header_files/khaass-pack4_KHC2.jpg` | `_review/pages/goodricke-homepage-header-files/khaass-pack4-khc2.jpg` |
| `Goodricke Homepage Header_files/secondary-logo_white-mu5rs8bf-ngry_KHC2.png` | `_review/pages/goodricke-homepage-header-files/secondary-logo-white-mu5rs8bf-ngry-khc2.png` |
| `Goodricke Homepage Header_files/team-portrait_KHC2.png` | `_review/pages/goodricke-homepage-header-files/team-portrait-khc2.png` |
| `Goodricke Homepage Header_files/tertiary-logo_white-mu5smfso-frvh_KHC2.svg` | `_review/pages/goodricke-homepage-header-files/tertiary-logo-white-mu5smfso-frvh-khc2.svg` |
| `story-cup.jpg` | `_review/images/story-cup.jpg` |
| `tertiary-logo_white-mu5smfso-frvh.svg` | `_review/images/tertiary-logo-white-mu5smfso-frvh.svg` |
| `uploads/Tertiary Logo_Green-d3d24e6f.png` | `_review/images/uploads-tertiary-logo-green-d3d24e6f.png` |
| `.thumbnail` | `_review/misc/thumbnail.png` |
| `03_chai_ctc_dust-mu6fm9e8-0n8i.png` | `_review/images/03-chai-ctc-dust-mu6fm9e8-0n8i.png` |
| `07_khaass_box_1-mu6flapy-5w0s.png` | `_review/images/07-khaass-box-1-mu6flapy-5w0s.png` |
| `10_roasted_darjeeling_jar-mu6flijn-3h1p.png` | `_review/images/10-roasted-darjeeling-jar-mu6flijn-3h1p.png` |
| `16_thurbo_whole_leaf_box_2-mu6flr60-j2bs.png` | `_review/images/16-thurbo-whole-leaf-box-2-mu6flr60-j2bs.png` |
| `19_castleton_black_tin-mu6fm1fd-6mgz.png` | `_review/images/19-castleton-black-tin-mu6fm1fd-6mgz.png` |
| `1kg-mu5n0ntf-qfzb.jpg` | `_review/images/1kg-mu5n0ntf-qfzb.jpg` |
| `1kg-mu6d0lc1-sfpq.png` | `_review/images/1kg-mu6d0lc1-sfpq.png` |
| `20-mu5t06z6-9uy3.png` | `_review/images/20-mu5t06z6-9uy3.png` |
| `<!doctype html>.html` | `_review/pages/doctype-html-draft.html` |
| `Claude outputs/expand_sequence.png` | `_review/dev-screenshots/claude-outputs/expand-sequence.png` |
| `Claude outputs/overlap_0.png` | `_review/dev-screenshots/claude-outputs/overlap-0.png` |
| `Claude outputs/overlap_350.png` | `_review/dev-screenshots/claude-outputs/overlap-350.png` |
| `Claude outputs/overlap_700.png` | `_review/dev-screenshots/claude-outputs/overlap-700.png` |
| `Claude outputs/se_sequence.png` | `_review/dev-screenshots/claude-outputs/se-sequence.png` |
| `Claude outputs/sticky_d1440.png` | `_review/dev-screenshots/claude-outputs/sticky-d1440.png` |
| `Claude outputs/sticky_m390_open.png` | `_review/dev-screenshots/claude-outputs/sticky-m390-open.png` |
| `Goodricke Homepage (final).html` | `_review/pages/goodricke-homepage-final.html` |
| `Goodricke Homepage Header.html` | `_review/pages/goodricke-homepage-header.html` |
| `Goodricke Homepage_old.html` | `_review/pages/goodricke-homepage-old.html` |
| `adobestock_1003230309-mu6iyxtp-l08b.png` | `_review/images/adobestock-1003230309-mu6iyxtp-l08b.png` |
| `adobestock_1022704315-mu6de0e5-ppii.jpeg` | `_review/images/adobestock-1022704315-mu6de0e5-ppii.jpeg` |
| `adobestock_1512151696-mu5in9sh-f8bf.jpeg` | `_review/images/adobestock-1512151696-mu5in9sh-f8bf.jpeg` |
| `adobestock_1512151696-mu5vrhyg-48x6.jpeg` | `_review/images/adobestock-1512151696-mu5vrhyg-48x6.jpeg` |
| `adobestock_2001049197-mu6fgqn4-34ls.png` | `_review/images/adobestock-2001049197-mu6fgqn4-34ls.png` |
| `adobestock_273992041-mu5io0uy-8yh3.jpeg` | `_review/images/adobestock-273992041-mu5io0uy-8yh3.jpeg` |
| `adobestock_273992041-mu6s3eil-sxki.png` | `_review/images/adobestock-273992041-mu6s3eil-sxki.png` |
| `adobestock_273992041-mu6s46u9-vbu1.png` | `_review/images/adobestock-273992041-mu6s46u9-vbu1.png` |
| `adobestock_273992041-mu6s4g0i-ryqg.png` | `_review/images/adobestock-273992041-mu6s4g0i-ryqg.png` |
| `adobestock_492737037-1-mu6qmkpr-3u3n.jpg` | `_review/images/adobestock-492737037-1-mu6qmkpr-3u3n.jpg` |
| `adobestock_630955967-mu5vsi86-49et.jpeg` | `_review/images/adobestock-630955967-mu5vsi86-49et.jpeg` |
| `adobestock_74532598-mu5ioqsp-ixo5.jpeg` | `_review/images/adobestock-74532598-mu5ioqsp-ixo5.jpeg` |
| `chatgpt-image-sep-18--2026--02_25_58-pm-mu6qb0la-bq5g.png` | `_review/images/chatgpt-image-sep-18-2026-02-25-58-pm-mu6qb0la-bq5g.png` |
| `chatgpt-image-sep-18-2026-01_53_59-pm-mu6ozqfu-lan0.png` | `_review/images/chatgpt-image-sep-18-2026-01-53-59-pm-mu6ozqfu-lan0.png` |
| `chatgpt-image-sep-18-2026-08_01_19-am-1-mu6cs8qm-nwgp.png` | `_review/images/chatgpt-image-sep-18-2026-08-01-19-am-1-mu6cs8qm-nwgp.png` |
| `chatgpt-image-sep-18-2026-08_01_19-am-1-mu6ctcgu-dfoc.png` | `_review/images/chatgpt-image-sep-18-2026-08-01-19-am-1-mu6ctcgu-dfoc.png` |
| `chatgpt-image-sep-18-2026-11_54_32-am-mu6ps9qr-y4cd.png` | `_review/images/chatgpt-image-sep-18-2026-11-54-32-am-mu6ps9qr-y4cd.png` |
| `chatgpt-image-sep-18-2026-11_57_22-am-mu6ps0y0-l52y.png` | `_review/images/chatgpt-image-sep-18-2026-11-57-22-am-mu6ps0y0-l52y.png` |
| `chatgpt-image-sep-18-2026-12_01_36-pm-mu6ovd7p-p3jo.png` | `_review/images/chatgpt-image-sep-18-2026-12-01-36-pm-mu6ovd7p-p3jo.png` |
| `designoverlap.html` | `_review/pages/designoverlap.html` |
| `doowdars-mu6fnzsx-fxfe.jpg` | `_review/images/doowdars-mu6fnzsx-fxfe.jpg` |
| `goodricke-icon_green-mu6nxaxk-e0ok.svg` | `_review/images/goodricke-icon-green-mu6nxaxk-e0ok.svg` |
| `goodricke-icon_green-mu6nzmn8-kuci.svg` | `_review/images/goodricke-icon-green-mu6nzmn8-kuci.svg` |
| `goodricke-icon_white-mu6whnb1-68x1.png` | `_review/images/goodricke-icon-white-mu6whnb1-68x1.png` |
| `gr_chai_1kg_dust-2500x2500_px-mu5t0izu-4c5k.jpg` | `_review/images/gr-chai-1kg-dust-2500x2500-px-mu5t0izu-4c5k.jpg` |
| `gr_sc_1kg_pack-mu5n0un8-tvsh.png` | `_review/images/gr-sc-1kg-pack-mu5n0un8-tvsh.png` |
| `images/footer-logo.svg` | `_review/images/footer-logo.svg` |
| `images/p-lotion.jpg` | `_review/images/p-lotion.jpg` |
| `images/p-scrub.jpg` | `_review/images/p-scrub.jpg` |
| `images/p-tonic.jpg` | `_review/images/p-tonic.jpg` |
| `images/p-vetyver.jpg` | `_review/images/p-vetyver.jpg` |
| `khaass-pack.psd` | `_review/design-source/khaass-pack.psd` |
| `look-4-mu5gtr46-r1wg.webp` | `_review/images/look-4-mu5gtr46-r1wg.webp` |
| `look-4-mu5hoa34-u60q.webp` | `_review/images/look-4-mu5hoa34-u60q.webp` |
| `roastedjar250g-front-mu5n0fr2-znfh.jpg` | `_review/images/roastedjar250g-front-mu5n0fr2-znfh.jpg` |
| `roastedjar250g-front-mu6d1a24-nypv.png` | `_review/images/roastedjar250g-front-mu6d1a24-nypv.png` |
| `screenshots/01-hero-slide.png` | `_review/dev-screenshots/01-hero-slide.png` |
| `screenshots/01-hero-slide2.png` | `_review/dev-screenshots/01-hero-slide2.png` |
| `screenshots/02-hero-slide.png` | `_review/dev-screenshots/02-hero-slide.png` |
| `screenshots/02-hero-slide2.png` | `_review/dev-screenshots/02-hero-slide2.png` |
| `screenshots/03-hero-slide.png` | `_review/dev-screenshots/03-hero-slide.png` |
| `screenshots/03-hero-slide2.png` | `_review/dev-screenshots/03-hero-slide2.png` |
| `screenshots/mobile-check.png` | `_review/dev-screenshots/mobile-check.png` |
| `secondary-logo_black-mu5rqm8c-ou4v.png` | `_review/images/secondary-logo-black-mu5rqm8c-ou4v.png` |
| `supercupgold1kg-01-mu5mkfni-ik46.jpg` | `_review/images/supercupgold1kg-01-mu5mkfni-ik46.jpg` |
| `supercupgold1kg-01-mu6d1s75-4wln.png` | `_review/images/supercupgold1kg-01-mu6d1s75-4wln.png` |
| `thurbo_250g_carton-01-mu5n05tr-o20o.jpg` | `_review/images/thurbo-250g-carton-01-mu5n05tr-o20o.jpg` |
| `unbox-model.png` | `_review/images/unbox-model.png` |
| `uploads/Goodricke-Icon_White.png` | `_review/images/uploads-goodricke-icon-white.png` |
| `uploads/draw-8c614b55-7af3-42a1-b58c-93658f421537.png` | `_review/images/uploads-draw-8c614b55-7af3-42a1-b58c-93658f421537.png` |
| `uploads/icons.svg` | `_review/images/uploads-icons.svg` |
| `uploads/index.html` | `_review/pages/uploads-index.html` |
| `uploads/pasted-1789645479512-0.png` | `_review/images/uploads-pasted-1789645479512-0.png` |
| `uploads/pasted-1789645814979-0.png` | `_review/images/uploads-pasted-1789645814979-0.png` |
| `uploads/pasted-1789645821387-0.png` | `_review/images/uploads-pasted-1789645821387-0.png` |
| `uploads/pasted-1789646029666-0.png` | `_review/images/uploads-pasted-1789646029666-0.png` |
| `uploads/pasted-1789646230676-0.png` | `_review/images/uploads-pasted-1789646230676-0.png` |
| `uploads/pasted-1789646890009-0.png` | `_review/images/uploads-pasted-1789646890009-0.png` |
| `uploads/pasted-1789647354035-0.png` | `_review/images/uploads-pasted-1789647354035-0.png` |
| `uploads/pasted-1789648246296-0.png` | `_review/images/uploads-pasted-1789648246296-0.png` |
| `uploads/pasted-1789649759542-0.png` | `_review/images/uploads-pasted-1789649759542-0.png` |
| `uploads/pasted-1789661023832-0.png` | `_review/images/uploads-pasted-1789661023832-0.png` |
| `uploads/pasted-1789661140046-0.png` | `_review/images/uploads-pasted-1789661140046-0.png` |
| `uploads/pasted-1789661166677-0.png` | `_review/images/uploads-pasted-1789661166677-0.png` |
| `uploads/pasted-1789661273012-0.png` | `_review/images/uploads-pasted-1789661273012-0.png` |
| `uploads/pasted-1789664352714-0.png` | `_review/images/uploads-pasted-1789664352714-0.png` |
| `uploads/pasted-1789664396059-0.png` | `_review/images/uploads-pasted-1789664396059-0.png` |
| `uploads/pasted-1789665108810-0.png` | `_review/images/uploads-pasted-1789665108810-0.png` |
| `uploads/pasted-1789665296117-0.png` | `_review/images/uploads-pasted-1789665296117-0.png` |
| `uploads/pasted-1789665343842-0.png` | `_review/images/uploads-pasted-1789665343842-0.png` |
| `uploads/pasted-1789665939390-0.png` | `_review/images/uploads-pasted-1789665939390-0.png` |
| `uploads/pasted-1789667287059-0.png` | `_review/images/uploads-pasted-1789667287059-0.png` |
| `uploads/pasted-1789674128204-0.png` | `_review/images/uploads-pasted-1789674128204-0.png` |
| `uploads/pasted-1789699060810-0.png` | `_review/images/uploads-pasted-1789699060810-0.png` |
| `uploads/pasted-1789707254616-0.png` | `_review/images/uploads-pasted-1789707254616-0.png` |
| `uploads/pasted-1789707411664-0.png` | `_review/images/uploads-pasted-1789707411664-0.png` |
| `uploads/pasted-1789709014713-0.png` | `_review/images/uploads-pasted-1789709014713-0.png` |
| `uploads/pasted-1789709402509-0.png` | `_review/images/uploads-pasted-1789709402509-0.png` |
| `uploads/pasted-1789709865338-0.png` | `_review/images/uploads-pasted-1789709865338-0.png` |
| `uploads/pasted-1789710159496-0.png` | `_review/images/uploads-pasted-1789710159496-0.png` |
| `uploads/pasted-1789710168007-0.png` | `_review/images/uploads-pasted-1789710168007-0.png` |
| `uploads/pasted-1789710212203-0.png` | `_review/images/uploads-pasted-1789710212203-0.png` |
| `uploads/pasted-1789710637308-0.png` | `_review/images/uploads-pasted-1789710637308-0.png` |
| `uploads/pasted-1789710671395-0.png` | `_review/images/uploads-pasted-1789710671395-0.png` |
| `uploads/pasted-1789716360062-0.png` | `_review/images/uploads-pasted-1789716360062-0.png` |
| `uploads/pasted-1789717299335-0.png` | `_review/images/uploads-pasted-1789717299335-0.png` |
| `uploads/pasted-1789717308311-0.png` | `_review/images/uploads-pasted-1789717308311-0.png` |
| `uploads/pasted-1789718261738-0.png` | `_review/images/uploads-pasted-1789718261738-0.png` |
| `uploads/pasted-1789718332545-0.png` | `_review/images/uploads-pasted-1789718332545-0.png` |
| `uploads/pasted-1789718784534-0.png` | `_review/images/uploads-pasted-1789718784534-0.png` |
| `uploads/pasted-1789718808034-0.png` | `_review/images/uploads-pasted-1789718808034-0.png` |
| `uploads/pasted-1789719146682-0.png` | `_review/images/uploads-pasted-1789719146682-0.png` |
| `uploads/pasted-1789719218440-0.png` | `_review/images/uploads-pasted-1789719218440-0.png` |
| `uploads/pasted-1789719329199-0.png` | `_review/images/uploads-pasted-1789719329199-0.png` |
| `uploads/pasted-1789719967222-0.png` | `_review/images/uploads-pasted-1789719967222-0.png` |
| `uploads/pasted-1789720240139-0.png` | `_review/images/uploads-pasted-1789720240139-0.png` |
| `uploads/pasted-1789720332242-0.png` | `_review/images/uploads-pasted-1789720332242-0.png` |
| `uploads/pasted-1789720416987-0.png` | `_review/images/uploads-pasted-1789720416987-0.png` |
| `uploads/pasted-1789734313183-0.png` | `_review/images/uploads-pasted-1789734313183-0.png` |
| `uploads/pasted-1789734626548-0.png` | `_review/images/uploads-pasted-1789734626548-0.png` |
| `uploads/pasted-1789734821730-0.png` | `_review/images/uploads-pasted-1789734821730-0.png` |
| `uploads/pasted-1789734914666-0.png` | `_review/images/uploads-pasted-1789734914666-0.png` |
| `uploads/pasted-1789738708884-0.png` | `_review/images/uploads-pasted-1789738708884-0.png` |
| `uploads/pasted-1789739088973-0.png` | `_review/images/uploads-pasted-1789739088973-0.png` |
| `uploads/pasted-1789739155266-0.png` | `_review/images/uploads-pasted-1789739155266-0.png` |
| `uploads/pasted-1789739445607-0.png` | `_review/images/uploads-pasted-1789739445607-0.png` |
| `uploads/pasted-1789739580872-0.png` | `_review/images/uploads-pasted-1789739580872-0.png` |
| `uploads/pasted-1789740704783-0.png` | `_review/images/uploads-pasted-1789740704783-0.png` |
| `uploads/pasted-1789740713963-0.png` | `_review/images/uploads-pasted-1789740713963-0.png` |
| `uploads/pasted-1789754570564-0.png` | `_review/images/uploads-pasted-1789754570564-0.png` |
| `uploads/pasted-1789754737825-0.png` | `_review/images/uploads-pasted-1789754737825-0.png` |
| `uploads/pasted-1789755241115-0.png` | `_review/images/uploads-pasted-1789755241115-0.png` |
| `uploads/pasted-1789790589269-0.png` | `_review/images/uploads-pasted-1789790589269-0.png` |
| `uploads/pasted-1789790598619-0.png` | `_review/images/uploads-pasted-1789790598619-0.png` |
| `uploads/pasted-1789791139257-0.png` | `_review/images/uploads-pasted-1789791139257-0.png` |
| `uploads/pasted-1789791271235-0.png` | `_review/images/uploads-pasted-1789791271235-0.png` |
| `uploads/pasted-1789791332811-0.png` | `_review/images/uploads-pasted-1789791332811-0.png` |
| `uploads/pasted-1789791346415-0.png` | `_review/images/uploads-pasted-1789791346415-0.png` |
| `uploads/pasted-1789791357044-0.png` | `_review/images/uploads-pasted-1789791357044-0.png` |
| `uploads/pasted-1789791565648-0.png` | `_review/images/uploads-pasted-1789791565648-0.png` |
| `uploads/pasted-1789791909212-0.png` | `_review/images/uploads-pasted-1789791909212-0.png` |
| `uploads/pasted-1789798628904-0.png` | `_review/images/uploads-pasted-1789798628904-0.png` |
| `uploads/pasted-1789798724278-0.png` | `_review/images/uploads-pasted-1789798724278-0.png` |
| `uploads/pasted-1789799618108-0.png` | `_review/images/uploads-pasted-1789799618108-0.png` |
| `uploads/pasted-1789799780243-0.png` | `_review/images/uploads-pasted-1789799780243-0.png` |
| `uploads/pasted-1789799965622-0.png` | `_review/images/uploads-pasted-1789799965622-0.png` |
| `uploads/pasted-1789800026467-0.png` | `_review/images/uploads-pasted-1789800026467-0.png` |
| `uploads/pasted-1789800555067-0.png` | `_review/images/uploads-pasted-1789800555067-0.png` |
| `uploads/pasted-1789800621091-0.png` | `_review/images/uploads-pasted-1789800621091-0.png` |
| `uploads/pasted-1789801277045-0.png` | `_review/images/uploads-pasted-1789801277045-0.png` |
| `uploads/pasted-1789801431547-0.png` | `_review/images/uploads-pasted-1789801431547-0.png` |
</details>

## 7. External dependencies / CDN links

**None.** The page loads no CDN scripts, stylesheets or Google Fonts. All fonts are self-hosted.
The only external URLs are ordinary links (Instagram profile and posts).

## 8. Verification results

- **Broken-link check** (`python3 docs/check-links.py`, which checks every `src`/`href`/`poster`/`data-img`/`url()` in HTML, CSS and JS):
  113 local references, **1 broken, and it was already broken in the approved version**:
  `index.html` unbox slide 3 → `./adobestock_1003230309-mu6iyxtp-l08b.jpg`. That file never existed at the root
  (only `uploads/adobestock_1003230309-mu6iyxtp-l08b.jpg`, now `assets/images/hero-slide-2.jpg`, and a `.png` version, now in `_review/images/`).
  It was left untouched, because fixing it would change how the page looks. **Awaiting a decision from the brand.**
- **Round-trip check:** re-inlining every CSS/JS file, re-embedding the fonts and the hero JPEG, and restoring the old
  paths reproduces the original `Goodricke Homepage.html` **exactly**, apart from the `./` prefix of two CSS `url()` paths.
- **Screenshots** (Playwright/Chromium, clock frozen, videos paused, full page) of the original backup vs. the new version:
  - Desktop 1440px: same page height (13040px); 0.08% of pixels differ, all inside the hero headline (x 186–678, y 353–635).
    Two runs of the *original* against each other differ in the same area by the same amount (animation anti-aliasing), so this is noise, not a change.
  - Mobile 390px: same height (9819px); 0.10% differ, again only in the hero headline noise band.
  - Shop mega-menu opened and hovered to "Assam Tea" (tests the image-swap script): **0 pixels differ**, and the preview image swaps correctly.
  - Scrolled mobile view: **0 pixels differ**.
  - Screenshots are in `docs/verification/` (orig-* vs new-*).
- **Console:** no JavaScript errors in either version. The only console error in both is the 404 above.
  Font faces loaded (Arpona 400/600, Inter normal/italic) are the same in both.

## 9. Shopify handoff notes

Shopify themes keep all CSS, JS, images and fonts in one **flat** `assets/` folder and reference them with
`{{ 'file.css' | asset_url }}`.

**Files that go into the Shopify `assets/` folder** (92 files: `css/*`, `js/*`, `assets/fonts/*`, `assets/images/*`, `assets/media/*`).
**Filename collisions after flattening: none.** Every basename is unique, and the numbered CSS/JS prefixes (`01-…`) keep them apart.

What has to change when you move to Shopify:
1. **CSS `url()` paths**: in a flat folder, `../assets/images/x.png` and `../assets/fonts/x.otf` become just `x.png` / `x.otf`
   (same folder), or rename the file to `.css.liquid` and use `{{ 'x.png' | asset_url }}`. Affected: `css/fonts.css` (11 fonts) and `css/main.css` (4 images).
2. **HTML paths** (`src`, `poster`, `data-img`, inline `background-image:url(...)`) → `{{ 'x.png' | asset_url }}`,
   or better, section/block settings with `image_url` so the client can swap images.
   Keep the nav-panel `data-img` and well `<img src>` in the same form, because the script compares the two strings.
3. **Load order**: include the stylesheets and scripts in the order in §2 (`fonts.css`, `main.css`, `01…21`). Scripts 01–04 were in `<head>`.
   Merging the numbered overrides into one file is safe **only in the same order**.
4. **Heavy media**: videos (up to 12.3 MB) and several multi-MB PNGs (e.g. `unbox-slide-2.png` 6.5 MB) are better uploaded to
   *Content → Files* (Shopify CDN) than kept in theme assets, which have per-file size limits.
5. **Deployment files** (`Dockerfile`, `nginx.conf`, `CNAME`, `.github/workflows/`) only host the static demo at demo.webricke.in.
   They're not needed in Shopify. (The Dockerfile's old "rename Goodricke Homepage.html → index.html" step was removed,
   because the page is now `index.html`. The old URL `/Goodricke%20Homepage.html` no longer exists.)

**Page sections that map naturally to Shopify sections** (`index.html` line → suggested section):

| Line | Element | Suggested Shopify section |
|------|---------|---------------------------|
| 50 | `div.nav-panels` (Shop / Our Gardens mega-menu) | `header` (mega-menu blocks) |
| 82 | `header.stickybar` (sticky header + mobile menu) | `header` |
| 97 | `section.hero` (topline, logo, pill nav, 4-image slider, headline, CTAs) | `announcement-bar` + `hero-slideshow` |
| 163 | `section.unbox` ("Unbox More Than Tea", 3-image slider) | `image-slider-with-text` |
| 208 | `section.range` ("Whole body health starts in the gut", 4 product cards) | `featured-collection` (range) |
| 340 | `section.story` (background video + wordmark, "Watch story" modal) | `video-story` |
| 356 | `section.shop` ("Bestsellers Rooted in Nature", 4-product carousel) | `featured-collection` (bestsellers) |
| 444 | `section.region` ("Every cup begins in a…" Assam / Darjeeling / Dooars) | `collection-list` / `region-cards` |
| 468 | `section.team` ("Products For You", auto-scrolling Khaass cards) | `product-carousel` |
| 555 | `section.quality` ("High Quality Goodricke Tea", video) | `video-banner` |
| 566 | `section.promo` (scroll crossfade) | `promo-crossfade` |
| 571 | `section.voices` ("Loved by Thousands", testimonials with leaf ratings) | `testimonials` |
| 604 | `section.insta-section` ("From Our Instagram", 4 reels) | `instagram-reels` |
| 655 | `footer.site-footer` ("Be the first to know" newsletter, links, disclaimer) | `footer` + `newsletter` |
