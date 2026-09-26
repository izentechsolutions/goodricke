// Deterministic UI/transition comparison.
// JS timers: Playwright fake clock. CSS animations/transitions: paused and seeked
// to fixed points ("mid" = 150ms in, "end" = settled) before every frame.
const { chromium } = require('playwright');
const SITES = JSON.parse(process.argv[2]);
const OUT = process.argv[3];
function settle(mode) {
  for (const a of document.getAnimations()) {
    try {
      a.pause();
      const t = a.effect.getComputedTiming();
      if (mode === 'mid') a.currentTime = Math.min(150, isFinite(t.endTime) ? t.endTime : 150);
      else a.currentTime = isFinite(t.endTime) ? t.endTime : 0;
    } catch (e) {}
  }
  document.querySelectorAll('video').forEach(v => { v.pause(); try { v.currentTime = 0; } catch (e) {} });
}
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const errors = {};
  for (const [tag, url] of Object.entries(SITES)) {
    errors[tag] = [];
    for (const [vpName, vp] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
      const ctx = await b.newContext({ viewport: vp });
      const p = await ctx.newPage();
      p.on('pageerror', e => errors[tag].push(e.message));
      await p.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
      await p.goto(url, { waitUntil: 'load' });
      await p.evaluate(async () => {
        document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
        document.querySelectorAll('video').forEach(v => { v.pause(); v.preload = 'auto'; });
        await document.fonts.ready;
      });
      await p.waitForTimeout(4000);
      let i = 0;
      const snap = async label => {
        for (const mode of ['mid', 'end']) {
          await p.evaluate(`(${settle.toString()})(${JSON.stringify(mode)})`);
          await p.waitForTimeout(250);
          await p.screenshot({ path: `${OUT}/${tag}-${vpName}-${String(i).padStart(2, '0')}-${label}-${mode}.png` });
        }
        i++;
      };
      let now = 0;
      for (const t of [0, 1000, 6100, 8500, 12100, 18100, 24100]) { await p.clock.runFor(t - now); now = t; await snap('t' + t); }
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= H; y += Math.round(vp.height * 0.6)) {
        await p.evaluate(y => window.scrollTo(0, y), y); await p.clock.runFor(1200); await snap('y' + y);
      }
      if (vpName === 'd') {
        for (const sel of ['.range-card', '.shop-card', '.region-card']) {
          const el = p.locator(sel).first();
          await el.scrollIntoViewIfNeeded().catch(() => {}); await p.clock.runFor(1200);
          await el.hover({ force: true }).catch(() => {}); await p.clock.runFor(400);
          await snap('hover' + sel.replace(/\W/g, ''));
          await p.mouse.move(5, 5); await p.clock.runFor(800);
        }
      }
      await ctx.close();
    }
  }
  console.log(JSON.stringify(errors));
  await b.close();
})();
