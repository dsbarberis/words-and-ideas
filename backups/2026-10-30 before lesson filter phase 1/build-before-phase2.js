// Builds every standard deck from template.html and the data files in decks/.
// Usage (from the repository root): node standard-deck/build.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const here = __dirname;
const template = fs.readFileSync(path.join(here, "template.html"), "utf8");
// The course's time zone, shown with the instructor's results (course.json).
const COURSE_ZONE = JSON.parse(fs.readFileSync(path.join(here, "course.json"), "utf8")).timeZone;
// The course settings (current lesson, required quizzes, notice) at the site
// root. Decks with "lessons: true" fetch the file when they open, so a change
// needs no rebuild; the copy built in is only for a first visit offline, and
// is left out of the deck version, so changing it asks no one to reload.
const SETTINGS_FILE = path.join(here, "..", "course-settings.json");
const COURSE_SETTINGS = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
(function checkSettings(s) {
  if (!Number.isInteger(s.currentLesson) || s.currentLesson < 2) throw new Error("course-settings.json: currentLesson must be a lesson number (2 or more)");
  (s.required || []).forEach(function (r, k) {
    if (!Number.isInteger(r.from) || !Number.isInteger(r.to) || r.from > r.to) throw new Error("course-settings.json: required[" + k + "] needs whole numbers from <= to");
    if (r.due && isNaN(Date.parse(r.due))) throw new Error("course-settings.json: required[" + k + "].due is not a date");
    // "dirs": which directions the quiz asks, "le" and/or "el"; missing means "le" only (D, Oct 30, 2026).
    if (r.dirs !== undefined && (!Array.isArray(r.dirs) || !r.dirs.length || r.dirs.some(function (d) { return d !== "le" && d !== "el"; }))) throw new Error("course-settings.json: required[" + k + "].dirs must list \"le\" and/or \"el\"");
  });
  if (s.notice != null && typeof s.notice !== "string") throw new Error("course-settings.json: notice must be text");
})(COURSE_SETTINGS);
const glossary = require(path.join(here, "glossary.js"));
const vocabulary = require(path.join(here, "vocabulary.js"));
// Each base's everyday synonyms from its Latin Roots card ("keys"), by glossary key.
// The Bases box counts them, not shown (instructor's card "Bases, as described", Oct 29, 2026).
const latinRootsKeys = {};
(require(path.join(here, "decks", "latin-roots.js")).cards || []).forEach(function (c) {
  if (c.gloss && Array.isArray(c.keys)) latinRootsKeys[c.gloss] = [].concat.apply([], c.keys);
});
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
    // A card may show the book's whole line of forms ("CAD-, (CID-), CAS-")
    // and its own examples where the glossary splits a family into one
    // entry per form (Lesson XII Import form, Oct 25, 2026).
    out.word = card.forms || entry.forms;
    out.origin = card.examples || entry.examples || "";
    delete out.forms; delete out.examples;
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
// Dictionary wordings that count in the suffix box for every adjective
// suffix, and for the present participle -ant/-ent (instructor, Element Box
// Answers form, Oct 27, 2026). Not shown on the card.
const ADJECTIVE_SUFFIXES = ["-ILE", "-AL", "-ARY", "-ULENT", "-IC", "-OUS", "-INE", "-ATE-adj", "-AIN",
  "-ABLE", "-ILE-able", "-ACIOUS", "-AN", "-ANE", "-AR", "-ID", "-IL-pertaining", "-ITIOUS", "-IVE",
  "-ORY", "-OSE", "-TIC", "-ULOUS", "-UOUS"];
