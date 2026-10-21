// Deck tests: run before every publish (Deck Creation Practices form, Oct 15, 2026).
//   NODE_PATH=$(npm root -g) node standard-deck/tests/run.js
// Exit code 1 if any test fails; do not publish until all pass.
// Each new deck problem adds a test here. See README.md in this folder.
const fs = require("fs"), os = require("os"), path = require("path");
const { execFileSync } = require("child_process");

const repo = path.resolve(__dirname, "..", "..");
const results = [];
function report(name, failures, summary) {
  results.push({ name, failures });
  console.log((failures.length ? "FAIL " : "pass ") + name + ": " + summary);
  failures.forEach(f => console.log("     " + f));
}

// The decks built from the repository, keyed by file name.
function builtDecks() {
  const out = {};
  for (const f of fs.readdirSync(repo).filter(x => x.endsWith(".html"))) {
    const s = fs.readFileSync(path.join(repo, f), "utf8");
    if (s.includes("const CARDS = DECK.cards;")) out[f] = s;
  }
  return out;
}

// 1. The published files are what build.js makes from the deck sources, so no
// one has edited a built deck by hand and no unintended deck has changed.
function testBuildMatches(decks) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "deck-build-"));
  fs.cpSync(path.join(repo, "standard-deck"), path.join(tmp, "standard-deck"), { recursive: true });
  execFileSync("node", [path.join(tmp, "standard-deck", "build.js")], { stdio: "pipe" });
  const fails = [];
  const rebuilt = fs.readdirSync(tmp).filter(x => x.endsWith(".html"));
  for (const f of rebuilt) {
    if (!(f in decks)) fails.push(f + ": built but not in the repository");
    else if (fs.readFileSync(path.join(tmp, f), "utf8") !== decks[f]) fails.push(f + ": differs from a fresh build (run build.js and check the change is intended)");
  }
  for (const f of Object.keys(decks)) if (!rebuilt.includes(f)) fails.push(f + ": in the repository but not made by build.js");
  // The report differs only in its date line when nothing else changed.
  const strip = s => s.replace(/^Written by build\.js.*$/m, "");
  const rep = p => strip(fs.readFileSync(p, "utf8"));
  if (rep(path.join(tmp, "standard-deck", "build-report.md")) !== rep(path.join(repo, "standard-deck", "build-report.md")))
    fails.push("standard-deck/build-report.md: out of date (run build.js)");
  report("build matches", fails, rebuilt.length + " decks rebuilt and compared");
}

// 2. No working notes reach students: wording-source marks stay in the sources.
function testNoWorkingNotes(decks) {
  const fails = [];
  const marks = [/Claude, unchecked/, /checked by Claude/, /Claude's condensation/, /no answer key was supplied/, /\(from p\. \d+/];
  for (const [f, s] of Object.entries(decks)) {
    const m = s.match(/const DECK = (\{[\s\S]*?\});\n/);
    const data = m ? m[1] : s;
    marks.forEach(re => { if (re.test(data)) fails.push(f + ": deck data contains " + re); });
  }
  report("no working notes on cards", fails, Object.keys(decks).length + " decks searched");
}

// A test copy of a deck: Sheet sending cut off and the judge exposed.
function testCopy(tmp, f, s) {
  const a = "const CARDS = DECK.cards;";
  s = s.replace(a, a + " window.__t={judgeExercise:(...x)=>judgeExercise(...x),goodFaith:(...x)=>goodFaith(...x),CARDS:CARDS,EX:()=>EXERCISE,quiz:()=>quiz,render:()=>render()};");
  s = s.replace("function sendToSheet(payload) {", "function sendToSheet(payload) { return;");
  const out = path.join(tmp, f);
  fs.writeFileSync(out, s);
  return out;
}

async function browserTests(decks) {
  let chromium;
  try { ({ chromium } = require("playwright")); }
  catch (e) { report("browser tests", ["Playwright not found; run with NODE_PATH=$(npm root -g)"], "not run"); return; }
  const browser = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "deck-test-"));
  const loadFails = [], modelFails = [], stuckFails = [], notes = [];
  let checked = 0, gated = 0;
  for (const [f, s] of Object.entries(decks)) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.route(/^https?:/, r => r.abort()); // nothing leaves the test copy
    await page.goto("file://" + testCopy(tmp, f, s));
    try { await page.waitForFunction(() => window.__t, null, { timeout: 10000 }); }
    catch (e) { errors.push("deck did not start"); }
    // 3. Every deck loads without a script error.
    errors.forEach(m => loadFails.push(f + ": " + m));
    // 4. Every Exercise Deck card accepts its own answer as the back prints it
    // (the Oct 12 impend and magnate mistake; first kept as
    // the project's private deck-checks tool, Oct 15).
    if (!errors.length) {
      const res = await page.evaluate(modelAnswers);
      checked += res.checked;
      res.fails.forEach(x => modelFails.push(f + ": " + x.word + " typed " + JSON.stringify(x.typed) + " got " + JSON.stringify(x.result)));
      if (res.long.length) notes.push(f + ": printed answer longer than the box allows (student asked to shorten): " + res.long.join(", "));
    }
    await page.close();
    // 5. A card that refuses to check until the analysis or base is typed
    // always has a way on (Oct 21, 2026: a student took the refusal for a freeze).
    if (!errors.length && /check"?: ?"(parts|deriv)"/.test(s)) {
      const r = await stuckCard(browser, tmp, f, s);
      if (r.skipped) continue;
      gated++;
      r.fails.forEach(m => stuckFails.push(f + ": " + m));
    }
  }
  await browser.close();
  report("decks load", loadFails, Object.keys(decks).length + " decks opened");
  report("model answers", modelFails, checked + " cards checked");
  report("stuck card has a way on", stuckFails, gated + " decks with a refusing card tried");
  notes.forEach(n => console.log("     note: " + n));
}

