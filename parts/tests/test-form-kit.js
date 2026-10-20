// Saved test for part 1.7, the form kit on the shared parts.  NODE_PATH=$(npm root -g) node parts/tests/test-form-kit.js
// Builds one made-up form two ways, with the kit as it was (form-kit/reference/) and on the parts,
// and checks: the field check, the question helper, the build, the look (pixel comparison in
// several states) and the data (every database read and write the same).
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const { chromium } = require("playwright");
const P = path.join(__dirname, ".."), K = path.join(P, "form-kit");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "formkit-test-"));
let fails = 0;
const ok = (name, cond, got) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : "  (got " + JSON.stringify(got) + ")")); };
const py = (args, input) => spawnSync("python3", ["-I"].concat(args), { encoding: "utf8", input, cwd: tmp });

// 1. A sample form made with the question helper, covering every kind of question.
const maker = `
import sys, json; sys.path.insert(0, ${JSON.stringify(K)})
from formkit import *
f = form("sample-form", "Sample Form", [
  question("plain", "Pick one", [opt("a", "Choice A", rec=True), opt("b", "Choice B", note="A note"), other()], section="Part one",
           prompt="A prompt.", details_html="<p>Details</p>", clarify=clar("a sample.", "nothing.")),
  items_question("several", "Several items", [item("x", "Item X"), item("y", "Item Y", options=[opt("keep", "Keep", rec=True), opt("drop", "Drop")])],
           options=[opt("yes", "Yes", rec=True), opt("no", "No")]),
  table("words", "Wordings", [column("cur", "Current"), column("new", "Proposed")],
        [row("r1", "Row one", {"cur": "Old words", "new": "New words"}, rec="new", clarify=clar("a row.", "one label.")),
         row("r2", "Row two", {"cur": "Same", "new": "Changed"}, rec="cur")],
        combine=True, extra={"value": "skip", "label": "Don't change"}, section="Part two"),
], subtitle="Made-up questions for the saved test", intro_html="<p>Intro text.</p>")
save(f, "sample.json")
by_hand = {"formId": "sample-form", "title": "Sample Form", "subtitle": "Made-up questions for the saved test", "introHtml": "<p>Intro text.</p>"}
print(json.dumps(list(f.keys())))
`;
let r = py(["-c", maker]);
ok("the question helper makes a form that passes the field check", r.status === 0 && fs.existsSync(path.join(tmp, "sample.json")), r.stderr || r.stdout);
const sample = JSON.parse(fs.readFileSync(path.join(tmp, "sample.json"), "utf8"));
ok("the helper writes the same fields a hand-written form has", sample.questions[0].options[0].rec === true && sample.questions[2].type === "table" && sample.questions[2].rows[0].rec === "new" && sample.questions[0].clarify.startsWith("Where it came from: a sample. What it changes:"), sample.questions[0]);

// 2. The field check catches what would break a page or lose an answer.
const bad = {
  "duplicate question id": f => { f.questions[1].id = "plain"; },
  "two recommended options": f => { f.questions[0].options[1].rec = true; },
  "prefill without a text box": f => { f.questions[0].options[0].prefill = "x"; },
  "a row recommending a column that doesn't exist": f => { f.questions[2].rows[0].rec = "nope"; },
  "a cell with no column": f => { f.questions[2].rows[0].cells.ghost = "x"; },
  "a dot in an id": f => { f.questions[0].id = "a.b"; },
  "a question with no options": f => { delete f.questions[0].options; },
  "an item with nothing to choose": f => { delete f.questions[1].options; },
  "a missing title": f => { delete f.title; },
  "an unknown question type": f => { f.questions[0].type = "slider"; },
};
for (const [name, plant] of Object.entries(bad)) {
  const f = JSON.parse(JSON.stringify(sample)); plant(f);
  fs.writeFileSync(path.join(tmp, "bad.json"), JSON.stringify(f));
  r = py([path.join(K, "check_form.py"), "bad.json"]);
  ok("the field check stops " + name, r.status === 1 && /ERROR/.test(r.stdout), r.stdout);
}
r = py([path.join(K, "check_form.py"), "sample.json"]);
ok("the field check passes the sample", r.status === 0, r.stdout);
r = py([path.join(K, "build-form.py"), "bad.json", "bad.html"]);
ok("build-form refuses a form the field check stops", r.status === 1 && !fs.existsSync(path.join(tmp, "bad.html")) && /build refused/.test(r.stdout), r.stdout);

