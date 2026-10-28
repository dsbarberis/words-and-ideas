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
    "judge:(...x)=>judge(...x),judgeMeanings:(...x)=>judgeMeanings(...x),MEANINGS:()=>MEANINGS," +
    "quiz:()=>quiz,setQuiz:(q)=>{quiz=q;},known:()=>known,plan:()=>planNextRound(),space:(c)=>spaceOrder(c),setSpacing:(x)=>{spacing=x;},missed:()=>roundMissed(),score:()=>roundScore()," +
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
  const loadFails = [], modelFails = [], notes = [], effortFails = [], uiFails = [], flashFails = [];
  let flashCount = 0;
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
      if (!isEx) {
        const fc = await page.evaluate(flashcardChecks);
        flashCount += fc.checked;
        fc.fails.forEach(x => flashFails.push(f + ": " + x));
        let ui;
        try { ui = await flashcardUi(page); }
        catch (e) { ui = { checked: 0, fails: ["the in-deck check stopped: " + String(e.message).split("\n")[0]] }; }
        flashCount += ui.checked;
        ui.fails.forEach(x => flashFails.push(f + ": " + x));
      }
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
  report("Flashcard quizzes", flashFails, flashCount + " checks of meaning groups, the gate, the hidden back and spacing in the Flashcard Decks");
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
    // Element boxes: each element of the box's kind as printed, with its first meaning, or "none".
    const elModel = k => c.parts.filter(pt => pt.type === k).map(pt => pt.label.split("(" + ARROW)[0].split(",")[0].trim() + " " + pt.meanings[0]).join("; ") || "none";
    if (c.parts && c.defn) return c.boxes.map(bx => bx.check === "parts" ? c.parts.map(pt => pt.label.split("(" + ARROW)[0].split(",")[0].trim()).join(" + ") : /^el:/.test(bx.check || "") ? elModel(bx.check.slice(3)) : c.defn);
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
  // 5. Spacing: a missed question comes back after at least 3 other questions,
  // counted on every tab, or after the 2-minute pause.
  const n = __t.CARDS.length;
  if (n >= 8) {
    const saved = __t.quiz();
    const kn = __t.known();
    const keep = new Set(kn);
    const now = Date.now();
    kn.clear(); for (let k = 0; k < n; k++) if (k !== 5 && k !== 7) kn.add(k);
    // Card 5 was missed 2 questions ago, card 7 just now.
    __t.setSpacing({ n: 8, miss: { 5: { n: 6, t: now }, 7: { n: 8, t: now } } });
    const p = __t.space([5, 7]);
    checked++;
    const since = { 5: 2, 7: 0 };
    if (p.opensAt) fails.push("spacing: paused although review questions were available");
    p.order.forEach((idx, k) => {
      if (p.review[k] && (idx === 5 || idx === 7 || !kn.has(idx))) fails.push("spacing: review question " + idx + " is not one already right");
      if (!p.review[k] && since[idx] + k < 3) fails.push("spacing: question " + idx + " comes back after only " + (since[idx] + k) + " others");
    });
    if (p.order.filter((_, k) => !p.review[k]).length !== 2) fails.push("spacing: the list does not hold exactly the 2 missed questions");
    // A quiz on another tab (here a list of other questions) keeps the gap too.
    const q = __t.space([7, 0, 1, 2]);
    checked++;
    if (q.order.indexOf(7) < 3) fails.push("spacing: a question missed just now came first on another tab");
    // With nothing to review, the list opens after the pause from the miss.
    kn.clear();
    const p3 = __t.space([7]);
    checked++;
    if (!(p3.opensAt >= now + 119000)) fails.push("spacing: a one-question list with nothing to review did not pause");
    // A miss older than the pause needs no gap.
    __t.setSpacing({ n: 8, miss: { 7: { n: 8, t: now - 121000 } } });
    checked++;
    if (__t.space([7]).opensAt || __t.space([7]).order[0] !== 7) fails.push("spacing: a miss older than the pause was still held");
    // Review questions never count.
    __t.setQuiz({ round: 2, set: "all", size: 8, order: [1, 7], review: [true, false], pos: 1, phase: "card", sent: false, answers: [{ a: "", ok: false }, { a: "", ok: true }] });
    checked++;
    if (__t.missed().length !== 0 || __t.score() !== 1) fails.push("spacing: a review question counted in the round");
    __t.setSpacing({ n: 0, miss: {} });
    kn.clear(); keep.forEach(x => kn.add(x));
    __t.setQuiz(saved);
  }
  // 6. Every element of an analysis is typed as a piece of its own: a base
  // joined to its suffix ("genit" for GEN- and -it-) is wrong (instructor, Oct 22, 2026).
  __t.CARDS.forEach((c, i) => {
    if (!c.boxes || !c.parts || !c.defn || c.parts.length < 3) return;
    const forms = c.parts.map(pt => (pt.accept || [])[0] || "");
    for (let k = 0; k + 1 < forms.length; k++) {
      const joined = forms.slice(0, k).concat([forms[k] + forms[k + 1]], forms.slice(k + 2)).join(" ");
      const v = c.boxes.map(bx => bx.check === "parts" ? joined : c.defn);
      checked++;
      const g = __t.goodFaith(c, v);
      if (!g && __t.judgeExercise(i, v).ok) fails.push(c.word + ": analysis with two elements joined (" + joined + ") was marked right");
    }
  });
  // 7. A list of every person or place does not pass (Greek Lesson II).
  const named = __t.CARDS.filter(c => c.names && c.names.length);
  if (named.length > 1) {
    const all = named.map(c => c.names[0]).join(" ");
    named.forEach(c => {
      const i = __t.CARDS.indexOf(c);
      const v = c.boxes.map(bx => bx.check === "names" ? all : (c.answerLines.find(l => l[0] === bx.label) || [])[1] || "");
      checked++;
      if (__t.judgeExercise(i, v).ok) fails.push(c.word + ": a list of every card's person or place was marked right");
    });
  }
  // 8. Element boxes (instructor, Oct 24, 2026): the forms without their
  // meanings are wrong, and so is a box that leaves out an element. An
  // optional English ending (-ing, -ed) is never judged, and a named plural
  // -s or -es never fails a suffix box (instructor, Oct 27, 2026).
  __t.CARDS.forEach((c, i) => {
    if (!c.boxes || !c.parts || !c.boxes.some(bx => /^el:/.test(bx.check || ""))) return;
    const m = model(c);
    c.boxes.forEach((bx, k) => {
      if (!/^el:/.test(bx.check || "")) return;
      const mine = c.parts.filter(pt => pt.type === bx.check.slice(3));
      if (!mine.length && bx.check === "el:suffix" && __t.judgeExercise(i, m).ok) {
        checked++;
        if (!__t.judgeExercise(i, m.map((x, j) => j === k ? "-s plural ending" : x)).ok) fails.push(c.word + ": " + bx.label + " naming the plural -s was marked wrong");
      }
      if (!mine.some(pt => !pt.optional)) return;
      const bare = m.map((x, j) => j === k ? mine.map(pt => (pt.accept || [])[0]).join(" ") : x);
      checked++;
      if (__t.judgeExercise(i, bare).ok) fails.push(c.word + ": " + bx.label + " with forms but no meanings was marked right");
      if (mine.length > 1) {
        const short = m.map((x, j) => j === k ? x.split("; ").slice(1).join("; ") : x);
        checked++;
        if (__t.judgeExercise(i, short).ok) fails.push(c.word + ": " + bx.label + " missing an element was marked right");
      }
    });
  });
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
    const vals = await page.evaluate(i => { const c = __t.CARDS[i]; return c.boxes ? c.boxes.map(b => b.check === "parts" ? c.parts.map(p => p.accept[0]).join(" ") : /^el:/.test(b.check || "") ? (c.parts.filter(p => p.type === b.check.slice(3)).map(p => p.accept[0]).join(" ") || "none") : b.check === "explain" || (b.senses && b.noPenalty) ? "zebra quartz violin harbor mango" : b.check === "names" ? "Zanzibar" : b.check === "greek" ? "zzzqqq" : b.check === "deriv" ? (/^base$/i.test(b.label) ? c.word.slice(0, 3) : "zebra") : "zebra quartz violin") : ["zzzq"]; }, t.i);
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

