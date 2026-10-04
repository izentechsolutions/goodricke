/*
 * Builds one small CSS file per page from src/style.css.
 *  1. PurgeCSS keeps only rules whose selectors appear in that page's HTML or JS
 *     (class names toggled by JS are found as strings in the page's JS files).
 *  2. PLP/PDP also get the few Bootstrap 5.3.8 rules they use (reboot + container/grid),
 *     which replaces the Bootstrap CDN file.
 *  3. Output stays readable (comments and formatting kept) so it can be handed to
 *     developers, e.g. for a Shopify theme. Shopify/nginx compress files on delivery.
 * Edit src/style.css (never css/*.css), then run: npm run build:css
 */
const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const PAGES = {
  home: { content: ['index.html', 'js/common.js', 'js/home.js'], bootstrap: false },
  plp: { content: ['plp.html', 'js/common.js', 'js/plp.js'], bootstrap: true },
  pdp: { content: ['pdp.html', 'js/common.js', 'js/pdp.js'], bootstrap: true },
};
const purgeOptions = (content, css) => ({
  content: content.map(f => path.join(ROOT, f)),
  css: [{ raw: css }],
  fontFace: false, keyframes: false, variables: false,
  safelist: { standard: [/^is-/, /^show$/, /^open$/, /^active$/, /^dragging$/] },
  defaultExtractor: c => c.match(/[\w-/:%.@]+(?<!:)/g) || [],
});

(async () => {
  const style = read('src/style.css');
  const bootstrap = fs.readFileSync(require.resolve('bootstrap/dist/css/bootstrap.css'), 'utf8');
  for (const [name, page] of Object.entries(PAGES)) {
    let css = '';
    if (page.bootstrap) css += (await new PurgeCSS().purge(purgeOptions(page.content, bootstrap)))[0].css + '\n';
    css += (await new PurgeCSS().purge(purgeOptions(page.content, style)))[0].css;
    const banner = `/* Goodricke — ${name} page styles. GENERATED from src/style.css by build/build-css.js (npm run build:css): only the rules this page uses. Edit src/style.css, not this file. */\n`;
    fs.writeFileSync(path.join(ROOT, 'css', `${name}.css`), banner + css);
    console.log(`css/${name}.css  ${((banner + css).length / 1024).toFixed(1)} KB`);
  }
})();
