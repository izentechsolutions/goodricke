# Goodricke Website: Home, PLP and PDP

The final Goodricke static site, organised and optimised for handoff (for example to a Shopify developer).
It keeps the **approved home-page theme** plus the later improvements, such as the dark-green fill on product cards on hover.

| Page | File | What it is |
|------|------|-----------|
| Home | `index.html` | Approved home page |
| Product listing (PLP) | `plp.html` | All teas, with filter & sort and the bag drawer |
| Product detail (PDP) | `pdp.html` | Estate Gift Set: gallery, weights, tabs, reviews, frequently bought together |

Run it locally from the project root with `python3 -m http.server` and open <http://localhost:8000/>.
Use a server rather than `file://`, because the CSS uses relative URLs.

---

## 1. Folder structure

```
index.html  plp.html  pdp.html     pages (readable, not minified)
css/
  home.css  plp.css  pdp.css      one stylesheet per page, GENERATED from src/style.css (do not edit)
js/
  common.js                        shared by all pages
  home.js  plp.js  pdp.js          page-specific behaviour
assets/
  fonts/                           11 WOFF2 fonts (Arpona ×9, Inter variable ×2)
  images/                          WebP images (+ "-m" mobile versions) and og-image.jpg
  media/                           MP4 videos (+ small "-preview" clips for the PDP story circles)
src/style.css                      the editable source for all CSS
build/build-css.js                 builds css/*.css from src/style.css   (npm run build:css)
build/check-links.py               verifies every file reference exists  (python3 build/check-links.py)
build/dedupe-css.js                one-off cleanup: removes overridden duplicate CSS (see §2)
package.json                       build tooling only (not needed to run the site)
Dockerfile, nginx.conf, .github/   demo hosting (Cloud Run / GitHub Pages)
```

Nothing is minified. The Shopify team can read and edit every file.
Shopify and nginx compress files when they serve them, so minifying would gain little.

## 2. CSS: how it works

- `src/style.css` holds all the styles in their original cascade order:
  - fonts;
  - the approved home styles, with overrides 01–21 in order;
  - product box, bag drawer and filter styles;
  - PLP and PDP styles;
  - the final consistency passes.
- `npm run build:css` writes one file per page, keeping only the rules that page's HTML and JS use.
  It runs PurgeCSS; class names toggled by JS are found as strings in the page's JS.
  PLP and PDP also get the few Bootstrap 5.3.8 rules they use (reboot, `container`, `row`, `col-*`, `visually-hidden`).
  That removes the Bootstrap CDN entirely; no page loads any external file.
- **Duplicate rules removed:** `Goodricke_Website` had merged two versions of the main stylesheet, so many rules existed twice and the later one always won.
  `build/dedupe-css.js` removed 3,281 such overridden declarations, 16 duplicate `@keyframes` and 820 rules left empty, taking `src/style.css` from 440 KB to 316 KB.
  It only removes a declaration when a later rule with the identical selector, in the identical `@media`/`@supports` context and at equal or higher importance, sets the same property to a browser-valid value. By the cascade, the removed declaration could never apply.
  Verified: the computed styles of all 145,038 element/pseudo-element styles across 3 pages × 3 widths × up to 10 states match the version before the cleanup.
- **Edit `src/style.css`, then run the build.** Never edit `css/*.css` directly. To install the build tools once: `npm install`.
- Each page loads exactly one stylesheet: `css/home.css`, `css/plp.css` or `css/pdp.css`.

## 3. JavaScript

Every block in these files is one of the original modules, unchanged and in its original order. Each is wrapped in `try/catch`, so an error in one module can't stop the others.

| File | Modules |
|------|---------|
| `js/common.js` | Header "Bag (n)" count (kept for the session), mobile menu, smooth scroll, sticky header expand, sticky menu, custom cursor, Shop/Our Gardens mega-menu, header search, bag drawer, lazy background videos |
| `js/home.js` | The approved home modules: product-card click/tap, story video modal, unbox slider, team-row auto-scroll (two original versions; both run, as approved), Instagram reel autoplay, product carousel, scroll-expand, unbox/range overlap |
| `js/plp.js` | Product boxes (sizes, wishlist, add to bag), filter & sort drawer, Shop hero slider |
| `js/pdp.js` | Product boxes, PDP gallery, weights and price, gift wrap, "Learn more", cart drawer, story viewer, tabs, reviews (featured quote + full list with filter, sort and paging), frequently bought together |

