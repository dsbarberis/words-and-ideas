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
  fs.copyFileSync(path.join(repo, "course-settings.json"), path.join(tmp, "course-settings.json"));
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
  const vfile = p => { try { return fs.readFileSync(p, "utf8"); } catch (e) { return null; } };
  if (vfile(path.join(tmp, "deck-versions.json")) !== vfile(path.join(repo, "deck-versions.json")))
    fails.push("deck-versions.json: out of date (run build.js)");
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
    "goTo:(i)=>{let k=quiz.order.indexOf(i);if(k<0){k=0;quiz.order[0]=i;quiz.answers[0]=null;if(quiz.review)quiz.review[0]=false;}quiz.pos=k;if(quiz.tries)quiz.tries[k]=0;if(quiz.first)quiz.first[k]=null;inputFor=null;render();}," +
    "load:(n)=>loadStudent(n),FROZEN:()=>FROZEN_N,ID:()=>ID,N:()=>N,BYSET:()=>QUIZ_BY_SET,markItem:(...x)=>markItem(...x)," +
    "LES:()=>LESSONS,lessons:{apply:(x)=>applySettings(x),list:()=>currentList(),set:(k)=>setIndices(k),label:(k)=>setLabel(k),title:(k)=>setTitle(k),pick:(n)=>{lessonPick=n;},cur:()=>currentLesson,tabs:(p,t)=>passTabs(p,t),count:(k)=>tabCount(k),built:()=>BUILT_SETTINGS},rules:{round:(r,p,l)=>rulesRound(r,p,l),allRight:(q)=>quizAllRight(q),SIZE:()=>ROUND_SIZE,TRIES:()=>TRIES,next:()=>quizNext(),dbg:()=>({sliding:sliding,phase:quiz&&quiz.phase,pos:quiz&&quiz.pos,n:quiz&&quiz.order.length})}," +
    "state:()=>JSON.parse(JSON.stringify({known:[...known].sort((a,b)=>a-b),learning:[...learningMarked].sort((a,b)=>a-b),pass:learnPass,marks:markSrc,spacing:spacing,quiz:quiz,quizzes:quizzes}))};");
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
  const loadFails = [], modelFails = [], notes = [], effortFails = [], uiFails = [], flashFails = [], keyFails = [];
  let keyCount = 0;
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
    // 8. Records kept by element (release A, Oct 28, 2026): Latin Roots and
    // one deck that quizzes by tab move every record from positions to keys.
    if (!errors.length && (f === "index.html" || f === "Lesson X Exercise III Flashcards.html")) {
      let kr;
      try { kr = await page.evaluate(keyedRecords); }
      catch (e) { kr = { checked: 0, fails: ["the check stopped: " + String(e.message).split("\n")[0]] }; }
      keyCount += kr.checked;
      kr.fails.forEach(x => keyFails.push(f + ": " + x));
      await page.evaluate(() => localStorage.clear());
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
        if (await page.evaluate(() => __t.LES())) {
          let lc;
          try { lc = await lessonChecks(page); }
          catch (e) { lc = { checked: 0, fails: ["the lesson check stopped: " + String(e.message).split("\n")[0]] }; }
          flashCount += lc.checked;
          lc.fails.forEach(x => flashFails.push(f + ": " + x));
        }
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
  report("records kept by element", keyFails, keyCount + " checks of moving records from card positions to element keys");
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
    // Only a card with an analysis (forms) box; element boxes are checked elsewhere.
    if (!c.boxes || !c.boxes.some(bx => bx.check === "parts") || !c.parts || !c.defn || c.parts.length < 3) return;
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
    // The first wrong try: marked, not locked, the back hidden, one more try.
    const one = await page.evaluate(i => { const q = __t.quiz(); const k = q.order.indexOf(i); return { a: !!q.answers[k], tries: q.tries[k], flipped: document.getElementById("card").classList.contains("flipped"), miss: document.getElementById("missNote").textContent, off: document.getElementById("checkBtn").disabled }; }, t.i);
    checked++;
    if (one.a || one.tries !== 1 || one.flipped || one.off || !/one more try/.test(one.miss)) fails.push("first try: " + JSON.stringify(one));
    await page.click("#checkBtn");
    const res = await page.evaluate(i => { const q = __t.quiz(); const a = q.answers[q.order.indexOf(i)]; return { a: a && { ok: a.ok, t: a.t }, note: document.getElementById("quizNote").textContent, flipped: document.getElementById("card").classList.contains("flipped"), back: document.getElementById("meaningBack").textContent.trim(), miss: document.getElementById("missNote").hidden ? "" : document.getElementById("missNote").textContent, marks: document.querySelectorAll(".face-front .box-mark, .face-front .in-no").length }; }, t.i);
    checked++;
    if (!res.a) fails.push("miss: the wrong answer was not checked (" + res.note + ")");
    else if (res.a.ok) fails.push("miss: the wrong answer was marked right");
    else {
      if (res.flipped) fails.push("miss: the back was shown");
      if (res.back) fails.push("miss: the answer is on the page (" + res.back.slice(0, 40) + ")");
      if (!/comes back in a later round/.test(res.miss) || !/To study it/.test(res.miss)) fails.push("miss: no miss line or study line on the front");
      if (res.a.t !== 2) fails.push("miss: the second try is not recorded");
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
    let otherCardChecked = 0;
    C.forEach((c, i) => {
      checked++;
      if (c.defn && __t.goodFaith(c, c.defn)) fails.push(c.word + ": printed definition refused by the gate");
      checked++;
      if (!__t.goodFaith(c, "the of")) fails.push(c.word + ": little words passed the gate");
      checked++;
      if (!__t.judge(i, c.word).ok && !__t.goodFaith(c, c.word)) fails.push(c.word + ": the headword typed back passed the gate");
      // Other-card rule (instructor, Oct 28, 2026): an answer that matches its own
      // card is never refused for another card's term, here one that typed alone
      // is refused as a mix-up (so that case still names the other card).
      const sense = (c.senses || [])[0];
      if (!sense || !sense.groups.length) return;
      const own = sense.groups.map(g => g.terms[0].text).join(" ");
      if (!__t.judge(i, own).ok) return;
      for (let j = 0; j < C.length; j++) {
        if (j === i) continue;
        // A term of the other card's that, typed alone, is refused as a mix-up.
        const t = (C[j].penaltyTerms || []).find(x => { const r = __t.judge(i, x.text); return !r.ok && r.mixed; });
        if (!t) continue;
        checked++;
        const both = __t.judge(i, own + " " + t.text);
        if (!both.ok) fails.push(c.word + ": \"" + own + " " + t.text + "\" matches its own card but was refused (mixed: " + both.mixed + ")");
        otherCardChecked++;
        break;
      }
    });
    // A deck where no card could be checked would pass silently.
    if (C.length >= 2 && !otherCardChecked) fails.push("other-card rule: no card could be checked in this deck");
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
// Lessons decks (Lesson Filter release): cards shown by the current lesson,
// the lesson menu newest first, lesson quizzes, the Quiz tab list and row names.
async function lessonChecks(page) {
  await page.fill("#nameInput", "Test Student");
  await page.keyboard.press("Enter");
  // The Quiz tab's list: nothing is open, so a change of lesson applies at once.
  await page.click("button.tab[data-mode=quiz]");
  const r = await page.evaluate(() => {
    const fails = []; let checked = 0;
    const L = __t.lessons, C = __t.CARDS;
    function check(ok, msg) { checked++; if (!ok) fails.push(msg); }
    check(C.every(c => Number.isInteger(c.lesson)), "a card has no lesson");
    const early = C.filter(c => /\b(FAC|PULS|NOMIN|LOC|SPIR|LIMIN)-/.test(c.word));
    check(early.length === 6 && early.every(c => c.lesson === 5), "the six early cards are not in Lesson V");
    // Bad settings are ignored.
    const was = L.cur();
    L.apply({ currentLesson: "XIII" }); check(L.cur() === was, "settings with a bad lesson were used");
    L.apply({ currentLesson: 5, required: [{ from: 2, to: 4, due: "2026-11-06T23:59:00-06:00" }], notice: "Lesson V starts Monday." });
    check(L.cur() === 5, "the current lesson did not change to V");
    const shown = C.map((_, i) => i).filter(i => C[i].lesson <= 5);
    check(L.list().length === shown.length && L.list().every(i => C[i].lesson <= 5), "Learn shows cards after Lesson V");
    check(L.count("all") === shown.length, "the All tab counts hidden cards");
    const menu = [...document.getElementById("lessonMenu").options].map(o => o.textContent);
    check(JSON.stringify(menu) === JSON.stringify(["Lessons II\u2013V", "Lesson V", "Lesson IV", "Lesson III", "Lesson II"]), "lesson menu: " + JSON.stringify(menu));
    L.pick(3);
    check(L.list().every(i => C[i].lesson === 3) && L.list().length === C.filter(c => c.lesson === 3).length, "picking Lesson III does not show just its cards");
    check(L.tabs({ tab: "prefix", lesson: 3 }, "unfinished") === " (Prefixes, Lesson III, unfinished)", "Learn pass name with a lesson: " + L.tabs({ tab: "prefix", lesson: 3 }, "unfinished"));
    check(L.tabs({ tab: "all" }, "") === "", "a whole Learn pass gained a bracket");
    L.pick(0);
    check(L.set("L4").length === C.filter(c => c.lesson === 4).length, "the Lesson IV quiz has the wrong cards");
    check(L.set("R2-4").length === C.filter(c => c.lesson >= 2 && c.lesson <= 4).length, "the Lessons II\u2013IV quiz has the wrong cards");
    check(L.set("all").length === shown.length, "the quiz on every lesson so far has hidden cards");
    check(L.label("L6") === "Lesson VI" && L.label("R2-10") === "Lessons II\u2013X" && L.label("L13") === "Lesson XIII", "lesson labels");
    check(L.title("all") === "Quiz: Lessons II\u2013V", "full quiz title: " + L.title("all"));
    check(document.getElementById("courseNotice").textContent === "Lesson V starts Monday." && !document.getElementById("courseNotice").hidden, "the notice is not shown");
    // A whole-deck quiz saved before the release carries over as the quiz on every lesson so far.
    const ID = __t.ID(), sl = "carry-test";
    localStorage.setItem(ID + "_quiz_v1__" + sl, JSON.stringify({ round: 2, order: [0, 1, 2], pos: 1, answers: [{ a: "x", ok: false }, null, null], phase: "card", sent: false }));
    __t.load("Carry Test");
    const st = __t.state();
    check(st.quizzes.all && st.quizzes.all.set === "all" && st.quizzes.all.round === 2 && st.quizzes.all.order.length === 3 && st.quizzes.all.size === 3, "an old saved quiz did not carry over: " + JSON.stringify(st.quizzes));
    check(!localStorage.getItem(ID + "_quiz_v2__" + sl), "the old quiz record was kept, so it could come back");
    __t.load("Test Student");
    // The quiz rules (Oct 30, 2026): rounds of about 20, a missed card back in a
    // later round with new cards, padding from cards already right, done only
    // when every card has been answered right.
    const R = __t.rules, SIZE = R.SIZE();
    check(SIZE === 20 && R.TRIES() === 2, "round size or tries changed");
    const list = C.map((_, i) => i).slice(0, 45);
    let q = R.round(1, null, list);
    check(q.order.length === SIZE && q.review.every(x => !x) && q.order.every(i => list.indexOf(i) >= 0), "round 1 is not 20 new cards");
    check(q.asked.length === SIZE && q.right.length === 0 && q.size === 45 && q.attempt, "round 1 bookkeeping");
    const missed1 = q.order.slice(0, 3);
    q.order.forEach(i => { if (missed1.indexOf(i) < 0) q.right.push(i); });
    let q2 = R.round(2, q);
    check(missed1.every(i => q2.order.indexOf(i) >= 0), "a card missed in round 1 is not in round 2 (after the break)");
    check(q2.order.length === SIZE && q2.review.filter(Boolean).length === 0 && q2.order.filter(i => q.asked.indexOf(i) < 0).length === 17, "round 2 is not the 3 missed and 17 new cards");
    check(q2.attempt === q.attempt, "the attempt changed between rounds");
    // Round 3: the 8 cards not yet asked, nothing missed: padded to 20 with cards already right.
    q2.order.forEach(i => q2.right.indexOf(i) < 0 && q2.right.push(i));
    const q3 = R.round(3, q2);
    const counted3 = q3.order.filter((_, k) => !q3.review[k]);
    check(counted3.length === 8 && q3.order.length === SIZE && q3.order.filter((_, k) => q3.review[k]).every(i => q2.right.indexOf(i) >= 0), "round 3 is not 8 new cards padded to 20 with cards already right: " + counted3.length + "/" + q3.order.length);
    check(!R.allRight(q3), "the quiz counted as done before every card was right");
    counted3.forEach(i => q3.right.push(i));
    check(R.allRight(q3), "the quiz is not done when every card is right");
    // A short quiz: as many cards as there are.
    const small = R.round(1, null, list.slice(0, 7));
    check(small.order.length === 7, "a 7-card quiz did not ask its 7 cards");
    return { checked, fails };
  });
  // The Quiz tab lists the due quiz, every lesson so far, then each lesson newest first.
  const rows = await page.$$eval("#quizPanel .quiz-row", b => b.map(x => x.dataset.set));
  r.checked++;
  if (JSON.stringify(rows) !== JSON.stringify(["R2-4", "all", "L5", "L4", "L3", "L2"])) r.fails.push("Quiz tab rows: " + JSON.stringify(rows));
  await page.click("#quizPanel .quiz-row[data-set=L4]");
  const title = await page.$eval("#quizPanel .panel-title", x => x.textContent);
  r.checked++;
  if (title !== "Quiz: Lesson IV") r.fails.push("Lesson IV quiz page: " + title);
  await page.click("#quizPanel button:has-text('Start the quiz')");
  const q = await page.evaluate(() => { const q = __t.quiz(); return { set: q.set, n: q.order.length, lesson: q.lesson, all: q.order.every(i => __t.CARDS[i].lesson === 4) }; });
  r.checked++;
  if (q.set !== "L4" || !q.all || q.lesson !== 5) r.fails.push("Lesson IV quiz: " + JSON.stringify(q));
  // A round with a miss ends with the break: Learn Missed Cards, a Learn pass named
  // for the round, then back to the same quiz.
  await page.evaluate(() => {
    const q = __t.quiz();
    q.order.forEach((i, k) => { q.answers[k] = { a: "x", ok: k !== 0 }; if (k !== 0 && !q.review[k] && q.right.indexOf(i) < 0) q.right.push(i); });
    q.pos = q.order.length - 1;
  });
  await page.waitForTimeout(600);
  const dbg = await page.evaluate(() => { __t.rules.next(); return __t.rules.dbg(); });
  const end = await page.evaluate(d => { const q = __t.quiz(); return { d: d, phase: q.phase, missed: q.missedLast, btns: [...document.querySelectorAll("#quizPanel button")].map(b => b.textContent) }; }, dbg);
  r.checked++;
  if (end.phase !== "between" || !end.missed || end.missed.length !== 1 || end.btns[0] !== "Learn Missed Cards") r.fails.push("round end: " + JSON.stringify(end));
  else {
    await page.click("#quizPanel button:has-text('Learn Missed Cards')");
    const brk = await page.evaluate(() => ({ list: __t.lessons.list(), back: !document.getElementById("breakBackBtn").hidden, name: __t.lessons.tabs({ tab: "missed", brk: { round: 1, set: "L4" } }, "") }));
    r.checked++;
    if (brk.list.length !== 1 || brk.list[0] !== end.missed[0] || !brk.back || brk.name !== " (missed cards, quiz round 1, Lesson IV)") r.fails.push("break: " + JSON.stringify(brk));
    await page.click("#breakBackBtn");
    const after = await page.evaluate(() => ({ set: __t.quiz() && __t.quiz().set, phase: __t.quiz() && __t.quiz().phase }));
    r.checked++;
    if (after.set !== "L4" || after.phase !== "between") r.fails.push("back from the break: " + JSON.stringify(after));
  }
  // Back to the list; the lesson goes back to the built-in one, then to Learn.
  await page.click("button.tab[data-mode=quiz]");
  r.checked++;
  if (!(await page.locator("#quizPanel .quiz-row").count())) r.fails.push("tapping Quiz again does not list the quizzes");
  const back = await page.evaluate(() => { __t.lessons.apply(__t.lessons.built()); return __t.lessons.cur(); });
  r.checked++;
  if (back !== 13) r.fails.push("the lesson did not go back to XIII from the quiz list: " + back);
  await page.click("button.tab[data-mode=learn]");
  return r;
}

async function flashcardUi(page) {
  const fails = []; let checked = 0;
  if (await page.isVisible("#nameInput")) {
    await page.fill("#nameInput", "Test Student");
    await page.keyboard.press("Enter");
  }
  await page.click("button.mode-tab[data-mode=quiz], .mode-tab:has-text('Quiz'), button:has-text('Quiz')");
  // A lessons deck lists its quizzes first: open the quiz on every lesson so far.
  const allRow = page.locator("#quizPanel .quiz-row[data-set=all]");
  if (await allRow.count()) await allRow.click();
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
  const one = await page.evaluate(i => { const q = __t.quiz(); const k = q.order.indexOf(i); return { a: !!q.answers[k], tries: q.tries[k], flipped: document.getElementById("card").classList.contains("flipped"), miss: document.getElementById("missNote").textContent }; }, pick.miss);
  checked++;
  if (one.a || one.tries !== 1 || one.flipped || !/one more try/.test(one.miss)) fails.push("first try: " + JSON.stringify(one));
  await page.click("#checkBtn");
  let res = await page.evaluate(i => { const q = __t.quiz(); const a = q.answers[q.order.indexOf(i)]; return { a: a && { ok: a.ok }, flipped: document.getElementById("card").classList.contains("flipped"), back: document.getElementById("meaningBack").textContent.trim(), origin: document.getElementById("originBack").textContent.trim(), count: document.querySelectorAll(".sense-count, .sense-pill").length, miss: document.getElementById("missNote").hidden ? "" : document.getElementById("missNote").textContent }; }, pick.miss);
  checked++;
  if (!res.a) fails.push("miss: the answer was not checked");
  else if (res.a.ok) fails.push("miss: a partial or wrong answer was marked right");
  else {
    if (res.flipped) fails.push("miss: the back was shown");
    if (res.back || res.origin || res.count) fails.push("miss: the answer or the count is on the page");
    if (!/comes back in a later round/.test(res.miss)) fails.push("miss: no \"comes back in a later round\" line on the front");
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

// 9. Every deck's first cards keep the keys and order they had when records
// moved to keys (card-keys.json), so older records and the Sheet's "i" still
// name the same cards; new cards only go at the end.
function testFrozenKeys(decks) {
  const frozen = JSON.parse(fs.readFileSync(path.join(repo, "standard-deck", "card-keys.json"), "utf8"));
  const fails = []; let n = 0;
  for (const [f, s] of Object.entries(decks)) {
    const m = s.match(/const DECK = (\{[\s\S]*?\});\n/);
    const deck = JSON.parse(m[1].replace(/<\\\//g, "</"));
    const want = frozen[deck.id];
    if (!want) { fails.push(f + ": deck \"" + deck.id + "\" is not in card-keys.json"); continue; }
    if (deck.frozenCount !== want.length) fails.push(f + ": frozenCount " + deck.frozenCount + ", card-keys.json lists " + want.length);
    want.forEach((k, i) => { n++; if (!deck.cards[i] || deck.cards[i].k !== k) fails.push(f + ": card " + (i + 1) + " should have key " + JSON.stringify(k) + ", has " + JSON.stringify(deck.cards[i] && deck.cards[i].k)); });
    const ks = deck.cards.map(c => c.k);
    ks.forEach((k, i) => { if (!k || ks.indexOf(k) !== i) fails.push(f + ": card " + (i + 1) + " key " + JSON.stringify(k) + " missing or repeated"); });
  }
  report("card keys frozen", fails, n + " frozen keys compared");
}

// Runs inside the page (release A, Oct 28, 2026). Writes records by card
// position under the old ("_v1") names, as the earlier deck left them, then
// checks that the deck reads them, writes them by key under "_v2", leaves the
// old records untouched, can run the move twice, takes a newer old record
// from a tab still open on the earlier deck, and survives storage failing
// partway through the move.
function keyedRecords() {
  const fails = []; let checked = 0;
  const T = __t, ID = T.ID(), N = T.N(), sl = "move-test", K = i => T.CARDS[i].k;
  function check(ok, msg) { checked++; if (!ok) fails.push(msg); }
  const names = { known: "known", learning: "learning", pass: "learnPass", marks: "markSrc", quiz: "quiz", quizzes: "quizzes", spacing: "spacing" };
  const v1 = s => ID + "_" + names[s] + "_v1__" + sl, v2 = s => ID + "_" + names[s] + "_v2__" + sl;
  localStorage.clear();
  const now = Date.now();
  const a = 0, b = Math.min(5, N - 1), c = Math.min(7, N - 1), d = Math.min(3, N - 1);
  const order = [c, b, a, d], review = [false, false, true, false];
  const q = { round: 2, set: "all", size: 4, order: order, pos: 1, answers: [{ a: "x", ok: false }, null, null, null], phase: "card", sent: false,
    review: review, next: { order: [b, c], review: [false, false] } };
  const rec = {
    known: [a, b], learning: [c],
    // An old record knew only the cards of its day: the frozen ones (cards added later, as Latin Roots gained in Lesson XIII, were not in it).
    pass: { tab: "all", start: now - 1000, last: now, list: T.CARDS.slice(0, T.FROZEN()).map((_, i) => i), seen: [a, b], marked: [a] },
    marks: { [a]: { s: "learn", d: "2026-10-20" }, [c]: { s: "quiz", d: "2026-10-21" } },
    spacing: { n: 10, miss: { [c]: { n: 8, t: now } } }
  };
  if (T.BYSET()) rec.quizzes = { all: q }; else rec.quiz = q;
  Object.keys(rec).forEach(s => localStorage.setItem(v1(s), JSON.stringify(rec[s])));
  const oldRaw = {}; Object.keys(rec).forEach(s => oldRaw[s] = localStorage.getItem(v1(s)));
  function expectState(st, label, knownWant) {
    check(JSON.stringify(st.known) === JSON.stringify(knownWant || [a, b].sort((x, y) => x - y)), label + ": Know It marks " + JSON.stringify(st.known));
    check(JSON.stringify(st.learning) === JSON.stringify([c]), label + ": Still Learning marks " + JSON.stringify(st.learning));
    check(st.pass && JSON.stringify(st.pass.seen) === JSON.stringify([a, b]) && JSON.stringify(st.pass.marked) === JSON.stringify([a]) && st.pass.list.length === T.FROZEN(), label + ": the Learn pass under way");
    check(st.marks[a] && st.marks[a].d === "2026-10-20" && st.marks[c] && st.marks[c].s === "quiz", label + ": where marks came from");
    check(st.spacing.n === 10 && st.spacing.miss[c] && st.spacing.miss[c].n === 8, label + ": spacing");
    const qq = T.BYSET() ? st.quizzes.all : st.quiz;
    check(qq && JSON.stringify(qq.order) === JSON.stringify(order) && qq.round === 2 && qq.pos === 1 && JSON.stringify(qq.review) === JSON.stringify(review) &&
      qq.answers[0] && qq.answers[0].a === "x", label + ": the quiz in round 2, with review");
    // Under the quiz rules (Oct 30, 2026) a quiz saved before them keeps its round, drops its old
    // plan for the next round, and knows its cards: those in this round are not yet right.
    check(qq && !qq.next && Array.isArray(qq.list) && qq.list.length && [c, b, d].every(x => qq.right.indexOf(x) < 0) && qq.list.filter(x => [c, b, d].indexOf(x) < 0).every(x => qq.right.indexOf(x) >= 0),
      label + ": the saved quiz moved to the quiz rules");
  }
  // 1. The move.
  T.load("Move Test");
  expectState(T.state(), "first load");
  const k2 = JSON.parse(localStorage.getItem(v2("known")) || "null");
  check(Array.isArray(k2) && k2.indexOf(K(a)) >= 0 && k2.indexOf(K(b)) >= 0, "the new Know It record names cards by key: " + JSON.stringify(k2));
  const q2 = JSON.parse(localStorage.getItem(v2(T.BYSET() ? "quizzes" : "quiz")) || "null");
  const qk = T.BYSET() ? q2 && q2.all : q2;
  check(qk && qk.order[0] === K(c) && qk.next.order[0] === K(b), "the new quiz record names cards by key");
  const sp2 = JSON.parse(localStorage.getItem(v2("spacing")) || "null");
  check(sp2 && sp2.miss[K(c)], "the new spacing record names cards by key");
  Object.keys(oldRaw).forEach(s => check(localStorage.getItem(v1(s)) === oldRaw[s], "the old " + s + " record was changed"));
  // 2. Twice.
  const snap = {}; Object.keys(names).forEach(s => snap[s] = localStorage.getItem(v2(s)));
  T.load("Move Test");
  expectState(T.state(), "second load");
  Object.keys(names).forEach(s => check(localStorage.getItem(v2(s)) === snap[s], "a second load changed the new " + s + " record"));
  // 3. A record by key reaches its card wherever it sits; an unknown key is dropped.
  const e = Math.min(9, N - 1);
  localStorage.setItem(v2("known"), JSON.stringify([K(a), K(b), K(e), "NO-SUCH-CARD"]));
  T.load("Move Test");
  check(JSON.stringify(T.state().known) === JSON.stringify([a, b, e].filter((x, i, arr) => arr.indexOf(x) === i).sort((x, y) => x - y)), "a Know It record by key: " + JSON.stringify(T.state().known));
  // 4. A tab still open on the earlier deck writes the old record: it is newer and wins.
  localStorage.setItem(v1("known"), JSON.stringify([d]));
  T.load("Move Test");
  check(JSON.stringify(T.state().known) === JSON.stringify([d]), "the newer old record was not taken: " + JSON.stringify(T.state().known));
  check(JSON.stringify(JSON.parse(localStorage.getItem(v2("known")))) === JSON.stringify([K(d)]), "the newer old record was not moved");
  localStorage.setItem(v1("known"), oldRaw.known);
  // 4b. An old position at or past the frozen cards names no card and is dropped.
  const keepK = localStorage.getItem(v1("known"));
  localStorage.setItem(v1("known"), JSON.stringify([a, T.FROZEN(), T.FROZEN() + 3]));
  T.load("Move Test");
  check(JSON.stringify(T.state().known) === JSON.stringify([a]), "an old position past the frozen cards was kept: " + JSON.stringify(T.state().known));
  localStorage.setItem(v1("known"), keepK);
  // 5. Storage failing partway through the move.
  Object.keys(names).forEach(s => localStorage.removeItem(v2(s)));
  localStorage.removeItem(ID + "_movedFrom_v2__" + sl);
  const set = Storage.prototype.setItem; let calls = 0;
  Storage.prototype.setItem = function (k, v) { if (++calls > 2) throw new Error("full"); return set.call(this, k, v); };
  try { T.load("Move Test"); expectState(T.state(), "load with storage failing"); }
  finally { Storage.prototype.setItem = set; }
  check(localStorage.getItem(ID + "_movedFrom_v2__" + sl) === null, "the move was marked done although it failed partway");
  T.load("Move Test");
  expectState(T.state(), "load after storage recovered");
  check(localStorage.getItem(ID + "_movedFrom_v2__" + sl) !== null, "the move was not finished after storage recovered");
  // 6. The Sheet gets the element key on Latin Roots only.
  const item = T.markItem(a, true, new Set());
  if (T.MEANINGS && T.MEANINGS()) check(item.i === a && item.e === K(a), "a Learn entry for the Sheet lacks \"e\": " + JSON.stringify(item));
  else check(item.e === undefined, "a deck not of glossary entries sends \"e\"");
  localStorage.clear();
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

// Deck versions (reload prompt, Old Deck Pages plan, Oct 28, 2026): every
// built page carries the DECK_VERSION and page name that deck-versions.json
// gives it, so an open page offers a reload only when its deck has changed.
function testDeckVersions(decks) {
  const fails = [];
  let list = null;
  try { list = JSON.parse(fs.readFileSync(path.join(repo, "deck-versions.json"), "utf8")); }
  catch (e) { fails.push("deck-versions.json: missing or not JSON (run build.js)"); }
  if (list) {
    for (const [f, s] of Object.entries(decks)) {
      const v = (s.match(/const DECK_VERSION = "([^"]*)";/) || [])[1];
      const p = (s.match(/const DECK_PAGE = "([^"]*)";/) || [])[1];
      if (!v || !/^[0-9a-f]{12}$/.test(v)) fails.push(f + ": no DECK_VERSION of 12 hex digits");
      else if (list[f] !== v) fails.push(f + ": DECK_VERSION " + v + " but deck-versions.json gives " + JSON.stringify(list[f]));
      if (p !== f) fails.push(f + ": DECK_PAGE is " + JSON.stringify(p) + ", not the page's own file name");
    }
    if (!process.env.ONLY) Object.keys(list).forEach(f => { if (!(f in decks)) fails.push("deck-versions.json lists " + f + ", which is not a built deck"); });
  }
  report("deck versions", fails, Object.keys(decks).length + " pages compared with deck-versions.json");
}

// 11. Reload prompt and new-round lock (Old Deck Pages plan, Oct 28, 2026;
// D's "Lock new rounds", Oct 29). The pages are served over a local http
// server so the version check can run; deck-versions.json is served from a
// list the test changes. Starting point: the Tools and Tests Desk's hand probe.
async function reloadPromptTests(decks) {
  const fails = []; let checked = 0;
  const ex = "Lesson XII Exercise III Flashcards.html", fc = "Greek History Flashcards.html";
  const want = [ex, fc].filter(f => decks[f]);
  if (!want.length) { report("reload prompt", [], "not run (neither deck built)"); return; }
  let chromium;
  try { ({ chromium } = require("playwright")); }
  catch (e) { report("reload prompt", ["Playwright not found; run with NODE_PATH=$(npm root -g)"], "not run"); return; }
  const http = require("http");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "deck-reload-"));
  want.forEach(f => testCopy(tmp, f, decks[f]));
  const versions = JSON.parse(fs.readFileSync(path.join(repo, "deck-versions.json"), "utf8"));
  const srv = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0].slice(1));
    if (u === "deck-versions.json") { r.setHeader("content-type", "application/json"); return r.end(JSON.stringify(versions)); }
    try { r.end(fs.readFileSync(path.join(tmp, path.basename(u)))); } catch (e) { r.statusCode = 404; r.end(); }
  });
  await new Promise(ok => srv.listen(0, "127.0.0.1", ok));
  const base = "http://127.0.0.1:" + srv.address().port + "/";
  const browser = await chromium.launch();
  const NEW = "abcdef123456";
  async function open(f, qs) {
    const page = await browser.newPage();
    await page.route(/^https?:/, r => r.request().url().startsWith(base) ? r.continue() : r.abort());
    const got = page.waitForResponse(r => r.url().includes("deck-versions.json"), { timeout: 10000 });
    await page.goto(base + encodeURIComponent(f) + (qs || ""));
    await page.waitForFunction(() => window.__t, null, { timeout: 10000 });
    await got; await page.waitForTimeout(100);
    return page;
  }
  const barShown = page => page.evaluate(() => !document.getElementById("updateBar").hidden);
  async function toQuiz(page) {
    await page.fill("#nameInput", "Test Student");
    await page.keyboard.press("Enter");
    // Exercise Decks open straight on the quiz; other decks have a Quiz tab.
    const tab = page.locator(".tab:visible", { hasText: /^Quiz$/ });
    if (await tab.count()) await tab.first().click();
  }
  async function recheck(page) {
    const got = page.waitForResponse(r => r.url().includes("deck-versions.json"), { timeout: 10000 });
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await got; await page.waitForTimeout(100);
  }
  try {
    for (const f of want) {
      const orig = versions[f], isEx = f === ex;
      let page = await open(f);
      checked++; if (await barShown(page)) fails.push(f + ": banner shown when the version is the same");
      // Mid-round: Exercise Decks show the banner, other decks wait for the round's end.
      await toQuiz(page);
      const start = page.locator("#quizPanel button", { hasText: "Start the quiz" });
      if (await start.count()) await start.first().click();
      const begun = await page.evaluate(() => { const q = __t.quiz(); if (!q || !q.answers || q.answers.length < 2) return false; q.answers[0] = { ok: true }; return true; });
      if (begun) {
        versions[f] = NEW;
        await recheck(page);
        checked++;
        const shown = await barShown(page);
        if (isEx && !shown) fails.push(f + ": banner not shown mid-round on an Exercise Deck");
        if (!isEx && shown) fails.push(f + ": banner shown mid-round on a Flashcard Deck");
      } else fails.push(f + ": could not start a round");
      await page.close();
      // A newer version on open: banner, and a new round is locked.
      versions[f] = NEW;
      page = await open(f);
      checked++; if (!(await barShown(page))) fails.push(f + ": banner not shown when the version changed");
      await page.evaluate(() => localStorage.clear());
      await toQuiz(page);
      const before = await page.evaluate(() => JSON.stringify(__t.quiz()));
      const st = page.locator("#quizPanel button", { hasText: "Start the quiz" });
      if (await st.count()) {
        await st.first().click();
        const after = await page.evaluate(() => ({ q: JSON.stringify(__t.quiz()), text: document.getElementById("updateBarText").textContent, shown: !document.getElementById("updateBar").hidden }));
        checked++;
        if (after.q !== before) fails.push(f + ": a new round started although a newer version exists");
        if (!after.shown || !/start a new round/.test(after.text)) fails.push(f + ": the lock did not say to reload (" + JSON.stringify(after.text) + ")");
      } else fails.push(f + ": no Start the quiz button to test the lock");
      // Reload goes to ?v=<new>.
      await Promise.all([page.waitForNavigation({ timeout: 10000 }), page.click("#updateReloadBtn")]);
      checked++; if (new URL(page.url()).searchParams.get("v") !== NEW) fails.push(f + ": Reload went to " + page.url());
      await page.close();
      // The address already asked for that version: no banner and no lock.
      page = await open(f, "?v=" + NEW);
      checked++; if (await barShown(page)) fails.push(f + ": banner shown again after a reload to ?v=");
      await page.close();
      versions[f] = orig;
    }
  } catch (e) { fails.push("the check stopped: " + String(e.message).split("\n")[0]); }
  await browser.close(); srv.close();
  report("reload prompt", fails, checked + " checks of the update banner, the new-round lock and the reload address");
}

(async () => {
  const decks = builtDecks();
  testBuildMatches(decks);
  testDeckVersions(decks);
  testNoWorkingNotes(decks);
  testFrozenKeys(decks);
  await browserTests(decks);
  await reloadPromptTests(decks);
  const failed = results.filter(r => r.failures.length);
  console.log(failed.length ? failed.length + " of " + results.length + " tests failed: do not publish" : "all " + results.length + " tests passed");
  process.exit(failed.length ? 1 : 0);
})();
