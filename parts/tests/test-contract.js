// Saved test for part 1.9's runner, parts/check/contract.js.  NODE_PATH=$(npm root -g) node parts/tests/test-contract.js
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const R = path.join(__dirname, "..", "check", "contract.js");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "contract-test-"));
let fails = 0;
const ok = (name, cond, got) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : "  (got " + JSON.stringify(got) + ")")); };
const page = (name, key, extra) => { fs.writeFileSync(path.join(tmp, name), `<!doctype html><meta charset="utf-8"><button id="b">Save</button><script>
(async () => { const db = await claude.use("db"); const d = await db.doc("drafts/current").get();
  document.getElementById("b").onclick = async () => { await db.doc("drafts/current").set({ n: ((d.data() || {}).n || 0) + 1, at: new Date().toISOString(), ms: Date.now() });
    localStorage.setItem("${key}", "1"); ${extra || ""} }; })();</script>`); return path.join(tmp, name); };
fs.writeFileSync(path.join(tmp, "steps.js"), `module.exports = { seed: { available: true, docs: { "drafts/current": { n: 1 } } },
  steps: async (p, reload) => { await p.click("#b"); await p.waitForTimeout(200); await reload(); await p.click("#b"); }, settle: 300 };`);
const run = (pg, mode) => spawnSync("node", [R, pg, path.join(tmp, "steps.js"), mode, path.join(tmp, "c.json")], { encoding: "utf8", env: process.env });
let r = run(page("a.html", "k"), "--record");
const c = r.status === 0 ? JSON.parse(fs.readFileSync(path.join(tmp, "c.json"), "utf8")) : {};
ok("a contract is recorded", r.status === 0 && c.loads && c.loads.length === 2, r.stdout + r.stderr);
ok("saved data carries across a reload, as on claude.ai", c.docs && c.docs["drafts/current"] && c.docs["drafts/current"].n === 3, c.docs);
ok("times and stamps become placeholders", c.docs && c.docs["drafts/current"].at === "<time>" && c.docs["drafts/current"].ms === "<ms>", c.docs);
ok("the same page keeps its contract", run(path.join(tmp, "a.html"), "--check").status === 0, null);
r = run(page("b.html", "other-key"), "--check");
ok("a renamed storage key breaks it", r.status === 1 && /localStorage\/k/.test(r.stdout), r.stdout);
r = run(page("c.html", "k", 'await db.doc("extra/x").set({ y: 1 });'), "--check");
ok("an extra database write breaks it", r.status === 1 && /DIFFERENT/.test(r.stdout), r.stdout);
r = run(page("d.html", "k", 'fetch("https://example.invalid/x", { method: "POST", body: "row" }).catch(() => {});'), "--check");
ok("a web request, blocked, breaks it and is recorded with its body", r.status === 1 && /requests/.test(r.stdout), r.stdout);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails ? fails + " failure(s)" : "all contract runner tests passed"); process.exit(fails ? 1 : 0);
