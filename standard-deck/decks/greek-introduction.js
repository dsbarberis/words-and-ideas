// Greek Introduction Exercise: an Exercise Deck (Quiz only).
// Content copied unchanged from the earlier self-graded page (cards in the
// same order, so saved progress carries over). Exercises 1 and 3 have one
// box per part of the answer: the Greek word (matched without accents, and
// with k/c, kh/ch and y/u treated alike), its meaning (key-word lists, as in
// the Greek decks) and, in Exercise 1, a closer English derivative.
// Exercise 2 cards are answered by tapping the stages in order.
// Lists approved by the instructor on Oct 5, 2026
// (proposals/greek-introduction-lists.md).
// Each card names its word in the shared vocabulary list (vocab), which holds
// the word's etymology (Greek word, meaning and its key-word lists, parts,
// route into English); the card keeps the exercise's boxes and derivatives.
module.exports = {
  id: "greekasg",
  type: "exercise",
  output: "Greek Introduction Exercise.html",
  title: "Greek Introduction Exercise", // deck name sent to the Sheet (unchanged)
  heading: "Words Borrowed from Greek",
  allTitle: "Greek Introduction",
  round1: "book",
  help: "Press Enter to go to the next box, and Enter in the last box to check",
  legacy: { progressKey: "greekasg_progress", nameKey: "greekasg_name" },
  categories: [
    { key: "1", label: "Ex 1", title: "Exercise 1: Greek source and doublet",
      instruction: "Give the Greek word, its meaning, and an English derivative closer to the Greek (usually a doublet).",
      example: "Example: dish, from Greek diskos \u201cquoit, discus\u201d; closer derivative disk (or discus)." },
    { key: "2", label: "Ex 2", title: "Exercise 2: Route into English",
      instruction: "Tap the stages in order, from Greek to Modern English." },
    { key: "3", label: "Ex 3", title: "Exercise 3: Greek original",
      instruction: "Give the Greek original and its meaning." }
  ],
  cards: [
    { vocab: "bishop", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "bishop", deriv: "episcopal", derivs: ["episcopal","episcopacy","episcopate","episcopalian"] },
    { vocab: "blame", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "blame", deriv: "blaspheme (a doublet)", derivs: ["blaspheme","blasphemy","blasphemous"] },
    { vocab: "chair", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "chair", deriv: "cathedra (a doublet); also cathedral, the church that holds a bishop’s seat", derivs: ["cathedra","cathedral","ex cathedra"] },
    { vocab: "desk", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "desk", deriv: "disk or discus (doublets); dish and dais come from the same word too", derivs: ["disk","disc","discus","dish","dais"] },
    { vocab: "devil", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "devil", deriv: "diabolical", derivs: ["diabolical","diabolic","diabolism"] },
    { vocab: "glamour", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "glamour", deriv: "grammar (a doublet)", derivs: ["grammar","grammatical","grammarian"] },
    { vocab: "palsy", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "palsy", deriv: "paralysis (a doublet)", derivs: ["paralysis","paralyze","paralyse","paralytic"] },
    { vocab: "parole", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "parole", deriv: "parable or parabola (doublets)", derivs: ["parable","parabola","parabolic"] },
    { vocab: "priest", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "priest", deriv: "presbyter (a doublet); also Presbyterian", derivs: ["presbyter","presbyterian","presbytery"] },
    { vocab: "story", cat: "1", kind: "boxes", boxes: [{"label":"Greek word","check":"greek"},{"label":"Its meaning","check":"mean"},{"label":"English derivative closer to the Greek","check":"deriv"}], word: "story", deriv: "history (a doublet)", derivs: ["history","historic","historical","historian","historiography"] },
    { vocab: "alms", cat: "2", kind: "order", word: "alms" },
    { vocab: "box", cat: "2", kind: "order", word: "box" },
    { vocab: "chimney", cat: "2", kind: "order", word: "chimney" },
    { vocab: "church", cat: "2", kind: "order", word: "church" },
    { vocab: "elixir", cat: "2", kind: "order", word: "elixir" },
    { vocab: "pew", cat: "2", kind: "order", word: "pew" },
    { vocab: "prow", cat: "2", kind: "order", word: "prow (of a ship)" },
    { vocab: "almond", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "almond" },
    { vocab: "cherry", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "cherry" },
    { vocab: "date", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "date (fruit)" },
    { vocab: "fancy", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "fancy" },
    { vocab: "frantic", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "frantic" },
    { vocab: "guitar", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "guitar" },
    { vocab: "lantern", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "lantern" },
    { vocab: "licorice", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "licorice" },
    { vocab: "place", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "place" },
    { vocab: "surgeon, surgery", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "surgeon, surgery" },
    { vocab: "truck", cat: "3", kind: "boxes", boxes: [{"label":"Greek original","check":"greek"},{"label":"Its meaning","check":"mean"}], word: "truck (vehicle)" }
  ]
};
