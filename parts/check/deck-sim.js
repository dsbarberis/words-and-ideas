// Deck simulation (part 1.10): simulated Learn and Quiz passes on built decks, with the Sheet rows they
// would send, recorded before a deck moves and compared byte for byte after (plan, rules 3 and 4).
//   NODE_PATH=$(npm root -g) node parts/check/deck-sim.js DECK.html [...] (--record DIR | --check DIR)
// Each deck is copied, its Sheet-sending code is found and wrapped to record each row, and every web
// request is blocked and recorded with its body, so a test row can never reach the class Sheet. If the
// sending code is not found, the simulation STOPS rather than trust the network block alone.
// Time is fixed (Oct 14, 2026, 15:00 UTC; the page's clock only moves when the simulation moves it) and
// random choices are seeded, so a deck
// that has not changed gives the same rows every run. The records hold the form's address and field
// names, so they live in the private shared folder, never in this repository.
const fs = require("fs"), os = require("os"), path = require("path");
const { chromium } = require("playwright");
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const decks = args.filter((a, i) => !a.startsWith("--") && !["--record", "--check"].includes(args[i - 1]));
const outDir = opt("--record") || opt("--check");
if (!decks.length || !outDir) { console.log("usage: deck-sim.js DECK.html [...] (--record DIR | --check DIR)"); process.exit(2); }
const SEND = "function sendToSheet(payload) {";
const HOOK = "const CARDS = DECK.cards;";
const T = `window.__t = { CARDS: CARDS, EX: () => EXERCISE, markKnown: () => markKnown(), markLearning: () => markLearning(), goNext: () => goNext(),
  setMode: m => setMode(m), startQuiz: () => startQuiz(), startNextRound: () => startNextRound(), checkAnswer: c => checkAnswer(c), quizNext: () => quizNext(),
  setPick: a => { orderPick = a; }, poolOrder: it => poolOrder(it),
  state: () => ({ mode: mode, quiz: quiz ? { pos: quiz.pos, phase: quiz.phase, round: quiz.round, n: quiz.order.length, idx: quiz.order[quiz.pos], answered: !!quiz.answers[quiz.pos] } : null }) };`;

class Stop extends Error {}
function testCopy(file, tmp) {
  let s = fs.readFileSync(file, "utf8");
  if (s.split(SEND).length !== 2) throw new Stop(`${path.basename(file)}: the code that sends to the Sheet ("${SEND}") was not found exactly once; the simulation stops rather than rely on the network block`);
  if (s.split(HOOK).length !== 2) throw new Stop(`${path.basename(file)}: "${HOOK}" not found; update the simulation's hooks with the deck's new code`);
  s = s.replace(SEND, SEND + " (window.__rows = window.__rows || []).push(JSON.parse(JSON.stringify(payload)));");
  s = s.replace(HOOK, HOOK + " " + T);
  const out = path.join(tmp, path.basename(file)); fs.writeFileSync(out, s); return out;
}

