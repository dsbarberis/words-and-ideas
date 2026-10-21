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
    if (s.includes("const CARDS = DECK.cards;") && (!process.env.ONLY || f.includes(process.env.ONLY))) out[f] = s;
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
  s = s.replace(a, a + " window.__t={judgeExercise:(...x)=>judgeExercise(...x),goodFaith:(...x)=>goodFaith(...x),CARDS:CARDS,EX:()=>EXERCISE," +
    "quiz:()=>quiz,setQuiz:(q)=>{quiz=q;},known:()=>known,plan:()=>planNextRound(),missed:()=>roundMissed(),score:()=>roundScore()," +
    "goTo:(i)=>{quiz.pos=quiz.order.indexOf(i);inputFor=null;render();}};");
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
  const loadFails = [], modelFails = [], notes = [], effortFails = [], uiFails = [];
  const effort = { checked: 0 };
  let uiCount = 0;
  let checked = 0;
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
    if (!errors.length) {
      const ef = await page.evaluate(effortChecks);
      effort.checked += ef.checked;
      ef.fails.forEach(x => effortFails.push(f + ": " + x));
      const isEx = await page.evaluate(() => __t.EX());
      if (isEx) {
        let ui;
        try { ui = await uiChecks(page); }
        catch (e) { if (process.env.ONLY) await page.screenshot({ path: path.join(os.tmpdir(), "ui-fail.png") }); ui = { checked: 0, fails: ["the in-deck check stopped: " + String(e.message).split("\n")[0]] }; }
        uiCount += ui.checked;
        ui.fails.forEach(x => uiFails.push(f + ": " + x));
      }
    }
    await page.close();
  }
  await browser.close();
  report("decks load", loadFails, Object.keys(decks).length + " decks opened");
  report("model answers", modelFails, checked + " cards checked");
  report("answer effort", effortFails, effort.checked + " checks of the gate, the copy prompt, lists and spacing");
  report("answer effort in the deck", uiFails, uiCount + " answers typed and checked with the deck's own Check button");
  notes.forEach(n => console.log("     note: " + n));
}

