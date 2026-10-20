// Saved test for part 1.8: the build step and the private-settings check (plan, rule 7).
//   NODE_PATH=$(npm root -g) node parts/tests/test-private.js
// Every planted value below is made up, in the shape of the real thing.
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const P = path.join(__dirname, ".."), REPO = path.join(P, "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "private-test-"));
let fails = 0;
const ok = (name, cond, got) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : "  (got " + JSON.stringify(got) + ")")); };
const node = (args, env) => spawnSync("node", args, { encoding: "utf8", env: Object.assign({}, process.env, env || {}) });
const py = (args) => spawnSync("python3", ["-I"].concat(args), { encoding: "utf8", cwd: tmp });
const checker = path.join(P, "check", "private-check.js");

// The check passes the parts as they are.
let r = node([checker]);
ok("the parts hold no private values", r.status === 0, r.stdout);

// Each kind of private value, planted in a copy, is caught.
const plants = {
  "a Google file ID": 'const SHEET_ID = "1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789abcd";',
  "a Google form ID": 'const A = "https://docs.google.com/forms/d/e/1FAIpQLSzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/formResponse";',
  "a form field name": 'const F = { name: "entry.123456789" };',
  "a claude.ai artifact link": "<!-- https://claude.ai/artifact/Abcdefghijklmnop -->",
  "a routine ID": "const T = 'trig_01AbcdefghijklmnopQR';",
  "a session ID": "// from cse_01AbcdefghijklmnopQR",
  "a path in the shared folder": 'fs.readFileSync("/mnt/project-files/forms/x.json")',
  "an email address": "/* ask someone@example.edu */",
};
for (const [what, line] of Object.entries(plants)) {
  const d = fs.mkdtempSync(path.join(tmp, "plant-"));
  fs.writeFileSync(path.join(d, "page.js"), "// a part\n" + line + "\n");
  r = node([checker, d]);
  ok("the check catches " + what, r.status === 1 && r.stdout.includes(what), r.stdout);
}
const d0 = fs.mkdtempSync(path.join(tmp, "plant-"));
fs.writeFileSync(path.join(d0, "page.css"), "@import url('https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,500');\n.a{color:#1f5f7a}\n");
ok("a font address and a colour are not mistaken for private values", node([checker, d0]).status === 0, null);
fs.writeFileSync(path.join(tmp, "settings.json"), JSON.stringify({ SHEET_NAME: "Sample class roster" }));
fs.writeFileSync(path.join(d0, "page.js"), "const n = 'Sample class roster';\n");
r = node([checker, d0], { SP_PRIVATE_SETTINGS: path.join(tmp, "settings.json") });
ok("with the private settings file, any of its values is caught word for word", r.status === 1 && r.stdout.includes("private settings file"), r.stdout);

// The data feed exception (Oct 20, 2026): with --feed, the posting address and entry codes pass
// in deck pages only. Made-up values in the real shape; the real ones stay in the shared folder.
const FEED = { postingAddress: "https://docs.google.com/forms/d/e/1FAIpQLSsampleSAMPLEsampleSAMPLEsample00/formResponse",
  entryCodes: { deck: "entry.1111111", name: "entry.2222222" },
  allowedGlobs: ["*.html", "standard-deck/template.html", "backups/**/*.html"] };
