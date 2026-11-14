# Client feedback v02: what changed

Branch `client-feedback-v02`, made from `website-final-v1` (the build shared with Goodricke).
Source deck: *Goodricke_Website_Feedback_v02.pptx*. Styles were added as one block at the end of
`src/style.css` ("CLIENT FEEDBACK v02"), then `npm run build:css`. Asset versions bumped to `?v=20261113`.

| Slide | Feedback | Change |
|---|---|---|
| 2 | Hero too dark; too much text, worst on mobile | Home hero photo brightened, the dark overlay only sits behind the text. Copy shortened to a dummy headline + one line until final copy arrives. Hero fills exactly one screen; on phones it is taller with the text at the bottom. |
| 3 | Show products after the first scroll; skip "Unbox More Than Tea" | Unbox section and its scroll animation removed. The first scroll lands on the product row. |
| 4 | Misaligned gaps | Every home section uses the same top/bottom spacing (was 200 px + 200 px, and 0 on Bestsellers). |
| 5 | Alternate content and products; replace "High Quality Goodricke Tea" with certifications / awards | New "Our Certifications and Accolades" section in its place. |
| 6 | Side-scrolling rows need a cue | Arrows under every horizontal row (only while it can scroll), a fade on the right edge, and a one-time nudge on touch screens (`js/common.js` → "Side-scroll cue"). |
| 7 | Footer: social buttons, less space | Social icons, policy links, copyright and disclaimer in one compact footer row on all pages. |
| 8 | Shop page background too dark | Shop hero overlay lightened. |
| 9 | 2nd/3rd image on hover; automatic on mobile | Cards with `data-images` fade to their other photos on hover and rotate on phones, with dots (`js/common.js` → "Product photo gallery"). |
| 10 | Product page cluttered | Key info at a glance; Description, About this tea and How to brew are dropdowns. |
| 11 | Caffeine display; Subscribe & save; FBT under Add to cart and dynamic | Low / Medium / High caffeine scale. One-time / Subscribe & save 10% with delivery frequency. Frequently bought together right under Add to bag; follows size and plan. |
| 12 | Reviews take too much space | Rating summary with breakdown + a row of short review cards; "View all reviews" unchanged. |
| 13 | Consistent image sizes | All shop cards the same size with square image frames (no 2×2 cards). |
| 14 | FAQ position and visibility | FAQ moved to straight after the product, two columns, first answer open, "Contact us" button. |

## Placeholders to confirm with Goodricke
- Certifications: trustea, India Organic and Darjeeling GI are placeholders (FSSC 22000, Rainforest Alliance and ETP come from the existing PDP). Confirm and supply official logos.
- Hero copy is dummy text until final copy arrives.
- Only products with existing alternate shots (SuperCup, Khaass, Chai, Thurbo) rotate photos; others need extra photos (`product.images` on Shopify).
- Subscribe & save 10% and the FBT suggestions are demo data (subscription app / product recommendations on Shopify).
