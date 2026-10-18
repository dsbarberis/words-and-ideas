// Private-settings check (part 1.8, plan rule 7): nothing private goes into this public repository.
//   node parts/check/private-check.js [DIR ...]          (default: parts/)
// Fails (exit 1) on anything that looks like a private setting: a Google file or form ID, a
// form's field names, a claude.ai artifact, session or routine ID, a path in the project's
// shared folder, or an email address. With SP_PRIVATE_SETTINGS set to a settings JSON file
// (kept in the shared folder), it also fails on any of that file's values, word for word.
const fs = require("fs"), path = require("path");
const PATTERNS = [
  ["a Google form ID", /1FAIpQL[\w-]{20,}/],
  ["a Google Docs or Forms address", /docs\.google\.com\/(?:forms|spreadsheets|document)\/d\//],
  ["a Google file ID", /(?<![\w-])1[A-Za-z0-9_-]{32,}(?![\w-])/],
  ["a form field name", /\bentry\.\d{6,}\b/],
  ["a claude.ai artifact link", /claude\.ai\/(?:code\/)?artifact\//],
  ["a routine ID", /\btrig_[A-Za-z0-9]{12,}\b/],
  ["a session ID", /\b(?:cse|session)_[A-Za-z0-9]{12,}\b/],
  ["a path in the shared folder", /\/mnt\/project-files\b/],
  ["an email address", /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z]{2,})+\b/],
];
// Lines that may name a pattern on purpose: this file and its own test.
const SELF = new Set([path.resolve(__filename), path.resolve(__dirname, "..", "tests", "test-private.js")]);
const TEXT = /\.(js|css|html|json|md|py|txt|svg)$/i;

function files(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules" && !e.name.startsWith(".")) out.push(...files(p)); }
    else if (TEXT.test(e.name) && !SELF.has(path.resolve(p))) out.push(p);
  }
  return out;
}
function check(dirs, extra) {
  const found = [];
  for (const d of dirs) for (const f of files(d)) {
    const lines = fs.readFileSync(f, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const [what, re] of PATTERNS) if (re.test(line)) found.push(`${f}:${i + 1}: ${what}`);
      for (const v of extra) if (line.includes(v)) found.push(`${f}:${i + 1}: a value from the private settings file`);
    });
  }
  return found;
}
module.exports = { check, PATTERNS };
if (require.main === module) {
  const dirs = process.argv.slice(2).length ? process.argv.slice(2) : [path.join(__dirname, "..")];
  let extra = [];
  if (process.env.SP_PRIVATE_SETTINGS) {
    const s = JSON.parse(fs.readFileSync(process.env.SP_PRIVATE_SETTINGS, "utf8"));
    extra = Object.values(s).filter(v => typeof v === "string" && v.length >= 8);
  }
  const found = check(dirs, extra);
  found.forEach(f => console.log("FAIL " + f));
  console.log(found.length ? found.length + " private value(s) found; take them out and put them in at build time" : "no private values found");
  process.exit(found.length ? 1 : 0);
}