// Answer effort (Answer Effort form, Oct 21, 2026). Runs inside the page.
// Every printed answer passes the gate, the copy prompt and the judging;
// every printed note typed into a box is caught; lists of accepted answers
// pass and a list with one wrong item fails; the retry is spaced.
function effortChecks() {
  const fails = []; let checked = 0;
  if (!__t.EX()) return { checked, fails };
  const COPY = "Type the answer in your own words, not the note.";
  const ARROW = "\u2192", LQ = "\u201c", RQ = "\u201d";
  function model(c) {
    if (c.kind === "typed") return c.answerText;
    if (!c.boxes) return null;
    if (c.answerLines) {
      const L = k => (c.answerLines.find(l => l[0] === k) || [])[1] || "";
      const base = L("Base"), q = base.indexOf(LQ);
      const baseForm = base.split(/[ ,]/)[0], baseMeaning = q >= 0 ? base.slice(q + 1, base.indexOf(RQ, q)) : "";
      return c.boxes.map(bx => bx.label !== "Base" && L(bx.label) ? L(bx.label) : bx.check === "deriv" ? baseForm : bx.senses ? L("Connection") : baseMeaning);
    }
    if (c.parts && c.defn) return c.boxes.map(bx => bx.check === "parts" ? c.parts.map(pt => pt.label.split("(" + ARROW)[0].split(",")[0].trim()).join(" + ") : c.defn);
    if (c.greekForms) return c.boxes.map(bx => bx.check === "greek" ? c.greek : bx.check === "deriv" ? c.deriv : c.gmean);
    return null;
  }
  window.__model = model;
  const notesOf = c => [c.note, c.caution, c.answerNote, c.derivNote].concat((c.parts || []).map(pt => pt && !Array.isArray(pt) ? pt.note : null)).filter(Boolean);
  const words = s => String(s).toLowerCase().replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean);
  __t.CARDS.forEach((c, i) => {
    const m = model(c);
    if (m == null) return;
    // 1. The printed answer passes.
    checked++;
    const gf = __t.goodFaith(c, m);
    if (gf) fails.push(c.word + c.label + ": printed answer " + JSON.stringify(m) + " refused: " + gf);
    else { const r = __t.judgeExercise(i, m); if (!r.ok && !r.tooLong) fails.push((c.word || c.label) + ": printed answer " + JSON.stringify(m) + " marked wrong"); }
    // 2. A printed note typed into a box is caught.
    notesOf(c).filter(n => words(n).length >= 5).forEach(n => {
      (c.boxes || [null]).forEach((bx, k) => {
        if (bx && ["parts", "deriv"].indexOf(bx.check) >= 0) return;
        const v = c.boxes ? m.map((x, j) => j === k ? n : x) : n;
        checked++;
        if (__t.goodFaith(c, v) !== COPY) fails.push((c.word || c.label) + ": note " + JSON.stringify(n) + " typed in " + (bx ? bx.label : "the answer") + " was not caught");
      });
    });
    // 3. A derivative copied with its note asks for just the derivative.
    if (c.derivNote) {
      checked++;
      const v = c.boxes.map((bx, k) => bx.check === "deriv" ? c.deriv + " (" + c.derivNote + ")" : m[k]);
      if (__t.goodFaith(c, v) !== "Type just the derivative.") fails.push(c.word + ": derivative with its note was not refused");
    }
    // 4. Lists of accepted answers.
    const lists = [];
    if (c.kind === "typed") {
      const one = (c.accept || []).filter(a => !/\s/.test(a.trim()));
      if (one.length) lists.push({ forms: one, put: v => v });
    }
    (c.boxes || []).forEach((bx, k) => {
      const forms = bx.check === "deriv" ? c.derivs : bx.check === "greek" ? c.greekForms : null;
      if (forms && forms.length) lists.push({ forms: forms.filter(f => !/\s/.test(f)), put: v => m.map((x, j) => j === k ? v : x) });
    });
    lists.forEach(L => {
      if (!L.forms.length) return;
      const a = L.forms[0], b = L.forms[1] || L.forms[0];
      [" or ", " and ", ", ", "/"].forEach(j => {
        const v = L.put(a + j + b);
        checked++;
        const g = __t.goodFaith(c, v), r = g ? null : __t.judgeExercise(i, v);
        if (g || !r.ok) fails.push((c.word || c.label) + ": list " + JSON.stringify(a + j + b) + " " + (g ? "refused: " + g : "marked wrong"));
      });
      const bad = L.put(a + " or zzzq");
      checked++;
      const g = __t.goodFaith(c, bad);
      if (!g && __t.judgeExercise(i, bad).ok) fails.push((c.word || c.label) + ": list with a wrong item marked right");
    });
  });
  // 5. Spacing: a missed question comes back after at least 3 other questions.
  const n = __t.CARDS.length;
  if (n >= 8) {
    const saved = __t.quiz();
    const order = [0, 1, 2, 3, 4, 5, 6, 7];
    const mk = okAt => ({ round: 1, set: "all", size: 8, order: order, pos: 7, phase: "between", sent: true, answers: order.map((_, k) => ({ a: "", ok: okAt(k) })) });
    const kn = __t.known();
    const keep = new Set(kn);
    kn.clear(); for (let k = 0; k < n; k++) if (k !== 5 && k !== 7) kn.add(k);
    __t.setQuiz(mk(k => k !== 5 && k !== 7));
    const p = __t.plan();
    checked++;
    const missedLeft = { 5: 2, 7: 0 };
    if (p.opensAt) fails.push("spacing: paused although review questions were available");
    p.order.forEach((idx, k) => {
      if (p.review[k] && (idx === 5 || idx === 7 || !kn.has(idx))) fails.push("spacing: review question " + idx + " is not one already right");
      if (!p.review[k] && missedLeft[idx] + k < 3) fails.push("spacing: question " + idx + " comes back after only " + (missedLeft[idx] + k) + " others");
    });
    if (p.order.filter((_, k) => !p.review[k]).length !== 2) fails.push("spacing: the round does not hold exactly the 2 missed questions");
    // With no right answers to review, the round opens after a pause.
    kn.clear();
    __t.setQuiz(mk(() => false));
    const p2 = __t.plan();
    checked++;
    if (p2.opensAt) fails.push("spacing: every question missed needs no pause (each keeps its place)");
    __t.setQuiz({ round: 1, set: "all", size: 1, order: [7], pos: 0, phase: "between", sent: true, answers: [{ a: "", ok: false }] });
    const p3 = __t.plan();
    checked++;
    if (!(p3.opensAt > Date.now())) fails.push("spacing: a one-question round with nothing to review did not pause");
    // Review questions never count.
    __t.setQuiz({ round: 2, set: "all", size: 8, order: [1, 7], review: [true, false], pos: 1, phase: "card", sent: false, answers: [{ a: "", ok: false }, { a: "", ok: true }] });
    checked++;
    if (__t.missed().length !== 0 || __t.score() !== 1) fails.push("spacing: a review question counted in the round");
    kn.clear(); keep.forEach(x => kn.add(x));
    __t.setQuiz(saved);
  }
  return { checked, fails };
}