const ADJECTIVE_WORDINGS = ["having the quality of", "characterized by"];
const PARTICIPLE_WORDINGS = ["being in a state of", "in a state of"];

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
        if (entry.optionalInBoxes) o.optional = true;
        const key = (card.keyMeanings || {})[pt.gloss];
        const dictionary = ADJECTIVE_SUFFIXES.indexOf(pt.gloss) >= 0 ? ADJECTIVE_WORDINGS : pt.gloss === "-ANT" ? PARTICIPLE_WORDINGS : [];
        // A base also takes its Latin Roots synonyms; suffixes don't, because
        // their Latin Roots lists hold wordings the instructor ruled wrong in the boxes.
        const synonyms = entry.kind === "base" ? latinRootsKeys[pt.gloss] || [] : [];
        const also = [].concat(entry.plainMeanings || [], dictionary, key || [], synonyms);
        if (also.length) o.alsoMeans = also;
        // A suffix built from two pieces (-ac + -ous for -acious): written as
        // its pieces, the last piece's book meaning counts (instructor, Oct 28, 2026).
        if (entry.lastPiece) {
          const last = glossary[entry.lastPiece];
          if (!last) throw new Error(file + ": glossary entry \"" + pt.gloss + "\" names lastPiece \"" + entry.lastPiece + "\", which is not in the glossary");
          o.pieceMeans = [].concat(last.meanings || [], last.plainMeanings || []);
        }
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
    out.boxes = [{ label: "Prefixes and their meanings", placeholder: "Prefix + meaning, or none", check: "el:prefix" },
                 { label: "Bases and their meanings", placeholder: "Base + meaning", check: "el:base" },
                 { label: "Suffixes and their meanings", placeholder: "Suffix + meaning, or none", check: "el:suffix" },
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

// Card keys (records kept by element, release A, Oct 28, 2026). Each card's
// record on a student's device is kept under its key, not its position: the
// card's "id" if it has one, else its glossary key, vocabulary key, word or
// label. card-keys.json holds every deck's keys as they stood when records
// moved to keys; those cards must stay first and in that order, because older
// records and the Sheet's "i" give a card by its position. New cards go at the
// end. If a key has to change (a label corrected), give the card "id" with
// its old key.
const FROZEN_KEYS = JSON.parse(fs.readFileSync(path.join(here, "card-keys.json"), "utf8"));
function cardKey(c) { return c.id || c.gloss || c.vocab || c.word || c.label; }
function checkKeys(deck, file) {
  const keys = deck.cards.map(cardKey);
  keys.forEach(function (k, i) {
    if (typeof k !== "string" || !k) throw new Error(file + ": card " + (i + 1) + " has no key (give it an \"id\")");
    if (keys.indexOf(k) !== i) throw new Error(file + ": two cards share the key \"" + k + "\" (give one an \"id\")");
  });
  const frozen = FROZEN_KEYS[deck.id] || [];
  frozen.forEach(function (k, i) {
    if (keys[i] !== k) throw new Error(file + ": card " + (i + 1) + " must keep the key \"" + k + "\" (card-keys.json); new cards go at the end, and a changed label needs \"id\": \"" + k + "\"");
  });
  return { keys: keys, frozenCount: frozen.length };
}

// Deck versions (reload prompt, Old Deck Pages plan, Oct 28, 2026). Each page
// carries a short hash of what judges it: the deck's embedded data (its cards
// as built, with the glossary and vocabulary content they take, and its
// settings) and the template's script (the judging code). The template's
// styles and markup, the title and the course time zone are left out, so a
// change only to how pages look asks no one to reload. deck-versions.json at
// the site root lists every page's hash; an open page that finds a different
// hash there offers a reload.
const templateScript = (template.match(/<script>[\s\S]*<\/script>/) || [template])[0];
function deckVersion(json) {
  return crypto.createHash("sha256").update(templateScript + "\n" + json).digest("hex").slice(0, 12);
}
const versions = {}; // page file name -> hash

const uses = {}; // vocabulary key -> [{ deck, sense, override }]
for (const file of fs.readdirSync(path.join(here, "decks")).filter(f => f.endsWith(".js")).sort()) {
  const deck = require(path.join(here, "decks", file));
  const { output, ...data } = deck;
  const cardKeys = checkKeys(deck, file);
  data.frozenCount = cardKeys.frozenCount;
  deck.cards.forEach(function (c) {
    const key = vocabKey(c, deck);
    if (!key) return;
    (uses[key] = uses[key] || []).push({ deck: deck.title, sense: c.sense || 0, override: c.defn ? (c.defnWording || UNCHECKED) : null });
  });
  data.cards = deck.cards.map(function (c, i) {
    const out = splitExample(resolveParts(resolveGlossary(resolveVocab(c, file, deck), file, deck), file, deck), deck);
    delete out.id;
    out.k = cardKeys.keys[i];
    // The lesson that teaches the card: the card's own "lesson" (the six
    // cards the deck had before their lessons are shown from Lesson V), or
    // its glossary entry's.
    if (deck.lessons) {
      const e = c.gloss ? glossary[c.gloss] : null;
      out.lesson = c.lesson || (e && e.lessonNo);
      if (!Number.isInteger(out.lesson)) throw new Error(file + ": card " + (i + 1) + " (" + (c.gloss || c.term) + ") has no lesson; give it \"lesson\": <number>");
    }
    return out;
  });
  const json = JSON.stringify(data, null, 2).replace(/<\//g, "<\\/");
  const version = deckVersion(json);
  versions[output] = version;
  const html = template
    .split("{{DECK_VERSION}}").join(version)
    .split("{{DECK_PAGE}}").join(JSON.stringify(output).slice(1, -1))
    .split("{{TITLE}}").join(escHtml(deck.heading || deck.title))
    .split("{{COURSE_ZONE}}").join(COURSE_ZONE)
    .replace("{{COURSE_SETTINGS}}", () => JSON.stringify(COURSE_SETTINGS).replace(/<\//g, "<\\/"))
    .replace("{{DECK_JSON}}", () => json);
  fs.writeFileSync(path.join(here, "..", output), html);
  console.log("built " + output + " (" + deck.cards.length + " cards)");
}

// The version file the open pages check (sorted, so a rebuild with no change
// writes the same file).
fs.writeFileSync(path.join(here, "..", "deck-versions.json"),
  JSON.stringify(Object.keys(versions).sort().reduce(function (o, k) { o[k] = versions[k]; return o; }, {}), null, 2) + "\n");
console.log("deck versions: deck-versions.json (" + Object.keys(versions).length + " pages)");

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
