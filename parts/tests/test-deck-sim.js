// Saved test for part 1.10, the deck simulation.  NODE_PATH=$(npm root -g) node parts/tests/test-deck-sim.js
// Uses the smallest built deck. Its records are written to a temporary folder only (they hold the form's address).
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const SIM = path.join(__dirname, "..", "check", "deck-sim.js"), REPO = path.join(__dirname, "..", "..");
const DECK = path.join(REPO, "Greek Mythology Flashcards.html");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "deck-sim-test-"));
let fails = 0;
const ok = (name, cond, got) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : "  (got " + JSON.stringify(got) + ")")); };
const sim = (deck, mode) => spawnSync("node", [SIM, deck, mode, path.join(tmp, "rec")], { encoding: "utf8", env: process.env });
let r = sim(DECK, "--record");
const rec = r.status === 0 ? JSON.parse(fs.readFileSync(path.join(tmp, "rec", "Greek Mythology Flashcards.json"), "utf8")) : {};
ok("a Learn pass, an unfinished pass and two quiz rounds are simulated", r.status === 0 && JSON.stringify(rec.steps) === JSON.stringify(["learn pass", "learn, unfinished", "quiz round 1", "quiz round 2"]), r.stdout + r.stderr);
ok("each pass makes one Sheet row, and each row was caught as a blocked post", rec.rows && rec.rows.length === 4 && rec.posts.length === 4 && rec.posts.every(p => p.method === "POST" && p.body), rec.rows && rec.rows.length);
ok("the rows carry the made-up name and the fixed time, never a real one", rec.rows && rec.rows.every(x => x.name === "Sample Student") && JSON.stringify(rec.rows).includes("2026-10-14T15:"), null);
ok("the deck's saved attempts are recorded too", rec.attempts && rec.attempts.log.filter(x => x[0] === "set" && /^attempts\//.test(x[1])).length === 4, rec.attempts && rec.attempts.log);
r = sim(DECK, "--check");
ok("the same deck gives the same rows, byte for byte, on a second run", r.status === 0 && /4 Sheet rows the same/.test(r.stdout), r.stdout);
const changed = path.join(tmp, "Greek Mythology Flashcards.html");
fs.writeFileSync(changed, fs.readFileSync(DECK, "utf8").replace('passScore: row.passCorrect + "/" + row.passSize', 'passScore: row.passCorrect + " / " + row.passSize'));
r = sim(changed, "--check");
ok("a one-character change to a row is caught", r.status === 1 && /differs in posts, rows/.test(r.stdout), r.stdout);
fs.writeFileSync(changed, fs.readFileSync(DECK, "utf8").replace("function sendToSheet(payload) {", "function postRow(payload) {"));
r = sim(changed, "--check");
ok("the simulation stops when it cannot find the code that sends to the Sheet", r.status === 1 && /STOPPED: .*not found/.test(r.stdout), r.stdout);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails ? fails + " failure(s)" : "all deck simulation tests passed"); process.exit(fails ? 1 : 0);