// The same checks through the deck itself: a list answer typed in the boxes
// and checked with the Check button, and what a miss and a right answer show.
async function uiChecks(page) {
  const fails = []; let checked = 0;
  await page.fill("#nameInput", "Test Student");
  await page.keyboard.press("Enter");
  const start = page.locator("#quizPanel button", { hasText: "Start the quiz" });
  if (await start.count()) await start.first().click();
  const cards = await page.evaluate(() => __t.CARDS.map((c, i) => ({ i, kind: c.kind, boxes: (c.boxes || []).map(b => b.check || ""), derivs: c.derivs || [], greek: c.greekForms || [], accept: c.accept || [] })));
  const pick = [];
  const seen = {};
  cards.forEach(c => {
    const key = c.kind + c.boxes.join();
    if ((c.kind === "typed" && c.accept.some(a => !/\s/.test(a))) || c.boxes.includes("deriv") || c.boxes.includes("greek")) {
      if (!seen[key]) { seen[key] = 1; pick.push(c); }
    }
  });
  async function typeInto(vals) {
    const inputs = page.locator(".face-front .quiz-form input.quiz-input:not(.line-input)");
    for (let k = 0; k < vals.length; k++) await inputs.nth(k).fill(vals[k], { timeout: 5000 });
  }
  for (const c of pick) {
    await page.evaluate(i => { const q = __t.quiz(); q.answers[q.order.indexOf(i)] = null; __t.goTo(i); }, c.i);
    const vals = await page.evaluate(i => {
      const c = __t.CARDS[i];
      const one = f => (f || []).filter(x => !/\s/.test(x));
      if (c.kind === "typed") { const a = one(c.accept); return [a[0] + " or " + (a[1] || a[0])]; }
      return c.boxes.map(bx => {
        if (bx.check === "deriv") { const a = one(c.derivs); return a[0] + ", " + (a[1] || a[0]); }
        if (bx.check === "greek") { const a = one(c.greekForms); return a[0] + "/" + (a[1] || a[0]); }
        return null;
      }).map((v, k) => v == null ? window.__model(c)[k] : v);
    }, c.i);
    await typeInto(vals);
    await page.click("#checkBtn");
    const res = await page.evaluate(i => { const q = __t.quiz(); const a = q.answers[q.order.indexOf(i)]; return { ok: a && a.ok, note: document.getElementById("quizNote").textContent, flipped: document.getElementById("card").classList.contains("flipped") }; }, c.i);
    checked++;
    if (!res.ok) fails.push("card " + c.i + ": list " + JSON.stringify(vals) + " not accepted (" + (res.note || "marked wrong") + ")");
    else if (!res.flipped) fails.push("card " + c.i + ": right answer did not show the back");
  }
  // A miss: the back stays hidden and empty, and the front shows the marks and the study line.
  const t = cards.find(c => c.kind === "typed" || c.boxes.length);
  if (t) {
    await page.evaluate(i => { const q = __t.quiz(); q.answers[q.order.indexOf(i)] = null; __t.goTo(i); }, t.i);
    const vals = await page.evaluate(i => { const c = __t.CARDS[i]; return c.boxes ? c.boxes.map(b => b.check === "parts" ? c.parts.map(p => p.accept[0]).join(" ") : b.check === "explain" || (b.senses && b.noPenalty) ? "zebra quartz violin harbor mango" : b.check === "names" ? "Zanzibar" : b.check === "greek" ? "zzzqqq" : b.check === "deriv" ? (/^base$/i.test(b.label) ? c.word.slice(0, 3) : "zebra") : "zebra quartz violin") : ["zzzq"]; }, t.i);
    await typeInto(vals);
    await page.click("#checkBtn");
    const res = await page.evaluate(i => { const q = __t.quiz(); const a = q.answers[q.order.indexOf(i)]; return { a: a && { ok: a.ok }, note: document.getElementById("quizNote").textContent, flipped: document.getElementById("card").classList.contains("flipped"), back: document.getElementById("meaningBack").textContent.trim(), miss: document.getElementById("missNote").hidden ? "" : document.getElementById("missNote").textContent, marks: document.querySelectorAll(".face-front .box-mark, .face-front .in-no").length }; }, t.i);
    checked++;
    if (!res.a) fails.push("miss: the wrong answer was not checked (" + res.note + ")");
    else if (res.a.ok) fails.push("miss: the wrong answer was marked right");
    else {
      if (res.flipped) fails.push("miss: the back was shown");
      if (res.back) fails.push("miss: the answer is on the page (" + res.back.slice(0, 40) + ")");
      if (!/comes back later/.test(res.miss) || !/To study it/.test(res.miss)) fails.push("miss: no miss line or study line on the front");
      if (!res.marks) fails.push("miss: no marks on the front");
    }
  }
  return { checked, fails };
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
