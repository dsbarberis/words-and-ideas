// Builds every standard deck from template.html and the data files in decks/.
// Usage (from the repository root): node standard-deck/build.js
const fs = require("fs");
const path = require("path");

const here = __dirname;
const template = fs.readFileSync(path.join(here, "template.html"), "utf8");
const glossary = require(path.join(here, "glossary.js"));
const vocabulary = require(path.join(here, "vocabulary.js"));
const UNCHECKED = "Claude, unchecked";

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Every spelling a glossary entry's forms allow, for typed answers:
// "DOM(IN)-" gives dom and domin; "CLUD-, CLUS-, [CLOS-]" gives clud, clus, clos.
function formsOf(forms) {
  const out = [];
  (forms.match(/[A-Z]+(?:\([A-Z]+\))?[A-Z]*/g) || []).forEach(function (f) {
    const m = f.match(/^([A-Z]*)\(([A-Z]+)\)([A-Z]*)$/);
    if (m) { out.push(m[1] + m[3], m[1] + m[2] + m[3]); } else out.push(f);
  });
  return out.map(function (f) { return f.toLowerCase(); }).filter(function (f, i, a) { return f && a.indexOf(f) === i; });
}

// A card that names a vocabulary entry takes the word's content from it.
// A Flashcard Deck card's word is its key; an Exercise Deck card gives it as
// "vocab". Anything the card sets itself is kept (an override). A card may
// name one sense ("sense": 2); otherwise every sense counts.
function vocabKey(card, deck) { return card.vocab || (deck.type === "exercise" ? null : card.word); }
function resolveVocab(card, file, deck) {
  const key = vocabKey(card, deck);
  const out = Object.assign({}, card);
  delete out.vocab; delete out.sense; delete out.defnWording;
  if (!key) return out;
  const e = vocabulary[key];
  if (!e) throw new Error(file + ": no vocabulary entry \"" + key + "\"");
  const senses = card.sense ? [e.senses[card.sense - 1]] : e.senses;
  if (card.sense && !senses[0]) throw new Error(file + ": \"" + key + "\" has no sense " + card.sense);
  function fill(k, v) { if (out[k] === undefined && v !== undefined) out[k] = v; }
  if (deck.type !== "exercise") {
    out.word = e.word; // the card names its word by key; students see the entry's form
    fill("defn", senses.map(s => s.defn).join(" "));
    if (e.origin) fill("origin", e.origin.text);
    fill("senses", [].concat.apply([], senses.map(s => s.keys || [])));
    const acc = [].concat.apply([], senses.map(s => s.accepted || []));
    const evd = [].concat.apply([], senses.map(s => s.everyday || []));
    if (acc.length) fill("accepted", acc);
    if (evd.length) fill("everyday", evd);
  } else if (card.kind === "meaning") {
    if (e.parts.length) fill("parts", e.parts);
  } else if (card.kind === "boxes" && !e.etymology) {
    // Person or place, and meaning (Greek Lesson II Exercise): a "names" box
    // checks the origin's names; any other box, the word's key-word lists.
    fill("senses", [].concat.apply([], senses.map(s => s.keys || [])));
    const acc = [].concat.apply([], senses.map(s => s.accepted || []));
    if (acc.length) fill("accepted", acc);
    if (e.origin && e.origin.names) fill("names", e.origin.names);
    fill("answerLines", card.boxes.map(function (b) {
      return [b.label, b.check === "names" ? e.origin.text : senses.map(s => s.defn).join(" ")];
    }));
  } else if ((card.kind === "boxes" || card.kind === "order") && e.etymology) {
    const y = e.etymology;
    ["greek", "gmean", "note", "steps", "greekForms", "accepted"].forEach(k => fill(k, y[k]));
    fill("senses", y.keys);
    if (y.parts) fill("parts", y.parts.map(function (pt) {
      if (!pt.gloss) return [pt.label, pt.text];
      const g = glossary[pt.gloss];
      if (!g) throw new Error(file + ": no glossary entry \"" + pt.gloss + "\"");
      return [pt.label, g.meanings.join(", ")];
    }));
  }
  return out;
}

// A card that points to a glossary entry takes its forms and meanings from it.
// On a meanings deck (Latin Roots) the card IS the entry: its forms on the
// front, its meanings and examples on the back.
function resolveGlossary(card, file, deck) {
  if (!card.gloss) return card;
  const entry = glossary[card.gloss];
  if (!entry) throw new Error(file + ": no glossary entry \"" + card.gloss + "\"");
  const out = Object.assign({}, card);
  out.glossForms = entry.forms;
  out.glossMeanings = entry.meanings;
  if (card.kind === "typed" && !card.accept) out.accept = formsOf(entry.forms);
  if (!card.answerText) out.answerText = entry.forms;
  if (deck.answer === "meanings") {
    out.word = entry.forms;
    out.meanings = entry.meanings;
    out.origin = entry.examples || "";
    if (!card.keys || card.keys.length !== entry.meanings.length) {
      throw new Error(file + ": \"" + card.gloss + "\" needs one key-word list per meaning");
    }
    delete out.glossForms; delete out.glossMeanings; delete out.answerText;
  }
  return out;
}

// A word's analysis: each part as printed, with the glossary's full set of
// meanings (and its note, unless the card gives its own).
function resolveParts(card, file) {
  if (!card.parts || card.kind !== "meaning") return card;
  return Object.assign({}, card, {
    parts: card.parts.map(function (pt) {
      const entry = glossary[pt.gloss];
      if (!entry) throw new Error(file + ": no glossary entry \"" + pt.gloss + "\"");
      const out = { label: pt.label, meanings: entry.meanings };
      if (pt.note || entry.note) out.note = pt.note || entry.note;
      return out;
    })
  });
}

