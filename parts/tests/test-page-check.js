// Saved test for part 1.1, the page check: it proves the check catches what it is meant to catch.
//   NODE_PATH=$(npm root -g) node parts/tests/test-page-check.js
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const check = path.join(__dirname, "..", "check", "page-check.js");
const css = fs.readFileSync(path.join(__dirname, "..", "tokens", "dist", "working.css"), "utf8");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "page-check-test-"));
const page = (name, body, extra = "") => {
  const f = path.join(tmp, name + ".html");
  fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${css}
body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font-family:var(--font-body)} button{min-height:32px;min-width:44px}
.ind{display:inline-block;font-size:16px;width:20px;text-align:center}${extra}</style></head><body>${body}</body></html>`);
  return f;
};
const run = (f, args, out) => spawnSync("node", [check, f, "--out", path.join(tmp, out), "--widths", "390,1280", ...args], { encoding: "utf8", env: process.env });
let fails = 0;
function expect(name, r, code, text) {
  const ok = r.status === code && (!text || r.stdout.includes(text));
  if (!ok) fails++;
  console.log((ok ? "PASS " : "FAIL ") + name + (ok ? "" : `\n  exit ${r.status}\n${r.stdout}${r.stderr}`));
}
const good = '<h1>Sample</h1><p>A page built from the shared colours.</p><button>Save</button> <span class="ind">▾</span>';
const g = page("good", good);
expect("a good page passes", run(g, [], "good"), 0, "page check passed");
expect("the same page matches its own baseline", run(g, ["--baseline", path.join(tmp, "good")], "good2"), 0, "page check passed");
const changed = page("good", good.replace("Sample", "Sample page with a longer heading that changes the look"));
expect("a visible change is caught", run(changed, ["--baseline", path.join(tmp, "good")], "good3"), 1, "looks different from the baseline");
expect("sideways scroll is caught", run(page("wide", '<div style="width:2000px">wide</div>'), [], "wide"), 1, "sideways scroll");
expect("a small target is caught", run(page("small", '<button style="min-width:0;min-height:0;padding:0;font-size:8px">x</button>'), [], "small"), 1, "target under 24 px");
expect("a small radio with a full-size label passes", run(page("label", '<label style="display:inline-block;padding:6px 8px"><input type="radio" name="a"> One</label>'), [], "label"), 0, "page check passed");
expect("a glyph in running text is caught", run(page("glyph", "<p>Open ▾ details</p>"), [], "glyph"), 1, "inherits its text's size");
expect("a script error is caught", run(page("err", "<script>nope()</script>"), [], "err"), 1, "script error");
const net = run(page("net", "<script>fetch('https://example.com/x').catch(()=>{})</script>"), [], "net");
expect("a web request is blocked and counted", net, 0, "1 web requests blocked");
const db = page("db", `<p id="s">…</p><script>(async()=>{const db=await claude.use("db");await db.doc("drafts/current").set({a:1});
const d=await db.doc("drafts/current").get();document.getElementById("s").textContent=d.data().a})()</script>`);
const r = run(db, ["--no-dark"], "db");
const rep = JSON.parse(fs.readFileSync(path.join(tmp, "db", "report.json"), "utf8"));
expect("the stand-in records database writes", r, 0, "page check passed");
if (!rep.standin || !rep.standin.docs["drafts/current"]) { fails++; console.log("FAIL the stand-in kept no document"); }
const off = path.join(tmp, "off.json"); fs.writeFileSync(off, JSON.stringify({ available: false }));
const offPage = page("off", `<p id="s"></p><script>(async()=>{const db=await claude.use("db");document.getElementById("s").textContent=db?"has db":"no db";if(db)throw new Error("db should be missing")})()</script>`);
expect("'not available here' can be simulated", run(offPage, ["--standin", off, "--no-dark"], "off"), 0, "page check passed");
fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails ? fails + " failure(s)" : "all page check tests passed");
process.exit(fails ? 1 : 0);
