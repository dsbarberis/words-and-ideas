// Latin Roots: a Flashcard Deck (Learn + Quiz). Each card is a glossary
// entry (standard-deck/glossary.js): its forms on the front, its meanings
// (one per line) and examples on the back. In the quiz the student types
// the meanings one per line and every meaning is required; each meaning has
// its own key-word list. Key-word lists approved by the instructor on
// Oct 5, 2026 (proposals/latin-roots-keyword-lists.md). A wording listed on
// more than one card never counts against an answer on either card.
// Oct 23, 2026: the meanings became the book's (Ayers pp. 149-155) at the
// instructor's choice; the earlier wordings stay accepted in the lists, and
// the key words for the book's added meanings (very, thoroughly, secretly,
// wrongly, in front of, behind and others) are Claude's, unchecked.
// Oct 23, 2026 (Meaning Clouds form): synonyms among a root's meanings form
// one distinct meaning (the glossary's "groups"), and any one counts. The
// lists below stay one per printed meaning; the build joins the lists of
// each group.
const SEE=["see","sight","vision"], STRONG=["strong","strength","sturdy","mighty","powerful"],
 GO=["go","move","proceed"], PUSH=["push","shove","press"], HOLY=["holy","holiness","hallowed"],
 AROUND=["around","round","about","surrounding"], BEFORE=["before","prior","earlier","previous","preceding"],
 NOT=["not","no","non","un"], AWAY=["away","off"], AGAINST=["against","opposed","opposing","opposite","versus","contrary"],
 TOWARD=["toward","towards","in the direction of"], BELOW=["below","lower","underneath"], WITHOUT=["without","lacking","lack"],
 APART=["apart","separate","asunder"], THROUGH=["through","throughout"], BEYOND=["beyond","more than","further","past"],
 FROM=["from"];

const OLD_BY_KEY = {};
require("../tools/latin-roots-old-cards.json").cards.forEach(function (c) { OLD_BY_KEY[c.id || c.gloss] = c; });

module.exports = {
  id: "latinroots",
  output: "index.html",
  title: "Latin Roots Flashcards", // deck name sent to the Sheet
  heading: "Latin Roots",
  answer: "meanings",
  direction: "le",
  pair: { id: "latinroots-en", page: "latin-roots-en.html" }, // English to Latin, behind the direction switch
  lessons: true, // each card shows from its lesson on (course-settings.json); lesson menu and lesson quizzes (Lesson Filter release)
  shufflePasses: true, // every Learn pass starts in a new random order (instructor, Oct 12, 2026)
  noun: "card",
  backLabel: "Examples",
  // Instruction approved on the Meaning Clouds form (instructor, Oct 23, 2026).
  quizIntro: "Type each meaning on its own line. Where a meaning has synonyms, any one of them counts. Tap “+ Add another meaning” (or press Enter) for each new line.",
  categories: [
    { key: "base", label: "Bases" },
    { key: "prefix", label: "Prefixes" },
    { key: "suffix", label: "Suffixes" } // added Oct 12, 2026 (Latin Lesson X)
  ],
  legacy: { knownPrefix: "latinFlashcards_known_v2__", learningPrefix: "latinFlashcards_learning_v2__", nameKey: "latinFlashcards_lastName" },
  // One card per Latin form, shared spellings joined into one card (Lesson Filter
  // release, Oct 30, 2026; D's ruling: every meaning taught so far is required).
  // The cards come from decks/latin-roots-cards.json, written by the key-word
  // review's script (proposals/lesson-filter/key-words/make-entries.js); key
  // words not yet in D's review are Claude's drafts. The cards before this
  // release are kept in tools/latin-roots-old-cards.json, and key-table.json
  // carries students' marks from them to the new cards.
  cards: require("./latin-roots-cards.json").map(function (c) {
    const old = OLD_BY_KEY[c.key] || {};
    return { id: c.key, gloss: c.glosses[0], glosses: c.glosses, cat: c.kind, forms: c.forms, spellings: c.spellings,
      examples: old.examples || c.examples || "", lesson: c.lesson, english: c.english || undefined, everyday: c.everyday || undefined,
      groups: c.meanings.map(function (m) { return { parts: m.parts, keys: m.keys, lesson: m.lesson, gloss: m.gloss }; }) };
  })
};