const uses = {}; // vocabulary key -> [{ deck, sense, override }]
for (const file of fs.readdirSync(path.join(here, "decks")).filter(f => f.endsWith(".js")).sort()) {
  const deck = require(path.join(here, "decks", file));
  const { output, ...data } = deck;
  deck.cards.forEach(function (c) {
    const key = vocabKey(c, deck);
    if (!key) return;
    (uses[key] = uses[key] || []).push({ deck: deck.title, sense: c.sense || 0, override: c.defn ? (c.defnWording || UNCHECKED) : null });
  });
  data.cards = deck.cards.map(function (c) { return resolveParts(resolveGlossary(resolveVocab(c, file, deck), file, deck), file); });
  const json = JSON.stringify(data, null, 2).replace(/<\//g, "<\\/");
  const html = template
    .split("{{TITLE}}").join(escHtml(deck.heading || deck.title))
    .replace("{{DECK_JSON}}", () => json);
  fs.writeFileSync(path.join(here, "..", output), html);
  console.log("built " + output + " (" + deck.cards.length + " cards)");
}

// ---- Build report: which decks use each word, conflicts, unchecked wording ----
(function report() {
  const L = [];
  const date = new Date().toISOString().slice(0, 10);
  L.push("# Build report", "", "Written by build.js on every rebuild (" + date + "). Do not edit by hand.", "");
  // 1. Conflicts
  const conflicts = [], overrides = [], dupes = [], unused = [];
  Object.keys(uses).forEach(function (k) {
    const u = uses[k];
    const decks = u.map(x => x.deck).filter((d, i, a) => a.indexOf(d) === i);
    const senses = u.map(x => x.sense).filter((d, i, a) => a.indexOf(d) === i);
    if (decks.length > 1 && senses.length > 1) conflicts.push("- **" + vocabulary[k].word + "**: " + u.map(x => x.deck + " (" + (x.sense ? "sense " + x.sense : "every sense") + ")").join("; "));
    u.filter(x => x.override).forEach(x => overrides.push("- **" + vocabulary[k].word + "** in " + x.deck + " (wording: " + x.override + ")"));
  });
  const seen = {};
  Object.keys(vocabulary).forEach(function (k) {
    const w = vocabulary[k].word.toLowerCase();
    if (seen[w]) dupes.push("- **" + vocabulary[k].word + "**: entries \"" + seen[w] + "\" and \"" + k + "\" (a duplicate, or a homograph to number)");
    else seen[w] = k;
    if (!uses[k]) unused.push("- " + vocabulary[k].word);
  });
  L.push("## 1. Conflicts", "");
  L.push("**A word two decks use with different senses:** " + (conflicts.length ? "" : "none."));
  conflicts.forEach(x => L.push(x));
  L.push("", "**A deck card that overrides the shared definition:** " + (overrides.length ? overrides.length + "." : "none."));
  overrides.forEach(x => L.push(x));
  L.push("", "**Possible duplicates or homographs:** " + (dupes.length ? "" : "none."));
  dupes.forEach(x => L.push(x));
  if (unused.length) { L.push("", "**Entries no deck uses:**"); unused.forEach(x => L.push(x)); }
  // 2. Unchecked wording, by deck
  L.push("", "## 2. Wording still marked \"" + UNCHECKED + "\"", "");
  const byDeck = {};
  function add(deck, line) { (byDeck[deck] = byDeck[deck] || []).push(line); }
  Object.keys(uses).forEach(function (k) {
    const e = vocabulary[k];
    const decks = uses[k].map(x => x.deck).filter((d, i, a) => a.indexOf(d) === i);
    decks.forEach(function (d) {
      e.senses.forEach(function (s, i) { if (s.wording === UNCHECKED) add(d, "- **" + e.word + "**, sense " + (i + 1) + ": " + s.defn + (s.printed ? " (source's words: \u201c" + s.printed.text + "\u201d, " + s.printed.ref + ")" : "")); });
      if (e.origin && e.origin.wording === UNCHECKED) add(d, "- **" + e.word + "**, origin note: " + e.origin.text);
      if (e.etymology && e.etymology.wording === UNCHECKED) add(d, "- **" + e.word + "**, etymology");
    });
    uses[k].filter(x => x.override === UNCHECKED).forEach(x => add(x.deck, "- **" + e.word + "**, definition in context on the card"));
  });
  Object.keys(byDeck).sort().forEach(function (d) { L.push("### " + d + " (" + byDeck[d].length + ")", ""); byDeck[d].forEach(x => L.push(x)); L.push(""); });
  const gl = Object.keys(glossary).filter(k => glossary[k].wording === UNCHECKED);
  L.push("### Glossary meanings (" + gl.length + ")", "", gl.map(k => glossary[k].forms + " " + glossary[k].meanings.join(", ")).join(" \u00b7 "), "");
  // 3. Decks per word
  L.push("## 3. Which decks use each word", "");
  Object.keys(vocabulary).forEach(function (k) {
    const decks = (uses[k] || []).map(x => x.deck).filter((d, i, a) => a.indexOf(d) === i);
    L.push("- " + vocabulary[k].word + ": " + (decks.join(", ") || "none"));
  });
  fs.writeFileSync(path.join(here, "build-report.md"), L.join("\n") + "\n");
  console.log("build report: " + conflicts.length + " sense conflicts, " + overrides.length + " overrides, " + dupes.length + " possible duplicates; standard-deck/build-report.md");
})();
