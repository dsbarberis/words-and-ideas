// Page check (part 1.1): the automated part of the general design checklist, and the
// before-and-after comparison every move uses (migration plan, rule 3).
//
//   NODE_PATH=$(npm root -g) node parts/check/page-check.js PAGE.html --out DIR
//        [--baseline DIR]      compare each shot with the same shot in DIR (rule 3)
//        [--strict]            with --baseline: any pixel changed by more than 4 levels fails (a move meant to be identical)
//        [--widths 390,820,1280] [--no-dark]  (decks: --no-dark)
//        [--standin CONFIG.json] [--states STATES.js]
//
// For each width, in light and dark: loads the page with the claude.ai stand-in and every web
// request blocked but Google Fonts, waits for fonts, and records script errors, blocked requests, sideways
// scroll, clickable targets under 24 px, and indicator glyphs not drawn at a fixed size.
// Then runs each named state (a module exporting [{name, run: async page => {...}}]) and
// screenshots it. Writes DIR/report.json and DIR/<shot>.png. Exit 1 on any failure.
// Comparison: a shot differs when more than 0.1% of its pixels differ by more than 32 in any
// channel (small anti-aliasing changes pass), or when the page height changed.
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i < 0 ? d : argv[i + 1]; };
const page0 = argv[0];
if (!page0 || page0.startsWith("--")) { console.log("usage: page-check.js PAGE.html --out DIR [--baseline DIR] [--widths 390,820,1280] [--no-dark] [--standin CFG.json] [--states STATES.js] [--strict]"); process.exit(2); }
const out = path.resolve(opt("--out", "page-check-out"));
const baseline = opt("--baseline", null);
const widths = opt("--widths", "390,820,1280").split(",").map(Number);
const themes = argv.includes("--no-dark") ? ["light"] : ["light", "dark"];
const standin = opt("--standin", null) ? JSON.parse(fs.readFileSync(opt("--standin"), "utf8")) : {};
const states = opt("--states", null) ? require(path.resolve(opt("--states"))) : [];
// Google Fonts is the one web source a page may load (the design checklist allows it).
const FONTS = /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//;
const DIFF_SHARE = 0.001, DIFF_LEVEL = 32;
const strict = process.argv.includes("--strict");   // any changed pixel fails: for moves meant to be identical

