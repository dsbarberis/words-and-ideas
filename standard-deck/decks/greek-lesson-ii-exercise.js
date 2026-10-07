// Greek Lesson II Exercise: an Exercise Deck (Quiz only) from the book's
// Greek Lesson II, Assignment I (pp. 176-177), approved Oct 7, 2026
// (proposals/greek-lesson-ii-trial/2-import-proposal.md). The book gives no
// answers; the instructor checked the answer key (assignment-i-answers-checked.md).
// Each card has two boxes: "Person or place" passes when the answer contains
// one of the word's names (vocabulary.js, origin.names); "Meaning" is judged
// with the word's key-word lists. The back shows both answers.
module.exports = {
  id: "greekl2x",
  type: "exercise",
  output: "Greek Lesson II Exercise.html",
  title: "Greek Lesson II Exercise", // deck name sent to the Sheet
  heading: "Words from Proper Names",
  allTitle: "Greek Lesson II",
  round1: "book",
  orderNote: false, // the start screen doesn't name the order's source
  help: "Press Enter to go to the next box, and Enter in the last box to check",
  categories: [
    { key: "I", label: "Ex I", title: "Exercise I: Words from Proper Names",
      instruction: "With the aid of a dictionary identify the persons or places whose names they represent, and determine their meanings." }
  ],
  cards: [
    { vocab: "bedlam", cat: "I", kind: "boxes", word: "bedlam", sentence: "The neighborhood surrounding Tiger Stadium became a <span class=\"target\">bedlam</span> following Detroit's victory in the World Series.", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "boycott", cat: "I", kind: "boxes", word: "boycott", sentence: "They are being ostracized, their shops . . . are completely <span class=\"target\">boycotted</span>, their children without a school.", cite: "— Time", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "dunce", cat: "I", kind: "boxes", word: "dunce", sentence: "Great new theories share the fate of great old theories: they seem to be the work of <span class=\"target\">dunces</span>.", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "Frankenstein", cat: "I", kind: "boxes", word: "Frankenstein", sentence: "Its advocates have not yet succeeded in stripping nuclear power of its <span class=\"target\">Frankensteinian</span> mask.", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "jeremiad", cat: "I", kind: "boxes", word: "jeremiad", sentence: "Dr. Caldecott's <span class=\"target\">jeremiad</span> against nuclear arms must be preached among all the nations.", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "maudlin", cat: "I", kind: "boxes", word: "maudlin", sentence: "He burst into tears of <span class=\"target\">maudlin</span> pity for himself.", cite: "— Dickens", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "quixotic", cat: "I", kind: "boxes", word: "quixotic", sentence: "What wonder, then, if the Spaniard of that day, feeding his imagination with dreams of enchantment at home, and with its realities abroad, should have displayed a <span class=\"target\">Quixotic</span> enthusiasm!", cite: "— William Hickling Prescott", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "simony", cat: "I", kind: "boxes", word: "simony", sentence: "He did not scruple to become a broker in <span class=\"target\">simony</span> of a peculiarly discreditable kind, and to use a bishopric as a bait to tempt a divine to perjury.", cite: "— Macaulay", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "tawdry", cat: "I", kind: "boxes", word: "tawdry", sentence: "History is what happened, it is not what fits some scriptwriter's <span class=\"target\">tawdry</span> idea.", cite: "— Harper's Magazine", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] },
    { vocab: "utopia", cat: "I", kind: "boxes", word: "utopia", sentence: "It is often said that an ideal state—an <span class=\"target\">Utopia</span> where there is no folly, crime, or sorrow—has a singular fascination for the mind.", cite: "— W.H. Hudson", boxes: [{"label":"Person or place","check":"names"},{"label":"Meaning","check":"mean"}] }
  ]
};