// 3. Build both ways.
fs.writeFileSync(path.join(tmp, "zones.json"), JSON.stringify({ architect: "America/Chicago", course: "America/Chicago" }));
r = py([path.join(K, "build-form.py"), "sample.json", "nozone.html"]);
ok("build-form refuses to guess the time zone", r.status === 1 && /TIME_ZONE/.test(r.stdout), r.stdout);
r = py([path.join(K, "build-form.py"), "sample.json", "new.html", "--zones", "zones.json"]);
ok("build-form builds the sample on the parts", r.status === 0, r.stdout + r.stderr);
r = py([path.join(K, "reference", "build-form.py"), "sample.json", "old.html"]);
ok("the kit as it was builds the sample too", r.status === 0, r.stdout + r.stderr);
const built = fs.readFileSync(path.join(tmp, "new.html"), "utf8");
const labels = [...built.matchAll(/\/\*\s*shared-part:\s*([\w./-]+)\s*\*\/([\s\S]*?)\/\*\s*\/shared-part:\s*\1\s*\*\//g)];
ok("the built page carries the three parts, each exactly as its home copy",
  JSON.stringify(labels.map(m => m[1])) === JSON.stringify(["tokens/dist/working.css", "shell/shell.js", "data/data.js"]) &&
  labels.every(m => m[2].trim() === fs.readFileSync(path.join(P, m[1]), "utf8").trim()), labels.map(m => m[1]));
ok("no colour value is written in the kit itself", !/#[0-9a-f]{3,6}\b/i.test(fs.readFileSync(path.join(K, "template.html"), "utf8").replace(/rgba\([^)]*\)/g, "")), null);

// 4. The look: the page check compares the new page with the old one, in several states.
const states = path.join(tmp, "states.js");
// Each state waits for saving to finish, so "Saving…" never races the screenshot.
fs.writeFileSync(states, `const settle = p => p.waitForFunction(() => !/Saving/.test(document.getElementById("saved").textContent));
module.exports = [
  { name: "accept all", run: async p => { await p.click("#acceptAll"); await settle(p); } },
  { name: "combine open", run: async p => { await p.click("#r_words_r2_combine"); await p.fill("#t_words_r2", "Mine"); await settle(p); } },
  { name: "other text", run: async p => { await p.click("#o_plain_2"); await settle(p); } },
  { name: "clarify open", run: async p => { await p.click("#q_plain .clar"); await settle(p); } },
];`);
const pc = (page, out, base) => spawnSync("node", [path.join(P, "check", "page-check.js"), path.join(tmp, page), "--out", path.join(tmp, out), "--states", states].concat(base ? ["--baseline", path.join(tmp, base), "--strict"] : []), { encoding: "utf8", env: process.env });
r = pc("old.html", "pc-old");
ok("the old page passes the page check (the baseline is sound)", r.status === 0, r.stdout.split("\n").slice(-5).join(" | "));
r = pc("new.html", "pc-new", "pc-old");
ok("the new page looks the same as the old in every state, width and theme", r.status === 0 && /compared with/.test(r.stdout), r.stdout.split("\n").slice(-6).join(" | "));

// 5. The data: the same steps on both pages read and write the same things.
(async () => {
  const b = await chromium.launch();
  const seed = { available: true, userId: "u_sample", docs: {
    "submissions/20261001000000": { formId: "sample-form", submittedAt: "2026-10-01T00:00:00.000Z", raw: { plain: { choice: "b" } }, general: "" },
    "drafts/current": { formId: "sample-form", updatedAt: "2026-10-02T00:00:00.000Z", answers: { plain: { choice: "a" } }, general: "draft note" } } };
  async function run(file, cfg) {
    const ctx = await b.newContext(); await ctx.route("**/*", rt => rt.request().url().startsWith("file:") ? rt.continue() : rt.abort());
    const p = await ctx.newPage(); const errs = []; p.on("pageerror", e => errs.push(e.message));
    await p.addInitScript(c => { window.__STANDIN_CONFIG = c; }, cfg); await p.addInitScript({ path: path.join(P, "check", "stand-in.js") });
    await p.goto("file://" + path.join(tmp, file)); await p.waitForTimeout(300);
    const loaded = { general: await p.inputValue("#general"), checked: await p.isChecked("#o_plain_0"), status: await p.textContent("#status") };
    await p.click("#o_plain_1"); await p.fill("#c_plain_comment", "a comment");
    await p.click("#acceptAll"); await p.click("#r_words_r1_cur");
    await p.waitForTimeout(1000);
    const submitOn = await p.isEnabled("#submit"); if (submitOn) await p.click("#submit");
    await p.waitForTimeout(300);
    const out = await p.evaluate(() => JSON.parse(JSON.stringify(window.__standin)));
    const local = await p.evaluate(() => localStorage.getItem("approval-draft-v2-sample-form"));
    await ctx.close();
    const norm = s => JSON.parse(JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g, "T").replace(/submissions\/\d+/g, "submissions/N"));
    return { loaded, submitOn, log: norm(out.log), docs: norm(out.docs), local, errs };
  }
  const a = await run("old.html", seed), n = await run("new.html", seed);
  // The one intended difference (D, Oct 19): times are shown in the Setup zone with zone letters.
  ok("the new page shows the last submission in the Setup zone, with zone letters", /^Last submitted Sep 30, 7:00 p\.m\. CDT\. /.test(n.loaded.status), n.loaded.status);
  const sameExceptTime = x => Object.assign({}, x, { status: x.status.replace(/^Last submitted .*?(?:CDT|CST|[AP]M)\. /, "Last submitted <time>. ") });
  ok("both pages pick up the saved draft the same way", JSON.stringify(sameExceptTime(a.loaded)) === JSON.stringify(sameExceptTime(n.loaded)) && n.loaded.general === "draft note" && n.loaded.checked, [a.loaded, n.loaded]);
  ok("the sample reaches Submit on both pages", a.submitOn && n.submitOn, [a.submitOn, n.submitOn]);
  ok("every database read and write is the same, in the same order", JSON.stringify(a.log) === JSON.stringify(n.log) && a.log.length > 5, { old: a.log.length, new: n.log.length });
  ok("the stored data ends up the same", JSON.stringify(a.docs) === JSON.stringify(n.docs) && Object.keys(n.docs).some(k => k.startsWith("submissions/N")), Object.keys(n.docs));
  ok("the browser copy of the draft is the same", a.local === n.local && !!n.local, null);
  const off = await run("new.html", { available: false });
  ok("outside claude.ai the new page says it can't save, as the old did", /can't save answers in this view/.test(off.loaded.status) && !off.submitOn, off.loaded.status);
  ok("no script errors", !a.errs.length && !n.errs.length && !off.errs.length, [a.errs, n.errs, off.errs]);
  await b.close(); if (process.env.KEEP_TMP) console.log("kept " + tmp); else fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fails ? fails + " failure(s)" : "all form kit tests passed"); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
