// Builds every standard deck from template.html and the data files in decks/.
// Usage (from the repository root): node standard-deck/build.js
const fs = require("fs");
const path = require("path");

const here = __dirname;
const template = fs.readFileSync(path.join(here, "template.html"), "utf8");
// The course's time zone, shown with the instructor's results (course.json).
const COURSE_ZONE = JSON.parse(fs.readFileSync(path.join(here, "course.json"), "utf8")).timeZone;
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

// A glossary entry's distinct meanings: its "groups" (synonyms together, any
// one counts; Meaning Clouds form, Oct 23, 2026), or one meaning per group.
// The groups must hold every meaning exactly once.
function groupsOf(entry, key) {
  if (!entry.groups) return entry.meanings.map(function (m) { return [m]; });
  const flat = [].concat.apply([], entry.groups);
  const a = flat.slice().sort(), b = entry.meanings.slice().sort();
  if (entry.groups.some(function (g) { return !g.length; }) || JSON.stringify(a) !== JSON.stringify(b)) {
    throw new Error("glossary.js: the groups of \"" + key + "\" must hold each of its meanings exactly once");
  }
  return entry.groups.map(function (g) { return g.slice(); });
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
    out.origin = entry.examples || "";
    if (!card.keys || card.keys.length !== entry.meanings.length) {
      throw new Error(file + ": \"" + card.gloss + "\" needs one key-word list per meaning");
    }
    // One answer line per distinct meaning: the key-word lists of a group's
    // synonyms are joined, so any one of them counts.
    const groups = groupsOf(entry, card.gloss);
    out.meaningGroups = groups;
    out.meanings = groups.map(function (g) { return g.join(" or "); });
    out.keys = groups.map(function (g) {
      const list = [];
      g.forEach(function (m) {
        card.keys[entry.meanings.indexOf(m)].forEach(function (w) { if (list.indexOf(w) < 0) list.push(w); });
      });
      return list;
    });
    delete out.glossForms; delete out.glossMeanings; delete out.answerText;
  }
  return out;
}

// A word's analysis: each part as printed, with the glossary's full set of
// meanings (and its note, unless the card gives its own). "accept" lists the
// forms an Analysis box takes for the part: the form printed on the card and
// every form of its glossary entry, plus any the card adds as "alsoAccept"
// (INEFFABLE takes "-ble" after FA-, Oct 20, 2026). A deck with "analysis: true" asks for the
// analysis in a box above the meaning (instructor, Oct 12, 2026).
function resolveParts(card, file, deck) {
  if (!card.parts || card.kind !== "meaning") return card;
  const out = Object.assign({}, card, {
    parts: card.parts.map(function (pt) {
      const entry = glossary[pt.gloss];
      if (!entry) throw new Error(file + ": no glossary entry \"" + pt.gloss + "\"");
      const o = { label: pt.label, meanings: entry.meanings, meaningGroups: groupsOf(entry, pt.gloss) };
      if (pt.note || entry.note) o.note = pt.note || entry.note;
      const printed = formsOf(pt.label.replace(/\(\u2192[^)]*\)/g, "").toUpperCase());
      // "-ary (\u2192 i)": the y becomes i in the word, so "-ari" counts too.
      const shifted = /\(\u2192 i\)/.test(pt.label) ? printed.map(function (f) { return f.replace(/y$/, "i"); }) : [];
      o.accept = printed.concat(shifted, formsOf(entry.forms), pt.alsoAccept || []).filter(function (f, i, a) { return a.indexOf(f) === i; });
      if (deck.elementBoxes) {
        // Element boxes: the element's kind picks its box, and "alsoMeans"
        // holds wordings that count but are not shown: the glossary's plain
        // wordings for a grammatical suffix ("plainMeanings") and the answer
        // key's wording on this card ("keyMeanings", by glossary key).
        if (["prefix", "base", "suffix"].indexOf(entry.kind) < 0) throw new Error(file + ": glossary entry \"" + pt.gloss + "\" has no kind prefix, base or suffix");
        o.type = entry.kind;
        const key = (card.keyMeanings || {})[pt.gloss];
        const also = [].concat(entry.plainMeanings || [], key || []);
        if (also.length) o.alsoMeans = also;
      }
      return o;
    })
  });
  if (card.keyMeanings) {
    Object.keys(card.keyMeanings).forEach(function (g) {
      if (!card.parts.some(function (pt) { return pt.gloss === g; })) throw new Error(file + ": keyMeanings names \"" + g + "\", which is not one of the card's parts");
    });
    delete out.keyMeanings;
  }
  if (deck.analysis && deck.elementBoxes && !card.boxes) {
    // Element boxes (instructor, Oct 20 and Oct 24, 2026): one box each for
    // prefixes, bases and suffixes, every element with its meaning, then the
    // meaning in context. The card is right only when every box is.
    out.boxes = [{ label: "Prefixes and their meanings", placeholder: "Each prefix with its meaning, or none", check: "el:prefix" },
                 { label: "Bases and their meanings", placeholder: "Each base with its meaning", check: "el:base" },
                 { label: "Suffixes and their meanings", placeholder: "Each suffix with its meaning, or none", check: "el:suffix" },
                 { label: "Meaning in context", placeholder: card.placeholder || "Your answer" }];
  } else if (deck.analysis && !card.boxes) {
    out.boxes = [{ label: "Analysis (forms only)", placeholder: "e.g. pre- DIC- -tion" },
                 { label: "Meaning in context", placeholder: card.placeholder || "Your answer" }];
    out.boxes[0].check = "parts";
  }
  return out;
}

// A typed answer printed with an example word in brackets ("lumin
// (illuminate)") shows the answer in large type and the example as its note
// (Answer Effort form, Oct 21, 2026). The wording is unchanged, only moved.
function splitExample(card, deck) {
  if (deck.type !== "exercise" || card.kind !== "typed" || card.answerNote || !card.answerText) return card;
  const m = card.answerText.match(/^(.*\S)\s+\(([^()]+)\)$/);
  // Only an example word: "EQU-, (IQU-)" is a list of forms.
  if (!m || /-/.test(m[2]) || !/^[a-z\u00e0-\u00ff]/.test(m[2])) return card;
  return Object.assign({}, card, { answerText: m[1], answerNote: "Example: " + m[2] + "." });
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
  data.cards = deck.cards.map(function (c) { return splitExample(resolveParts(resolveGlossary(resolveVocab(c, file, deck), file, deck), file, deck), deck); });
  const json = JSON.stringify(data, null, 2).replace(/<\//g, "<\\/");
  const html = template
    .split("{{TITLE}}").join(escHtml(deck.heading || deck.title))
    .split("{{COURSE_ZONE}}").join(COURSE_ZONE)
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