// A refused check: type "idk" twice into a card that needs an analysis or a
// base, then Show the answer must turn the card, missed, so Next works.
async function stuckCard(browser, tmp, f, s) {
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
  const fails = [];
  page.on("pageerror", e => fails.push("script error: " + e.message));
  await page.route(/^https?:/, r => r.abort());
  await page.goto("file://" + testCopy(tmp, f, s));
  await page.waitForFunction(() => window.__t, null, { timeout: 10000 });
  await page.fill("#nameInput", "Test Student");
  await page.click("#beginBtn");
  const start = await page.$("button:visible >> text=/Start the quiz/");
  if (!start) { await page.close(); return { skipped: true }; }
  await start.click();
  const found = await page.evaluate(() => {
    const q = __t.quiz();
    const k = q.order.findIndex(i => (__t.CARDS[i].boxes || []).some(b => b.check === "parts" || (b.check === "deriv" && /^base$/i.test(b.label || ""))));
    if (k < 0) return false;
    q.pos = k; __t.render(); return true;
  });
  if (!found) { await page.close(); return { skipped: true }; }
  for (let t = 0; t < 2; t++) {
    for (const x of await page.$$(".quiz-input:visible")) if (!(await x.isDisabled())) await x.fill("idk");
    await page.click("#checkBtn");
    await page.waitForTimeout(100);
  }
  const st = await page.evaluate(() => ({ note: document.getElementById("quizNote").textContent, btn: !!document.getElementById("showAnswerBtn") && !document.getElementById("showAnswerBtn").hidden }));
  if (!st.note) fails.push("a refused check shows no message");
  if (!st.btn) fails.push("no Show the answer button after two refused checks");
  else {
    await page.click("#showAnswerBtn");
    await page.waitForTimeout(100);
    const after = await page.evaluate(() => { const q = __t.quiz(), a = q.answers[q.pos]; return { a: !!a, ok: a && a.ok, next: !document.getElementById("quizNextBtn").disabled }; });
    if (!after.a || after.ok !== false) fails.push("Show the answer did not mark the card missed");
    if (!after.next) fails.push("Next stays off after Show the answer");
  }
  await page.close();
  return { fails };
}

// Runs inside the page. Types each card's printed answer into its own boxes.
function modelAnswers() {
  const LQ = "“", RQ = "”", ARROW = "→";
  const fails = [], long = []; let checked = 0;
  if (!__t.EX()) return { checked, fails, long };
  __t.CARDS.forEach((c, i) => {
    if (!c.boxes) return;
    let vals = null;
    if (c.answerLines) {
      const L = k => (c.answerLines.find(l => l[0] === k) || [])[1] || "";
      // Exercise IV prints the base and its meaning on one "Base" line and the
      // model connection as "Connection"; other decks print one line per box label.
      const base = L("Base"), q = base.indexOf(LQ);
      const baseForm = base.split(/[ ,]/)[0], baseMeaning = q >= 0 ? base.slice(q + 1, base.indexOf(RQ, q)) : "";
      vals = c.boxes.map(bx => bx.label !== "Base" && L(bx.label) ? L(bx.label)
        : bx.check === "deriv" ? baseForm : bx.senses ? L("Connection") : baseMeaning);
    } else if (c.parts && c.defn) {
      // Exercise III: the forms-only line, then the definition.
      vals = c.boxes.map(bx => bx.check === "parts"
        ? c.parts.map(pt => pt.label.split("(" + ARROW)[0].split(",")[0].trim()).join(" + ") : c.defn);
    }
    // An accepted derivative must also pass the check made before judging
    // (Greek Introduction's devil, diabolical: refused Oct 14 to 18).
    if (c.derivs && !c.answerLines) c.derivs.forEach(d => {
      const v = c.boxes.map(bx => bx.check === "deriv" ? d : "");
      const gf = __t.goodFaith(c, v);
      if (gf) fails.push({ word: c.word, typed: v, result: "refused before checking: " + gf });
    });
    if (!vals) return;
    checked++;
    const gf = __t.goodFaith(c, vals);
    if (gf) { fails.push({ word: c.word, typed: vals, result: "refused before checking: " + gf }); return; }
    const r = __t.judgeExercise(i, vals);
    // Too long is not a wrong mark: the student is asked to shorten the answer.
    if (r.tooLong) long.push(c.word);
    else if (!r.ok) fails.push({ word: c.word, typed: vals, result: r });
  });
  return { checked, fails, long };
}

(async () => {
  const decks = builtDecks();
  testBuildMatches(decks);
  testNoWorkingNotes(decks);
  await browserTests(decks);
  const failed = results.filter(r => r.failures.length);
  console.log(failed.length ? failed.length + " of " + results.length + " tests failed: do not publish" : "all " + results.length + " tests passed");
  process.exit(failed.length ? 1 : 0);
})();