Every page loads `common.js` first, then its own file, at the end of `<body>`.

## 4. Fonts (Goodricke Brand Book 2026)

The brand book allows **Arpona Light for headings and Inter Regular for body text**, with no other fonts or weights, and kerning at 0%.

| Family | Use | File |
|--------|-----|------|
| Arpona | all headings, one cut for every weight | `assets/fonts/arpona-light.woff2` |
| Inter (variable) | all other text, set to Regular (400) everywhere | `inter-variable.woff2` (+ `inter-variable-italic.woff2`) |

- Every `font-weight` is 400, including browser-default bold on headings, `<b>` and `<strong>`.
- Every `letter-spacing` is 0.
- Buttons and inputs inherit the brand font (browsers default them to Arial).

**⚠️ Arpona licence: action needed before launch.**
- The Arpona file is the **Fontspring DEMO** version that came with the design. It is **not licensed for a live website**.
- It is **not Light**: it's Regular, used as a placeholder.
- Buy the Arpona Light webfont licence, then replace `assets/fonts/arpona-light.woff2` with the licensed file under the same name. No CSS change is needed.
- Until then:
  - the demo file contains only basic letters, and stamps a **"DEMO" mark** on these characters: `' ! & - ( ) / @ # % $ " +` and the digit `4`;
  - headings currently avoid those characters (verified on every page, including hidden menus and drawers);
  - **don't put them in Arpona text until the licensed font is in place.**

## 5. Images and video

- **Images** are WebP, resized to at most twice their largest displayed size (capped at 2600 px). Exceptions:
  - the Assam, Darjeeling and Dooars region-card images keep their original 992×1586 size, because that layout sizes the cards from the image;
  - `og-image.jpg` (1200×630) is for link previews.
- **Mobile:** full-width background photos have a `-m.webp` version at 900 px. Below 768 px wide, a CSS block at the end of `src/style.css` switches to it. Desktop is unchanged.
- **Lazy loading:** images below the first screen use `loading="lazy"`.
- **Video:**
  - all MP4s are re-encoded as H.264 with fast-start (SSIM 0.98–0.99 against the originals, visually the same); audio was removed from the muted reels;
  - the home background videos and Instagram reels load only when scrolled near, and show a first-frame poster until then;
  - the PDP story circles play 240 px preview clips; the full video opens in the story viewer.

## 6. What changed in this round

**Kept from the approved home theme:** layout, hero (the woman in the tea garden, which stays on slide 1 as approved), all animations and transitions, and the custom cursor (restored; it had been dropped).

**Kept from your later work:** the header search and "Bag (n)", "Add to Bag", the product-card colour fill on hover, the bag drawer, and the PLP and PDP pages.

**Fixed:**
- **Fonts:** three font files in the earlier upload were corrupted, so Inter didn't load anywhere. They're replaced by the approved fonts. Two duplicate `@font-face` sets pointing to missing files were removed.
- **Duplicate scripts:** 8 exact-duplicate modules were removed. This fixes the sticky-header mobile menu, which opened and immediately closed.
- **Shop hero slider:** it was also running on home and rotating the approved hero. It now runs on PLP only.
- **PDP:** a JS error (missing `.pdp-weight__clear`) stopped "Learn more". It's fixed.
- **Navigation:** pages now link to each other.
  - logo and "Home" go to `index.html`;
  - "Shop", "Explore Teas", "Shop Now", "Shop All", "Explore All" and the mega-menu tea links go to `plp.html`;
  - PLP products go to `pdp.html`;
  - PDP breadcrumbs link back.
  - The `file:///Users/...` link is gone, and PLP/PDP highlight "Shop" as the active menu item.
- **PLP filters** now work: each product has `data-tags`. The "Benefits" group is renamed "Product Lines", "Textures" is renamed "Tea Type", and Clear counts the real number of products.
- **Header bag count** updates when items are added, and persists while browsing during the session.
- **PLP copy and meta:** the off-topic template copy on PLP is replaced with existing Goodricke copy. Page titles, meta descriptions, a favicon and Open Graph link-preview tags are added.
- **Mega-menu images:** broken paths on PLP are fixed.
- **Cleanup:** 142 unused or duplicate asset files (about 230 MB) were removed. These include 3 images that were only named in CSS rules that are always overridden, so they never showed. Also removed: the PSD, four copies of a 13.8 MB photo, 54 unused static Inter fonts and `.DS_Store` files. The old duplicate copy of the site is removed too; it's still in git history.

