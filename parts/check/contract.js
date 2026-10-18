// Data contract runner (part 1.9, plan rule 4): a page's move must not change what it stores.
//   NODE_PATH=$(npm root -g) node parts/check/contract.js PAGE.html STEPS.js --record CONTRACT.json
//   NODE_PATH=$(npm root -g) node parts/check/contract.js PAGE.html STEPS.js --check CONTRACT.json
// STEPS.js exports { seed, local, steps, settle }:
//   seed   the claude.ai stand-in's config (check/stand-in.js): made-up saved data and connector answers
//   local  browser storage to start with, { key: "value" }
//   steps  async (page, reload) => { ... }  clicks and typing, as a person would; reload() reloads the page
//   settle milliseconds to wait after the steps for saves to finish (default 1500)
// It loads the page with every web request blocked (each attempt, with its body, is recorded),
// runs the steps, and records every database read and write, the saved data, browser storage and
// web requests, with times and dates replaced by placeholders. --record saves that as the page's
// contract, taken on today's page before its move; --check fails if a page does anything different.
// Use made-up data only: never a real student's name or the class Sheet.
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const [pagePath, stepsPath] = process.argv.slice(2);
const opt = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
if (!pagePath || !stepsPath || !(opt("--record") || opt("--check"))) { console.log("usage: contract.js PAGE.html STEPS.js (--record | --check) CONTRACT.json"); process.exit(2); }
const S = require(path.resolve(stepsPath));
const STANDIN = path.join(__dirname, "stand-in.js");

// Times, dates and stamps change on every run, so they become placeholders, in text and as numbers.
const normText = t => t
  .replace(/\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:?\d\d)?/g, "<time>")
  .replace(/(?<!\d)1[78]\d{11}(?!\d)/g, "<ms>")
  .replace(/(?<![\d<])20\d{12,15}(?!\d)/g, "<stamp>");
function norm(v) {
  if (typeof v === "string") return normText(v);
  if (typeof v === "number") return v >= 1.7e12 && v < 1.9e12 ? "<ms>" : v;
  if (Array.isArray(v)) return v.map(norm);
  if (v && typeof v === "object") { const o = {}; for (const k of Object.keys(v)) o[normText(k)] = norm(v[k]); return o; }
  return v;
}

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: S.width || 1280, height: 900 } });
  const requests = [];
  await ctx.route("**/*", r => {
    const q = r.request();
    if (q.url().startsWith("file:")) return r.continue();
    requests.push({ method: q.method(), url: q.url(), body: q.postData() || null });
    return r.abort();
  });
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", e => errors.push(String(e.message || e)));
  await page.addInitScript(([cfg, local]) => {
    window.__STANDIN_CONFIG = cfg;
    try { if (!localStorage.getItem("__contract_seeded")) { for (const [k, v] of Object.entries(local || {})) localStorage.setItem(k, v); localStorage.setItem("__contract_seeded", "1"); } } catch (e) {}
  }, [S.seed || { available: true }, S.local || {}]);
  await page.addInitScript({ path: STANDIN });
  // The stand-in starts afresh on each load; carry its saved data across a reload, as claude.ai would.
  let carried = null, logs = [];
  await page.addInitScript(() => { const c = sessionStorage.getItem("__contract_docs"); if (c && window.__standin) { const d = JSON.parse(c); for (const k of Object.keys(window.__standin.docs)) delete window.__standin.docs[k]; Object.assign(window.__standin.docs, d); } });
  const url = "file://" + path.resolve(pagePath);
  await page.goto(url, { waitUntil: "load" }); await page.waitForTimeout(500);
  const reload = async () => {
    const st = await page.evaluate(() => { sessionStorage.setItem("__contract_docs", JSON.stringify(window.__standin.docs)); return window.__standin.log; });
    // Read browser storage and pause before reloading: a reload straight after a write can lose it in the
    // test browser (seen on the dashboard, about one run in six), which is not the page's doing.
    await page.evaluate(() => Object.keys(localStorage)); await page.waitForTimeout(300);
    logs.push(st); await page.reload({ waitUntil: "load" }); await page.waitForTimeout(500);
  };
  if (S.steps) await S.steps(page, reload);
  await page.waitForTimeout(S.settle || 1500);
  const end = await page.evaluate(() => {
    const dump = s => { const o = {}; try { for (let i = 0; i < s.length; i++) { const k = s.key(i); if (!k.startsWith("__contract")) o[k] = s.getItem(k); } } catch (e) { o["<unreadable>"] = String(e); } return o; };
    return { log: window.__standin ? window.__standin.log : null, docs: window.__standin ? window.__standin.docs : null, local: dump(localStorage), session: dump(sessionStorage) };
  });
  await browser.close();
  logs.push(end.log);
  const sortKeys = o => Object.keys(o || {}).sort().reduce((a, k) => (a[k] = o[k], a), {});
  return norm({ loads: logs, docs: sortKeys(end.docs), localStorage: sortKeys(end.local), sessionStorage: sortKeys(end.session), requests, errors });
}

function diff(a, b, at = "", out = []) {
  if (out.length >= 12) return out;
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (a && b && typeof a === "object" && typeof b === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], at + "/" + k, out);
  } else out.push(`${at || "/"}: contract ${JSON.stringify(a)?.slice(0, 160)}, page ${JSON.stringify(b)?.slice(0, 160)}`);
  return out;
}

run().then(got => {
  if (opt("--record")) {
    fs.writeFileSync(opt("--record"), JSON.stringify(got, null, 1) + "\n");
    const writes = got.loads.flat().filter(x => x && ["set", "update", "delete"].includes(x[0])).length;
    console.log(`recorded ${opt("--record")}: ${got.loads.flat().length} database calls (${writes} writes), ${Object.keys(got.localStorage).length} browser storage keys, ${got.requests.length} web requests, ${got.errors.length} script errors`);
    process.exit(0);
  }
  const want = JSON.parse(fs.readFileSync(opt("--check"), "utf8"));
  const d = diff(want, got);
  d.forEach(x => console.log("  DIFFERENT " + x));
  console.log(d.length ? "data contract broken" : "data contract kept");
  process.exit(d.length ? 1 : 0);
}).catch(e => { console.error(e); process.exit(1); });
