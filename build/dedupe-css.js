/*
 * Removes CSS declarations that can never take effect because a LATER rule with
 * the IDENTICAL selector, inside the IDENTICAL @media/@supports context, sets the
 * SAME property again (with equal or higher importance, and a value the browser
 * accepts). By the cascade, the earlier declaration always loses, so removing it
 * cannot change rendering. Earlier @keyframes with the same name in the same
 * context are removed too (the last one wins). Rules left empty are dropped.
 *
 * Usage: node build/dedupe-css.js src/style.css   (rewrites the file in place)
 * Validation of "value the browser accepts" uses CSS.supports() in Chromium
 * (Playwright), so an invalid later value never knocks out a valid earlier one.
 */
const fs = require('fs');
const postcss = require('postcss');
const { chromium } = require('playwright');

const file = process.argv[2];
const root = postcss.parse(fs.readFileSync(file, 'utf8'), { from: file });

const norm = s => s.replace(/\s+/g, ' ').replace(/\s*([>+~,(){}])\s*/g, '$1').trim().toLowerCase();
const context = node => {
  const chain = [];
  for (let p = node.parent; p && p.type !== 'root'; p = p.parent) {
    if (p.type === 'atrule') chain.unshift(`@${p.name.toLowerCase()} ${norm(p.params)}`);
    else return null; // nested inside a rule: leave alone
  }
  return chain.join(' | ');
};

(async () => {
  // 1. index every declaration by (context, selector, property)
  const groups = new Map();
  let order = 0;
  root.walkRules(rule => {
    if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    const ctx = context(rule);
    if (ctx === null) return;
    const key = ctx + ' || ' + norm(rule.selector);
    rule.each(node => {
      if (node.type !== 'decl') return;
      const prop = node.prop.startsWith('--') ? node.prop : node.prop.toLowerCase();
      const k = key + ' || ' + prop;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push({ decl: node, rule, i: order++ });
    });
  });

  // 2. candidate overrides: an earlier decl followed by a later decl in a DIFFERENT rule
  const pairs = [];
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    for (let a = 0; a < list.length - 1; a++) {
      const later = list.slice(a + 1).filter(x => x.rule !== list[a].rule && (x.decl.important || !list[a].decl.important));
      if (later.length) pairs.push({ victim: list[a], winners: later });
    }
  }

  // 3. check the winning values are valid in a real browser
  const tests = [...new Set(pairs.flatMap(p => p.winners.map(w => JSON.stringify([w.decl.prop, w.decl.value]))))].map(s => JSON.parse(s));
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const page = await browser.newPage();
  const ok = await page.evaluate(list => list.map(([p, v]) => p.startsWith('--') || CSS.supports(p, v)), tests);
  await browser.close();
  const valid = new Set(tests.filter((t, i) => ok[i]).map(t => JSON.stringify(t)));

  let removedDecls = 0;
  for (const { victim, winners } of pairs) {
    if (!winners.some(w => valid.has(JSON.stringify([w.decl.prop, w.decl.value])))) continue;
    if (victim.decl.parent) { victim.decl.remove(); removedDecls++; }
  }

  // 4. earlier duplicate @keyframes (same name, same context)
  const frames = new Map(); let removedFrames = 0;
  root.walkAtRules(/keyframes$/i, at => { const k = context(at) + ' || ' + at.name.toLowerCase() + ' ' + norm(at.params); if (!frames.has(k)) frames.set(k, []); frames.get(k).push(at); });
  for (const list of frames.values()) for (const at of list.slice(0, -1)) { at.remove(); removedFrames++; }

  // 5. drop rules / at-rules left empty (comments inside don't count as content)
  let removedRules = 0;
  const empty = n => !n.nodes || n.nodes.every(c => c.type === 'comment');
  let changed = true;
  while (changed) {
    changed = false;
    root.walk(n => {
      if ((n.type === 'rule' || (n.type === 'atrule' && /^(media|supports)$/i.test(n.name))) && n.nodes && empty(n)) { n.remove(); removedRules++; changed = true; }
    });
  }

  fs.writeFileSync(file, root.toString());
  console.log(`removed ${removedDecls} overridden declarations, ${removedFrames} duplicate @keyframes, ${removedRules} empty rules`);
})();
