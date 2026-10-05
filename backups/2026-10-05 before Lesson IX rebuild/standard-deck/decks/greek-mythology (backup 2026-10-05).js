// Greek Mythology Words: content and quiz key-word lists.
// Key-word lists approved by the instructor on Oct 4, 2026 (see the working brief).
// Each sense is one acceptable meaning; an answer must hit a term from every
// group in a sense, or a ★ term (star), which covers all of that sense's groups.
// The "mixes in another word's meaning" penalty fires only on a term that
// belongs solely to other cards. "accepted" terms fit this card's meaning
// without being required; "everyday" terms and generic groups never trigger
// the penalty on other cards. Lists may overlap (revised Oct 5, 2026).
module.exports = {
  id: "greekmyth",
  output: "Greek Mythology Flashcards.html",
  title: "Greek Mythology Words Flashcards", // deck name sent to the Sheet
  heading: "Greek Mythology Words",
  cardTag: "mythology",
  backLabel: "Origin",
  legacy: { progressKey: "greekmyth_progress", nameKey: "greekmyth_name" },
  cards: [
    { word: "amazon",
      defn: "A strong, powerful woman.",
      origin: "From the Amazons, a legendary tribe of female warriors in Greek mythology.",
      senses: [{ groups: [
        { generic: true, terms: ["woman", "female", "lady", "girl"] },
        { terms: ["strong", "powerful", "warrior", "mighty", "formidable", "muscular", "tough", "fierce"] }
      ] }] },
    { word: "Procrustean",
      defn: "Effecting conformity by violent or ruthless means.",
      origin: "From Procrustes, a mythical bandit who forced travelers to fit his iron bed exactly, stretching or cutting them to size.",
      senses: [{ groups: [
        { terms: ["conformity", "conform", "uniform", "standard", "fit", "same", "one-size-fits-all"] },
        { terms: ["violent", "ruthless", "force", "forced", "brutal", "harsh", "cruel"] }
      ] }],
      accepted: ["punish", "punishment"],
      everyday: ["same", "fit"] },
    { word: "Chimerical",
      defn: "Extremely fanciful; wildly imaginary.",
      origin: "From the Chimera, a fire-breathing hybrid monster — part lion, part goat, part serpent.",
      senses: [{ groups: [
        { terms: ["fanciful", "imaginary", "fantastic", "fantasy", "illusory", "unreal", "unrealistic", "dreamlike", "made-up"] }
      ] }] },
    { word: "nemesis",
      defn: "Retribution; an unbeatable opponent.",
      origin: "From Nemesis, the Greek goddess of retribution and righteous vengeance.",
      senses: [
        { groups: [
          { terms: ["retribution", "vengeance", "revenge", "punishment", "payback"] }
        ] },
        { groups: [
          { terms: ["opponent", "rival", "enemy", "foe", "adversary"] },
          { terms: ["unbeatable", "invincible", "unconquerable", "undefeatable", "ultimate", "greatest", "powerful", "mighty", "formidable"] }
        ], star: ["archenemy", "archrival"] }
      ],
      accepted: ["fierce", "strong", "tough"] },
    { word: "stygian",
      defn: "Gloomy; infernally dark.",
      origin: "From the River Styx, the gloomy river separating the living world from the underworld.",
      senses: [
        { groups: [
          { terms: ["gloomy", "dismal", "bleak", "somber", "murky"] }
        ] },
        { groups: [
          { terms: ["dark", "black", "pitch-black", "shadowy"] },
          { terms: ["infernal", "hellish", "hell", "underworld"] }
        ] }
      ] },
    { word: "halcyon",
      defn: "Calm; peaceful.",
      origin: "From the mythical halcyon bird (identified with the kingfisher), said to calm the winds and sea while nesting.",
      senses: [{ groups: [
        { terms: ["calm", "peaceful", "tranquil", "serene", "idyllic", "quiet", "untroubled", "carefree"] }
      ] }] },
    { word: "mentor",
      defn: "A wise counselor.",
      origin: "From Mentor, the wise friend entrusted to guide Telemachus in Homer's Odyssey.",
      senses: [{ groups: [
        { terms: ["counselor", "adviser", "advisor", "guide", "teacher", "tutor", "coach"] },
        { terms: ["wise", "wisdom", "experienced", "trusted", "knowledgeable"] }
      ], star: ["guru", "sage"] }],
      accepted: ["support", "protect"] },
    { word: "labyrinth",
      defn: "A maze.",
      origin: "From the maze built by Daedalus on Crete to house the Minotaur.",
      senses: [{ groups: [
        { terms: ["maze", "warren", "tangle", "intricate network", "complicated passages"] }
      ] }],
      accepted: ["wander", "wandering", "dark"] },
    { word: "tantalize",
      defn: "To tease by offering something desirable while keeping it out of reach.",
      origin: "From Tantalus, condemned in the underworld to stand in water beneath fruit, neither of which he could ever reach.",
      senses: [{ groups: [
        { terms: ["tease", "tempt", "taunt", "torment", "dangle", "offer", "show"] },
        { terms: ["out of reach", "unreachable", "unattainable", "withhold", "keep away", "deny", "can't have"] }
      ] }],
      accepted: ["cruel", "punishment", "desire", "want", "long for"],
      everyday: ["offer", "show"] },
    { word: "odyssey",
      defn: "A long wandering journey.",
      origin: "From Homer's Odyssey, the epic recounting Odysseus's ten-year journey home from Troy.",
      senses: [{ groups: [
        { terms: ["journey", "voyage", "travel", "trip", "trek", "quest", "adventure", "expedition"] },
        { terms: ["long", "lengthy", "wandering", "epic", "extended", "years"] }
      ] }],
      everyday: ["long", "years"] },
    { word: "aegis",
      defn: "Protection; sponsorship.",
      origin: "From the aegis, the shield (or goatskin cloak) of Zeus, later associated with Athena — \"under the aegis of\" means under someone's protection.",
      senses: [{ groups: [
        { terms: ["protection", "protect", "shield", "defense", "guardianship", "sponsorship", "sponsor", "patronage", "auspices", "backing", "support"] }
      ] }],
      accepted: ["powerful", "mighty", "strong"],
      everyday: ["support"] },
    { word: "Achilles' heel",
      defn: "A point of vulnerability.",
      origin: "From Achilles, the Greek hero whose only vulnerable spot was the heel his mother held when she dipped him in the River Styx.",
      senses: [{ groups: [
        { terms: ["weakness", "weak", "vulnerability", "vulnerable", "flaw", "soft spot"] }
      ] }],
      accepted: ["invincible", "unbeatable", "strong", "powerful", "mighty"] }
  ]
};
