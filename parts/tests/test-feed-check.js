// Saved test for part 1.11, the data feed check.  node parts/tests/test-feed-check.js
// Made-up rows only, never the class Google Sheet. With SP_FEED_SETTINGS set to the data feed settings
// file (kept in the shared folder), the agreement cases also run against its own header, decks and
// pass modes, so a change there that breaks the check fails here.
const fs = require("fs"), path = require("path");
const SP = require(path.join(__dirname, "..", "data", "feed-check.js"));
let fails = 0;
const ok = (name, cond, got) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : "  (got " + JSON.stringify(got) + ")")); };

const SAMPLE = {
  header: ["Timestamp", "Deck", "Student Name", "Pass Mode", "Pass Score", "Pass Size", "Cumulative Correct", "Cumulative Total", "Results JSON"],
  decks: ["Sample Roots Flashcards", "Sample Exercise"],
  passModes: ["^learn$", "^learn \\([^()]+\\)$", "^learn \\(unfinished\\)$", "^learn \\([^()]+, unfinished\\)$", "^quiz round [1-9][0-9]*$", "^quiz round [1-9][0-9]* \\([^()]+\\)$"],
  testNames: { contains: ["sample"], startsWith: ["test"] }, gapDays: 3, sheetTimeZone: "America/Chicago" };

function suite(F, label) {
  const D0 = F.decks[0], D1 = F.decks[1] || F.decks[0];
  const row = (ts, o) => { o = o || {}; return [ts, o.deck || D0, o.name || "Alex Rivera", o.mode || "learn", "3/10", "10", "3", "102", "[]"]; };
  const sheet = (rows, header) => [header || F.header].concat(rows);
  const at = s => ({ now: new Date(s) });
  const base = [row("10/18/2026 14:00:00"), row("10/19/2026 9:30:00", { deck: D1, mode: "quiz round 1 (Ex I)" }), row("10/17/2026 8:00:00", { deck: "Old Deck Name", mode: "full" })];

  let r = SP.feedCheck(sheet(base), F, null, at("2026-10-20T08:00Z"));
  ok(label + "the first run reports nothing and only records where things stand", r.faults.length === 0 && r.state.rows === 3, r);
  ok(label + "the state holds counts and times, no names or decks", Object.keys(r.state).sort().join() === "faults,lastRun,newestRow,rows" && !JSON.stringify(r.state).includes("Alex"), r.state);
  ok(label + "the Google Sheet's times are read in its own zone", r.state.newestRow === "2026-10-19T14:30:00.000Z", r.state);
  const s1 = r.state;

  const good = base.concat(["learn (Still Learning)", "learn (unfinished)", "learn (Ex 2, unfinished)", "quiz round 12", "quiz round 2 (Missed)"].map(m => row("10/20/2026 10:00:00", { mode: m })));
  r = SP.feedCheck(sheet(good), F, s1, at("2026-10-21T08:00Z"));
  ok(label + "new rows inside the agreement pass; the old odd row is not reported", r.faults.length === 0, r.faults);
  const s2 = r.state;

  r = SP.feedCheck(sheet(good.concat([row("10/21/2026 9:00:00", { deck: "Lesson XII Sample Flashcards" })])), F, s2, at("2026-10-22T08:00Z"));
  ok(label + "a new row from a deck not in the agreement is reported", r.faults.length === 1 && r.faults[0].includes("Lesson XII Sample Flashcards"), r.faults);
  ok(label + "the report never names the student", !r.faults.join().includes("Alex"), r.faults);
  for (const m of ["full", "learn (All", "quiz round 0", "quiz", "Learn"]) {
    r = SP.feedCheck(sheet(good.concat([row("10/21/2026 9:00:00", { mode: m })])), F, s2, at("2026-10-22T08:00Z"));
    ok(label + "a new row with pass mode " + JSON.stringify(m) + " is reported", r.faults.length === 1 && r.faults[0].includes("pass mode"), r.faults);
  }
  for (const n of ["Sample Student", "  sample", "TEST user", "test"]) {
    r = SP.feedCheck(sheet(good.concat([row("10/21/2026 9:00:00", { name: n })])), F, s2, at("2026-10-22T08:00Z"));
    ok(label + "a new row with the test name " + JSON.stringify(n) + " is reported", r.faults.length === 1 && r.faults[0].includes("test name"), r.faults);
  }
  r = SP.feedCheck(sheet(good.concat([row("10/21/2026 9:00:00", { name: "Celeste Vasquez" })])), F, s2, at("2026-10-22T08:00Z"));
  ok(label + "an ordinary name is not taken for a test name", r.faults.length === 0, r.faults);

  r = SP.feedCheck(sheet(good, F.header.slice(0, 8).concat(["Results"])), F, s2, at("2026-10-22T08:00Z"));
  ok(label + "a changed header row is reported", r.faults.some(f => f.includes("header row has changed")), r.faults);

  const ranYesterday = Object.assign({}, s2, { lastRun: "2026-10-24T08:00:00.000Z" });
  r = SP.feedCheck(sheet(good), F, ranYesterday, at("2026-10-25T08:00Z"));
  ok(label + "no new row for more than three days is reported, in local time", r.faults.length === 1 && r.faults[0] === "No new row since Oct 20, 10:00 a.m. CDT: more than 3 days.", r.faults);
  r = SP.feedCheck(sheet(good), F, ranYesterday, { now: new Date("2026-10-25T08:00Z"), term: { first: "2026-08-24", last: "2026-10-23" } });
  ok(label + "after the term's last day, a quiet Google Sheet is not reported", r.faults.length === 0, r.faults);
  r = SP.feedCheck(sheet(good), F, ranYesterday, { now: new Date("2026-10-25T08:00Z"), term: { first: "2026-10-24", last: "2026-12-12" } });
  ok(label + "in a term's first days, a quiet Google Sheet is not reported yet", r.faults.length === 0, r.faults);

  r = SP.feedCheck(sheet(good), F, s2, at("2026-10-24T09:00Z"));
  ok(label + "a check that had not run for more than two days says so", r.faults.some(f => f.startsWith("The feed check had not run since Oct 21")), r.faults);
  r = SP.feedCheck(sheet([["not a time"].concat(row("").slice(1))]), F, s2, at("2026-10-22T08:00Z"));
  ok(label + "an unreadable Timestamp is reported", r.faults.some(f => f.includes("cannot read")), r.faults);
  r = SP.feedCheck([], F, s2, at("2026-10-22T08:00Z"));
  ok(label + "an empty Google Sheet is reported", r.faults.length === 1 && r.faults[0].includes("empty"), r.faults);
}

suite(SAMPLE, "");
// Around the clock change: 1:30 a.m. on Nov 1, 2026 happens twice in Chicago; either reading is fine, but
// 3:00 a.m. on Mar 8, 2026 (after the spring change) must be 08:00 UTC.
const spring = SP.feedCheck([SAMPLE.header, ["3/8/2026 3:00:00", "Sample Exercise", "A", "learn", "", "", "", "", ""]], SAMPLE, null, { now: new Date("2026-03-08T12:00Z") });
ok("times just after the spring clock change are read right", spring.state.newestRow === "2026-03-08T08:00:00.000Z", spring.state);
if (process.env.SP_FEED_SETTINGS) {
  const real = JSON.parse(fs.readFileSync(process.env.SP_FEED_SETTINGS, "utf8"));
  suite(real, "[settings] ");
}
console.log(fails ? fails + " failure(s)" : "all feed check tests passed"); process.exit(fails ? 1 : 0);
