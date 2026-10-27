// Private-settings check (part 1.8, plan rule 7): nothing private goes into this public repository.
//   node parts/check/private-check.js [--feed FILE] [DIR ...]          (default: parts/)
// Fails (exit 1) on anything that looks like a private setting: a Google file or form ID, a
// form's field names, a claude.ai artifact, session or routine ID, a path in the project's
// shared folder, a project message ID, a short Google Forms link, a document or artifact ID
// (a UUID), or an email address. Every folder is scanned except node_modules and .git. With SP_PRIVATE_SETTINGS set to a settings JSON file
// (kept in the shared folder), it also fails on any of that file's values, word for word.
// --feed FILE: the data feed settings (kept in the shared folder, never here). Their posting
// address and entry codes are public by design in deck pages only (the data feed exception,
// Oct 20, 2026): in a file matching one of the settings' allowedGlobs, relative to the DIR
// scanned, those exact values pass; anything else on the line is still checked. Elsewhere,
// or any other address or code, fails as before.
const fs = require("fs"), path = require("path");
const PATTERNS = [
  ["a Google form ID", /1FAIpQL[\w-]{20,}/],
  ["a Google Docs or Forms address", /docs\.google\.com\/(?:forms|spreadsheets|document)\/d\//],
  ["a Google file ID", /(?<![\w-])1[A-Za-z0-9_-]{32,}(?![\w-])/],
  ["a form field name", /\bentry\.\d{6,}\b/],
  ["a claude.ai artifact link", /claude\.ai\/(?:code\/)?artifact\//],
  ["a routine ID", /\btrig_[A-Za-z0-9]{12,}\b/],
  ["a session ID", /\b(?:cse|session)_[A-Za-z0-9]{12,}\b/],
  ["a project message ID", /\bcmsg_[A-Za-z0-9]{12,}\b/],
  ["a short Google Forms link", /forms\.gle\//],
  ["a document or artifact ID", /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i],
  ["a path in the shared folder", /\/mnt\/project-files\b/],
  ["an email address", /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z]{2,})+\b/],
];
// Lines that may name a pattern on purpose: this file and its own test, wherever the check runs from.
const SELF_NAMES = ["parts/check/private-check.js", "parts/tests/test-private.js"];
const SELF = { has: p => p === path.resolve(__filename) || SELF_NAMES.some(n => p.split(path.sep).join("/").endsWith("/" + n)) };
const TEXT = /\.(js|mjs|cjs|css|html|json|md|py|txt|svg|csv|tsv|yml|yaml|sh|toml|xml)$/i;

function files(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules" && e.name !== ".git") out.push(...files(p)); }
    else if (TEXT.test(e.name) && !SELF.has(path.resolve(p))) out.push(p);
  }
  return out;
}
// A glob from the settings: "*" matches within one folder, "**/" any number of folders.
function globRe(g) {
  const esc = g.split("**/").map(part => part.split("*").map(x => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*"));
  return new RegExp("^" + esc.join("(?:[^/]+/)*") + "$");
}
// The values that may stand in deck pages: the posting address and the entry codes, longest first.
function feedAllow(feed) {
  if (!feed) return null;
  const values = [feed.postingAddress].concat(Object.values(feed.entryCodes || {})).filter(v => typeof v === "string" && v.length >= 8);
  if (!feed.postingAddress || values.length < 2 || !(feed.allowedGlobs || []).length) throw new Error("the data feed settings have no postingAddress, entryCodes or allowedGlobs");
  return { values: values.sort((a, b) => b.length - a.length), globs: feed.allowedGlobs.map(globRe) };
}
function check(dirs, extra, feed) {
  const found = [], allow = feedAllow(feed);
  for (const d of dirs) for (const f of files(d)) {
    const rel = path.relative(d, f).split(path.sep).join("/");
    const exempt = allow && allow.globs.some(re => re.test(rel));
    const lines = fs.readFileSync(f, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (exempt) for (const v of allow.values) line = line.split(v).join(" ");
      for (const [what, re] of PATTERNS) if (re.test(line)) found.push(`${f}:${i + 1}: ${what}`);
      for (const v of extra) if (line.includes(v)) found.push(`${f}:${i + 1}: a value from the private settings file`);
    });
  }
  return found;
}
module.exports = { check, PATTERNS, globRe };
if (require.main === module) {
  const args = process.argv.slice(2);
  let feed = null;
  const k = args.indexOf("--feed");
  if (k >= 0) { feed = JSON.parse(fs.readFileSync(args[k + 1], "utf8")); args.splice(k, 2); }
  const dirs = args.length ? args : [path.join(__dirname, "..")];
  let extra = [];
  if (process.env.SP_PRIVATE_SETTINGS) {
    const s = JSON.parse(fs.readFileSync(process.env.SP_PRIVATE_SETTINGS, "utf8"));
    extra = Object.values(s).filter(v => typeof v === "string" && v.length >= 8);
  }
  const found = check(dirs, extra, feed);
  found.forEach(f => console.log("FAIL " + f));
  console.log(found.length ? found.length + " private value(s) found; take them out and put them in at build time" : "no private values found");
  process.exit(found.length ? 1 : 0);
}
