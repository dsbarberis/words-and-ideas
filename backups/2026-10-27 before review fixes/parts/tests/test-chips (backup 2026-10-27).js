// Saved test for part 1.5, filter chips and saved views.  NODE_PATH=$(npm root -g) node parts/tests/test-chips.js
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const { chromium } = require("playwright");
const P = path.join(__dirname, ".."), read = f => fs.readFileSync(path.join(P, f), "utf8");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "chips-test-")), page = path.join(tmp, "c.html");
fs.writeFileSync(page, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>c</title>
<style>${read("tokens/dist/working.css")}${read("shell/shell.css")}${read("chips/chips.css")} main{padding:16px}</style></head><body><main><div id="f"></div><div id="v"></div><p id="out"></p></main>
<script>${read("shell/shell.js")}${read("chips/chips.js")}
window.changes = [];
window.C = SP.chips(document.getElementById("f"), { groups: [
  { key: "deck", label: "Deck", options: [{ value: "roots", label: "Latin Roots", count: 91 }, { value: "ex3", label: "Exercise III" }] },
  { key: "kind", label: "Kind", multi: true, options: [{ value: "a", label: "Needs you" }, { value: "b", label: "Waiting" }] }],
  onChange: s => changes.push(s) });
window.saved = null; window.nextName = "Mine";
window.V = SP.views(document.getElementById("v"), { store: { load: async () => saved || [], save: async l => { saved = JSON.parse(JSON.stringify(l)); } },
  get: () => C.get(), set: s => C.set(s), ask: () => nextName });</script></body></html>`);
let fails = 0;
const ok = (n, c, g) => { if (!c) fails++; console.log((c ? "PASS " : "FAIL ") + n + (c ? "" : "  (got " + JSON.stringify(g) + ")")); };
const pc = spawnSync("node", [path.join(P, "check", "page-check.js"), page, "--out", path.join(tmp, "pc")], { encoding: "utf8", env: process.env });
ok("a page with chips and views passes the page check", pc.status === 0, pc.stdout.trim().split("\n").slice(-3).join(" | "));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 700 } });
  await p.goto("file://" + page); await p.waitForTimeout(100);
  const chip = (g, v) => `.sp-chip[data-g="${g}"][data-v="${v}"]`;
  ok("an empty list of views says why it is empty", (await p.textContent("#v")).includes("No saved views yet"), await p.textContent("#v"));
  await p.click(chip("deck", "roots"));
  ok("a chip presses", await p.getAttribute(chip("deck", "roots"), "aria-pressed") === "true", null);
  await p.click(chip("deck", "ex3"));
  ok("single-choice groups keep one chip pressed", JSON.stringify(await p.evaluate(() => C.get().deck)) === '["ex3"]', await p.evaluate(() => C.get()));
  await p.click(chip("deck", "ex3"));
  ok("a second click clears the chip", JSON.stringify(await p.evaluate(() => C.get().deck)) === "[]", await p.evaluate(() => C.get()));
  await p.click(chip("kind", "a")); await p.click(chip("kind", "b"));
  ok("multi-choice groups keep several", JSON.stringify(await p.evaluate(() => C.get().kind)) === '["a","b"]', null);
  ok("focus stays on the chip after a click", await p.evaluate(() => document.activeElement.dataset.v === "b"), null);
  ok("each click reports the new state", await p.evaluate(() => changes.length) === 5, await p.evaluate(() => changes.length));
  await p.click(".sp-views .sp-save");
  ok("Save View keeps the named state", await p.evaluate(() => saved && saved[0].name === "Mine" && saved[0].state.kind.length === 2), await p.evaluate(() => saved));
  await p.click(".sp-chips .sp-clear");
  ok("Clear Filters clears everything", await p.evaluate(() => Object.keys(C.get()).length === 0), null);
  await p.click(".sp-views .apply");
  ok("applying a saved view restores its filters", JSON.stringify(await p.evaluate(() => C.get().kind)) === '["a","b"]', null);
  await p.click(".sp-views .del");
  ok("a saved view can be deleted", await p.evaluate(() => saved.length === 0), null);
  ok("chips have a 24 px target or more", await p.evaluate(() => [...document.querySelectorAll(".sp-chip")].every(c => c.getBoundingClientRect().height >= 24)), null);
  await b.close(); fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fails ? fails + " failure(s)" : "all chips tests passed"); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
