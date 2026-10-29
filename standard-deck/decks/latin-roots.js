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

module.exports = {
  id: "latinroots",
  output: "index.html",
  title: "Latin Roots Flashcards", // deck name sent to the Sheet
  heading: "Latin Roots",
  answer: "meanings",
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
  cards: [
    { gloss: "ALIEN", cat: "base", keys: [["of another","belonging to another","another's","someone else's","another","other","foreign","foreigner","strange","stranger","alien"]] },
    { gloss: "ART", cat: "base", keys: [["art","artistry","craft","craftsmanship","handiwork"],["skill","skilled","skillful","talent","technique"]] },
    { gloss: "CED", cat: "base", keys: [["go","move","proceed"],["yield","give way","give in","surrender","concede","submit","withdraw","retreat","pull back","back away","recede"]] },
    { gloss: "CLUD", cat: "base", keys: [["shut","shut in","shut out","lock","seal","close","closed","enclose"]] },
    { gloss: "CRUC", cat: "base", keys: [["cross","crucifix"]] },
    { gloss: "CUR", cat: "base", keys: [["run","running","race","rush","dash","sprint"],["go","move","proceed"]] },
    { gloss: "DUC", cat: "base", keys: [["lead","leader","guide","conduct","bring"]] },
    { gloss: "FAC", cat: "base", keys: [["make","create","build","form","produce"],["do","act","perform","carry out"]] },
    { gloss: "FIN", cat: "base", keys: [["end","finish","final","ending"],["limit","boundary","border","edge","bound"]] },
    { gloss: "FIRM", cat: "base", keys: [STRONG,["firm","steady","stable","solid","secure","fixed"]] },
    { gloss: "FORT", cat: "base", keys: [["strong","strength","sturdy","mighty","powerful","brave","bravery","courage","courageous","bold","valiant","fearless"]] },
    { gloss: "GRAD", cat: "base", keys: [["step","stage","degree","grade","walk","march","stride"],["go","move","proceed"]] },
    { gloss: "GRAND", cat: "base", keys: [["great","grand","magnificent","large","big","huge","vast"]] },
    { gloss: "GRAV", cat: "base", keys: [["heavy","heaviness","serious","grave","burdensome"]] },
    { gloss: "GREG", cat: "base", keys: [["flock","group","crowd","gathering","gather","assembly","band"],["herd","herds","drove"]] },
    { gloss: "HAB", cat: "base", keys: [["have","own","possess","possession"],["hold","keep","contain","grasp","customary","custom","habit","usual"]] },
    { gloss: "JUDIC", cat: "base", keys: [["judge","judgment","judgement","decide","assess"]] },
    { gloss: "JUR", cat: "base", keys: [["right","just","justice","fair","rightful"],["law","legal","lawful"],["oath","take an oath","swear","vow","pledge"],["opinion","form an opinion","judge","judgment","judgement","think"]] },
    { gloss: "LEV", cat: "base", keys: [["light","lightness","light in weight","weightless"],["lift","raise","rise","elevate"]] },
    { gloss: "LINE", cat: "base", keys: [["line","row","stroke","thread","string","cord","yarn","strand"]] },
    { gloss: "LIMIN", cat: "base", keys: [["threshold","doorway","entrance","doorstep","sill"]] },
    { gloss: "LOC", cat: "base", keys: [["place","location","spot","site","position"]] },
    { gloss: "LOQU", cat: "base", keys: [["speak","speech","say","utter","talk","chat","converse","conversation"]] },
    { gloss: "LUD", cat: "base", keys: [["play","game","playful","sport"],["mock","mocking","mockery","ridicule","make fun of","tease","jest","joke"]] },
    { gloss: "NIHIL", cat: "base", keys: [["nothing","nothingness","void","zero"]] },
    { gloss: "NOMIN", cat: "base", keys: [["name","naming","title"],["noun","nouns"]] },
    { gloss: "NUL", cat: "base", keys: [["nothing","none","null","no one","not any","nil","no"]] },
    { gloss: "PART", cat: "base", keys: [["part","piece","portion","section","fraction","share","divide","division","participate"]] },
    { gloss: "PED", cat: "base", keys: [["foot","feet"]] },
    { gloss: "PEND", cat: "base", keys: [["hang","hanging","suspend","dangle"],["weigh","weighing","balance"],["pay","payment","spend","expend","compensate"]] },
    { gloss: "PLE", cat: "base", keys: [["fill","filling","fill up","supply"],["full","fullness","complete","plenty","plentiful"]] },
    { gloss: "PREC", cat: "base", keys: [["request","ask","entreat"],["beg","plead","implore","beseech"],["prayer","pray"]] },
    { gloss: "PULS", cat: "base", keys: [["drive","drive out","propel","force"],["push","shove","press","beat","beating","strike","hit","throb","pulse"]] },
    { gloss: "PUNG", cat: "base", keys: [["prick","sting","jab","pierce","puncture","perforate","stab"],["point","dot","tip","sharp"]] },
    { gloss: "SACR", cat: "base", keys: [["sacred","consecrated","divine","blessed","religious","holy","holiness","hallowed"]] },
    { gloss: "SANCT", cat: "base", keys: [["holy","holiness","hallowed","sacred","inviolable","untouchable","sacrosanct","protected"]] },
    { gloss: "SED", cat: "base", keys: [["sit","seat","seated"],["settle","settle down","sink","rest","remain"]] },
    { gloss: "SENT", cat: "base", keys: [["feel","feeling","emotion","emotional","perceive","perception","sense","notice","detect","be aware"],["think","thought","believe","opinion"]] },
    { gloss: "SPEC", cat: "base", keys: [["look","look at","watch","observe","view","see","sight","vision"]] },
    { gloss: "SPIR", cat: "base", keys: [["breathe","breath","respire","inhale","exhale"]] },
    { gloss: "TRUD", cat: "base", keys: [PUSH,["thrust","plunge"]] },
    { gloss: "TURB", cat: "base", keys: [["disturb","disturbance","upset","agitate","stir","unsettle","confuse","confusion","bewilder","mix up","disorder","crowd","throng","mob","multitude"]] },
    { gloss: "UND", cat: "base", keys: [["wave","surge","billow","ripple"]] },
    { gloss: "VEN", cat: "base", keys: [["come","coming","arrive","approach"]] },
    { gloss: "VERB", cat: "base", keys: [["word","wording"],["verb","verbs"]] },
    { gloss: "VERT", cat: "base", keys: [["turn","rotate","spin","revolve"]] },
    { gloss: "VEST", cat: "base", keys: [["clothing","clothes","clothe","garment","dress","attire","robe","vestment"]] },
    { gloss: "VI", cat: "base", keys: [["way","path","route"],["road","street","highway"]] },
    { gloss: "VID", cat: "base", keys: [SEE.concat(["view","observe"])] },
    { gloss: "VOC", cat: "base", keys: [["call","calling","summon","cry out"],["voice","vocal","sound"]] },
    { gloss: "AB", cat: "prefix", keys: [["away","away from","off"],["from"]] },
    { gloss: "AD", cat: "prefix", keys: [["to","at"],TOWARD] },
    { gloss: "AMBI", cat: "prefix", keys: [["both","two","double","two sides"],AROUND] },
    { gloss: "ANTE", cat: "prefix", keys: [["before","prior","earlier","previous","preceding"],["in front of","in front","front","ahead of","facing"]] },
    { gloss: "CIRCUM", cat: "prefix", keys: [AROUND] },
    { gloss: "CON", cat: "prefix", keys: [["with","along with"],["together","joint","jointly","united","union"],["very","completely","thoroughly","intensely","greatly","fully"]] },
    { gloss: "CONTRA", cat: "prefix", keys: [AGAINST] },
    { gloss: "DE", cat: "prefix", keys: [["down","downward","descend"],["off","away","reversal","reverse","undo","remove","removal"],["completely","complete","thoroughly","thorough","entirely","fully","wholly","totally","utterly","very"]] },
    { gloss: "DIS", cat: "prefix", keys: [["apart","separate","asunder","away","off"],["in different directions","different directions","various directions","every direction","scatter","scattered"],["not","no","non","un"]] },
    { gloss: "EX", cat: "prefix", keys: [["out","outward","exit"],["from","out of"],["completely","complete","thoroughly","thorough","entirely","fully","wholly","totally","utterly","very"]] },
    { gloss: "EXTRA", cat: "prefix", keys: [["outside","outer","external"],BEYOND] },
    { gloss: "IN-not", cat: "prefix", keys: [["not","no","non","un","without","lacking","lack"]] },
    { gloss: "IN-into", cat: "prefix", keys: [["in"],["into"],["against","opposed","opposing","opposite","versus","contrary"],["upon","on","onto"]] },
    { gloss: "INFRA", cat: "prefix", keys: [BELOW.concat(["under"]),["beneath"]] },
    { gloss: "INTER", cat: "prefix", keys: [["between","in between"],["among","amongst","amid"]] },
    { gloss: "INTRA", cat: "prefix", keys: [["within","inside","internal","inner","interior"]] },
    { gloss: "NON", cat: "prefix", keys: [NOT] },
    { gloss: "OB", cat: "prefix", keys: [["toward","towards","in the direction of"],["against","opposed","opposing","opposite","versus","contrary","in the way","blocking","block","obstruct","hinder"],["completely","complete","thoroughly","thorough","entirely","fully","wholly","totally","utterly","very"]] },
    { gloss: "PER", cat: "prefix", keys: [["through","throughout"],["wrongly","wrong","badly","falsely","astray","bad"],["completely","complete","thoroughly","thorough","entirely","fully","wholly","totally","utterly","very"]] },
    { gloss: "POST", cat: "prefix", keys: [["after","later","afterward","following"],["behind","in back of","at the back","rear"]] },
    { gloss: "PRE", cat: "prefix", keys: [["before","prior","earlier","previous","preceding"],["in front of","in front","front","ahead of","facing"]] },
    { gloss: "PRO", cat: "prefix", keys: [["forward","forth","ahead","onward"],["in front of","in front","front","ahead of","facing"],["for","in favor of","in favour of","favor","favoring","support","supporting"]] },
    { gloss: "RE", cat: "prefix", keys: [["back","return"],["again","anew","repeat","once more"]] },
    { gloss: "RETRO", cat: "prefix", keys: [["backward","backwards","back"],["behind","in back of","at the back","rear"]] },
    { gloss: "SE", cat: "prefix", keys: [["aside","to one side","apart","separate","asunder"],["away","off","without","lacking","lack"]] },
    { gloss: "SUB", cat: "prefix", keys: [["under","below","lower","underneath"],["up from under","from under","from below","from beneath","upward from below","up from below"],["secretly","secret","secretive","hidden","covertly","stealthily"]] },
    { gloss: "SUPER", cat: "prefix", keys: [["above","higher","superior","on top"],["over"]] },
    { gloss: "TRANS", cat: "prefix", keys: [["across","cross","crossing","to the other side"],["through","throughout","beyond","more than","further","past"]] },
    { gloss: "ULTRA", cat: "prefix", keys: [["beyond","more than","further","past"],["exceedingly","exceeding","excessively","excessive","too","too much","extreme","extremely","very"]] },
    // Latin Lesson X bases (Ayers book, p. 73), added Oct 12, 2026 after the
    // existing cards, because saved marks are stored by card position. Key-word
    // lists drafted by Claude (unchecked), for the instructor's review.
    { gloss: "CUMB", cat: "base", keys: [["lie down","lie","lying","lying down","recline","reclining","lay down","rest","be prone"]] },
    { gloss: "FEDER", cat: "base", keys: [["league","alliance","union","federation","confederation","confederacy","coalition","association"],["treaty","pact","compact","agreement","covenant","accord"]] },
    { gloss: "FID", cat: "base", keys: [["faith","trust","belief","believe","confidence","faithful","faithfulness","loyalty","fidelity"]] },
    { gloss: "FIDEL", cat: "base", keys: [["faithful","faithfulness","loyal","loyalty","true","devoted","fidelity","faith","trustworthy","trusty"]] },
    { gloss: "HER", cat: "base", keys: [["stick","sticking","stuck","cling","clinging","adhere","attach","cleave","glue","hold fast"]] },
    { gloss: "ORD", cat: "base", keys: [["put in order","order","orderly","in order","sequence","ordain"],["arrange","arrangement","organize","organise","sort","set up","align"]] },
    { gloss: "POT", cat: "base", keys: [["be able","able","can","capable","ability","possible"],["have power","power","powerful","potent","strength","might","mighty"]] },
    { gloss: "SAL", cat: "base", keys: [["leap","leaping","jump","jumping","spring","springing","bound","hop","vault"]] },
    { gloss: "TERR", cat: "base", keys: [["land","ground","soil","territory","terrain"],["earth","world","globe","dirt","planet"]] },
    // Latin Lesson X adjective-forming suffixes (Ayers book, p. 72), in a new
    // Suffixes tab (instructor's answer on the intake form, Oct 12, 2026).
    { gloss: "-INE", cat: "suffix", keys: [["pertaining to","pertaining","relating to","related to","concerning","about","having to do with"],["like","similar to","resembling","-like","characteristic of"],["of","belonging to"]] },
    { gloss: "-ATE-adj", cat: "suffix", keys: [["possessing","possess","having","has","have","with","full of","made","-ed"],["being","be","is","state","condition"]] },
    { gloss: "-ANT", cat: "suffix", keys: [["-ing","ing","doing","present participle","in the act of"],["person who","person","one who","someone who","agent","doer"],["that which","thing that","thing which","something that","which","what"]] },
    // Latin Lesson XI bases (Ayers book, p. 80) and adjective-forming suffixes
    // (pp. 79-80), added Oct 18, 2026 after the existing cards, because saved
    // marks are stored by card position (instructor's answer on the dashboard,
    // "III, IV and Latin Roots"). Key-word lists drafted by Claude (unchecked),
    // for the instructor's approval on the import form.
    { gloss: "CRED", cat: "base", keys: [["believe","belief","believing","credit","credence"],["trust","trusting","faith","rely","rely on","confidence"]] },
    { gloss: "DOC", cat: "base", keys: [["teach","teaching","taught","teacher","instruct","instruction","educate","education","doctrine","lesson"]] },
    { gloss: "FA", cat: "base", keys: [["speak","speaking","spoken","speech","say","saying","said","talk","tell","utter","utterance"],["reveal","revealing","revealed","disclose","make known","declare","show"]] },
    { gloss: "FALL", cat: "base", keys: [["deceive","deceiving","deceit","deception","deceptive","trick","mislead","misleading","fool","false","falsehood","lie","cheat","fail","fault"]] },
    { gloss: "MOD", cat: "base", keys: [["measure","measurement","measured","limit","boundary","manner","mode","moderate","moderation","standard"]] },
    { gloss: "MUT", cat: "base", keys: [["change","changing","changed","alter","alteration","shift","transform","mutate","mutation","exchange","switch","vary"]] },
    { gloss: "TANG", cat: "base", keys: [["touch","touching","touched","contact","feel","handle","tangible","tactile"]] },
    { gloss: "TRACT", cat: "base", keys: [["drag","dragging","dragged","draw","drawing","drawn","pull","pulling","pulled","haul","tow","attract"]] },
    { gloss: "-ABLE", cat: "suffix", keys: [["able to be","capable of being","can be","may be"],["able to","capable of","can","capable","ability"],["tending to","tend to","tendency","inclined to","given to","liable to","prone to","apt to"]] },
    { gloss: "-ILE-able", cat: "suffix", keys: [["able to be","capable of being","can be","may be"],["able to","capable of","can","capable","ability"],["tending to","tend to","tendency","inclined to","given to","liable to","prone to","apt to"]] },
    { gloss: "-ACIOUS", cat: "suffix", keys: [["tending to","tend to","tendency","apt to","likely to","prone to"],["inclined to","inclined","inclination","given to","disposed to","full of","abounding in"]] },
    // Lesson XII (Latin Lesson XII Import form, Oct 25, 2026): one card per line of
    // the Assignment (book p. 84), with the book's line of forms and its examples;
    // key words Claude's, approved on the form.
    { gloss: "AC", cat: "base", examples: "acid, acute, acetic acid", keys: [["sharp","sharpness","keen","pointed","acute","piercing"],["bitter","bitterness","sour","acid","acidic","tart","biting","harsh"]] },
    { gloss: "CAD", cat: "base", forms: "CAD-, (CID-), CAS-", examples: "cadence, accident, incident, casual, occasion", keys: [["fall","falling","fell","fallen","drop","dropping","collapse","sink"],["befall","befalls","happen","happening","occur","occurrence","chance","come about"]] },
    { gloss: "CAP", cat: "base", forms: "CAP-, (CIP-), CAPT-, (CEPT-), [CEIV-]", examples: "incapacitate, recipient, capture, except, reception, receive", keys: [["take","taking","took","taken","grasp","hold","receive","get","catch"],["seize","seizing","seized","capture","grab","grip","snatch","catch"]] },
    { gloss: "FLOR", cat: "base", examples: "florist, floral, Florida (through Spanish)", keys: [["flower","flowers","flowering","bloom","blooming","blossom","floral"]] },
    { gloss: "FLU", cat: "base", examples: "fluid, flux, effluvia, fluoroscope", keys: [["flow","flowing","flowed","stream","streaming","run","running","pour"],["a flow","flow","current","stream","flood","flux","tide"]] },
    { gloss: "FOLI", cat: "base", forms: "FOLI-, [FOIL-]", examples: "folio, defoliant, tinfoil", keys: [["leaf","leaves","leafy","foliage","sheet"]] },
    { gloss: "NOC", cat: "base", forms: "NOC-, NOX-, NIC-, NEC-", examples: "innocent, obnoxious, pernicious, internecine", keys: [["harm","harming","harmed","harmful","hurt","injure","injury","damage"],["kill","killing","killed","slay","slaughter","destroy","murder","death"]] },
    { gloss: "NOV", cat: "base", examples: "novel, novice, innovative", keys: [["new","newness","novel","fresh","recent","young","renew"]] },
    { gloss: "-ITIOUS", cat: "suffix", examples: "fictitious, expeditious", keys: [["tending to","tend to","tendency","inclined to","apt to","prone to","given to"],["characterized by","characteristic of","marked by","having","showing","full of"]] },
    { gloss: "-ID", cat: "suffix", examples: "frigid, rapid, humid", keys: [["tending to","tend to","tendency","apt to","prone to","likely to"],["inclined to","inclined","inclination","given to","disposed to"]] },
    { gloss: "-ULOUS", cat: "suffix", examples: "garrulous, tremulous", keys: [["tending to","tend to","tendency","apt to","prone to","likely to"],["inclined to","inclined","inclination","given to","disposed to","full of"]] },
    {"gloss": "CERN", "cat": "base", "forms": "CERN-, CRET-, [CERT-]", "examples": "discernment, secret, excrete, ascertain", "keys": [["separate", "separating", "set apart", "sift", "sort"], ["distinguish", "distinguishing", "discern", "discriminate", "tell apart", "decide", "determine"]]},
    {"gloss": "DUR", "cat": "base", "examples": "duration, endurable", "keys": [["hard", "harsh", "tough", "stern", "firm"], ["last", "lasting", "endure", "enduring", "continue", "remain", "persist"]]},
    {"gloss": "FUND", "cat": "base", "forms": "FUND-, FUS-, [FOUND-]", "examples": "refund, fusion, confusion, foundry", "keys": [["pour", "pouring", "poured", "spill", "flow"], ["melt", "melting", "melted", "fuse", "smelt", "cast"]]},
    {"gloss": "NASC", "cat": "base", "examples": "nascent, native, prenatal, nature, natural", "keys": [["be born", "born", "birth", "being born", "arise", "spring up", "come into being"]]},
    {"gloss": "PON", "cat": "base", "forms": "PON-, POSIT-, [POUND-], [POSE-]", "examples": "component, deposit, position, compound, compose, oppose", "note": "[POSE-], though historically from a different verb, was confused in meaning with PON- so long ago that the book takes it here (p. 88).", "keys": [["place", "placed", "placing", "position", "set"], ["put", "putting", "lay", "set down"]]},
    {"gloss": "TORT", "cat": "base", "examples": "torture, distort", "keys": [["twist", "twisting", "twisted", "wind", "wring", "wrench", "bend"]]},
    {"gloss": "-IVE", "cat": "suffix", "examples": "active, attractive, effective", "keys": [["tending to", "tend to", "tendency", "apt to", "prone to", "likely to"], ["inclined to", "inclined", "inclination", "given to", "disposed to"]]},
    {"gloss": "-UOUS", "cat": "suffix", "examples": "continuous, conspicuous", "keys": [["tending to", "tend to", "tendency", "apt to", "prone to", "likely to"], ["inclined to", "inclined", "inclination", "given to", "disposed to"]]},
    {"gloss": "-ORY", "cat": "suffix", "examples": "introductory, compulsory, contradictory", "keys": [["tending to", "tend to", "tendency", "apt to", "prone to", "likely to"], ["serving for", "serving as", "serving to", "serves for", "serves as", "used for", "useful for"]]}
  ]
};