async function measure(page) {
  return page.evaluate(() => {
    const issues = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth + 1) issues.push(`sideways scroll: page is ${doc.scrollWidth}px wide in a ${doc.clientWidth}px window`);
    const clickable = [...document.querySelectorAll("button, a[href], input:not([type=hidden]), select, [role=button], [role=tab], [onclick]")]
      .filter(e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden"; });
    for (const e of clickable) {
      // A checkbox or radio's target includes its label (a wrapping label, or one named by for=).
      const lab = e.tagName === "INPUT" ? (e.closest("label") || (e.id && document.querySelector(`label[for="${CSS.escape(e.id)}"]`))) : null;
      const r = (lab || e).getBoundingClientRect();
      const inText = e.tagName === "A" && getComputedStyle(e).display === "inline";
      if (!inText && (r.width < 24 || r.height < 24)) issues.push(`target under 24 px: ${e.tagName.toLowerCase()} "${(e.textContent || e.getAttribute("aria-label") || e.value || "").trim().slice(0, 30)}" is ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    const glyph = /[▲▼▾▸●○◷]/;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const sizes = {};
    while (walker.nextNode()) {
      const n = walker.currentNode; if (!glyph.test(n.nodeValue) || /^(SCRIPT|STYLE|TEMPLATE)$/.test(n.parentElement.tagName)) continue;
      const el = n.parentElement, own = el.textContent.trim();
      const g = own.match(glyph)[0];
      if (own.length > 2) issues.push(`glyph ${g} inherits its text's size ("${own.slice(0, 30)}"): draw it in its own fixed-size element`);
      const fs = getComputedStyle(el).fontSize; (sizes[g] = sizes[g] || new Set()).add(fs);
    }
    for (const [g, s] of Object.entries(sizes)) if (s.size > 1) issues.push(`glyph ${g} drawn at ${s.size} sizes (${[...s].join(", ")})`);
    return { issues: [...new Set(issues)], height: doc.scrollHeight };
  });
}

async function compare(browser, a, b) {
  const p = await browser.newPage();
  const res = await p.evaluate(async ([a, b]) => {
    const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + src; });
    const [x, y] = await Promise.all([load(a), load(b)]);
    if (x.width !== y.width || x.height !== y.height) return { sizeChanged: `${y.width}×${y.height} → ${x.width}×${x.height}` };
    const c = document.createElement("canvas"); c.width = x.width; c.height = x.height;
    const g = c.getContext("2d"); g.drawImage(x, 0, 0); const dx = g.getImageData(0, 0, c.width, c.height).data;
    g.clearRect(0, 0, c.width, c.height); g.drawImage(y, 0, 0); const dy = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0, any = 0;
    for (let i = 0; i < dx.length; i += 4) {
      const d = Math.max(Math.abs(dx[i] - dy[i]), Math.abs(dx[i + 1] - dy[i + 1]), Math.abs(dx[i + 2] - dy[i + 2]));
      if (d > 32) n++; if (d > 4) any++;   // up to 4 levels is drawing noise (a resize grip, anti-aliasing)
    }
    return { share: n / (dx.length / 4), changed: any / (dx.length / 4) };
  }, [a.toString("base64"), b.toString("base64")]);
  await p.close();
  return res;
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const url = "file://" + path.resolve(page0);
  const report = { page: page0, when: new Date().toISOString(), shots: [], failures: [] };
  const fail = (shot, msg) => report.failures.push(shot + ": " + msg);
  const initScript = fs.readFileSync(path.join(__dirname, "stand-in.js"), "utf8");
  for (const theme of themes) for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: theme, deviceScaleFactor: 1 });
    await ctx.addInitScript(`window.__STANDIN_CONFIG = ${JSON.stringify(standin)};`);
    await ctx.addInitScript(initScript);
    const blocked = [];
    await ctx.route("**/*", r => { const u = r.request().url(); if (u.startsWith("file:") || u.startsWith("data:") || FONTS.test(u)) return r.continue(); blocked.push(u); return r.abort(); });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(String(e.message || e)));
    page.on("console", m => { if (m.type() === "error" && !/net::ERR_FAILED|Failed to load resource/.test(m.text())) errors.push(m.text()); });
    await page.goto(url, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(300);
    const runs = [{ name: "first load", run: null }].concat(states);
    for (const st of runs) {
      if (st.run) { try { await st.run(page); await page.waitForTimeout(200); } catch (e) { fail(`${w}px ${theme} ${st.name}`, "state could not be set: " + e.message); continue; } }
      const shot = `${w}-${theme}-${st.name.replace(/[^a-z0-9]+/gi, "-")}`;
      const m = await measure(page);
      const png = await page.screenshot({ fullPage: true });
      fs.writeFileSync(path.join(out, shot + ".png"), png);
      m.issues.forEach(i => fail(shot, i));
      const rec = { shot, height: m.height };
      if (baseline) {
        const bp = path.join(baseline, shot + ".png");
        if (!fs.existsSync(bp)) fail(shot, "no baseline shot");
        else {
          const c = await compare(browser, png, fs.readFileSync(bp));
          rec.compare = c;
          if (c.sizeChanged) fail(shot, "page size changed: " + c.sizeChanged);
          else if (c.share > DIFF_SHARE) fail(shot, `looks different from the baseline (${(c.share * 100).toFixed(2)}% of pixels)`);
          else if (strict && c.changed > 0) fail(shot, `differs from the baseline in ${(c.changed * 100).toFixed(3)}% of pixels (--strict: any change of more than 4 levels fails)`);
        }
      }
      report.shots.push(rec);
    }
    errors.forEach(e => fail(`${w}px ${theme}`, "script error: " + e));
    if (blocked.length) report.blocked = (report.blocked || []).concat(blocked);
    report.standin = report.standin || (await page.evaluate(() => window.__standin ? { log: window.__standin.log, docs: window.__standin.docs } : null));
    await ctx.close();
  }
  await browser.close();
  report.blocked = [...new Set(report.blocked || [])];
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 1));
  console.log(`page check: ${report.shots.length} shots of ${page0}${baseline ? " compared with " + baseline : ""}; ${report.blocked.length} web requests blocked`);
  report.failures.forEach(f => console.log("  FAIL " + f));
  console.log(report.failures.length ? report.failures.length + " failure(s)" : "page check passed");
  process.exit(report.failures.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
