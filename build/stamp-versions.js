/* Cache busting: give every CSS / JS file referenced by the pages a version taken from its
   content (?v=<first 10 characters of its SHA-256>).
   The server lets browsers keep CSS / JS for a day (nginx.conf). With a fixed ?v=, a
   returning visitor got the new HTML with yesterday's CSS / JS until a hard refresh.
   Now a changed file always gets a new address, and unchanged files stay cached.
   Runs at the end of `npm run build:css`; `node build/stamp-versions.js` runs it alone. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
const hashes = {};
const hashOf = (rel) => {
  if (!(rel in hashes)) {
    const file = path.join(root, rel);
    hashes[rel] = fs.existsSync(file)
      ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10)
      : null;
  }
  return hashes[rel];
};

let changed = 0;
for (const page of pages) {
  const file = path.join(root, page);
  const html = fs.readFileSync(file, 'utf8');
  const out = html.replace(/((?:href|src)=["'])((?:css|js)\/[^"'?#]+\.(?:css|js))(?:\?v=[^"'#]*)?(["'])/g, (m, a, rel, z) => {
    const h = hashOf(rel);
    return h ? a + rel + '?v=' + h + z : m;
  });
  if (out !== html) { fs.writeFileSync(file, out); changed++; }
}
console.log('stamp-versions: ' + Object.keys(hashes).length + ' files versioned, ' + changed + ' page(s) updated');
