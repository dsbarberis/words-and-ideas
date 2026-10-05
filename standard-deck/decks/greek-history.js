// Greek History Words: content and quiz key-word lists.
// Key-word lists approved by the instructor on Oct 4, 2026 (see the working brief).
// Each sense is one acceptable meaning; an answer must hit a term from every
// group in a sense, or a ★ term (star), which covers all of that sense's groups.
// Generic groups never trigger the "mixes in another word's meaning" penalty.
module.exports = {
  id: "greekhist",
  output: "Greek History Flashcards.html",
  title: "Greek History Words Flashcards",
  subtitle: "Ten words from classical history",
  cardTag: "history",
  backLabel: "Origin",
  legacy: { progressKey: "greekhist_progress", nameKey: "greekhist_name" },
  cards: [
    { word: "laconic",
      defn: "Concise; using few words.",
      origin: "From Laconia, the region around Sparta, whose people were famous for terse, blunt speech.",
      senses: [{ groups: [
        { terms: ["concise", "terse", "brief", "succinct", "pithy", "curt", "few words", "short"] }
      ] }] },
    { word: "sword of Damocles",
      defn: "A permanently threatening danger.",
      origin: "From the courtier Damocles, seated beneath a sword hung by a single hair, to illustrate how precarious a ruler's power really is.",
      senses: [{ groups: [
        { terms: ["danger", "threat", "threatening", "peril", "doom", "disaster", "hazard"] },
        { terms: ["constant", "permanent", "always", "ever-present", "persistent", "looming", "impending", "imminent", "hanging over"] }
      ] }] },
    { word: "philippic",
      defn: "A stinging verbal condemnation.",
      origin: "From the fiery orations the Athenian statesman Demosthenes delivered against Philip II of Macedon.",
      senses: [{ groups: [
        { terms: ["condemnation", "condemn", "denunciation", "denounce", "attack", "criticism", "scolding", "rebuke"] },
        { terms: ["verbal", "speech", "spoken", "words", "oration", "lecture"] }
      ], star: ["tirade", "diatribe", "harangue", "rant", "invective"] }] },
    { word: "Draconian",
      defn: "Extremely harsh.",
      origin: "From Draco, the Athenian lawgiver whose legal code prescribed severe punishments even for minor offenses.",
      senses: [{ groups: [
        { terms: ["harsh", "severe", "strict", "cruel", "oppressive", "punitive", "brutal", "merciless"] }
      ] }] },
    { word: "solecism",
      defn: "A grammatical or social error.",
      origin: "From Soloi, a Greek colony whose residents were mocked by Athenians for speaking Greek incorrectly.",
      senses: [{ groups: [
        { terms: ["error", "mistake", "blunder", "slip", "impropriety"] },
        { terms: ["grammatical", "grammar", "language", "usage", "speech", "social", "etiquette", "manners"] }
      ], star: ["faux pas", "gaffe"] }] },
    { word: "epicure",
      defn: "A person of discriminating taste, especially in food and wine.",
      origin: "From Epicurus, the philosopher whose name became (somewhat unfairly) linked to refined pleasure-seeking.",
      senses: [{ groups: [
        { terms: ["taste", "discerning", "discriminating", "refined", "connoisseur", "picky", "particular"] },
        { generic: true, terms: ["food", "wine", "cuisine", "dining", "eating", "drink"] }
      ], star: ["gourmet", "foodie", "gastronome"] }] },
    { word: "cynic",
      defn: "A person who believes all human actions are prompted by self-interest.",
      origin: "From the ancient Cynic philosophers, who scorned social convention — the modern sense has drifted toward general distrust of others' motives.",
      senses: [{ groups: [
        { terms: ["believes", "thinks", "assumes", "suspects", "distrusts", "doubts", "expects", "sees"] },
        { terms: ["self-interest", "selfish", "self-serving", "self-centered", "ulterior", "motives"] }
      ] }] },
    { word: "sybarite",
      defn: "A person devoted to luxury and pleasure.",
      origin: "From Sybaris, an ancient Greek city in Italy proverbial for the soft living of its citizens.",
      senses: [{ groups: [
        { terms: ["devoted", "loves", "lives for", "seeks", "pursues", "obsessed", "indulges"] },
        { terms: ["luxury", "luxurious", "pleasure", "comfort", "decadence"] }
      ], star: ["hedonist", "pleasure-seeker", "self-indulgent"] }] },
    { word: "ostracism",
      defn: "Exclusion from society.",
      origin: "From ostrakon, the pottery shard Athenians inscribed with a name when voting to banish a citizen for ten years.",
      senses: [{ groups: [
        { terms: ["exclusion", "excluded", "rejection", "shunning", "shunned", "isolation"] },
        { generic: true, terms: ["society", "community", "group", "others", "people", "everyone"] }
      ], star: ["banishment", "banished", "exile", "outcast", "cast out"] }] },
    { word: "Pyrrhic",
      defn: "Pertaining to a victory won at such great cost it is nearly as bad as a defeat.",
      origin: "From King Pyrrhus of Epirus, whose costly victory over Rome prompted the remark that another such victory would ruin him.",
      senses: [{ groups: [
        { generic: true, terms: ["victory", "win", "won", "success", "triumph"] },
        { terms: ["cost", "costly", "losses", "sacrifice", "expensive", "damage", "price", "not worth it"] }
      ] }] }
  ]
};
