// Runs every parts test (Tools and tests desk).  NODE_PATH=$(npm root -g) node parts/tests/run.js
const { spawnSync } = require("child_process"), path = require("path"), fs = require("fs");
const tests = fs.readdirSync(__dirname).filter(f => /^test-.*\.js$/.test(f)).sort();
let failed = 0;
for (const t of tests) {
  const r = spawnSync("node", [path.join(__dirname, t)], { encoding: "utf8", env: process.env });
  const last = (r.stdout || "").trim().split("\n").pop();
  console.log((r.status === 0 ? "pass " : "FAIL ") + t + ": " + last);
  if (r.status !== 0) { failed++; console.log((r.stdout || "") + (r.stderr || "")); }
}
console.log(failed ? failed + " test file(s) failed" : "all parts tests passed");
process.exit(failed ? 1 : 0);