// Flashcard Decks (Meaning Clouds and "Every quiz", instructor, Oct 23, 2026).
// Runs inside the page. Latin Roots: each group's synonyms count once and any
// one of them answers the group; every printed meaning and key word passes the
// gate; little words and the root's own forms are refused unless they are a
// meaning. Greek decks: the headword typed back and little words are refused,
// the printed definition is not. All: a missed card waits for 3 others.
function flashcardChecks() {
  const fails = []; let checked = 0;
  const C = __t.CARDS;
  if (__t.MEANINGS()) {
    C.forEach((c, i) => {
      const groups = c.meaningGroups || [];
      checked++;
      if (!groups.length || groups.length !== c.meanings.length || groups.length !== c.keys.length) { fails.push(c.word + ": groups, meanings and key-word lists do not match"); return; }
      // One synonym from each group answers the card.
      groups.forEach((g, k) => {
        g.forEach(w => {
          checked++;
          if (__t.goodFaith(c, [w])) fails.push(c.word + ": printed meaning \"" + w + "\" refused by the gate");
          // A line may fit two groups ("up from under" fits SUB-'s "under" too); it must fit its own.
          const r = __t.judgeMeanings(i, [w]);
          if (!r.rows || !r.rows.some(row => row.hits.indexOf(k) >= 0)) fails.push(c.word + ": \"" + w + "\" does not answer its group " + (k + 1));
        });
      });
      checked++;
      const one = groups.map(g => g[g.length - 1]);
      if (!__t.judgeMeanings(i, one).ok) fails.push(c.word + ": one synonym per group " + JSON.stringify(one) + " marked wrong");
      if (groups.length > 1) {
        checked++;
        if (__t.judgeMeanings(i, one.slice(1)).ok) fails.push(c.word + ": an answer missing a group was marked right");
      }
      c.keys.forEach(l => l.forEach(w => { checked++; if (__t.goodFaith(c, [w])) fails.push(c.word + ": key word \"" + w + "\" refused by the gate"); }));
      // Little words and the root's own forms are no attempt, unless they are a meaning.
      const forms = (c.word.toLowerCase().match(/[a-z()]+/g) || []).map(f => f.replace(/[()]/g, "")).filter(f => f.length >= 2);
      ["the of", "to"].concat(forms).forEach(v => {
        const isMeaning = ((__t.judgeMeanings(i, [v]).rows || [])[0] || { hits: [] }).hits.length;
        if (isMeaning) return;
        checked++;
        if (!__t.goodFaith(c, [v])) fails.push(c.word + ": \"" + v + "\" passed the gate");
      });
    });
  } else {
    C.forEach((c, i) => {
      checked++;
      if (c.defn && __t.goodFaith(c, c.defn)) fails.push(c.word + ": printed definition refused by the gate");
      checked++;
      if (!__t.goodFaith(c, "the of")) fails.push(c.word + ": little words passed the gate");
      checked++;
      if (!__t.judge(i, c.word).ok && !__t.goodFaith(c, c.word)) fails.push(c.word + ": the headword typed back passed the gate");
      // Other-card rule (instructor, Oct 28, 2026): an answer that matches its own
      // card is never refused for another card's term; an answer made only of
      // another card's term is still wrong and names that card.
      const sense = (c.senses || [])[0];
      if (!sense || !sense.groups.length) return;
      const own = sense.groups.map(g => g.terms[0].text).join(" ");
      if (!__t.judge(i, own).ok) return;
      for (let j = 0; j < C.length; j++) {
        if (j === i) continue;
        const t = (C[j].penaltyTerms || []).find(x => !__t.judge(i, x.text).ok && __t.judge(i, x.text).mixed);
        if (!t) continue;
        checked += 2;
        const both = __t.judge(i, own + " " + t.text);
        if (!both.ok) fails.push(c.word + ": \"" + own + " " + t.text + "\" matches its own card but was refused (mixed: " + both.mixed + ")");
        const alone = __t.judge(i, t.text);
        if (alone.ok || !alone.mixed) fails.push(c.word + ": \"" + t.text + "\" (another card's term alone) was not refused as mixed");
        break;
      }
    });
  }
  // A missed card comes back after at least 3 others.
  if (C.length >= 8) {
    const saved = __t.quiz();
    const kn = __t.known(); const keep = new Set(kn);
    kn.clear(); for (let k = 0; k < C.length; k++) if (k !== 7) kn.add(k);
    __t.setSpacing({ n: 8, miss: { 7: { n: 8, t: Date.now() } } });
    checked++;
    const q = __t.space([7, 0, 1, 2]);
    if (q.order.indexOf(7) < 3) fails.push("spacing: a card missed just now came back before 3 others");
    __t.setSpacing({ n: 0, miss: {} });
    kn.clear(); keep.forEach(x => kn.add(x));
    __t.setQuiz(saved);
  }
  return { checked, fails };
}

