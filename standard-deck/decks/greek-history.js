// Greek History Words: a Flashcard Deck. Each card names a word in the shared vocabulary
// list (../vocabulary.js), which holds its definition, origin note and quiz
// key-word lists (approved by the instructor on Oct 4, 2026, revised Oct 5).
// The deck file keeps only the deck's settings and its cards' order.
module.exports = {
  id: "greekhist",
  output: "Greek History Flashcards.html",
  title: "Greek History Words Flashcards", // deck name sent to the Sheet
  heading: "Greek History Words",
  cardTag: "history",
  backLabel: "Origin",
  legacy: { progressKey: "greekhist_progress", nameKey: "greekhist_name" },
  cards: [
    { word: "laconic" },
    { word: "sword of Damocles" },
    { word: "philippic" },
    { word: "Draconian" },
    { word: "solecism" },
    { word: "epicure" },
    { word: "cynic" },
    { word: "sybarite" },
    { word: "ostracism" },
    { word: "Pyrrhic" }
  ]
};
