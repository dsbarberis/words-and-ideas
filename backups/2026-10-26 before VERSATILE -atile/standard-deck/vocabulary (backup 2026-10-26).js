// Shared vocabulary list: every whole word the decks teach, once each.
// Approved by the instructor on Oct 7, 2026 (proposals/vocabulary-list-proposal.md).
// Word parts live in glossary.js; an entry's parts point to it by key.
//
// An entry holds:
// - word: as shown to students.
// - senses: the word's meanings, numbered from 1. Each has its definition
//   (defn), its wording source (wording: book, workbook, answer key,
//   instructor, dictionary, or "Claude, unchecked"), where that wording is from
//   (ref), and its quiz key-word lists (keys, with accepted and everyday words,
//   in the same format the decks used). Where Claude expanded a source's
//   wording, printed keeps the source's own words.
// - parts: glossary entries the word is built from, as printed.
// - origin: the history note on the back of a card, with its wording source.
// - etymology: the Greek source and route into English (Greek Introduction).
// - sources: every place the course introduces the word, and the sense it
//   introduces.
// Which decks use each word is worked out by the build (build-report.md).
// A deck card names an entry by key: a Flashcard Deck card's word is its key;
// an Exercise Deck card gives it as vocab. A card may name one sense (sense: 2);
// a card that names none uses every sense.
module.exports = {
  "amazon": {
    word: "amazon",
    senses: [
      {"defn":"A strong, powerful woman.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"generic":true,"terms":["woman","female","lady","girl"]},{"terms":["strong","powerful","warrior","mighty","formidable","muscular","tough","fierce"]}]}]}
    ],
    parts: [],
    origin: {"text":"From the Amazons, a legendary tribe of female warriors in Greek mythology.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "Procrustean": {
    word: "Procrustean",
    senses: [
      {"defn":"Effecting conformity by violent or ruthless means.","wording":"instructor","printed":{"text":"effecting conformity by violent means","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["conformity","conform","uniform","standard","fit","same","one-size-fits-all"]},{"terms":["violent","ruthless","force","forced","brutal","harsh","cruel"]}]}],"accepted":["punish","punishment"],"everyday":["same","fit"]}
    ],
    parts: [],
    origin: {"text":"From Procrustes, a mythical bandit who forced travelers to fit his iron bed exactly, stretching or cutting them to size.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "Chimerical": {
    word: "Chimerical",
    senses: [
      {"defn":"Extremely fanciful; wildly imaginary.","wording":"instructor","printed":{"text":"extremely fanciful","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["fanciful","imaginary","fantastic","fantasy","illusory","unreal","unrealistic","dreamlike","made-up"]}]}]}
    ],
    parts: [],
    origin: {"text":"From the Chimera, a fire-breathing hybrid monster — part lion, part goat, part serpent.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "nemesis": {
    word: "nemesis",
    senses: [
      {"defn":"Retribution; an unbeatable opponent.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["retribution","vengeance","revenge","punishment","payback"]}]},{"groups":[{"terms":["opponent","rival","enemy","foe","adversary"]},{"terms":["unbeatable","invincible","unconquerable","undefeatable","ultimate","greatest","powerful","mighty","formidable"]}],"star":["archenemy","archrival"]}],"accepted":["fierce","strong","tough"]}
    ],
    parts: [],
    origin: {"text":"From Nemesis, the Greek goddess of retribution and righteous vengeance, personification of divine wrath.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "stygian": {
    word: "stygian",
    senses: [
      {"defn":"Gloomy; infernally dark. Pertaining to the river Styx (river in Hades).","wording":"instructor","printed":{"text":"gloomy","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["gloomy","dismal","bleak","somber","murky"]}]},{"groups":[{"terms":["dark","black","pitch-black","shadowy"]},{"terms":["infernal","hellish","hell","underworld"]}]},{"groups":[{"terms":["styx","river styx","hades"]}]}]}
    ],
    parts: [],
    origin: {"text":"From the River Styx, the gloomy river separating the living world from the underworld; infernal regions.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "halcyon": {
    word: "halcyon",
    senses: [
      {"defn":"Calm; peaceful.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["calm","peaceful","tranquil","serene","idyllic","quiet","untroubled","carefree"]}]}]}
    ],
    parts: [],
    origin: {"text":"From the mythical halcyon bird (identified with the kingfisher), said to calm the winds and sea while nesting.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "mentor": {
    word: "mentor",
    senses: [
      {"defn":"A wise counselor.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["counselor","adviser","advisor","guide","teacher","tutor","coach"]},{"terms":["wise","wisdom","experienced","trusted","knowledgeable"]}],"star":["guru","sage"]}],"accepted":["support","protect"]}
    ],
    parts: [],
    origin: {"text":"From Mentor, the wise friend entrusted to guide Telemachus in Homer's Odyssey.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "labyrinth": {
    word: "labyrinth",
    senses: [
      {"defn":"A maze.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["maze","warren","tangle","intricate network","complicated passages"]}]}],"accepted":["wander","wandering","dark"]}
    ],
    parts: [],
    origin: {"text":"From the maze built by Daedalus on Crete to house the Minotaur.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"workbook","lesson":"Part II, Lesson III, Exercise 4","page":"170"}]
  },
  "tantalize": {
    word: "tantalize",
    senses: [
      {"defn":"To tease by offering something desirable while keeping it out of reach.","wording":"instructor","printed":{"text":"to tease","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["tease","tempt","taunt","torment","dangle","offer","show"]},{"terms":["out of reach","unreachable","unattainable","withhold","keep away","deny","can't have"]}]}],"accepted":["cruel","punishment","desire","want","long for"],"everyday":["offer","show"]}
    ],
    parts: [],
    origin: {"text":"From Tantalus, condemned in the underworld to suffer thirst while standing in water beneath fruit, neither of which he could ever reach.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "odyssey": {
    word: "odyssey",
    senses: [
      {"defn":"A long wandering journey.","wording":"instructor","printed":{"text":"a long wandering","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["journey","voyage","travel","trip","trek","quest","adventure","expedition"]},{"terms":["long","lengthy","wandering","epic","extended","years"]}]}],"everyday":["long","years"]}
    ],
    parts: [],
    origin: {"text":"From Homer's Odyssey, the epic recounting Odysseus's ten-year journey home from Troy.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "aegis": {
    word: "aegis",
    senses: [
      {"defn":"Protection; sponsorship.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["protection","protect","shield","defense","guardianship","sponsorship","sponsor","patronage","auspices","backing","support"]}]}],"accepted":["powerful","mighty","strong"],"everyday":["support"]}
    ],
    parts: [],
    origin: {"text":"From the aegis, the shield (or goatskin cloak) of Zeus, later associated with Athena — \"under the aegis of\" means under someone's protection.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"workbook","lesson":"Part II, Lesson III, Exercise 4","page":"171"}]
  },
  "Achilles' heel": {
    word: "Achilles' heel",
    senses: [
      {"defn":"A point of vulnerability.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["weakness","weak","vulnerability","vulnerable","flaw","soft spot"]}]}],"accepted":["invincible","unbeatable","strong","powerful","mighty"]}
    ],
    parts: [],
    origin: {"text":"From Achilles, the Greek hero whose only vulnerable spot was the heel his mother held when she dipped him in the River Styx.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "laconic": {
    word: "laconic",
    senses: [
      {"defn":"Concise, brief, pithy, using few words.","wording":"instructor","printed":{"text":"brief, pithy, concise","wording":"book","ref":"Greek Lesson II, p. 172"},"note":"Replaces the earlier definition “Concise; using few words.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"terms":["concise","terse","brief","succinct","pithy","curt","few words","short"]}]}],"accepted":["speech","spoken","words"],"everyday":["short"],"ref":"instructor's wording, Oct 7, 2026"}
    ],
    parts: [],
    origin: {"text":"From Laconia, the region around Sparta, whose people were famous for terse, blunt speech.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"172","sense":1}]
  },
  "sword of Damocles": {
    word: "sword of Damocles",
    senses: [
      {"defn":"A constantly threatening danger.","wording":"book","ref":"Greek Lesson II, p. 175-176","note":"Replaces the earlier definition “A permanently threatening danger.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"terms":["danger","threat","threatening","peril","doom","disaster","hazard"]},{"terms":["constant","permanent","always","ever-present","persistent","looming","impending","imminent","hanging over"]}]}],"accepted":["attack"]}
    ],
    parts: [],
    origin: {"text":"From the courtier Damocles, seated beneath a sword hung by a single thread, to illustrate how precarious a ruler's power really is.","wording":"instructor","ref":"corrected to the book, p. 176 (instructor's ruling, Oct 7, 2026)"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"175-176","sense":1}]
  },
  "philippic": {
    word: "philippic",
    senses: [
      {"defn":"A fiery, damning speech, or tirade.","wording":"instructor","printed":{"text":"a bitter denunciation","wording":"book","ref":"Greek Lesson II, p. 173"},"note":"Replaces the earlier definition “A stinging verbal condemnation.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"terms":["condemnation","condemn","denunciation","denounce","attack","criticism","scolding","rebuke","damning","fiery"]}],"star":["tirade","diatribe","harangue","rant","invective"]}],"accepted":["harsh","severe","bitter","scathing","verbal","speech","spoken","words","oration","lecture"],"ref":"instructor's wording, Oct 7, 2026"}
    ],
    parts: [],
    origin: {"text":"From the fiery orations the Athenian statesman Demosthenes delivered against Philip II of Macedon.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"173","sense":1}]
  },
  "Draconian": {
    word: "Draconian",
    senses: [
      {"defn":"Extremely severe.","wording":"book","ref":"Greek Lesson II, p. 171","note":"Replaces the earlier definition “Extremely harsh.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"terms":["harsh","severe","strict","cruel","oppressive","punitive","brutal","merciless"]}]}],"accepted":["extreme","extremely"]}
    ],
    parts: [],
    origin: {"text":"From Draco, the Athenian lawgiver whose legal code prescribed severe punishments even for minor offenses.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"171","sense":1}]
  },
  "solecism": {
    word: "solecism",
    senses: [
      {"defn":"A substandard usage of language; a social blunder.","wording":"book","ref":"Greek Lesson II, p. 174","note":"Replaces the earlier definition “A grammatical or social error.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"terms":["error","mistake","blunder","slip","impropriety","substandard","incorrect","nonstandard","improper","wrong"]},{"terms":["grammatical","grammar","language","usage","speech","social","etiquette","manners","words","word"]}],"star":["faux pas","gaffe"]}]}
    ],
    parts: [],
    origin: {"text":"From Soloi, a Greek colony whose residents were mocked by Athenians for speaking Greek incorrectly.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"174","sense":1}]
  },
  "epicure": {
    word: "epicure, epicurean",
    senses: [
      {"defn":"A person of refined taste in matters of food and drink.","wording":"book","ref":"Greek Lesson II, p. 171-172","note":"Replaces the earlier definition “A person of discriminating taste, especially in food and wine.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"terms":["discerning","discriminating","refined","fine","connoisseur","picky","particular"]},{"generic":true,"terms":["taste","palate","food","wine","cuisine","dining","eating","drink"]}],"star":["gourmet","foodie","gastronome","connoisseur","good taste"]}],"accepted":["loves","enjoys","seeks","pleasure","luxury","indulges"]}
    ],
    parts: [],
    origin: {"text":"From Epicurus, the philosopher whose name became (somewhat unfairly) linked to refined pleasure-seeking.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"171-172","sense":1}]
  },
  "cynic": {
    word: "cynic",
    senses: [
      {"defn":"One who sarcastically doubts human motives.","wording":"book","ref":"Greek Lesson II, p. 171","note":"Replaces the earlier definition “A person who believes all human actions are prompted by self-interest.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"terms":["believes","thinks","assumes","suspects","distrusts","doubts","expects","sees"]},{"terms":["self-interest","selfish","self-serving","self-centered","ulterior","motives"]}]}],"everyday":["believes","thinks","assumes","expects","sees"],"accepted":["sarcastic","sarcastically"]}
    ],
    parts: [],
    origin: {"text":"From the ancient Cynic philosophers, who scorned social convention — the modern sense has drifted toward general distrust of others' motives.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"171","sense":1}]
  },
  "sybarite": {
    word: "sybarite",
    senses: [
      {"defn":"One devoted to luxury and pleasure.","wording":"book","note":"Replaces the earlier definition “A person devoted to luxury and pleasure.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"terms":["devoted","loves","lives for","seeks","pursues","obsessed","indulges"]},{"terms":["luxury","luxurious","pleasure","comfort","decadence"]}],"star":["hedonist","pleasure-seeker","self-indulgent"]}],"accepted":["selfish","self-centered"],"everyday":["loves","seeks","lives for"],"ref":"Greek Lesson II, p. 176"}
    ],
    parts: [],
    origin: {"text":"From Sybaris, an ancient Greek city in Italy proverbial for the soft living of its citizens.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"176","sense":1}]
  },
  "ostracism": {
    word: "ostracism",
    senses: [
      {"defn":"Exclusion from society.","wording":"book","ref":"Greek Lesson II, p. 173","note":"The book's wording (Greek Lesson II, p. 173); confirmed by the instructor, Oct 7, 2026.","keys":[{"groups":[{"terms":["exclusion","excluded","rejection","shunning","shunned","isolation"]},{"generic":true,"terms":["society","social","socially","community","group","others","people","everyone"]}],"star":["banishment","banished","exile","outcast","cast out"]}]}
    ],
    parts: [],
    origin: {"text":"From ostrakon, the pottery shard Athenians inscribed with a name when voting to banish a citizen for ten years.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"173","sense":1}]
  },
  "Pyrrhic": {
    word: "Pyrrhic victory",
    senses: [
      {"defn":"A victory won at too great a cost.","wording":"book","note":"Replaces the earlier definition “Pertaining to a victory won at such great cost it is nearly as bad as a defeat.” (instructor's ruling, Oct 7, 2026).","keys":[{"groups":[{"generic":true,"terms":["victory","win","won","success","triumph"]},{"terms":["cost","costly","losses","sacrifice","expensive","damage","price","not worth it"]}]}],"accepted":["disaster","ruin","ruinous"],"ref":"Greek Lesson II, p. 174"}
    ],
    parts: [],
    origin: {"text":"From King Pyrrhus of Epirus, whose costly victory over Rome prompted the remark that another such victory would ruin him.","wording":"instructor"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1},{"source":"book","lesson":"Greek Lesson II","page":"174","sense":1}]
  },
  "senile": {
    word: "senile",
    senses: [],
    parts: [{"gloss":"SEN","label":"SEN-"},{"gloss":"-ILE","label":"-ile"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"68 (inferred)"}]
  },
  "unilateral": {
    word: "unilateral",
    senses: [],
    parts: [{"gloss":"UNI","label":"uni-"},{"gloss":"LATER","label":"LATER-"},{"gloss":"-AL","label":"-al"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"68 (inferred)"}]
  },
  "generate": {
    word: "generate",
    senses: [],
    parts: [{"gloss":"GENER","label":"GENER-"},{"gloss":"-ATE","label":"-ate"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"68 (inferred)"}]
  },
  "luminary": {
    word: "luminary",
    senses: [],
    parts: [{"gloss":"LUMIN","label":"LUMIN-"},{"gloss":"-ARY","label":"-ary"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"68 (inferred)"}]
  },
  "turbulent": {
    word: "turbulent",
    senses: [],
    parts: [{"gloss":"TURB","label":"TURB-"},{"gloss":"-ULENT","label":"-ulent"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "aquatic": {
    word: "aquatic",
    senses: [],
    parts: [{"gloss":"AQU","label":"AQU(A)-"},{"gloss":"-IC","label":"-ic"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "corpulent": {
    word: "corpulent",
    senses: [],
    parts: [{"gloss":"CORPOR","label":"CORPOR-, CORP(US)-"},{"gloss":"-ULENT","label":"-ulent"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "precarious": {
    word: "precarious",
    senses: [],
    parts: [{"gloss":"PREC","label":"PREC-"},{"gloss":"-ARY","label":"-ary (→ i)"},{"gloss":"-OUS","label":"-ous"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "invoke": {
    word: "invoke",
    senses: [],
    parts: [{"gloss":"IN-into","label":"in-"},{"gloss":"VOC","label":"VOC-, VOK-"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "quadrilateral": {
    word: "quadrilateral",
    senses: [],
    parts: [{"gloss":"QUADRI","label":"quadri-"},{"gloss":"LATER","label":"LATER-"},{"gloss":"-AL","label":"-al"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "gregarious": {
    word: "gregarious",
    senses: [],
    parts: [{"gloss":"GREG","label":"GREG-"},{"gloss":"-ARY","label":"-ary (→ i)"},{"gloss":"-OUS","label":"-ous"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "deflated": {
    word: "deflated",
    senses: [],
    parts: [{"gloss":"DE","label":"de-"},{"gloss":"FLAT","label":"FLAT-"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "retained": {
    word: "retained",
    senses: [],
    parts: [{"gloss":"RE","label":"re-"},{"gloss":"TEN","label":"TEN-, TAIN-"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "generic": {
    word: "generic",
    senses: [],
    parts: [{"gloss":"GENER","label":"GENER-"},{"gloss":"-IC","label":"-ic"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "inflamed": {
    word: "inflamed",
    senses: [],
    parts: [{"gloss":"IN-into","label":"in-"},{"gloss":"FLAM","label":"FLAM(M)-"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "luminous": {
    word: "luminous",
    senses: [],
    parts: [{"gloss":"LUMIN","label":"LUMIN-"},{"gloss":"-OUS","label":"-ous"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "contemporary": {
    word: "contemporary",
    senses: [],
    parts: [{"gloss":"CON","label":"con-"},{"gloss":"TEMPOR","label":"TEMPOR-"},{"gloss":"-ARY","label":"-ary"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "servile": {
    word: "servile",
    senses: [],
    parts: [{"gloss":"SERV","label":"SERV-"},{"gloss":"-ILE","label":"-ile"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "enchanted": {
    word: "enchanted",
    senses: [],
    parts: [{"gloss":"IN-into","label":"en-","note":"causative"},{"gloss":"CANT","label":"CANT-, CHANT-"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "infer": {
    word: "infer",
    senses: [],
    parts: [{"gloss":"IN-into","label":"in-"},{"gloss":"FER","label":"FER-"}],
    sources: [{"source":"book","lesson":"Lesson IX, Exercise III","page":"69"}]
  },
  "bishop": {
    word: "bishop",
    senses: [],
    parts: [],
    etymology: {"greek":"episkopos","gmean":"overseer","parts":[{"gloss":"g:epi","label":"epi-"},{"gloss":"g:skopos","label":"skopos"}],"note":"Four changes: apheresis (the initial e- is lost); voicing (/p/ becomes /b/); /sk/ becomes the more English /sh/; and clipping at the end.","steps":[["Greek","episkopos","overseer"],["Late Latin","episcopus",""],["Old English","bisceop",""],["English","bishop",""]],"greekForms":["episkopos"],"keys":[{"groups":[{"terms":["overseer","oversee","overseeing","supervisor","superintendent","watcher","watchman","guardian","inspector","watch over","look over"]}]}],"wording":"book","ref":"pp. 159-160","wordingNote":"From the wording the instructor supplied."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "blame": {
    word: "blame",
    senses: [],
    parts: [],
    etymology: {"greek":"blasphēmein","gmean":"to speak evil of, slander","parts":[{"gloss":"g:blas","label":"blas-"},{"gloss":"g:pheme","label":"phēmē"}],"steps":[["Greek","blasphēmein","to slander, speak irreverently of sacred things"],["Church Latin","blasphemare",""],["Old French","blasmer",""],["English","blame","sense shifted to “find fault with”"]],"greekForms":["blasphēmein","blasphēmia","blasphēmos"],"keys":[{"groups":[{"terms":["slander","speak evil","speak ill","defame","revile","insult","malign","curse","profane","speak against","speak irreverently","badmouth","vilify","blaspheme","disparage"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "chair": {
    word: "chair",
    senses: [],
    parts: [],
    etymology: {"greek":"kathedra","gmean":"seat, chair","parts":[{"gloss":"g:kata","label":"kata-"},{"gloss":"g:hedra","label":"hedra"}],"steps":[["Greek","kathedra","seat"],["Latin","cathedra",""],["Old French","chaiere",""],["English","chair",""]],"greekForms":["kathedra"],"keys":[{"groups":[{"terms":["seat","chair","bench","throne","stool"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "desk": {
    word: "desk",
    senses: [],
    parts: [],
    etymology: {"greek":"diskos","gmean":"quoit, disk, platter","steps":[["Greek","diskos","quoit, platter"],["Latin","discus",""],["Medieval Latin","desca","table to write on"],["English","desk",""]],"greekForms":["diskos"],"keys":[{"groups":[{"terms":["quoit","disk","disc","discus","platter","plate","dish","round plate"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "devil": {
    word: "devil",
    senses: [],
    parts: [],
    etymology: {"greek":"diabolos","gmean":"slanderer, accuser","parts":[{"gloss":"g:dia","label":"dia-"},{"gloss":"g:ballein","label":"ballein"}],"note":"From diaballein, “to slander,” literally “to throw across.” Devil shows vowel reduction and clipping. The internal consonant appeared in other languages as b, v, or f, and was sometimes lost altogether when the word was contracted into one syllable.","steps":[["Greek","diabolos","slanderer"],["Late Latin","diabolus",""],["Old English","deofol",""],["English","devil",""]],"greekForms":["diabolos","diaballein"],"keys":[{"groups":[{"terms":["slanderer","slander","accuser","accuse","defamer","adversary","calumniator","one who throws across","throw across","liar","backbiter"]}]}],"wording":"book","ref":"pp. 159-160","wordingNote":"From the wording the instructor supplied."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "glamour": {
    word: "glamour",
    senses: [],
    parts: [],
    etymology: {"greek":"grammatikē (tekhnē)","gmean":"the art of letters","parts":[{"gloss":"g:gramma","label":"gramma"}],"note":"Learning was linked with magic in the Middle Ages, so “grammar” came to mean “magic” and was altered in Scots to glamour.","steps":[["Greek","grammatikē","the art of letters"],["Latin","grammatica",""],["Old French","gramaire","grammar; learning, magic"],["Scots","gramarye, glamer","magic, enchantment"],["English","glamour",""]],"greekForms":["grammatikē","grammatikē tekhnē","grammatikos","gramma"],"keys":[{"groups":[{"terms":["letters","letter","grammar","literature","learning","writing","art of letters","scholarship","literacy","reading and writing"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "palsy": {
    word: "palsy",
    senses: [],
    parts: [],
    etymology: {"greek":"paralysis","gmean":"a loosening; paralysis","parts":[{"gloss":"g:para","label":"para-"},{"gloss":"g:lyein","label":"lyein"}],"steps":[["Greek","paralysis","a loosening"],["Latin","paralysis",""],["Old French","paralisie",""],["Anglo-French","parlesie",""],["Middle English","palesie",""],["English","palsy",""]],"greekForms":["paralysis","paralyein"],"keys":[{"groups":[{"terms":["loosening","loosen","loose","paralysis","paralyzed","paralysed","disabling","disabled","weakness","release","undoing","relaxing","relaxation","slackening"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "parole": {
    word: "parole",
    senses: [],
    parts: [],
    etymology: {"greek":"parabolē","gmean":"comparison","parts":[{"gloss":"g:para","label":"para-"},{"gloss":"g:bole","label":"bolē"}],"note":"Literally “a throwing beside.”","steps":[["Greek","parabolē","comparison"],["Latin","parabola","comparison"],["Vulgar Latin","paraula","speech, word"],["French","parole","word"],["English","parole","word of honor"]],"greekForms":["parabolē","paraballein"],"keys":[{"groups":[{"terms":["comparison","compare","analogy","a throwing beside","throwing beside","juxtaposition","side by side","parable","illustration","placing beside"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "priest": {
    word: "priest",
    senses: [],
    parts: [],
    etymology: {"greek":"presbyteros","gmean":"elder","parts":[{"gloss":"g:presbys","label":"presbys"},{"gloss":"g:-teros","label":"-teros"}],"steps":[["Greek","presbyteros","elder"],["Late Latin","presbyter",""],["Vulgar Latin","prester",""],["Old English","prēost",""],["English","priest",""]],"greekForms":["presbyteros","presbys"],"keys":[{"groups":[{"terms":["elder","older","old man","older man","senior","old","aged","elderly"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "story": {
    word: "story",
    senses: [],
    parts: [],
    etymology: {"greek":"historia","gmean":"inquiry; an account, narrative","parts":[{"label":"histōr","text":"knowing, learned; a witness"}],"steps":[["Greek","historia","inquiry, account"],["Latin","historia",""],["Old French","estoire",""],["Anglo-French","storie",""],["English","story",""]],"greekForms":["historia","histōr"],"keys":[{"groups":[{"terms":["inquiry","enquiry","investigation","research","account","narrative","tale","history","report","record","knowledge","chronicle"]}]}],"accepted":["learning"],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 1","page":"159-160"}]
  },
  "alms": {
    word: "alms",
    senses: [],
    parts: [],
    etymology: {"greek":"eleēmosynē","gmean":"pity, mercy; in church Greek, charity","parts":[{"gloss":"g:eleos","label":"eleos"}],"steps":[["Greek","eleēmosynē","pity; charity"],["Church Latin","eleemosyna",""],["Vulgar Latin","alemosyna",""],["Early Germanic","alemosna",""],["Old English","ælmesse","almsgiving"],["English","alms","charity to the poor"]],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 2","page":"159-160"}]
  },
  "box": {
    word: "box",
    senses: [],
    parts: [],
    etymology: {"greek":"pyxos","gmean":"box tree","note":"The container is named for the boxwood it was made of.","steps":[["Greek","pyxos → pyxis","box tree → boxwood box"],["Latin","pyxis",""],["Late Latin","buxis",""],["Old English","box",""],["English","box","container"]],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 2","page":"159-160"}]
  },
  "chimney": {
    word: "chimney",
    senses: [],
    parts: [],
    etymology: {"greek":"kaminos","gmean":"furnace, oven","steps":[["Greek","kaminos","furnace, oven"],["Latin","caminus","furnace, forge, hearth"],["Late Latin","(camera) caminata","room with a fireplace"],["Old French","cheminee","fireplace; chimney"],["English","chimney","first “furnace,” later “smoke vent”"]],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 2","page":"159-160"}]
  },
  "church": {
    word: "church",
    senses: [],
    parts: [],
    etymology: {"greek":"kyriakon (dōma)","gmean":"the Lord’s (house)","parts":[{"gloss":"g:kyrios","label":"kyrios"}],"note":"Unusually, this word came from Greek into the Germanic languages directly (probably through Gothic) rather than through Latin.","steps":[["Greek","kyriakon","the Lord’s (house)"],["West Germanic","kirika",""],["Old English","cirice",""],["Middle English","chirche",""],["English","church",""]],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 2","page":"159-160"}]
  },
  "elixir": {
    word: "elixir",
    senses: [],
    parts: [],
    etymology: {"greek":"xērion","gmean":"powder for drying wounds","parts":[{"gloss":"g:xeros","label":"xēros"}],"steps":[["Greek","xērion","drying powder"],["Arabic","al-iksir","the philosopher’s stone (al- “the”)"],["Medieval Latin","elixir",""],["English","elixir","alchemical tincture; later a tonic"]],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 2","page":"159-160"}]
  },
  "pew": {
    word: "pew",
    senses: [],
    parts: [],
    etymology: {"greek":"podion","gmean":"little foot; base","parts":[{"gloss":"g:pous","label":"pous, podos"}],"steps":[["Greek","podion","little foot, base"],["Latin","podium","raised platform"],["Old French","puie","balcony, raised seat"],["Middle English","peue","raised seat in church"],["English","pew","church bench"]],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 2","page":"159-160"}]
  },
  "prow": {
    word: "prow",
    senses: [],
    parts: [],
    etymology: {"greek":"prōira","gmean":"bow of a ship","steps":[["Greek","prōira","bow of a ship"],["Latin","prora",""],["Vulgar Latin","proda",""],["Italian (Genoese)","prua",""],["French","proue",""],["English","prow",""]],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 2","page":"159-160"}]
  },
  "almond": {
    word: "almond",
    senses: [],
    parts: [],
    etymology: {"greek":"amygdalē","gmean":"almond","steps":[["Greek","amygdalē","almond"],["Latin","amygdala",""],["Vulgar Latin","amandula",""],["Old French","almande",""],["English","almond",""]],"greekForms":["amygdalē","amygdalon"],"keys":[{"groups":[{"terms":["almond","almond tree","nut"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "cherry": {
    word: "cherry",
    senses: [],
    parts: [],
    etymology: {"greek":"kerasos","gmean":"cherry tree","note":"Middle English cherise was mistaken for a plural, and the -s was dropped.","steps":[["Greek","kerasos","cherry tree"],["Vulgar Latin","ceresia",""],["Old North French","cherise",""],["English","cherry",""]],"greekForms":["kerasos","kerasion"],"keys":[{"groups":[{"terms":["cherry","cherry tree","cherries"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "date": {
    word: "date",
    senses: [],
    parts: [],
    etymology: {"greek":"daktylos","gmean":"finger","note":"From the fruit’s supposed resemblance to a finger. Compare dactyl.","steps":[["Greek","daktylos","finger"],["Latin","dactylus",""],["Old Provençal","datil",""],["Old French","date",""],["English","date",""]],"greekForms":["daktylos"],"keys":[{"groups":[{"terms":["finger","fingers","digit","toe"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "fancy": {
    word: "fancy",
    senses: [],
    parts: [],
    etymology: {"greek":"phantasia","gmean":"appearance, image; imagination","parts":[{"gloss":"g:phainesthai","label":"phainesthai"}],"note":"Fancy is a contraction of fantasy.","steps":[["Greek","phantasia","imagination"],["Latin","phantasia",""],["Old French","fantasie",""],["English","fantasy → fancy",""]],"greekForms":["phantasia","phainesthai"],"keys":[{"groups":[{"terms":["appearance","image","imagination","fantasy","vision","apparition","imagining","impression","notion","appear","show","display","perception"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "frantic": {
    word: "frantic",
    senses: [],
    parts: [],
    etymology: {"greek":"phrenitis","gmean":"inflammation of the brain; frenzy","parts":[{"gloss":"g:phren","label":"phrēn"},{"gloss":"g:-itis","label":"-itis"}],"note":"Frenetic comes from the same source.","steps":[["Greek","phrenitis","frenzy"],["Latin","phreneticus",""],["Old French","frenetike",""],["Middle English","frentik",""],["English","frantic",""]],"greekForms":["phrenitis","phrenitikos","phrēn"],"keys":[{"groups":[{"terms":["inflammation","inflamed","swelling","swollen","fever"]},{"terms":["brain","mind","head"]}]},{"groups":[{"terms":["frenzy","frenzied","madness","mad","delirium","delirious","insanity","insane","mania","raving","frenetic","brain fever","derangement"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "guitar": {
    word: "guitar",
    senses: [],
    parts: [],
    etymology: {"greek":"kithara","gmean":"a lyre-like stringed instrument","steps":[["Greek","kithara","stringed instrument"],["Latin","cithara",""],["Spanish","guitarra",""],["French","guitare",""],["English","guitar",""]],"greekForms":["kithara"],"keys":[{"groups":[{"terms":["lyre","harp","cithara","zither","lute"]}]},{"groups":[{"terms":["string","stringed","strings"]},{"terms":["instrument"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "lantern": {
    word: "lantern",
    senses: [],
    parts: [],
    etymology: {"greek":"lamptēr","gmean":"torch, lamp","parts":[{"gloss":"g:lampein","label":"lampein"}],"steps":[["Greek","lamptēr","torch"],["Latin","lanterna",""],["Old French","lanterne",""],["English","lantern",""]],"greekForms":["lamptēr","lampein"],"keys":[{"groups":[{"terms":["torch","lamp","light","beacon","candle","lampstand","firebrand"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "licorice": {
    word: "licorice",
    senses: [],
    parts: [],
    etymology: {"greek":"glykyrrhiza","gmean":"sweet root","parts":[{"gloss":"g:glykys","label":"glykys"},{"gloss":"g:rhiza","label":"rhiza"}],"steps":[["Greek","glykyrrhiza","sweet root"],["Late Latin","liquiritia",""],["Old French","licorece",""],["English","licorice",""]],"greekForms":["glykyrrhiza"],"keys":[{"groups":[{"terms":["sweet","sweetness"]},{"terms":["root","roots"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "place": {
    word: "place",
    senses: [],
    parts: [],
    etymology: {"greek":"plateia (hodos)","gmean":"broad (way), street","parts":[{"gloss":"g:platys","label":"platys"}],"steps":[["Greek","plateia","broad way"],["Latin","platea","courtyard, open space"],["Old French","place",""],["English","place",""]],"greekForms":["plateia","plateia hodos","platys"],"keys":[{"groups":[{"terms":["street","broad way","broad street","wide street","road","avenue","way","boulevard","square","broad","wide","thoroughfare"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "surgeon, surgery": {
    word: "surgeon, surgery",
    senses: [],
    parts: [],
    etymology: {"greek":"kheirourgia","gmean":"handiwork; surgery","parts":[{"gloss":"g:kheir","label":"kheir"},{"gloss":"g:ergon","label":"ergon"}],"steps":[["Greek","kheirourgia","work done by hand"],["Latin","chirurgia",""],["Old French","surgerie; surgien",""],["English","surgery; surgeon",""]],"greekForms":["kheirourgia","kheirourgos"],"keys":[{"groups":[{"terms":["handiwork","handwork","surgery","surgeon","craft","manual work","manual labor","manual labour","handicraft"]}]},{"groups":[{"terms":["hand","hands"]},{"terms":["work","working","worker","labor","labour","craft","done"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "truck": {
    word: "truck",
    senses: [],
    parts: [],
    etymology: {"greek":"trokhos","gmean":"wheel","parts":[{"gloss":"g:trekhein","label":"trekhein"}],"note":"English truck first meant a small solid wheel, then a cart, then a motor vehicle.","steps":[["Greek","trokhos","wheel"],["Latin","trochus","iron hoop"],["English","truck","small wheel → vehicle"]],"greekForms":["trokhos","trekhein"],"keys":[{"groups":[{"terms":["wheel","wheels","hoop","ring"]}]}],"wording":"dictionary","ref":"Online Etymology Dictionary","wordingNote":"Claude's wording, checked against the dictionary when the deck was built."},
    sources: [{"source":"book","lesson":"Greek Introduction, Exercise 3","page":"159-160"}]
  },
  "biped": {
    word: "biped",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "introversive": {
    word: "introversive",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "recessive": {
    word: "recessive",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "unanimous": {
    word: "unanimous",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "discursive": {
    word: "discursive",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "devious": {
    word: "devious",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "prospective": {
    word: "prospective",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "complementary": {
    word: "complementary",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "prelusory": {
    word: "prelusory",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "evidential": {
    word: "evidential",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "circumlocutory": {
    word: "circumlocutory",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "superannuated": {
    word: "superannuated",
    senses: [],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 1","page":"51-56"}]
  },
  "engine": {
    word: "engine",
    senses: [
      {"defn":"locomotive; motor","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: clever invention","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "domino": {
    word: "domino",
    senses: [
      {"defn":"a game-piece with spots","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: a monastic hood","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "dessert": {
    word: "dessert",
    senses: [
      {"defn":"last course of a meal","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: removal of the dishes","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "parade": {
    word: "parade",
    senses: [
      {"defn":"a public promenade","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: a stopping place","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "afflatus": {
    word: "afflatus",
    senses: [
      {"defn":"divine inspiration","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: a breathing upon","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "Lucifer": {
    word: "Lucifer",
    senses: [
      {"defn":"Satan","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: the light-bearer","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "flamingo": {
    word: "flamingo",
    senses: [
      {"defn":"a large, wading bird","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: flame","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "dungeon": {
    word: "dungeon",
    senses: [
      {"defn":"a prison","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: mastery","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "soufflé": {
    word: "soufflé",
    senses: [
      {"defn":"a baked dish made of eggs","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: puffed up","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "dome": {
    word: "dome",
    senses: [
      {"defn":"hemispherical roof","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: a house","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "flagrant": {
    word: "flagrant",
    senses: [
      {"defn":"shocking; notorious","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [{"gloss": "FLAM", "label": "FLAGR-"}, {"gloss": "-ANT", "label": "-ant"}],
    origin: {"text":"Etymological meaning: blazing","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1},{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "limn": {
    word: "limn",
    senses: [
      {"defn":"to depict","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: to illuminate manuscripts","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "flamboyant": {
    word: "flamboyant",
    senses: [
      {"defn":"highly ornate","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: having flame-like curves","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "collateral": {
    word: "collateral",
    senses: [
      {"defn":"security for a loan","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: side by side","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "several": {
    word: "several",
    senses: [
      {"defn":"more than a few","wording":"workbook","ref":"Lesson IX, Exercise 2"}
    ],
    parts: [],
    origin: {"text":"Etymological meaning: separated","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
  },
  "condominium": {
    word: "condominium",
    senses: [
      {"defn":"a purchased apartment","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "dominant": {
    word: "dominant",
    senses: [
      {"defn":"prevailing","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "domain": {
    word: "domain",
    senses: [
      {"defn":"realm","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "domicile": {
    word: "domicile",
    senses: [
      {"defn":"place of residence","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "conflagration": {
    word: "conflagration",
    senses: [
      {"defn":"a large, destructive fire","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "illuminate": {
    word: "illuminate",
    senses: [
      {"defn":"to enlighten","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "pellucid": {
    word: "pellucid",
    senses: [
      {"defn":"clear","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "parry": {
    word: "parry",
    senses: [
      {"defn":"to deflect; to evade","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "pare": {
    word: "pare",
    senses: [
      {"defn":"to remove by cutting","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "apparel": {
    word: "apparel",
    senses: [
      {"defn":"attire","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "seniority": {
    word: "seniority",
    senses: [
      {"defn":"priority gained through length of service","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "senectitude": {
    word: "senectitude",
    senses: [
      {"defn":"old age","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "subserve": {
    word: "subserve",
    senses: [
      {"defn":"to assist in a minor capacity","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "reserved": {
    word: "reserved",
    senses: [
      {"defn":"self-restrained","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "servitude": {
    word: "servitude",
    senses: [
      {"defn":"slavery","wording":"workbook","ref":"Lesson IX, Exercise 3"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 3","page":"51-56","sense":1}]
  },
  "congenital": {
    word: "congenital",
    senses: [
      {"defn":"existing at birth","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [{"gloss": "CON", "label": "con-"}, {"gloss": "GENER", "label": "GEN-"}, {"gloss": "-AL", "label": "-ital"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1},{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "genre": {
    word: "genre",
    senses: [
      {"defn":"category of artistic composition","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "disingenuous": {
    word: "disingenuous",
    senses: [
      {"defn":"insincere; calculating","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "gender": {
    word: "gender",
    senses: [
      {"defn":"classification as to sex","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "gentle": {
    word: "gentle",
    senses: [
      {"defn":"mild","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "progeny": {
    word: "progeny",
    senses: [
      {"defn":"offspring; descendant","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "generalize": {
    word: "generalize",
    senses: [
      {"defn":"to make universal or indefinite","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "congenial": {
    word: "congenial",
    senses: [
      {"defn":"agreeable","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "ingénue": {
    word: "ingénue",
    senses: [
      {"defn":"an artless, innocent young girl","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "generous": {
    word: "generous",
    senses: [
      {"defn":"unselfish","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "regenerate": {
    word: "regenerate",
    senses: [
      {"defn":"to produce anew","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "generic products": {
    word: "generic products",
    senses: [
      {"defn":"goods sold by type or kind, not by brand name","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "genuine": {
    word: "genuine",
    senses: [
      {"defn":"authentic","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "genetics": {
    word: "genetics",
    senses: [
      {"defn":"the science of heredity","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "germinate": {
    word: "germinate",
    senses: [
      {"defn":"to begin to grow; to sprout","wording":"workbook","ref":"Lesson IX, Exercise 5"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
  },
  "align": {
    word: "align",
    senses: [],
    parts: [{"gloss":"LINE","label":"LINE- [LIGN-]"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "pawn": {
    word: "pawn",
    senses: [],
    parts: [{"gloss":"PED","label":"PED-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "ingredient": {
    word: "ingredient",
    senses: [],
    parts: [{"gloss":"GRAD","label":"GRAD-, GRESS-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "bonny": {
    word: "bonny",
    senses: [],
    parts: [{"gloss":"BENE","label":"BENE-, BON-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "egalitarian": {
    word: "egalitarian",
    senses: [],
    parts: [{"gloss":"EQU","label":"EQU-, (IQU-)"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "regime": {
    word: "regime",
    senses: [],
    parts: [{"gloss":"REG","label":"REG-, (RIG-), RECT-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "damsel": {
    word: "damsel",
    senses: [],
    parts: [{"gloss":"DOM","label":"DOM(IN)-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "enclosure": {
    word: "enclosure",
    senses: [],
    parts: [{"gloss":"CLUD","label":"CLUD-, CLUS-, [CLOS-]"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "grievous": {
    word: "grievous",
    senses: [],
    parts: [{"gloss":"GRAV","label":"GRAV- [GRIEV-]"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "portion": {
    word: "portion",
    senses: [],
    parts: [{"gloss":"PART","label":"PART-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "convey": {
    word: "convey",
    senses: [],
    parts: [{"gloss":"VI","label":"VI(A)-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "revenue": {
    word: "revenue",
    senses: [],
    parts: [{"gloss":"VEN","label":"VEN-, VENT-, [VENU-]"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "pansy": {
    word: "pansy",
    senses: [],
    parts: [{"gloss":"PEND","label":"PEND-, PENS-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "abound": {
    word: "abound",
    senses: [],
    parts: [{"gloss":"UND","label":"UND- [OUND-]"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "premiere": {
    word: "premiere",
    senses: [],
    parts: [{"gloss":"PRIM","label":"PRIM-"}],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 6","page":"51-56"}]
  },
  "marathon": {
    word: "marathon",
    senses: [
      {"defn":"A long race (about 26 miles).","wording":"book","ref":"Greek Lesson II, p. 170","keys":[{"groups":[{"terms":["race","run","running","footrace","foot race"]},{"terms":["long","26","distance","endurance"]}],"star":["26 miles","26.2 miles"]}],"accepted":["miles"]}
    ],
    parts: [],
    origin: {"text":"From the Plain of Marathon, site of an Athenian victory over the Persians, whose messenger ran the news to Athens.","wording":"instructor","ref":"Claude's summary of the book, p. 170, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"170","sense":1}]
  },
  "Solon": {
    word: "Solon",
    senses: [
      {"defn":"A legislator (often used ironically).","wording":"instructor","ref":"instructor's wording, Oct 7, 2026","note":"The book: “a senator” (as the word is used in newspapers, p. 170); reworded by the instructor.","keys":[{"groups":[{"terms":["senator","legislator","lawmaker","congressman","congresswoman","politician","statesman","representative","lawgiver"]}]}],"accepted":["wise"]}
    ],
    parts: [],
    origin: {"text":"From Solon, the statesman commissioned to reform the laws of Athens.","wording":"instructor","ref":"Claude's summary of the book, p. 170, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"170","sense":1}]
  },
  "academy": {
    word: "academy",
    senses: [
      {"defn":"A school or learned society.","wording":"book","ref":"Greek Lesson II, p. 170","keys":[{"groups":[{"terms":["school","college","institute","university","education","educational","training"]}]},{"groups":[{"terms":["learned","scholarly","scholars","academic","intellectual"]},{"terms":["society","group","association","body","institution","organization"]}]}]}
    ],
    parts: [],
    origin: {"text":"From the grove of the hero Academus near Athens, where Plato taught.","wording":"instructor","ref":"Claude's summary of the book, p. 170, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"170","sense":1}]
  },
  "Arcadian": {
    word: "Arcadian",
    senses: [
      {"defn":"Simple, peaceful, rustic.","wording":"book","ref":"Greek Lesson II, p. 170-171","keys":[{"groups":[{"terms":["simple","peaceful","rustic","rural","pastoral","country","countryside","idyllic","tranquil","quiet","serene","unspoiled","bucolic"]}]}]}
    ],
    parts: [],
    origin: {"text":"From Arcadia, a remote, mountainous region of Greece known for its rustic life.","wording":"instructor","ref":"Claude's summary of the book, p. 170-171, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"170-171","sense":1}]
  },
  "Croesus": {
    word: "Croesus",
    senses: [
      {"defn":"A very rich man.","wording":"book","ref":"Greek Lesson II, p. 171","keys":[{"groups":[{"terms":["rich","wealthy","wealth","affluent","fortune","millionaire","billionaire","money"]}]}],"accepted":["man","person","king"]}
    ],
    parts: [],
    origin: {"text":"From Croesus, a historical king in Asia Minor famed for his wealth.","wording":"instructor","ref":"Claude's summary of the book, p. 171, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"171","sense":1}]
  },
  "hedonism": {
    word: "hedonism, hedonistic",
    senses: [
      {"defn":"The doctrine that pleasure or happiness is the highest good; self-indulgence.","wording":"dictionary","ref":"Online Etymology Dictionary (hedonism); the book, p. 172, only calls it “a blanket term for all such indulgent attitudes”","keys":[{"groups":[{"terms":["pleasure","happiness","enjoyment","indulgence","self-indulgence","self-indulgent","gratification"]}],"star":["pleasure-seeking","pursuit of pleasure"]}],"accepted":["doctrine","belief","philosophy","highest","goal","good"]}
    ],
    parts: [],
    origin: {"text":"From Greek hēdonē, “pleasure”; first taught by Aristippus and the Cyrenaic school.","wording":"instructor","ref":"Claude's summary of the book, p. 172, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"172","sense":1}]
  },
  "to cut the Gordian knot": {
    word: "to cut the Gordian knot",
    senses: [
      {"defn":"To solve a difficult problem by direct and drastic means.","wording":"book","ref":"Greek Lesson II, p. 172","keys":[{"groups":[{"terms":["solve","resolve","fix","settle","overcome","cut through","deal with"]},{"terms":["direct","drastic","bold","decisive","forceful","radical","extreme","quick","simple","straightforward","shortcut"]}]}],"accepted":["difficult","hard","complex","complicated","problem"]}
    ],
    parts: [],
    origin: {"text":"From the knot tied by King Gordius, which Alexander the Great cut with his sword.","wording":"instructor","ref":"Claude's summary of the book, p. 172, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"172","sense":1}]
  },
  "mausoleum": {
    word: "mausoleum",
    senses: [
      {"defn":"A large tomb.","wording":"book","ref":"Greek Lesson II, p. 173","keys":[{"groups":[{"terms":["tomb","grave","burial","sepulchre","sepulcher","crypt","vault","monument","memorial"]}]}],"accepted":["large","grand","magnificent","building"]}
    ],
    parts: [],
    origin: {"text":"From the tomb of King Mausolus of Caria, one of the Seven Wonders of the World.","wording":"instructor","ref":"Claude's summary of the book, p. 173, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"173","sense":1}]
  },
  "meander": {
    word: "meander",
    senses: [
      {"defn":"To follow a winding course.","wording":"book","ref":"Greek Lesson II, p. 173","note":"The book's first definition; its second, the Greek-key design, was left out by the instructor's ruling (Oct 7, 2026).","keys":[{"groups":[{"terms":["wind","winding","wander","wandering","twist","twisting","zigzag","curve","curving","roam","ramble"]}]}],"accepted":["course","path","aimlessly","river"]}
    ],
    parts: [],
    origin: {"text":"From the Meander, a river in Ionia (modern Turkey) known for its winding course.","wording":"instructor","ref":"instructor's wording, Oct 7, 2026"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"173","sense":1}]
  },
  "sophistry": {
    word: "sophistry, sophism",
    senses: [
      {"defn":"Clever but deceptive argumentation meant to mislead.","wording":"book","ref":"Greek Lesson II, p. 174-175","keys":[{"groups":[{"terms":["deceptive","misleading","mislead","deceive","deceit","false","fallacious","specious","dishonest","tricky","trick"]},{"terms":["argument","argumentation","arguing","reasoning","rhetoric","logic","debate"]}],"star":["fallacy","fallacies"]}],"accepted":["clever","plausible","persuasive"]}
    ],
    parts: [],
    origin: {"text":"From the sophists, traveling Greek teachers of rhetoric (sophia, “skill”).","wording":"instructor","ref":"Claude's summary of the book, p. 174-175, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"174-175","sense":1}]
  },
  "Spartan": {
    word: "Spartan",
    senses: [
      {"defn":"Rigorous, austere, disciplined.","wording":"book","ref":"Greek Lesson II, p. 175","keys":[{"groups":[{"terms":["rigorous","austere","disciplined","discipline","strict","simple","plain","frugal","stern","hardy","bare","minimal","no frills","self-denying"]}]}],"accepted":["harsh","severe","tough"]}
    ],
    parts: [],
    origin: {"text":"From Sparta, whose citizens were trained from childhood in hardship and discipline.","wording":"instructor","ref":"Claude's summary of the book, p. 175, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"175","sense":1}]
  },
  "stoic": {
    word: "stoic",
    senses: [
      {"defn":"Impassive.","wording":"book","ref":"Greek Lesson II, p. 175","keys":[{"groups":[{"terms":["impassive","unemotional","emotionless","without emotion","no emotion","no emotions","unmoved","calm","composed","unflappable","indifferent","enduring","uncomplaining","patient","unfeeling","detached","stolid","expressionless","accepting"]}]}]}
    ],
    parts: [],
    origin: {"text":"From Stoicism, a Greek school teaching calm acceptance of whatever happens.","wording":"instructor","ref":"Claude's summary of the book, p. 175, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"175","sense":1}]
  },
  "sandwich": {
    word: "sandwich",
    senses: [
      {"defn":"Meat or other filling between two slices of bread.","wording":"instructor","ref":"instructor's wording, Oct 7, 2026","note":"Claude's wording from the book's “putting meat between two slices of bread”, approved by the instructor (Oct 7, 2026).","keys":[{"groups":[{"terms":["bread","slice","slices","bun","roll"]}]}],"accepted":["meat","filling","food","between"]}
    ],
    parts: [],
    origin: {"text":"From the 18th-century Earl of Sandwich, who ate meat between slices of bread so he wouldn't have to leave the gaming table.","wording":"instructor","ref":"Claude's summary of the book, p. 176, approved by the instructor (Oct 7, 2026)"},
    sources: [{"source":"book","lesson":"Greek Lesson II","page":"176","sense":1}]
  },
  "bedlam": {
    word: "bedlam",
    senses: [
      {"defn":"A scene of uproar and confusion.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","keys":[{"groups":[{"terms":["uproar","confusion","chaos","chaotic","pandemonium","mayhem","turmoil","tumult","commotion","madness","disorder","frenzy","noise","noisy","havoc","riot"]}]}]}
    ],
    parts: [],
    origin: {"text":"Bethlehem Hospital (St. Mary of Bethlehem), a London asylum","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","names":["Bethlehem","Bethlem","Bedlam"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"176","sense":1}]
  },
  "boycott": {
    word: "boycott",
    senses: [
      {"defn":"To refuse to deal with a person or business.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","keys":[{"groups":[{"terms":["refuse","refusal","avoid","shun","stop","ban","abstain"]},{"terms":["deal","dealing","buy","buying","business","trade","purchase","support","use"]}],"star":["ostracize","blacklist","embargo"]}],"accepted":["protest"]}
    ],
    parts: [],
    origin: {"text":"Capt. Charles Boycott, an Irish land agent whom tenants ostracized (1880)","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","names":["Boycott"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"176","sense":1}]
  },
  "dunce": {
    word: "dunce",
    senses: [
      {"defn":"A dull or stupid person.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","keys":[{"groups":[{"terms":["dull","stupid","slow","dim","dimwit","fool","foolish","idiot","ignorant","dumb","unintelligent","blockhead","dolt","ignoramus","simpleton"]}]}]}
    ],
    parts: [],
    origin: {"text":"John Duns Scotus, a medieval philosopher whose followers were later mocked","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","names":["Duns Scotus"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"176","sense":1}]
  },
  "Frankenstein": {
    word: "Frankenstein",
    senses: [
      {"defn":"A creation that turns on or destroys its maker.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","keys":[{"groups":[{"terms":["creation","creature","invention","monster","creator","made","creates"]},{"terms":["destroys","destroy","turns on","turns against","ruin","threatens","harm","backfires","out of control"]}]}]}
    ],
    parts: [],
    origin: {"text":"Victor Frankenstein, the scientist in Mary Shelley's novel","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","names":["Frankenstein","Shelley"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"177","sense":1}]
  },
  "jeremiad": {
    word: "jeremiad",
    senses: [
      {"defn":"A long, mournful complaint or denunciation.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, reworded at the instructor's request and approved (Oct 7, 2026).","keys":[{"groups":[{"terms":["complaint","lament","lamentation","denunciation","tirade","rant","diatribe","harangue","criticism","warning"]}]}],"accepted":["long","mournful","bitter","gloomy","prophecy","doom"]}
    ],
    parts: [],
    origin: {"text":"The prophet Jeremiah of the Hebrew Bible, traditionally credited with the Book of Lamentations","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, reworded at the instructor's request and approved (Oct 7, 2026).","names":["Jeremiah"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"177","sense":1}]
  },
  "maudlin": {
    word: "maudlin",
    senses: [
      {"defn":"Tearfully or foolishly sentimental.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, reworded at the instructor's request and approved (Oct 7, 2026).","keys":[{"groups":[{"terms":["sentimental","tearful","weepy","mawkish","sappy","soppy","overemotional","emotional","self-pitying","teary","crying"]}]}],"accepted":["foolish","foolishly","tearfully"]}
    ],
    parts: [],
    origin: {"text":"Mary Magdalene, a follower of Jesus in the New Testament, often painted weeping","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, reworded at the instructor's request and approved (Oct 7, 2026).","names":["Magdalene","Magdalen"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"177","sense":1}]
  },
  "quixotic": {
    word: "quixotic",
    senses: [
      {"defn":"Idealistic to an impractical degree.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","keys":[{"groups":[{"terms":["idealistic","impractical","unrealistic","romantic","visionary","foolish","naive","chivalrous"]}]}],"accepted":["dreamer","noble"]}
    ],
    parts: [],
    origin: {"text":"Don Quixote, the hero of Cervantes' novel","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","names":["Quixote","Quijote","Cervantes"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"177","sense":1}]
  },
  "simony": {
    word: "simony",
    senses: [
      {"defn":"The buying or selling of church offices.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, reworded at the instructor's request and approved (Oct 7, 2026).","keys":[{"groups":[{"terms":["buying","selling","buy","sell","purchase","paying","sale","trade","trading","bribery","bribe"]},{"terms":["church","religious","ecclesiastical","clergy","holy","sacred","spiritual","office","offices","positions"]}]}]}
    ],
    parts: [],
    origin: {"text":"Simon Magus, who tried to buy spiritual power from the apostles (Acts 8, in the New Testament)","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, reworded at the instructor's request and approved (Oct 7, 2026).","names":["Simon Magus"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"177","sense":1}]
  },
  "tawdry": {
    word: "tawdry",
    senses: [
      {"defn":"Cheap and gaudy.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","keys":[{"groups":[{"terms":["cheap","gaudy","tacky","showy","flashy","tasteless","vulgar","shoddy","trashy","garish","sleazy","cheesy","low quality"]}]}]}
    ],
    parts: [],
    origin: {"text":"St. Audrey, whose fair sold cheap lace (“St. Audrey's lace”)","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","names":["Audrey","Etheldreda"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"177","sense":1}]
  },
  "utopia": {
    word: "utopia",
    senses: [
      {"defn":"An ideal society.","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","keys":[{"groups":[{"terms":["ideal","perfect","paradise","dream","flawless"]}]}],"accepted":["society","place","state","world","community"]}
    ],
    parts: [],
    origin: {"text":"Thomas More's Utopia (Greek ou “not” + topos “place”)","wording":"instructor","ref":"assignment-i-answers-checked.md","note":"Claude's draft, checked by the instructor (Oct 7, 2026).","names":["Thomas More","More's","Utopia"]},
    sources: [{"source":"book","lesson":"Greek Lesson II, Assignment I","page":"177","sense":1}]
  },
  "epode": {
    word: "epode",
    senses: [
      {"defn":"song sung after another song: third part of a Greek ode","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter J)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "tragedy": {
    word: "tragedy",
    senses: [
      {"defn":"goat song: tale of disaster","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter F)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "monody": {
    word: "monody",
    senses: [
      {"defn":"song sung by one voice","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter I)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "odeum": {
    word: "odeum",
    senses: [
      {"defn":"concert hall","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter C)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "comedy": {
    word: "comedy",
    senses: [
      {"defn":"mirth song: drama with a happy ending","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter H)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "rhapsody": {
    word: "rhapsody",
    senses: [
      {"defn":"exaggerated expression of feeling","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter A)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "parody": {
    word: "parody",
    senses: [
      {"defn":"burlesque imitation","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter G)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "palinode": {
    word: "palinode",
    senses: [
      {"defn":"a singing back: recantation","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter B)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "melody": {
    word: "melody",
    senses: [
      {"defn":"tune; song","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter E)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "ode": {
    word: "ode",
    senses: [
      {"defn":"short lyric poem","wording":"workbook","ref":"Part II, Lesson III, Exercise 1, p. 169 (answer key letter D)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 1","page":"169","sense":1}]
  },
  "bibliomania": {
    word: "bibliomania",
    senses: [
      {"defn":"obsession with collecting books","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter F)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "bibliotheca": {
    word: "bibliotheca",
    senses: [
      {"defn":"collection of books","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter K)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "Bible": {
    word: "Bible",
    senses: [
      {"defn":"the Good Book","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter O)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "bibliography": {
    word: "bibliography",
    senses: [
      {"defn":"list of references","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter I)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "bibliophile": {
    word: "bibliophile",
    senses: [
      {"defn":"booklover: collector of books","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter G)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "cryptic": {
    word: "cryptic",
    senses: [
      {"defn":"secret; obscure","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter C)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "grotesque": {
    word: "grotesque",
    senses: [
      {"defn":"distorted in appearance","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter M)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "apocryphal": {
    word: "apocryphal",
    senses: [
      {"defn":"of doubtful authorship","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter E)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "cryptonymous": {
    word: "cryptonymous",
    senses: [
      {"defn":"having a secret name","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter H)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "dichotomy": {
    word: "dichotomy",
    senses: [
      {"defn":"division, especially of two mutually exclusive groups","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter L)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "epitome": {
    word: "epitome",
    senses: [
      {"defn":"typical or ideal example","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter A)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "tome": {
    word: "tome",
    senses: [
      {"defn":"any large, scholarly book","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter D)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "mastectomy": {
    word: "mastectomy",
    senses: [
      {"defn":"excision of a breast","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter J)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "atom": {
    word: "atom",
    senses: [
      {"defn":"smallest part of an element","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter B)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "entomology": {
    word: "entomology",
    senses: [
      {"defn":"study of insects","wording":"workbook","ref":"Part II, Lesson III, Exercise 2, p. 169 (answer key letter N)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 2","page":"169","sense":1}]
  },
  "canonical": {
    word: "canonical",
    senses: [
      {"defn":"conforming to a general rule","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter C)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "bicycle": {
    word: "bicycle",
    senses: [
      {"defn":"two-wheeler","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter O)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "cyclone": {
    word: "cyclone",
    senses: [
      {"defn":"violent storm characterized by circular wind motion","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter L)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "encyclopedia": {
    word: "encyclopedia",
    senses: [
      {"defn":"a work that contains information on all branches of knowledge","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter F)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "glossal": {
    word: "glossal",
    senses: [
      {"defn":"pertaining to the tongue","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter A)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "gloss": {
    word: "gloss",
    senses: [
      {"defn":"note of explanation","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter J)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "polyglot": {
    word: "polyglot",
    senses: [
      {"defn":"multilingual","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter E)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "iconoclast": {
    word: "iconoclast",
    senses: [
      {"defn":"attacker of established beliefs","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter H)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "iconology": {
    word: "iconology",
    senses: [
      {"defn":"study of artistic symbolism","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter B)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "mimic": {
    word: "mimic",
    senses: [
      {"defn":"to imitate","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter N)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "pantomime": {
    word: "pantomime",
    senses: [
      {"defn":"the telling of a story without words","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter K)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "pyromaniac": {
    word: "pyromaniac",
    senses: [
      {"defn":"person with a passion for setting fires","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter Q)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "pyrosis": {
    word: "pyrosis",
    senses: [
      {"defn":"heartburn","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter D)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "empyrean": {
    word: "empyrean",
    senses: [
      {"defn":"heavens","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter I)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  "pyroclastic": {
    word: "pyroclastic",
    senses: [
      {"defn":"involving volcanic action","wording":"workbook","ref":"Part II, Lesson III, Exercise 3, p. 170 (answer key letter M)"}
    ],
    parts: [],
    sources: [{"source":"workbook","lesson":"Part II, Lesson III, Exercise 3","page":"170","sense":1}]
  },
  // ---- Latin Lesson X (workbook pp. 57-59; book Exercise III, pp. 73-74), added Oct 12, 2026 ----
  "insult": {
    word: "insult",
    senses: [
      {"defn": "to jump on someone: to offend", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option H)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}]
  },
  "assail": {
    word: "assail",
    senses: [
      {"defn": "to leap at: attack", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option F)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}]
  },
  "resilient": {
    word: "resilient",
    senses: [
      {"defn": "capable of leaping back after a mishap", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option I)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [{"gloss": "RE", "label": "re-"}, {"gloss": "SAL", "label": "SIL-"}, {"gloss": "-ANT", "label": "-ient"}],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}, {"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "salacious": {
    word: "salacious",
    senses: [
      {"defn": "fond of jumping: lecherous", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option C)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}]
  },
  "salmon": {
    word: "salmon",
    senses: [
      {"defn": "a fish that leaps", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option A)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}]
  },
  "salient": {
    word: "salient",
    senses: [
      {"defn": "striking: [a point] leaping at you", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option J)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [{"gloss": "SAL", "label": "SAL-"}, {"gloss": "-ANT", "label": "-ient"}],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}, {"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "73"}]
  },
  "sally": {
    word: "sally",
    senses: [
      {"defn": "a sudden rush of troops: a rushing [forward]", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option D)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}]
  },
  "exultation": {
    word: "exultation",
    senses: [
      {"defn": "the act of jumping for joy: rejoicing", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option G)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}]
  },
  "desultory": {
    word: "desultory",
    senses: [
      {"defn": "leaping from one topic to the next: random", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option B)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}]
  },
  "result": {
    word: "result",
    senses: [
      {"defn": "the consequence of leaping back", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 1, p. 57 (option E)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 1", "page": "57", "sense": 1}]
  },
  "posse": {
    word: "posse",
    senses: [
      {"defn": "a small force with legal authority", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: power", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "diffident": {
    word: "diffident",
    senses: [
      {"defn": "timid; shy", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [{"gloss": "DIS", "label": "dif-"}, {"gloss": "FID", "label": "FID-"}, {"gloss": "-ANT", "label": "-ent"}],
    origin: {"text": "Etymological meaning: lacking faith", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}, {"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "73"}]
  },
  "incubate": {
    word: "incubate",
    senses: [
      {"defn": "to sit on eggs in order to hatch them", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [{"gloss": "IN-into", "label": "in-"}, {"gloss": "CUMB", "label": "CUB-"}, {"gloss": "-ATE", "label": "-ate"}],
    origin: {"text": "Etymological meaning: to lie on", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}, {"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "siege": {
    word: "siege",
    senses: [
      {"defn": "blockade", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: a sitting (by the enemy)", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "somersault": {
    word: "somersault",
    senses: [
      {"defn": "acrobatic movement in which the body makes a full revolution", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: a leaping over", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "séance": {
    word: "séance",
    senses: [
      {"defn": "a meeting of spiritualists", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: a sitting", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "cubicle": {
    word: "cubicle",
    senses: [
      {"defn": "carrel", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: sleeping compartment", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "terra incognita": {
    word: "terra incognita",
    senses: [
      {"defn": "exploration of a new field of knowledge", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: unknown land", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "possess": {
    word: "possess",
    senses: [
      {"defn": "to own; to control", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: to sit in power", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "Fido": {
    word: "Fido",
    senses: [
      {"defn": "canine appellation", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: faithful", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "terra cotta": {
    word: "terra cotta",
    senses: [
      {"defn": "fired clay used for roofing tiles, pottery, etc.", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: baked earth", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "sauté": {
    word: "sauté",
    senses: [
      {"defn": "to cook in a small amount of fat", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: to leap", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "fiancé": {
    word: "fiancé",
    senses: [
      {"defn": "man engaged to be married", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: one promised", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "inter": {
    word: "inter",
    senses: [
      {"defn": "to bury a dead body", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: to put in the earth", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "exordium": {
    word: "exordium",
    senses: [
      {"defn": "introduction to a discourse", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 3, p. 58", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    origin: {"text": "Etymological meaning: a beginning", "wording": "workbook"},
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 3", "page": "58", "sense": 1}]
  },
  "succumb": {
    word: "succumb",
    senses: [
      {"defn": "to yield to a superior force", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option D)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "covey": {
    word: "covey",
    senses: [
      {"defn": "small group of game birds", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option C)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "concubine": {
    word: "concubine",
    senses: [
      {"defn": "in some polygamous societies, a second wife", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option M)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [{"gloss": "CON", "label": "con-"}, {"gloss": "CUMB", "label": "CUB-"}, {"gloss": "-INE", "label": "-ine"}],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}, {"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "73"}]
  },
  "defiant": {
    word: "defiant",
    senses: [
      {"defn": "rebellious", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option F)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "fiduciary": {
    word: "fiduciary",
    senses: [
      {"defn": "person to whom property is entrusted for another’s benefit", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option H)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "affiance": {
    word: "affiance",
    senses: [
      {"defn": "to pledge in marriage", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option G)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "adhesive": {
    word: "adhesive",
    senses: [
      {"defn": "glue, for example", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option N)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "hesitant": {
    word: "hesitant",
    senses: [
      {"defn": "slow to act", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option J)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "coordinate": {
    word: "coordinate",
    senses: [
      {"defn": "to place in harmonious relation", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option Q)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "extraordinary": {
    word: "extraordinary",
    senses: [
      {"defn": "remarkable", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option I)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "impotent": {
    word: "impotent",
    senses: [
      {"defn": "powerless", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option L)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "session": {
    word: "session",
    senses: [
      {"defn": "meeting during which a particular activity takes place", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option E)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "subsidy": {
    word: "subsidy",
    senses: [
      {"defn": "a grant of money", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option K)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "supersede": {
    word: "supersede",
    senses: [
      {"defn": "to supplant", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option O)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [{"gloss": "SUPER", "label": "super-"}, {"gloss": "SED", "label": "SED-"}],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}, {"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "73"}]
  },
  "Terre Haute": {
    word: "Terre Haute",
    senses: [
      {"defn": "city in Indiana located on high ground", "wording": "workbook", "ref": "Part I, Lesson X, Exercise 4, p. 59 (option A)", "note": "Matched to the word by Claude; no answer key was supplied (unchecked)."}
    ],
    parts: [],
    sources: [{"source": "workbook", "lesson": "Part I, Lesson X, Exercise 4", "page": "59", "sense": 1}]
  },
  "insubordinate": {
    word: "insubordinate",
    senses: [],
    parts: [{"gloss": "IN-not", "label": "in-"}, {"gloss": "SUB", "label": "sub-"}, {"gloss": "ORD", "label": "ORDIN-"}, {"gloss": "-ATE-adj", "label": "-ate"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "73"}]
  },
  "inherent": {
    word: "inherent",
    senses: [],
    parts: [{"gloss": "IN-into", "label": "in-"}, {"gloss": "HER", "label": "HER-"}, {"gloss": "-ANT", "label": "-ent"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "73"}]
  },
  "plenipotentiary": {
    word: "plenipotentiary",
    senses: [],
    parts: [{"gloss": "PLE", "label": "PLEN-"}, {"gloss": "POT", "label": "POT-"}, {"gloss": "-ANT", "label": "-ent"}, {"gloss": "-ARY", "label": "-iary"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "73"}]
  },
  "sedentary": {
    word: "sedentary",
    senses: [],
    parts: [{"gloss": "SED", "label": "SED-"}, {"gloss": "-ANT", "label": "-ent"}, {"gloss": "-ARY", "label": "-ary"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "73-74"}]
  },
  "subsidiary": {
    word: "subsidiary",
    senses: [],
    parts: [{"gloss": "SUB", "label": "sub-"}, {"gloss": "SED", "label": "SID-"}, {"gloss": "-ARY", "label": "-iary"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "aggregate": {
    word: "aggregate",
    senses: [],
    parts: [{"gloss": "AD", "label": "ag-"}, {"gloss": "GREG", "label": "GREG-"}, {"gloss": "-ATE-adj", "label": "-ate"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "terrain": {
    word: "terrain",
    senses: [],
    parts: [{"gloss": "TERR", "label": "TERR-"}, {"gloss": "-AIN", "label": "-ain"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "pungent": {
    word: "pungent",
    senses: [],
    parts: [{"gloss": "PUNG", "label": "PUNG-"}, {"gloss": "-ANT", "label": "-ent"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "universe": {
    word: "universe",
    senses: [],
    parts: [{"gloss": "UNI", "label": "uni-"}, {"gloss": "VERT", "label": "VERS-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "inordinate": {
    word: "inordinate",
    senses: [],
    parts: [{"gloss": "IN-not", "label": "in-"}, {"gloss": "ORD", "label": "ORDIN-"}, {"gloss": "-ATE-adj", "label": "-ate"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "omnipotent": {
    word: "omnipotent",
    senses: [],
    parts: [{"gloss": "OMNI", "label": "omni-"}, {"gloss": "POT", "label": "POT-"}, {"gloss": "-ANT", "label": "-ent"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "expedient": {
    word: "expedient",
    senses: [],
    parts: [{"gloss": "EX", "label": "ex-"}, {"gloss": "PED", "label": "PED-"}, {"gloss": "-ANT", "label": "-ient"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "incumbent": {
    word: "incumbent",
    senses: [],
    parts: [{"gloss": "IN-into", "label": "in-"}, {"gloss": "CUMB", "label": "CUMB-"}, {"gloss": "-ANT", "label": "-ent"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise III", "page": "74"}]
  },
  "annals": {
    word: "annals",
    senses: [],
    parts: [{"gloss": "ANN", "label": "ANN-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "ordinance": {
    word: "ordinance",
    senses: [],
    parts: [{"gloss": "ORD", "label": "ORD(IN)-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "confinement": {
    word: "confinement",
    senses: [],
    parts: [{"gloss": "FIN", "label": "FIN-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "impediment": {
    word: "impediment",
    senses: [],
    parts: [{"gloss": "PED", "label": "PED-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "impend": {
    word: "impend",
    senses: [],
    parts: [{"gloss": "PEND", "label": "PEND-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "incorporate": {
    word: "incorporate",
    senses: [],
    parts: [{"gloss": "CORPOR", "label": "CORPOR-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "invent": {
    word: "invent",
    senses: [],
    parts: [{"gloss": "VEN", "label": "VEN-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "jury": {
    word: "jury",
    senses: [],
    parts: [{"gloss": "JUR", "label": "JUR-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "magnate": {
    word: "magnate",
    senses: [],
    parts: [{"gloss": "MAGN", "label": "MAGN-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "obvious": {
    word: "obvious",
    senses: [],
    parts: [{"gloss": "VI", "label": "VI-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "prejudice": {
    word: "prejudice",
    senses: [],
    parts: [{"gloss": "JUDIC", "label": "JUDIC-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "punctuate": {
    word: "punctuate",
    senses: [],
    parts: [{"gloss": "PUNG", "label": "PUNCT-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "segregate": {
    word: "segregate",
    senses: [],
    parts: [{"gloss": "GREG", "label": "GREG-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "senate": {
    word: "senate",
    senses: [],
    parts: [{"gloss": "SEN", "label": "SEN-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },
  "travesty": {
    word: "travesty",
    senses: [],
    parts: [{"gloss": "VEST", "label": "VEST-"}],
    sources: [{"source": "book", "lesson": "Latin Lesson X, Exercise IV", "page": "75"}]
  },

  // ---- Latin Lesson XI Exercises III and IV (Ayers book, pp. 80-82; answer key: instructor's manual pp. 67-69), added Oct 18, 2026 ----
  "ineffable": {"word": "ineffable", "senses": [{"defn": "too great or intense to be expressed in words; indescribable", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "IN-not", "label": "in-"}, {"gloss": "EX", "label": "ef-"}, {"gloss": "FA", "label": "FAB-"}, {"gloss": "-ABLE", "label": "-able"}], "origin": {"text": "Analysis (answer key): in- not + effabilis (ex- out + FAB- to speak + -able able to be) easy to speak to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "80"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "credit": {"word": "credit", "senses": [{"defn": "to have faith in; believe; trust", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "CRED", "label": "CRED-"}, {"gloss": "-IT-verbal", "label": "-it"}], "origin": {"text": "Analysis (answer key): from the derivative noun creditum a loan, from CRED- to believe + -it- verbal suffix", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "80"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "transmuted": {"word": "transmuted", "senses": [{"defn": "to change from one nature, form, or substance to another. (Trans- here carries more a sense of 'completely' or 'thoroughly,' reflected in the L transmutare, which means simply 'to change.')", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "TRANS", "label": "trans-"}, {"gloss": "MUT", "label": "MUT-"}, {"gloss": "-ED", "label": "-ed"}], "origin": {"text": "Analysis (answer key): trans- across + MUT- to change + -ed E past participial suffix", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "80"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "fates": {"word": "Fates", "senses": [{"defn": "here, with a capital F and in plural, in Roman and Greek mythology the three goddesses (also called the Parcae) who controlled human life", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "FA", "label": "FAT-"}], "origin": {"text": "Analysis (answer key): from the derivative noun fatum (from the neuter past participle of fari) an utterance, a divine utterance, the expressed will of a god (so FAT- to speak)", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "80"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "fallible": {"word": "fallible", "senses": [{"defn": "capable of being mistaken", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "FALL", "label": "FALL-"}, {"gloss": "-ABLE", "label": "-ible"}], "origin": {"text": "Analysis (answer key): FALL- to deceive + -ible able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "80"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "credible": {"word": "credible", "senses": [{"defn": "believable; reliable; trustworthy", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "CRED", "label": "CRED-"}, {"gloss": "-ABLE", "label": "-ible"}], "origin": {"text": "Analysis (answer key): CRED- to believe + -ible able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "intractable": {"word": "intractable", "senses": [{"defn": "difficult to persuade, influence, or manage", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "IN-not", "label": "in-"}, {"gloss": "TRACT", "label": "TRACT-"}, {"gloss": "-ABLE", "label": "-able"}], "origin": {"text": "Analysis (answer key): in- not + TRACT- to drag, draw + -able tending to be, able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "contingent": {"word": "contingent", "senses": [{"defn": "depending on something uncertain; conditional", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "CON", "label": "con-"}, {"gloss": "TANG", "label": "TING-"}, {"gloss": "-ANT", "label": "-ent"}], "origin": {"text": "Analysis (answer key): con- with + TING- to touch + -ent -ing", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "genitally": {"word": "genitally", "senses": [{"defn": "by means of the sex organs; in a manner pertaining to the sex organs", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "GEN", "label": "GEN-"}, {"gloss": "-IT-verbal", "label": "-it-"}, {"gloss": "-AL", "label": "-al"}, {"gloss": "-LY", "label": "-ly"}], "origin": {"text": "Analysis (answer key): GEN- to produce + -it- verbal suffix + -al pertaining to + -ly E adverb suffix", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "intangible": {"word": "intangible", "senses": [{"defn": "not capable of being touched", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "IN-not", "label": "in-"}, {"gloss": "TANG", "label": "TANG-"}, {"gloss": "-ABLE", "label": "-ible"}], "origin": {"text": "Analysis (answer key): in- not + TANG- to touch + -ible able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "despicable": {"word": "despicable", "senses": [{"defn": "despised; contemptible", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "DE", "label": "de-"}, {"gloss": "SPEC", "label": "SPIC-"}, {"gloss": "-ABLE", "label": "-able"}], "origin": {"text": "Analysis (answer key): de- down + SPIC- to look + -able able to be, tending to be—these two definitions are not generally strong enough for many dictionaries; more like provoking", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "assimilable": {"word": "assimilable", "senses": [{"defn": "here, figurative, capable of being absorbed into a nation and adapting to its customs and general lifestyle, said, for example, of immigrants", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "AD", "label": "as-"}, {"gloss": "SIMIL", "label": "SIMIL-"}, {"gloss": "-ABLE", "label": "-able"}], "origin": {"text": "Analysis (answer key): from assimil(ate) (ad- to + SIMIL- like) + -able able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "incontrovertible": {"word": "incontrovertible", "senses": [{"defn": "not capable of being denied, opposed, or changed", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "IN-not", "label": "in-"}, {"gloss": "CONTRA", "label": "contro-"}, {"gloss": "VERT", "label": "VERT-"}, {"gloss": "-ABLE", "label": "-ible"}], "origin": {"text": "Analysis (answer key): in- not + contro- against + VERT- to turn + -ible able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "defame": {"word": "defame", "senses": [{"defn": "to speak evil of; attack or harm the reputation of; slander; libel", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "DIS", "label": "de-", "note": "from dis-, through Latin diffamare (answer key)"}, {"gloss": "FA", "label": "FAM-"}], "origin": {"text": "Analysis (answer key): from diffamare to spread evil reports about, from dis- in different directions + FAM- to speak (rumor is better here)", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "equable": {"word": "equable", "senses": [{"defn": "unvaried; even", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "EQU", "label": "EQU-", "note": "here, even (answer key)"}, {"gloss": "-ABLE", "label": "-able"}], "origin": {"text": "Analysis (answer key): EQU- even + -able tending to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "fallacious": {"word": "fallacious", "senses": [{"defn": "deceptive or misleading; or, logically unsound or erroneous", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "FALL", "label": "FALL-"}, {"gloss": "-ACIOUS", "label": "-acious"}], "origin": {"text": "Analysis (answer key): FALL- to deceive + -acious tending to, being apt or likely to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "immutable": {"word": "immutable", "senses": [{"defn": "not tending to change; never changing", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "IN-not", "label": "im-"}, {"gloss": "MUT", "label": "MUT-"}, {"gloss": "-ABLE", "label": "-able"}], "origin": {"text": "Analysis (answer key): im- not + MUT- to change + -able tending to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "docile": {"word": "docile", "senses": [{"defn": "easy to manage or control", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "DOC", "label": "DOC-"}, {"gloss": "-ILE-able", "label": "-ile"}], "origin": {"text": "Analysis (answer key): DOC- to teach + -ile able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "81"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "tenable": {"word": "tenable", "senses": [{"defn": "capable of being defended", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "TEN", "label": "TEN-"}, {"gloss": "-ABLE", "label": "-able"}], "origin": {"text": "Analysis (answer key): TEN- to hold + -able able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "obsessed": {"word": "obsessed", "senses": [{"defn": "to keep one's attention to an unreasonable, illogical, or unhealthy extent", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XI, Assignment III, pp. 67-68"}], "parts": [{"gloss": "OB", "label": "ob-"}, {"gloss": "SED", "label": "SESS-"}, {"gloss": "-ED", "label": "-ed"}], "origin": {"text": "Analysis (answer key): from obsessum, past participle of obsidēre in the (transitive) sense of to beset, haunt, occupy, fill, from ob- by, against + SID- to sit, settle + -ed E past participial suffix", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise III", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment III", "page": "67-68", "sense": 1}]},
  "cancer": {"word": "cancer", "senses": [], "parts": [], "origin": {"text": "Original meaning: a crab, or tumor", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "eradicate": {"word": "eradicate", "senses": [], "parts": [], "origin": {"text": "Original meaning: to pull up by the roots, root out", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "flourish": {"word": "flourish", "senses": [], "parts": [], "origin": {"text": "Original meaning: (of flowers) to bloom, grow luxuriantly", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "focus": {"word": "focus", "senses": [], "parts": [], "origin": {"text": "Original meaning: a hearth, a fireplace in a house", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "gladiolus": {"word": "gladiolus", "senses": [], "parts": [], "origin": {"text": "Original meaning: from gladiolus iris, a diminutive of gladius a sword", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "gland": {"word": "gland", "senses": [], "parts": [], "origin": {"text": "Original meaning: an acorn", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "muscle": {"word": "muscle", "senses": [], "parts": [], "origin": {"text": "Original meaning: from musculus a little mouse, a diminutive of mus mouse", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "pastor": {"word": "pastor", "senses": [], "parts": [], "origin": {"text": "Original meaning: a herdsman, a shepherd", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "remorse": {"word": "remorse", "senses": [], "parts": [], "origin": {"text": "Original meaning: to bite again", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "scruple": {"word": "scruple", "senses": [], "parts": [], "origin": {"text": "Original meaning: from scrupulus a sharp stone, from scrupus a sharp stone", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "seminary": {"word": "seminary", "senses": [], "parts": [], "origin": {"text": "Original meaning: a plantation, a nursery", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XI, Exercise IV", "page": "82"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XI, Assignment IV", "page": "68-69"}]},
  "incredulous": {"word": "incredulous", "senses": [{"defn": "not willing (or not ready) to believe; skeptical; unbelieving", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "IN-not", "label": "in-"}, {"gloss": "CRED", "label": "CRED-"}, {"gloss": "-ULOUS", "label": "-ulous"}], "origin": {"text": "Analysis (answer key): in- + CRED- to believe + -ulous tending to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "decadent": {"word": "decadent", "senses": [{"defn": "falling into an inferior condition; growing worse; declining; decaying; degenerating", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "DE", "label": "de-"}, {"gloss": "CAD", "label": "CAD-"}, {"gloss": "-ANT", "label": "-ent"}], "origin": {"text": "Analysis (answer key): de- down, apart + CAD- to fall + -ent -ing", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "distracting": {"word": "distracting", "senses": [{"defn": "turning (the mind or attention) away from a course or direction", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "DIS", "label": "dis-"}, {"gloss": "TRACT", "label": "TRACT-"}, {"gloss": "-ING", "label": "-ing"}], "origin": {"text": "Analysis (answer key): dis- away + TRACT- to drag + -ing E participial suffix", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "elevate": {"word": "elevate", "senses": [{"defn": "to raise in quality", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "EX", "label": "e-"}, {"gloss": "LEV", "label": "LEV-"}, {"gloss": "-ATE", "label": "-ate"}], "origin": {"text": "Analysis (answer key): e- (ex-) + LEV- to lift + -at- verbal suffix", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "pendulous": {"word": "pendulous", "senses": [{"defn": "hanging downward", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "PEND", "label": "PEND-"}, {"gloss": "-ULOUS", "label": "-ulous"}], "origin": {"text": "Analysis (answer key): PEND- to hang + -ulous tending to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "florid": {"word": "florid", "senses": [{"defn": "excessively ornate or showy (i.e. flowery) in style", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "FLOR", "label": "FLOR-"}, {"gloss": "-ID", "label": "-id"}], "origin": {"text": "Analysis (answer key): FLOR- flower + -id tending to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "effluent": {"word": "effluent", "senses": [{"defn": "sewage, waste water from industrial plants, or other waste liquid that is discharged into a river or lake", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "EX", "label": "ef-"}, {"gloss": "FLU", "label": "FLU-"}, {"gloss": "-ANT", "label": "-ent"}], "origin": {"text": "Analysis (answer key): ef- out, from + FLU- to flow + -ent -ing", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "pernicious": {"word": "pernicious", "senses": [{"defn": "causing great damage or harm; that will destroy or ruin; injurious", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "PER", "label": "per-"}, {"gloss": "NIC", "label": "NIC-"}, {"gloss": "-OUS", "label": "-ious"}], "origin": {"text": "Analysis (answer key): per- completely, thoroughly + NIC- to harm, kill + -ious full of", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "factitious": {"word": "factitious", "senses": [{"defn": "not natural; forced", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "FAC", "label": "FACT-"}, {"gloss": "-ITIOUS", "label": "-itious"}], "origin": {"text": "Analysis (answer key): FACT- to do, make + -itious characterized by", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "feasible": {"word": "feasible", "senses": [{"defn": "capable of being done or accomplished", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "FEAS", "label": "feas-"}, {"gloss": "-ABLE", "label": "-ible"}], "origin": {"text": "Analysis (answer key): feas- (= FAC-) to do, make + -ible able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "confluent": {"word": "confluent", "senses": [{"defn": "flowing into one", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "CON", "label": "con-"}, {"gloss": "FLU", "label": "FLU-"}, {"gloss": "-ANT", "label": "-ent"}], "origin": {"text": "Analysis (answer key): con- together + FLU- to flow + -ent -ing", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "renovate": {"word": "renovate", "senses": [{"defn": "to make like new; restore to a good condition", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "RE", "label": "re-"}, {"gloss": "NOV", "label": "NOV-"}, {"gloss": "-ATE", "label": "-ate"}], "origin": {"text": "Analysis (answer key): re- again + NOV- new + -at- verbal suffix (here, to make)", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "versatile": {"word": "versatile", "senses": [{"defn": "able to do many things well", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "VERT", "label": "VERS-"}, {"gloss": "-ATE", "label": "-at-"}, {"gloss": "-ILE-able", "label": "-ile"}], "origin": {"text": "Analysis (answer key): VERS- to turn + -at- verbal suffix + -ile able to be", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "defoliated": {"word": "defoliated", "senses": [{"defn": "stripped (land, jungle, forest, etc.) of all foliage, as with chemical sprays or bombs so as to deprive the enemy of places to hide", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "DE", "label": "de-"}, {"gloss": "FOLI", "label": "FOLI-"}, {"gloss": "-ATE", "label": "-at-"}, {"gloss": "-ED", "label": "-ed"}], "origin": {"text": "Analysis (answer key): de- away + FOLI- leaf + -at- verbal suffix + -ed E past participial suffix", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "85"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "perceive": {"word": "perceive", "senses": [{"defn": "to become aware of through the mind; understand; comprehend", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "PER", "label": "per-"}, {"gloss": "CEIV", "label": "CEIV-"}], "origin": {"text": "Analysis (answer key): per- thoroughly + CEIV- to grasp", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "86"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "acrid": {"word": "acrid", "senses": [{"defn": "sharp, bitter, and stinging to the nose", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "AC", "label": "ACR-"}, {"gloss": "-ID", "label": "-id"}], "origin": {"text": "Analysis (answer key): ACR- sharp + -id tending to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "86"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "adventitious": {"word": "adventitious", "senses": [{"defn": "added as something extra; incidental; nonessential", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "AD", "label": "ad-"}, {"gloss": "VEN", "label": "VENT-"}, {"gloss": "-ITIOUS", "label": "-itious"}], "origin": {"text": "Analysis (answer key): ad- to + VENT- to come + -itious tending to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "86"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "capacious": {"word": "capacious", "senses": [{"defn": "capable of holding a great quantity", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "CAP", "label": "CAP-"}, {"gloss": "-ACIOUS", "label": "-acious"}], "origin": {"text": "Analysis (answer key): CAP- to take, seize + -acious tending to", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "86"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "efficacious": {"word": "efficacious", "senses": [{"defn": "having, showing, or producing the desired result or effect; effective as a means, measure, or remedy", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "EX", "label": "ef-"}, {"gloss": "FAC", "label": "FIC-"}, {"gloss": "-ACIOUS", "label": "-acious"}], "origin": {"text": "Analysis (answer key): ef- out + FIC- to do, make + -acious", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "86"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]},
  "precepts": {"word": "precepts", "senses": [{"defn": "a rule of action or conduct; directive; teaching; guide", "wording": "answer key", "ref": "Instructor's manual, Latin Lesson XII, Assignment III, pp. 71-72"}], "parts": [{"gloss": "PRE", "label": "pre-"}, {"gloss": "CEPT", "label": "CEPT-"}], "origin": {"text": "Analysis (answer key): pre- before + CEPT- to take", "wording": "answer key"}, "sources": [{"source": "book", "lesson": "Latin Lesson XII, Exercise III", "page": "86"}, {"source": "answer key", "lesson": "Instructor's manual, Latin Lesson XII, Assignment III", "page": "71-72", "sense": 1}]}
};
