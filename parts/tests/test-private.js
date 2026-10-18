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
