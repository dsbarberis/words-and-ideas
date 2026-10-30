// Latin Roots, English to Latin (Lesson Filter release, Oct 30, 2026). One card
// per sense: the front shows the meaning, and the student types each Latin form
// taught up to the current lesson, one box per form, in any order. The cards
// come from decks/latin-roots-en-cards.json, written by the key-word review's
// script (proposals/lesson-filter/key-words/make-entries.js). Students see it
// as Latin Roots with the direction switched: the switch beside the lesson menu
// opens this page, and its own records and Sheet deck name keep it apart.
module.exports = {
  id: "latinroots-en",
  output: "latin-roots-en.html",
  title: "Latin Roots Flashcards (English to Latin)", // deck name sent to the Sheet
  heading: "Latin Roots",
  answer: "forms",
  lessons: true,
  direction: "el",
  pair: { id: "latinroots", page: "index.html" },
  shufflePasses: true,
  noun: "card",
  backLabel: "Forms",
  quizIntro: "Type each Latin form in its own box, in any order. Every form shown so far is needed.",
  categories: [
    { key: "base", label: "Bases" },
    { key: "prefix", label: "Prefixes" },
    { key: "suffix", label: "Suffixes" }
  ],
  cards: require("./latin-roots-en-cards.json").map(function (c) {
    return { id: c.key, word: c.label, cat: c.kind, lesson: c.lesson, forms: c.forms };
  })
};
