// Greek Mythology Words: a Flashcard Deck. Each card names a word in the shared vocabulary
// list (../vocabulary.js), which holds its definition, origin note and quiz
// key-word lists (approved by the instructor on Oct 4, 2026, revised Oct 5).
// The deck file keeps only the deck's settings and its cards' order.
module.exports = {
  id: "greekmyth",
  output: "Greek Mythology Flashcards.html",
  title: "Greek Mythology Words Flashcards", // deck name sent to the Sheet
  heading: "Greek Mythology Words",
  cardTag: "mythology",
  backLabel: "Origin",
  legacy: { progressKey: "greekmyth_progress", nameKey: "greekmyth_name" },
  cards: [
    { word: "amazon" },
    { word: "Procrustean" },
    { word: "Chimerical" },
    { word: "nemesis" },
    { word: "stygian" },
    { word: "halcyon" },
    { word: "mentor" },
    { word: "labyrinth" },
    { word: "tantalize" },
    { word: "odyssey" },
    { word: "aegis" },
    { word: "Achilles' heel" }
  ]
};
