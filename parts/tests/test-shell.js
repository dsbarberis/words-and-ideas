// Saved test for part 1.3, the page shell.  NODE_PATH=$(npm root -g) node parts/tests/test-shell.js
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const { chromium } = require("playwright");
const P = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(P, f), "utf8");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "shell-test-"));
const page = path.join(tmp, "sample.html");
fs.writeFileSync(page, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Shell sample</title><style>${read("tokens/dist/working.css")}${read("shell/shell.css")} main{padding:16px} .q{min-height:300px;border:1px solid var(--rule);margin:8px 0;padding:8px}</style></head>
<body><main><h1>Sample page</h1><p id="st"></p>
<div id="tl"><button data-panel="p1">First</button><button data-panel="p2">Second</button><button data-panel="p3">Third</button></div>
<section id="p1"><p>Panel one <span class="sp-ind" aria-label="open">▾</span></p></section><section id="p2"><p>Panel two</p></section><section id="p3"><p>Panel three</p></section>
<button id="open">Open Dialog</button> <button id="next"></button>
<div class="q" data-open="0"><input aria-label="a"></div><div class="q" data-open="1"><input aria-label="b"></div><div class="q" data-open="1"><input aria-label="c"></div>
</main><script>${read("shell/shell.js")}
SP.status(document.getElementById("st"), "loading");
SP.tabs(document.getElementById("tl"));
document.getElementById("open").onclick = () => SP.dialog("A <b>title</b>", "<p>Body</p>");
window.NU = SP.nextUnanswered(document.getElementById("next"), () => [...document.querySelectorAll(".q")], e => e.dataset.open === "1");
</script></body></html>`);
let fails = 0;
const ok = (name, cond, got) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : "  (got " + JSON.stringify(got) + ")")); };
const pc = spawnSync("node", [path.join(P, "check", "page-check.js"), page, "--out", path.join(tmp, "pc")], { encoding: "utf8", env: process.env });
ok("a sample page built on the shell passes the page check", pc.status === 0, pc.stdout.trim().split("\n").slice(-4).join(" | "));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 700 } });
  await p.goto("file://" + page);
  ok("esc escapes all five characters", await p.evaluate(() => SP.esc(`<a href="x">'&'</a>`)) === "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;", null);
  const tc = await p.evaluate(() => ["accept all recommendations", "know it", "take the quiz again", "next to decide"].map(SP.titleCase));
  ok("title case follows Apple's style", JSON.stringify(tc) === JSON.stringify(["Accept All Recommendations", "Know It", "Take the Quiz Again", "Next to Decide"]), tc);
  ok("status line uses the fixed wording", await p.evaluate(() => { const e = document.getElementById("st"); SP.status(e, "cantSave"); return e.textContent.startsWith("Couldn't save") && e.dataset.kind === "bad" && e.getAttribute("aria-live") === "polite"; }), null);
  let threw = await p.evaluate(() => { try { SP.status(document.getElementById("st"), "made up"); return false; } catch (e) { return true; } });
  ok("an unknown status is refused, so wording cannot drift", threw, null);
  await p.click("#tab-p1"); await p.keyboard.press("ArrowRight");
  ok("arrow key moves to the next tab and shows its panel", await p.evaluate(() => document.activeElement.id === "tab-p2" && !document.getElementById("p2").hidden && document.getElementById("p1").hidden), null);
  await p.keyboard.press("End"); ok("End goes to the last tab", await p.evaluate(() => document.activeElement.id === "tab-p3"), null);
  await p.keyboard.press("ArrowRight"); ok("arrow key wraps to the first tab", await p.evaluate(() => document.activeElement.id === "tab-p1"), null);
  await p.click("#open");
  ok("dialog opens and escapes its title", await p.evaluate(() => { const d = document.querySelector("dialog"); return !!d && d.open && d.querySelector("h2").innerHTML === "A &lt;b&gt;title&lt;/b&gt;"; }), null);
  await p.keyboard.press("Escape"); await p.waitForTimeout(100);
  ok("Escape closes the dialog and focus returns to its button", await p.evaluate(() => !document.querySelector("dialog") && document.activeElement.id === "open"), null);
  ok("the button is named Next Unanswered", await p.textContent("#next") === "Next Unanswered", null);
  await p.click("#next");
  const f1 = await p.evaluate(() => document.activeElement.getAttribute("aria-label"));
  ok("Next Unanswered skips answered items and lands on the first open one", f1 === "b", f1);
  await p.evaluate(() => { document.querySelectorAll(".q").forEach(q => q.dataset.open = "0"); });
  ok("it is disabled when nothing is open", await p.evaluate(() => { NU.refresh(); return document.getElementById("next").disabled; }), null);
  ok("theme can be set and remembered", await p.evaluate(() => { SP.theme("dark"); return document.documentElement.dataset.theme === "dark" && localStorage.getItem("sp-theme") === "dark"; }), null);
  const p2 = await b.newPage(); await p2.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
  const errs = []; p2.on("pageerror", e => errs.push(e.message)); await p2.goto("file://" + page);
  ok("the shell works when browser storage is blocked", errs.length === 0 && await p2.evaluate(() => SP.theme("light") === "light"), errs);
  await b.close(); fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fails ? fails + " failure(s)" : "all shell tests passed"); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
