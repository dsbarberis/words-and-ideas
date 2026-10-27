// Saved test for part 1.4, the table.  NODE_PATH=$(npm root -g) node parts/tests/test-table.js
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const { chromium } = require("playwright");
const P = path.join(__dirname, ".."), read = f => fs.readFileSync(path.join(P, f), "utf8");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "table-test-")), page = path.join(tmp, "t.html");
const rows = [
  { name: "Ann", score: 9, note: "A longer note that is allowed to wrap onto more lines when the window is narrow" },
  { name: "Ben", score: null, note: "" }, { name: "Cy", score: 7, note: "Short" },
  { name: "Dee", score: 9, note: "Tie with Ann" }, { name: "Eve", score: 12, note: "" }, { name: "Fay", score: 3, note: "x" }];
fs.writeFileSync(page, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>t</title>
<style>${read("tokens/dist/course.css")}${read("shell/shell.css")}${read("table/table.css")} main{padding:16px}</style></head><body><main><div id="box"></div></main>
<script>${read("shell/shell.js")}${read("table/table.js")}
window.T = SP.table(document.getElementById("box"), { title: "Students", limit: 4, rows: ${JSON.stringify(rows)},
  columns: [{ key: "name", label: "Name" }, { key: "score", label: "Score", num: true }, { key: "note", label: "Note", wrap: true }] });</script></body></html>`);
let fails = 0;
const ok = (n, c, g) => { if (!c) fails++; console.log((c ? "PASS " : "FAIL ") + n + (c ? "" : "  (got " + JSON.stringify(g) + ")")); };
const pc = spawnSync("node", [path.join(P, "check", "page-check.js"), page, "--out", path.join(tmp, "pc")], { encoding: "utf8", env: process.env });
ok("a page with the table passes the page check", pc.status === 0, pc.stdout.trim().split("\n").slice(-3).join(" | "));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 700 } });
  await p.goto("file://" + page);
  const names = () => p.$$eval("tbody tr td:first-child", t => t.map(x => x.textContent));
  ok("long lists show the limit and the count", (await names()).length === 4 && (await p.textContent(".sp-table-head strong")).includes("4 of 6"), await names());
  await p.check(".sp-table-head input"); ok("Show all shows every row", (await names()).length === 6, await names());
  await p.click('th button[data-key="score"]');
  ok("sorting up: ties keep the default order, empty last", JSON.stringify(await names()) === JSON.stringify(["Fay", "Cy", "Ann", "Dee", "Eve", "Ben"]), await names());
  ok("the active heading shows ▲ and aria-sort", await p.evaluate(() => { const th = document.querySelectorAll("th")[1]; return th.getAttribute("aria-sort") === "ascending" && th.textContent.includes("▲"); }), null);
  ok("focus stays on the heading after sorting", await p.evaluate(() => document.activeElement.dataset.key === "score"), null);
  await p.click('th button[data-key="score"]');
  ok("a second click reverses; ties still in default order; empty still last", JSON.stringify(await names()) === JSON.stringify(["Eve", "Ann", "Dee", "Cy", "Fay", "Ben"]), await names());
  ok("empty values show as a dash", await p.evaluate(() => [...document.querySelectorAll("td.empty")].every(t => t.textContent === "—") && document.querySelectorAll("td.empty").length === 3), null);
  ok("numbers are right-aligned", await p.evaluate(() => getComputedStyle(document.querySelector("td.num")).textAlign === "right"), null);
  ok("headings are pinned", await p.evaluate(() => getComputedStyle(document.querySelector("thead th")).position === "sticky"), null);
  ok("the first column is pinned for sideways scrolling", await p.evaluate(() => getComputedStyle(document.querySelector("td")).position === "sticky"), null);
  const wraps = await p.evaluate(() => [...document.querySelectorAll("tbody tr")].map(r => [...r.cells].slice(0, 2).some(c => {
    const rg = document.createRange(); rg.selectNodeContents(c); return new Set([...rg.getClientRects()].map(x => Math.round(x.top))).size > 1; })));
  ok("short columns stay on one line at phone width (wrap scan)", !wraps.some(Boolean), wraps);
  const caught = await p.evaluate(() => { const c = document.querySelector("tbody td"); c.style.whiteSpace = "normal"; c.style.maxWidth = "10px"; c.textContent = "two words"; const rg = document.createRange(); rg.selectNodeContents(c); return new Set([...rg.getClientRects()].map(x => Math.round(x.top))).size > 1; });
  ok("the wrap scan does catch a wrapped cell", caught, caught);
  // Every column sorts both ways: name and note too, with empty notes last both ways.
  const col = i => p.$$eval("tbody tr", (rs, i) => rs.map(r => r.cells[i].textContent), i);
  await p.click('th button[data-key="name"]');
  ok("the name column sorts up", JSON.stringify(await names()) === JSON.stringify(["Ann", "Ben", "Cy", "Dee", "Eve", "Fay"]), await names());
  await p.click('th button[data-key="name"]');
  ok("the name column sorts down", JSON.stringify(await names()) === JSON.stringify(["Fay", "Eve", "Dee", "Cy", "Ben", "Ann"]), await names());
  await p.click('th button[data-key="note"]');
  const up = await col(2);
  await p.click('th button[data-key="note"]');
  const down = await col(2);
  ok("the note column sorts both ways, empty last both ways", up[0].startsWith("A longer") && up.slice(-2).every(x => x === "—") && down[0] === "x" && down.slice(-2).every(x => x === "—"), [up, down]);
  // A word in a number column counts as empty: shown as a dash, sorted last, and the sort stays consistent.
  const mixed = await p.evaluate(() => { const t = document.createElement("div"); document.body.appendChild(t);
    const tb = SP.table(t, { rows: [{ n: "a", s: 5 }, { n: "b", s: "n/a" }, { n: "c", s: "2" }, { n: "d", s: 9 }], columns: [{ key: "n", label: "N" }, { key: "s", label: "S", num: true }] });
    const read = () => [...t.querySelectorAll("tbody tr")].map(r => r.cells[0].textContent + r.cells[1].textContent);
    tb.sortBy("s", "asc"); const a = read(); tb.sortBy("s", "desc"); const d = read(); t.remove(); return [a, d]; });
  ok("a word in a number column shows as a dash and sorts last both ways", JSON.stringify(mixed) === JSON.stringify([["c2", "a5", "d9", "b—"], ["d9", "a5", "c2", "b—"]]), mixed);
  ok("text is escaped", await p.evaluate(() => { T.render(); const t = document.createElement("div"); SP.table(t, { rows: [{ a: "<b>x</b>" }], columns: [{ key: "a", label: "A" }] }); return t.querySelector("td").innerHTML === "&lt;b&gt;x&lt;/b&gt;"; }), null);
  await b.close(); fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fails ? fails + " failure(s)" : "all table tests passed"); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