// Through the deck itself (made-up learner): a miss keeps the back empty and
// hidden, with no count on the page; a right answer shows the back, and on
// Latin Roots the count and one pill per group.
async function flashcardUi(page) {
  const fails = []; let checked = 0;
  await page.fill("#nameInput", "Test Student");
  await page.keyboard.press("Enter");
  await page.click("button.mode-tab[data-mode=quiz], .mode-tab:has-text('Quiz'), button:has-text('Quiz')");
  const start = page.locator("#quizPanel button", { hasText: "Start the quiz" });
  if (await start.count()) await start.first().click();
  const pick = await page.evaluate(() => {
    const C = __t.CARDS, M = __t.MEANINGS();
    const multi = M ? C.findIndex(c => c.meaningGroups.length > 1) : 0;
    return { M, miss: multi, right: M ? C.findIndex((c, i) => i !== multi && c.meaningGroups.length > 1) : 1 };
  });
  // A miss: only the first group answered (Latin Roots), or a wrong meaning.
  await page.evaluate(i => { const q = __t.quiz(); q.answers[q.order.indexOf(i)] = null; __t.goTo(i); }, pick.miss);
  const missVal = await page.evaluate(p => p.M ? __t.CARDS[p.miss].meaningGroups[0][0] : "zebra quartz violin", pick);
  await page.fill("#answerInput", missVal);
  await page.click("#checkBtn");
  let res = await page.evaluate(i => { const q = __t.quiz(); const a = q.answers[q.order.indexOf(i)]; return { a: a && { ok: a.ok }, flipped: document.getElementById("card").classList.contains("flipped"), back: document.getElementById("meaningBack").textContent.trim(), origin: document.getElementById("originBack").textContent.trim(), count: document.querySelectorAll(".sense-count, .sense-pill").length, miss: document.getElementById("missNote").hidden ? "" : document.getElementById("missNote").textContent }; }, pick.miss);
  checked++;
  if (!res.a) fails.push("miss: the answer was not checked");
  else if (res.a.ok) fails.push("miss: a partial or wrong answer was marked right");
  else {
    if (res.flipped) fails.push("miss: the back was shown");
    if (res.back || res.origin || res.count) fails.push("miss: the answer or the count is on the page");
    if (!/comes back later/.test(res.miss)) fails.push("miss: no \"comes back later\" line on the front");
  }
  // A right answer.
  await page.evaluate(i => { const q = __t.quiz(); q.answers[q.order.indexOf(i)] = null; __t.goTo(i); }, pick.right);
  const vals = await page.evaluate(p => p.M ? __t.CARDS[p.right].meaningGroups.map(g => g[g.length - 1]) : [__t.CARDS[p.right].defn], pick);
  await page.fill("#answerInput", vals[0]);
  for (const v of vals.slice(1)) { await page.keyboard.press("Enter"); await page.keyboard.type(v); }
  await page.click("#checkBtn");
  res = await page.evaluate(p => { const q = __t.quiz(); const a = q.answers[q.order.indexOf(p.right)]; return { a: a && { ok: a.ok }, note: document.getElementById("quizNote").textContent, flipped: document.getElementById("card").classList.contains("flipped"), pills: document.querySelectorAll("#meaningBack .sense-pill").length, count: (document.querySelector("#meaningBack .sense-count") || {}).textContent || "", groups: p.M ? __t.CARDS[p.right].meaningGroups.length : 0 }; }, pick);
  checked++;
  if (!res.a) fails.push("right: the answer was not checked (" + res.note + ")");
  else if (pick.M && !res.a.ok) fails.push("right: one synonym per group " + JSON.stringify(vals) + " marked wrong");
  else if (res.a.ok) {
    if (!res.flipped) fails.push("right: the back was not shown");
    if (pick.M && (res.pills !== res.groups || res.count !== res.groups + " of " + res.groups + " meanings")) fails.push("right: the back shows " + res.pills + " pills and \"" + res.count + "\" for " + res.groups + " meanings");
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
      // With element boxes: each element of the box's kind as printed with
      // every printed meaning, or "none".
      const elVals = k => c.parts.filter(pt => pt.type === k).map(pt => pt.label.split("(" + ARROW)[0].split(",")[0].trim() + " " + pt.meanings.join(", ")).join("; ") || "none";
      vals = c.boxes.map(bx => bx.check === "parts"
        ? c.parts.map(pt => pt.label.split("(" + ARROW)[0].split(",")[0].trim()).join(" + ")
        : /^el:/.test(bx.check || "") ? elVals(bx.check.slice(3)) : c.defn);
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
