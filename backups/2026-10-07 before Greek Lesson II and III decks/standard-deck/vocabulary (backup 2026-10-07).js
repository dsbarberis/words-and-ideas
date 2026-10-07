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
    origin: {"text":"From the Amazons, a legendary tribe of female warriors in Greek mythology.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "Procrustean": {
    word: "Procrustean",
    senses: [
      {"defn":"Effecting conformity by violent or ruthless means.","wording":"Claude, unchecked","printed":{"text":"effecting conformity by violent means","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["conformity","conform","uniform","standard","fit","same","one-size-fits-all"]},{"terms":["violent","ruthless","force","forced","brutal","harsh","cruel"]}]}],"accepted":["punish","punishment"],"everyday":["same","fit"]}
    ],
    parts: [],
    origin: {"text":"From Procrustes, a mythical bandit who forced travelers to fit his iron bed exactly, stretching or cutting them to size.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "Chimerical": {
    word: "Chimerical",
    senses: [
      {"defn":"Extremely fanciful; wildly imaginary.","wording":"Claude, unchecked","printed":{"text":"extremely fanciful","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["fanciful","imaginary","fantastic","fantasy","illusory","unreal","unrealistic","dreamlike","made-up"]}]}]}
    ],
    parts: [],
    origin: {"text":"From the Chimera, a fire-breathing hybrid monster — part lion, part goat, part serpent.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "nemesis": {
    word: "nemesis",
    senses: [
      {"defn":"Retribution; an unbeatable opponent.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["retribution","vengeance","revenge","punishment","payback"]}]},{"groups":[{"terms":["opponent","rival","enemy","foe","adversary"]},{"terms":["unbeatable","invincible","unconquerable","undefeatable","ultimate","greatest","powerful","mighty","formidable"]}],"star":["archenemy","archrival"]}],"accepted":["fierce","strong","tough"]}
    ],
    parts: [],
    origin: {"text":"From Nemesis, the Greek goddess of retribution and righteous vengeance.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "stygian": {
    word: "stygian",
    senses: [
      {"defn":"Gloomy; infernally dark.","wording":"Claude, unchecked","printed":{"text":"gloomy","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["gloomy","dismal","bleak","somber","murky"]}]},{"groups":[{"terms":["dark","black","pitch-black","shadowy"]},{"terms":["infernal","hellish","hell","underworld"]}]}]}
    ],
    parts: [],
    origin: {"text":"From the River Styx, the gloomy river separating the living world from the underworld.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "halcyon": {
    word: "halcyon",
    senses: [
      {"defn":"Calm; peaceful.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["calm","peaceful","tranquil","serene","idyllic","quiet","untroubled","carefree"]}]}]}
    ],
    parts: [],
    origin: {"text":"From the mythical halcyon bird (identified with the kingfisher), said to calm the winds and sea while nesting.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "mentor": {
    word: "mentor",
    senses: [
      {"defn":"A wise counselor.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["counselor","adviser","advisor","guide","teacher","tutor","coach"]},{"terms":["wise","wisdom","experienced","trusted","knowledgeable"]}],"star":["guru","sage"]}],"accepted":["support","protect"]}
    ],
    parts: [],
    origin: {"text":"From Mentor, the wise friend entrusted to guide Telemachus in Homer's Odyssey.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "labyrinth": {
    word: "labyrinth",
    senses: [
      {"defn":"A maze.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["maze","warren","tangle","intricate network","complicated passages"]}]}],"accepted":["wander","wandering","dark"]}
    ],
    parts: [],
    origin: {"text":"From the maze built by Daedalus on Crete to house the Minotaur.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "tantalize": {
    word: "tantalize",
    senses: [
      {"defn":"To tease by offering something desirable while keeping it out of reach.","wording":"Claude, unchecked","printed":{"text":"to tease","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["tease","tempt","taunt","torment","dangle","offer","show"]},{"terms":["out of reach","unreachable","unattainable","withhold","keep away","deny","can't have"]}]}],"accepted":["cruel","punishment","desire","want","long for"],"everyday":["offer","show"]}
    ],
    parts: [],
    origin: {"text":"From Tantalus, condemned in the underworld to stand in water beneath fruit, neither of which he could ever reach.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "odyssey": {
    word: "odyssey",
    senses: [
      {"defn":"A long wandering journey.","wording":"Claude, unchecked","printed":{"text":"a long wandering","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["journey","voyage","travel","trip","trek","quest","adventure","expedition"]},{"terms":["long","lengthy","wandering","epic","extended","years"]}]}],"everyday":["long","years"]}
    ],
    parts: [],
    origin: {"text":"From Homer's Odyssey, the epic recounting Odysseus's ten-year journey home from Troy.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "aegis": {
    word: "aegis",
    senses: [
      {"defn":"Protection; sponsorship.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["protection","protect","shield","defense","guardianship","sponsorship","sponsor","patronage","auspices","backing","support"]}]}],"accepted":["powerful","mighty","strong"],"everyday":["support"]}
    ],
    parts: [],
    origin: {"text":"From the aegis, the shield (or goatskin cloak) of Zeus, later associated with Athena — \"under the aegis of\" means under someone's protection.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "Achilles' heel": {
    word: "Achilles' heel",
    senses: [
      {"defn":"A point of vulnerability.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["weakness","weak","vulnerability","vulnerable","flaw","soft spot"]}]}],"accepted":["invincible","unbeatable","strong","powerful","mighty"]}
    ],
    parts: [],
    origin: {"text":"From Achilles, the Greek hero whose only vulnerable spot was the heel his mother held when she dipped him in the River Styx.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "laconic": {
    word: "laconic",
    senses: [
      {"defn":"Concise; using few words.","wording":"Claude, unchecked","printed":{"text":"concise","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["concise","terse","brief","succinct","pithy","curt","few words","short"]}]}],"accepted":["speech","spoken","words"],"everyday":["short"]}
    ],
    parts: [],
    origin: {"text":"From Laconia, the region around Sparta, whose people were famous for terse, blunt speech.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "sword of Damocles": {
    word: "sword of Damocles",
    senses: [
      {"defn":"A permanently threatening danger.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["danger","threat","threatening","peril","doom","disaster","hazard"]},{"terms":["constant","permanent","always","ever-present","persistent","looming","impending","imminent","hanging over"]}]}],"accepted":["attack"]}
    ],
    parts: [],
    origin: {"text":"From the courtier Damocles, seated beneath a sword hung by a single hair, to illustrate how precarious a ruler's power really is.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "philippic": {
    word: "philippic",
    senses: [
      {"defn":"A stinging verbal condemnation.","wording":"Claude, unchecked","printed":{"text":"stinging condemnation","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["condemnation","condemn","denunciation","denounce","attack","criticism","scolding","rebuke"]},{"terms":["verbal","speech","spoken","words","oration","lecture"]}],"star":["tirade","diatribe","harangue","rant","invective"]}],"accepted":["harsh","severe","bitter","scathing"]}
    ],
    parts: [],
    origin: {"text":"From the fiery orations the Athenian statesman Demosthenes delivered against Philip II of Macedon.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "Draconian": {
    word: "Draconian",
    senses: [
      {"defn":"Extremely harsh.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["harsh","severe","strict","cruel","oppressive","punitive","brutal","merciless"]}]}]}
    ],
    parts: [],
    origin: {"text":"From Draco, the Athenian lawgiver whose legal code prescribed severe punishments even for minor offenses.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "solecism": {
    word: "solecism",
    senses: [
      {"defn":"A grammatical or social error.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["error","mistake","blunder","slip","impropriety"]},{"terms":["grammatical","grammar","language","usage","speech","social","etiquette","manners","words","word"]}],"star":["faux pas","gaffe"]}]}
    ],
    parts: [],
    origin: {"text":"From Soloi, a Greek colony whose residents were mocked by Athenians for speaking Greek incorrectly.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "epicure": {
    word: "epicure",
    senses: [
      {"defn":"A person of discriminating taste, especially in food and wine.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["discerning","discriminating","refined","fine","connoisseur","picky","particular"]},{"generic":true,"terms":["taste","palate","food","wine","cuisine","dining","eating","drink"]}],"star":["gourmet","foodie","gastronome","connoisseur","good taste"]}],"accepted":["loves","enjoys","seeks","pleasure","luxury","indulges"]}
    ],
    parts: [],
    origin: {"text":"From Epicurus, the philosopher whose name became (somewhat unfairly) linked to refined pleasure-seeking.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "cynic": {
    word: "cynic",
    senses: [
      {"defn":"A person who believes all human actions are prompted by self-interest.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["believes","thinks","assumes","suspects","distrusts","doubts","expects","sees"]},{"terms":["self-interest","selfish","self-serving","self-centered","ulterior","motives"]}]}],"everyday":["believes","thinks","assumes","expects","sees"]}
    ],
    parts: [],
    origin: {"text":"From the ancient Cynic philosophers, who scorned social convention — the modern sense has drifted toward general distrust of others' motives.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "sybarite": {
    word: "sybarite",
    senses: [
      {"defn":"A person devoted to luxury and pleasure.","wording":"Claude, unchecked","printed":{"text":"person devoted to luxury","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"terms":["devoted","loves","lives for","seeks","pursues","obsessed","indulges"]},{"terms":["luxury","luxurious","pleasure","comfort","decadence"]}],"star":["hedonist","pleasure-seeker","self-indulgent"]}],"accepted":["selfish","self-centered"],"everyday":["loves","seeks","lives for"]}
    ],
    parts: [],
    origin: {"text":"From Sybaris, an ancient Greek city in Italy proverbial for the soft living of its citizens.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "ostracism": {
    word: "ostracism",
    senses: [
      {"defn":"Exclusion from society.","wording":"workbook","ref":"Lessons I & II worksheet, p. 167","note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key.","keys":[{"groups":[{"terms":["exclusion","excluded","rejection","shunning","shunned","isolation"]},{"generic":true,"terms":["society","social","socially","community","group","others","people","everyone"]}],"star":["banishment","banished","exile","outcast","cast out"]}]}
    ],
    parts: [],
    origin: {"text":"From ostrakon, the pottery shard Athenians inscribed with a name when voting to banish a citizen for ten years.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
  },
  "Pyrrhic": {
    word: "Pyrrhic",
    senses: [
      {"defn":"Pertaining to a victory won at such great cost it is nearly as bad as a defeat.","wording":"Claude, unchecked","printed":{"text":"pertaining to a victory won at great cost","wording":"workbook","ref":"Lessons I & II worksheet, p. 167"},"note":"The worksheet's option, matched to the word by Claude; the worksheet had no answer key. The definition expands the worksheet's wording.","keys":[{"groups":[{"generic":true,"terms":["victory","win","won","success","triumph"]},{"terms":["cost","costly","losses","sacrifice","expensive","damage","price","not worth it"]}]}],"accepted":["disaster","ruin","ruinous"]}
    ],
    parts: [],
    origin: {"text":"From King Pyrrhus of Epirus, whose costly victory over Rome prompted the remark that another such victory would ruin him.","wording":"Claude, unchecked"},
    sources: [{"source":"workbook","lesson":"Lessons I & II worksheet","page":"167","sense":1}]
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
    parts: [],
    origin: {"text":"Etymological meaning: blazing","wording":"workbook"},
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 2","page":"51-56","sense":1}]
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
    parts: [],
    sources: [{"source":"workbook","lesson":"Lesson IX, Exercise 5","page":"51-56","sense":1}]
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
  }
};
