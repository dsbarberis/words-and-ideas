// Saved test for part 1.2, colours and type (migration plan, stage 1).
//   node parts/tests/test-tokens.js
// Checks: every theme has every colour name; every text pair meets WCAG 2.2 AA (4.5:1) and every
// control pair 3:1 in all four themes, except listed exceptions, which are counted and must still
// be real (a listed exception that now passes fails the test, so the list never goes stale);
// the built stylesheets match tokens.json.
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const T = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tokens", "tokens.json"), "utf8"));
const fails = [];
function lum(h) {
  const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) { const A = lum(a), B = lum(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); }
const colourNames = Object.keys(T.names).filter(k => !k.startsWith("font-"));
const courseOnly = ["burgundy", "sage", "gold"];
let checked = 0, excepted = 0;
for (const [theme, own] of Object.entries(T.themes)) {
  const light = theme.replace("-dark", "-light");
  const vals = Object.assign({}, T.themes[light], own);
  for (const n of colourNames) {
    if (theme.startsWith("working") && courseOnly.includes(n)) continue;
    if (!(n in own)) fails.push(theme + ": no value for " + n);
    else if (!/^#[0-9a-f]{6}$/i.test(own[n])) fails.push(theme + ": " + n + " is not a 6-digit hex colour");
  }
  for (const [list, need] of [[T.textPairs, 4.5], [T.controlPairs, 3]]) for (const [fg, bg] of list) {
    if (!(fg in own) || !(bg in own)) continue;
    checked++;
    const r = ratio(vals[fg], vals[bg]);
    const ex = T.exceptions.find(e => e.theme === theme && e.pair[0] === fg && e.pair[1] === bg);
    if (r < need && !ex) fails.push(`${theme}: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${need}:1`);
    if (ex) { excepted++; if (r >= need) fails.push(`${theme}: ${fg} on ${bg} now passes (${r.toFixed(2)}:1); remove its exception`); }
  }
}
try { execFileSync("node", [path.join(__dirname, "..", "tokens", "build.js"), "--check"], { stdio: "pipe" }); }
catch (e) { fails.push(String(e.stdout || e.message).trim()); }
fails.forEach(f => console.log("FAIL " + f));
console.log(`${checked} pairs checked in ${Object.keys(T.themes).length} themes; ${excepted} listed exceptions, waiting on the architect's look decision`);
console.log(fails.length ? fails.length + " failure(s)" : "all token tests passed");
process.exit(fails.length ? 1 : 0);