**Known and accepted:** unbox slide 3 points to `./adobestock_1003230309-mu6iyxtp-l08b.jpg`, which has never existed. It's left as in the approved design and listed as an accepted exception in `build/check-links.py`.

## 6b. Brand-book compliance (fonts, colours, gradients)

Checked against *Goodricke Brand Book 2026* (pages 55–65). The brand book is not stored in this repository.

- **Colours:** every colour on the three pages is now one of the following:
  - a brand colour: Goodricke Green `#205007`, Morning Mist `#FFFFF4`, Golden Harvest `#CAAA2C`, Dark Garden `#042C05`, Earthy Brown `#A35917` or Accent Blue `#BADBFA`;
  - a brand colour with transparency;
  - a neutral (white, black, grey).

  374 colour values (163 distinct) were mapped:

  | Old colour type | Mapped to |
  |---|---|
  | Greens | Goodricke Green or Dark Garden |
  | Creams and pale tints | Morning Mist |
  | Golds and lime accents | Golden Harvest |
  | Reds (sale badges) | Earthy Brown |
  | Light blue | Accent Blue |
  | Muted tints | a neutral grey of the same lightness, so contrast is kept |

  Measured in the browser: 0 off-brand colours.
- **Gradients:** the gold glow on the hero was removed, and the green-tinted image overlays became neutral (black) overlays. That's the only kind of gradient the brand book allows.
- **Type:** see §4.
- **Copy:** off-topic template text was replaced:
  - the home range section had health-supplement copy ("Whole body health starts in the gut…"); it now reads "Teas from our own estates, made the good way.";
  - the PLP intro had beauty-brand copy, already replaced earlier.
- **Code hygiene:** design-tool leftovers (`__bundler_thumbnail`, `data-om-label`), commented-out dead markup, and change-log or "requested" style comments were removed. Section labels in the CSS and JS now describe what the code does.

## 6c. PDP design and reviews

- **PDP restyled in the home-page theme:**
  - rounded gallery card with round arrows and pill indicators;
  - gold "Limited Edition" pill;
  - outlined weight chips (green when selected) with "Save x%" in Earthy Brown;
  - carded gift-wrap option (the off-brand emoji is removed);
  - pill "Add to bag" button;
  - gold story rings with poster images;
  - "Learn more →";
  - centred uppercase Arpona section titles and a rounded "About this tea" panel.
- **Reviews:**
  - every review shows its own star rating: on the reviewer pill, above the quote, and in the list;
  - a 5-star row sits under the score;
  - **"View all reviews (20)"** opens a list of every review, with a filter by rating (All / 5 / 4 stars), sorting (featured, highest, lowest) and "Show more" (6 at a time).
- ⚠️ **Placeholder ratings.** The review texts had no ratings, so each reviewer pill has a placeholder `data-rating` in `pdp.html`: 18 × 5 stars and 2 × 4 stars, averaging 4.9 to match the score shown. Replace them with real review data; on Shopify, use a reviews app.

## 7. Performance (measured in Chromium)

| Page | Before: first load | After: first load | After: full scroll |
|------|-------------------:|------------------:|-------------------:|
| Home (desktop 1440) | 44.3 MB | **3.4 MB** | 6.0 MB |
| Home (mobile 390) | 44.3 MB | **1.5 MB** | 3.0 MB |
| PLP (desktop / mobile) | 5.2 MB | **1.25 / 0.92 MB** | 1.3 / 1.0 MB |
| PDP | 2.3 MB | **1.2 MB** | 1.2 MB |

- Before, the videos (about 33 MB) also started downloading on page load; now they load only when needed.
- Assets went from 280 MB to 30 MB: 22 MB of video, 6.7 MB of images and 0.8 MB of fonts.
- Per-page CSS went from 431 KB plus the Bootstrap CDN to 145–173 KB of readable CSS (about 30 KB gzipped).
- Fonts per page went from 874 KB of TTF (plus 6 failed requests) to 340 KB of WOFF2.
- No page loads anything from another domain any more (Bootstrap was the only external dependency).

## 8. Verification