fs.writeFileSync(path.join(tmp, "feed.json"), JSON.stringify(FEED));
const deckLines = `const GFORM_ACTION = "${FEED.postingAddress}";\nconst F = { deck: "entry.1111111", name: "entry.2222222" };\n`;
const repo = fs.mkdtempSync(path.join(tmp, "repo-"));
const put = (rel, text) => { const f = path.join(repo, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
put("Sample Deck.html", deckLines);
put("standard-deck/template.html", deckLines);
put("backups/2026-10-05 before a rebuild/Sample Deck (backup).html", deckLines);
put("backups/old.html", deckLines);
const feedRun = () => node([checker, "--feed", path.join(tmp, "feed.json"), repo]);
r = feedRun();
ok("with --feed, the posting address and entry codes pass in deck pages, the template and old copies", r.status === 0, r.stdout);
r = node([checker, repo]);
ok("without --feed, the same deck pages still fail", r.status === 1 && /a Google form ID/.test(r.stdout), r.stdout);
put("dashboard/page.html", deckLines);
r = feedRun();
ok("the address in any other file fails", r.status === 1 && r.stdout.includes("dashboard/page.html") && !r.stdout.includes("Sample Deck"), r.stdout);
fs.rmSync(path.join(repo, "dashboard"), { recursive: true });
put("notes.md", deckLines);
r = feedRun();
ok("the address in a non-page file at the top fails", r.status === 1 && r.stdout.includes("notes.md"), r.stdout);
fs.rmSync(path.join(repo, "notes.md"));
put("Other Deck.html", deckLines.replace("SAMPLEsample00", "OTHERotherxx00"));
r = feedRun();
ok("another Google Form's address fails, even in a deck page", r.status === 1 && r.stdout.includes("Other Deck.html"), r.stdout);
put("Other Deck.html", deckLines.replace("entry.2222222", "entry.3333333"));
r = feedRun();
ok("an entry code not on the list fails, even in a deck page", r.status === 1 && r.stdout.includes("Other Deck.html:2: a form field name"), r.stdout);
put("Other Deck.html", `const A = "${FEED.postingAddress}"; // ask someone@example.edu\n`);
r = feedRun();
ok("anything else on an allowed line is still checked", r.status === 1 && r.stdout.includes("an email address"), r.stdout);
fs.rmSync(path.join(repo, "Other Deck.html"));
fs.writeFileSync(path.join(tmp, "feed-bad.json"), JSON.stringify({ entryCodes: FEED.entryCodes, allowedGlobs: FEED.allowedGlobs }));
r = node([checker, "--feed", path.join(tmp, "feed-bad.json"), repo]);
ok("data feed settings without a posting address are refused", r.status !== 0 && /no postingAddress/.test(r.stdout + r.stderr), r.stdout + r.stderr);

// The build step.
const B = path.join(P, "build", "build_page.py");
fs.writeFileSync(path.join(tmp, "src.html"), `<style>/* shared-part: tokens/dist/working.css */ /* /shared-part: tokens/dist/working.css */</style>
<script>/* shared-part: data/data.js */ /* /shared-part: data/data.js */
const SHEET = "__SHEET_ID__";</script>`);
fs.writeFileSync(path.join(tmp, "s.json"), JSON.stringify({ SHEET_ID: "sample-sheet-id" }));
r = py([B, "src.html", "out.html", "--settings", "s.json"]);
const out = r.status === 0 ? fs.readFileSync(path.join(tmp, "out.html"), "utf8") : "";
ok("the build puts each part in, between its labels", r.status === 0 && out.includes(fs.readFileSync(path.join(P, "tokens/dist/working.css"), "utf8").trim()) && out.includes("SP.readSheet") && /\/\* \/shared-part: data\/data\.js \*\//.test(out), r.stdout + r.stderr);
ok("the build fills a private setting from the settings file", out.includes('const SHEET = "sample-sheet-id"') && !out.includes("__SHEET_ID__"), null);
ok("a part that mentions a marker by name (data.js) does not stop the build", out.includes("__SP_TEST__"), null);
r = py([B, "src.html", "out2.html"]);
ok("the build refuses to leave a setting unfilled", r.status === 1 && /unfilled setting\(s\): SHEET_ID/.test(r.stdout) && !fs.existsSync(path.join(tmp, "out2.html")), r.stdout);
fs.writeFileSync(path.join(tmp, "bad.html"), "<script>/* shared-part: ../../etc/passwd */ /* /shared-part: ../../etc/passwd */</script>");
r = py([B, "bad.html", "out3.html"]);
ok("the build refuses a part outside parts/", r.status === 1 && /no part named/.test(r.stdout), r.stdout);
const inRepo = path.join(P, "build", "planted-settings.json");
fs.writeFileSync(inRepo, JSON.stringify({ SHEET_ID: "x" }));
try { r = py([B, "src.html", "out4.html", "--settings", inRepo]); } finally { fs.rmSync(inRepo, { force: true }); }
ok("the build refuses a settings file kept inside the public repository", r.status === 1 && /inside the public repository/.test(r.stdout), r.stdout);
r = py([B, "out.html", "again.html"]);
ok("building a built page again gives the same page", r.status === 0 && fs.readFileSync(path.join(tmp, "again.html"), "utf8") === out, r.stdout);

fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails ? fails + " failure(s)" : "all build and private-settings tests passed"); process.exit(fails ? 1 : 0);