async function simulate(browser, file, tmp) {
  const copy = testCopy(file, tmp);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const requests = [];
  await ctx.route("**/*", r => { const q = r.request(); if (q.url().startsWith("file:")) return r.continue(); requests.push({ method: q.method(), url: q.url(), body: q.postData() || null }); return r.abort(); });
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", e => errors.push(String(e.message || e)));
  await page.clock.install({ time: new Date("2026-10-14T15:00:00Z") });
  await page.addInitScript(() => { let a = 1; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; window.__STANDIN_CONFIG = { available: true, userId: "u_sample" }; });
  await page.addInitScript({ path: path.join(__dirname, "stand-in.js") });
  const tick = ms => page.clock.runFor(ms || 400);
  await page.goto("file://" + copy, { waitUntil: "load" });
  await page.clock.pauseAt(new Date("2026-10-14T15:00:01Z")); await tick(1000);   // from here time moves only when the simulation moves it
  if (!(await page.evaluate(() => !!window.__t))) throw new Stop(path.basename(file) + ": the deck did not start");
  await page.fill("#nameInput", "Sample Student"); await page.click("#beginBtn"); await tick(1000);
  const info = await page.evaluate(() => ({ ex: __t.EX(), n: __t.CARDS.length }));
  const steps = [], notes = [];
  if (!info.ex) {
    // A whole Learn pass: two of every three cards marked known, then a pass left unfinished.
    for (let k = 0; k < info.n; k++) { await page.evaluate(k => k % 3 ? __t.markKnown() : __t.markLearning(), k); await tick(1000); }
    steps.push("learn pass");
    for (let k = 0; k < 3; k++) { await page.evaluate(() => __t.goNext()); await tick(1000); }
    steps.push("learn, unfinished");
  }
  await page.evaluate(() => __t.setMode("quiz")); await tick();
  if (!(await page.evaluate(() => __t.state().quiz))) { await page.evaluate(() => __t.startQuiz()); await tick(); }
  // Quiz rounds 1 and 2: every other answer is the card's own wording where the card has one, else made up.
  for (let round = 1; round <= 2; round++) {
    let guard = 0;
    while (guard++ < 400) {
      const st = await page.evaluate(() => __t.state());
      if (!st.quiz || st.quiz.phase !== "card") break;
      if (!st.quiz.answered) {
        const answer = (k, forceWrong, wordOnly) => page.evaluate(([k, forceWrong, wordOnly]) => {
          const c = __t.CARDS[__t.state().quiz.idx], right = k % 2 === 0 && !forceWrong;
          if (__t.EX() && c.kind === "choice") return __t.checkAnswer(k % 2);
          if (__t.EX() && c.kind === "order") { const p = __t.poolOrder(c); __t.setPick(right ? p.slice().sort((a, b) => a - b) : p); return __t.checkAnswer(); }
          let vals;
          if (c.boxes) {
            // Box cards: the printed answer, as the deck tests type it (standard-deck/tests/run.js, model answers);
            // a wrong try keeps the analysis and base boxes and makes up the meaning, so the good-faith check passes.
            const LQ = "\u201c", RQ = "\u201d", ARROW = "\u2192";
            if (c.answerLines) {
              const L = q => (c.answerLines.find(l => l[0] === q) || [])[1] || "";
              const base = L("Base"), qi = base.indexOf(LQ), baseForm = base.split(/[ ,]/)[0], baseMeaning = qi >= 0 ? base.slice(qi + 1, base.indexOf(RQ, qi)) : "";
              vals = c.boxes.map(bx => bx.label !== "Base" && L(bx.label) ? L(bx.label) : bx.check === "deriv" ? baseForm : bx.senses ? L("Connection") : baseMeaning);
            } else if (c.parts && c.defn) vals = c.boxes.map(bx => bx.check === "parts" ? c.parts.map(pt => pt.label.split("(" + ARROW)[0].split(",")[0].trim()).join(" + ") : c.defn);
            else vals = c.boxes.map(bx => bx.check === "greek" ? c.greek || "" : bx.check === "mean" ? c.gmean || "" : bx.check === "deriv" ? c.deriv || "" : "made-up answer");
            if (!right) vals = vals.map((v, i) => ["parts", "deriv", "greek"].includes(c.boxes[i].check) ? v : "made-up answer");
            if (wordOnly) vals = vals.map((v, i) => ["parts", "deriv"].includes(c.boxes[i].check) ? String(c.word).toLowerCase() : v);
          } else {
            const own = (c.senses && c.senses[0] && c.senses[0].star && c.senses[0].star[0]) || (c.accepted && c.accepted[0]) || "";
            vals = [right && own ? own : "made-up answer"];
          }
          document.getElementById("answerInput").value = vals[0];
          document.querySelectorAll("#card .more-boxes input").forEach((i, k) => { i.value = vals[k + 1] || ""; });
          __t.checkAnswer();
        }, [k, forceWrong, !!wordOnly]);
        const answered = () => page.evaluate(() => { const b = document.getElementById("egPop"); if (b) b.hidden = true; return __t.state().quiz.answered; });
        // A printed answer longer than the box allows is refused (the deck asks for a shorter one): then answer wrongly.
        const k = st.quiz.pos + round;
        await answer(k, false); await tick(300);
        if (!(await answered())) {
          const said = await page.textContent("#quizNote");
          const word = await page.evaluate(() => __t.CARDS[__t.state().quiz.idx].word);
          if (k % 2 === 0 && !/keep (your answer|each meaning)/.test(said)) notes.push(`${word}: the card's own answer was refused ("${said}")`);
          await answer(k, true); await tick(300);
        }
        if (!(await answered())) { await answer(k, true, true); await tick(300); }   // the good-faith check wants letters from the word itself
        if (!(await answered())) throw new Stop(`${path.basename(file)}: card ${st.quiz.idx} would not take an answer (the deck said: "${await page.textContent("#quizNote")}")`);
      }
      await page.evaluate(() => __t.quizNext()).catch(e => errors.push(String(e.message || e).split("\n")[0])); await tick(1000);
    }
    steps.push("quiz round " + round);
    const st = await page.evaluate(() => __t.state());
    if (round === 1) { if (st.quiz && st.quiz.phase === "between") { await page.evaluate(() => __t.startNextRound()); await tick(); } else break; }
  }
  await tick(4000);
  const end = await page.evaluate(() => {
    const dump = s => { const o = {}; for (let i = 0; i < s.length; i++) o[s.key(i)] = s.getItem(s.key(i)); return o; };
    return { rows: window.__rows || [], db: window.__standin ? { log: window.__standin.log, docs: window.__standin.docs } : null, local: dump(localStorage) };
  });
  await ctx.close();
  const sheet = requests.filter(r => r.method === "POST");
  if (sheet.length !== end.rows.length) throw new Stop(`${path.basename(file)}: ${end.rows.length} rows made but ${sheet.length} posts seen; the sending code has changed`);
  return { deck: path.basename(file), steps, notes, rows: end.rows, posts: sheet, otherRequests: requests.filter(r => r.method !== "POST").map(r => r.url), attempts: end.db, localStorage: end.local, errors };
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "deck-sim-"));
  const browser = await chromium.launch();
  let failed = 0;
  try {
    for (const d of decks) {
      const got = await simulate(browser, d, tmp);
      const f = path.join(outDir, got.deck.replace(/\.html$/, "") + ".json");
      got.notes.forEach(n => console.log("     note: " + got.deck + ": " + n));
      if (opt("--record")) { fs.mkdirSync(outDir, { recursive: true }); fs.writeFileSync(f, JSON.stringify(got, null, 1) + "\n"); console.log(`recorded ${got.deck}: ${got.steps.join(", ")}; ${got.rows.length} Sheet rows`); continue; }
      if (!fs.existsSync(f)) { failed++; console.log("FAIL " + got.deck + ": no record yet (a new deck: record it with --record)"); continue; }
      const want = JSON.parse(fs.readFileSync(f, "utf8"));
      const same = k => JSON.stringify(want[k]) === JSON.stringify(got[k]);
      const bad = ["posts", "rows", "attempts", "localStorage", "otherRequests", "errors"].filter(k => !same(k));
      if (bad.length) failed++;
      console.log((bad.length ? "FAIL " : "pass ") + got.deck + ": " + (bad.length ? "differs in " + bad.join(", ") : got.rows.length + " Sheet rows the same, byte for byte"));
    }
  } catch (e) { if (e instanceof Stop) { console.log("STOPPED: " + e.message); failed++; } else throw e; }
  finally { await browser.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
  console.log(failed ? failed + " deck(s) failed" : opt("--record") ? "recorded" : "every deck's rows match");
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