- `python3 build/check-links.py`: 503 local references checked, 0 broken (plus the accepted slide-3 exception above).
- **No JavaScript errors** on any page at 1440 px or 390 px.
  - The only console messages are the accepted slide-3 404, and, in headless Chromium only, the story video, because that browser build has no H.264 codec.
  - Real Chrome, Safari, Edge and Firefox play these files.
- **Screenshots:** 70 states per run (full pages, timers, mega-menu, search, hover, bag, filter, PDP tabs, mobile menus) were compared pixel by pixel before and after the CSS/JS optimisation. Remaining differences also occur between two runs of the same code, i.e. animation timing.
- **Layout:** element sizes match on all pages at 1440, 768 and 390 px.
- **Images:** the WebP versions compare at PSNR ≥ 40 dB (visually identical) on most frames. The rest are lazy-video posters (the poster now shows the first frame instead of an empty box) and animation timing.
- **Behaviour checked:**
  - home: hero menu, sticky menu, cursor, search, mega-menu, story modal, add to bag and count; the hero holds slide 1; reels play when visible;
  - PLP: filter (for example Oolong returns the oolong teas), sort, Shop slider rotates, products link to the PDP;
  - PDP: "Learn more", weight price change, add to bag and count, breadcrumbs.

## 9. Notes for the Shopify developer

- **Flat assets folder:** everything in `css/`, `js/`, `assets/fonts/`, `assets/images/` and `assets/media/` (85 files) can go into the theme's single `assets/` folder. **No file-name collisions.**
  - In Liquid use `{{ 'home.css' | asset_url | stylesheet_tag }}` and `{{ 'common.js' | asset_url | script_tag }}`.
  - In CSS, `../assets/images/x.webp` and `../assets/fonts/x.woff2` become `x.webp` / `x.woff2` (same folder), or use a `.css.liquid` file with `asset_url`.
  - Product and collection images should come from Shopify (`image_url`), not theme assets. Upload the videos to *Content → Files*.
- **Keep the load order:** one CSS per page in `<head>`; `common.js` then the page JS at the end of `<body>`.
  If you merge the CSS into one theme stylesheet, build it from `src/style.css` in its existing order.
- **Wire up to Shopify:**
  - the bag drawer and header count use local JS state; connect them to the AJAX Cart API (`/cart/add.js`, `/cart.js`);
  - header search goes to predictive search;
  - PLP filters go to collection filtering (the `data-tags` values are inferred from the placeholder product names);
  - the PDP weights become variants;
  - footer links such as `/policies/shipping-policy` already use Shopify routes.
- **Suggested sections:**
  - **Header and nav** (all pages): announcement bar, mega-menu (`div.nav-panels`), sticky header (`header.stickybar`), search overlay (`div.hsearch`), bag drawer.
  - **Home:**
    - hero slideshow (`section.hero`);
    - "Unbox More Than Tea" image slider (`section.unbox`);
    - featured collection, range (`section.range`);
    - video story (`section.story`);
    - featured collection, bestsellers (`section.shop`);
    - region cards (`section.region`);
    - product carousel (`section.team`);
    - video banner (`section.quality`);
    - promo (`section.promo`);
    - testimonials (`section.voices`);
    - Instagram reels (`section.insta-section`).
  - **PLP:** collection hero (`section.hero`), product grid with filter drawer (`section.product-listing`, `aside.gk-filter-drawer`).
  - **PDP:**
    - breadcrumbs;
    - main product (gallery, info, weights, gift wrap, story circles);
    - details tabs (`section.pdp-details`);
    - recommendations (`section.product-listing`);
    - frequently bought together (`section.pdp-fbt`);
    - reviews (`section.rv`);
    - story viewer (`div.gk-story`).
  - **Footer** (all pages): newsletter and links (`footer.site-footer`).

## 10. Open items (content / brand)

- **Arpona licence** (see §4): buy Arpona Light before launch; the current file is a Fontspring demo.
- **Review ratings** in `pdp.html` are placeholders (see §6c).
- PLP product names are placeholders and don't match their images (for example "Earl Grey Classic" shows a Khaass pack). 3 names appear twice.
- Many links are still `#` (Our Gardens, Journal, Contact, footer links, account) until those pages exist.
- The custom cursor now appears on PLP and PDP too, for a consistent theme. Remove `18-gk-cursor` from `common.js` to limit it to home.
