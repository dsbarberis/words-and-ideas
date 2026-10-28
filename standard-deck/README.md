# Standard deck

Every deck rebuilt to the standard design (Latin Roots look, Learn and Quiz modes,
Google Sheet reporting, teacher dashboard and presenter mode) is generated from
one template, so the decks stay identical apart from their content.

- `template.html`: the shared page (look, Learn and Quiz modes, answer judging, reporting).
- `decks/*.js`: one file per deck with its cards and the approved quiz key-word lists.
- `glossary.js`: every base, prefix and suffix used in the decks, once, with its forms
  and its full set of meanings. Decks point to entries (`gloss: "PED"`) instead of
  repeating the meanings, so all decks agree. Change a meaning here and rebuild.
  Since Oct 22, 2026 it also holds every Latin prefix, suffix and base in the book's
  lists (Ayers, pp. 149-155): one entry per printed line, with `lesson` ("Latin XII")
  and `lessonNo` (12) for the lesson the book gives, `book` (the printed lines, stored on
  entries that existed before), and `latin` (the Latin word it comes from; `family`
  links every form of one word). The import's records are in the Project files,
  proposals/latin-elements-full-list/.
- `vocabulary.js`: every whole word the decks teach, once each (approved Oct 7, 2026):
  its numbered senses (definition, wording source, quiz key-word lists), its parts
  (glossary keys), its origin note or etymology, and every place the course introduces
  it. A Flashcard Deck card is just `{ word: "nemesis" }`; an Exercise Deck card names
  its word with `vocab` and keeps what belongs to the exercise. A card may name one
  sense (`sense: 2`); anything a card sets itself overrides the list.
- **Wording sources:** every definition, origin note, etymology and glossary meaning
  records where its wording comes from (`wording`: book, workbook, answer key,
  instructor, dictionary, or "Claude, unchecked"; `ref` says where).
- `build.js`: writes each deck's HTML file to the repository root, and
  `build-report.md`: words two decks use with different senses, cards that override
  the shared definition, possible duplicates or homographs, every wording still
  marked "Claude, unchecked" (by deck), and which decks use each word.
- `card-keys.json`: every deck's card keys as they stood on Oct 28, 2026, when the
  records kept on students' devices moved from card positions to card keys (release A
  of the Latin Roots Lesson Filter). A card's key is its `id` if it has one, else its
  glossary key, vocabulary key, word or label. Those cards must stay first and in that
  order, because older records and the Sheet's `i` name a card by its position:
  **add new cards at the end.** If a key has to change (a label corrected), give the
  card `id` with its old key. `build.js` refuses a deck that breaks this. Never edit
  the file except to add a new deck's keys.
- `tests/run.js`: the deck tests, run before every publish
  (`NODE_PATH=$(npm root -g) node standard-deck/tests/run.js`; see `tests/README.md`).

Before changing any file, keep a renamed copy of it in `backups/` (see `backups/README.md`).

## Two deck types

- **Flashcard Deck** (Greek Mythology, Greek History, Latin Roots): Learn and
  Quiz modes, for content to be memorized.
  - Latin Roots (`decks/latin-roots.js`, built as `index.html`) is a meanings deck
    (`answer: "meanings"`): each card is a glossary entry, with its forms on the front
    and its meanings and examples on the back. In the quiz the student
    types the meanings one per line ("+ Add another meaning", or Enter), and every
    distinct meaning is required. `keys` holds one key-word list per printed meaning, in
    the glossary's order. **Meaning Clouds** (instructor, Oct 23, 2026): a glossary
    entry's `groups` sorts its meanings into distinct meanings, each a list of
    synonyms of which any one counts (`[["art","skill"]]` is one meaning; JUR- has
    three). The build joins the key-word lists of each group, so one line answers a
    group. The back shows a count ("3 meanings", "2 of 3 meanings" after a check) and
    one pill per distinct meaning, its synonyms joined by a small "or"; Exercise backs
    show the same pills, smaller, beside each element. An entry without `groups` has
    one meaning per group.
    A Latin Roots card may set `forms` and `examples` to show the book's whole line where the
    glossary splits a family into one entry per form ("CAD-, (CID-), CAS-"; Lesson XII Import
    form, Oct 25, 2026); the meanings and key words still come from the entry it names.
- **Answer effort in every quiz** (Exercise Decks since Oct 21, 2026; Latin Roots,
  Greek History and Greek Mythology since the instructor's "Every quiz", Oct 23,
  2026): a real attempt before Check, the back hidden and off the page until the
  answer is right, a missed card back only after 3 others (with review cards already
  right, which never count, or a 2-minute pause). On Latin Roots each filled line needs
  a word of its own (not only little words, not only the root's own forms unless that
  is a meaning) and copies no five words of a note; the number of lines is not
  checked, since the count shows on the back only. Greek History and Greek Mythology
  use the rule of an Exercise meaning box. Teacher mode skips the gate. A deck can
  opt out with `answerEffort: false`. A line that matches only another card's wording makes the answer wrong;
    a line that matches nothing is ignored. The quiz always covers every card (the
    instructor dropped quizzing by tab on Oct 12, 2026; `quizBySet: true` would make a
    deck's quiz cover the selected tab, with Sheet rows such as "quiz round 1 (Bases)").
    `shufflePasses: true` starts every Learn pass in a new random order: on opening the
    deck, after each finished pass, and on changing tab. The old page's Know it / Still learning marks carry over
    once (`legacy.knownPrefix` / `learningPrefix`).
- **Learn passes in the Sheet** (Flashcard Decks; approved Oct 12, 2026). Learn and Quiz
  share one Know it / Still learning record per student, and the deck notes where each
  mark came from (a Learn tap or a quiz answer) and the day. A pass covers the Learn tab
  the student is on (All, a category such as Bases, or Still Learning): it is sent once
  every card that was on the tab when it began has been seen and the student moves on
  (or switches tab or mode with every card seen). Pass Mode is "learn" for All and names
  the tab otherwise ("learn (Still Learning)", "learn (Bases)"). Results JSON lists each
  marked card on the tab: `{"i":4,"r":true,"src":"learn","d":"2026-10-14","p":1}`, where
  `src` is learn, quiz or earlier (marked before Oct 12, 2026), `d` the day it was set,
  and `p:1` a card tapped in this pass.
  A pass left unfinished (the student switches tab or mode, or comes back after more than
  an hour) is sent once, when that happens, as "learn (unfinished)" or "learn (Still
  Learning, unfinished)". Its Pass Score is cards seen / cards on the tab, and its Results
  JSON is `{"tab","start","last","seen","of"}`; its marks are not sent. A pass of one card
  is not sent.
- **Exercise Deck** (`type: "exercise"`; Lesson IX, Exercise III, Greek Introduction, Greek Lesson II Exercise, Greek Lesson III Exercise, Lesson X Workbook, Lesson X Exercise III, Lesson X Exercise IV): Quiz mode only. The name
  screen opens the quiz. Tabs: All, one per exercise (`categories`), and Missed; the
  quiz covers the selected tab, and each tab's unfinished quiz resumes separately.
  `round1: "book"` keeps Round 1 in the workbook's order (later rounds are shuffled);
  `orderNote: false` leaves "in the workbook's order" off the start screen.
  Each card is a `choice` question (tap one option; `answer` is its index; an
  exercise's shared `options` can sit on its category) or a `typed` one (`accept`
  lists the answers that count, compared without case, accents, hyphens or brackets;
  a card with `gloss` accepts any form of that glossary entry). Sheet rows use pass
  mode "quiz round N", with the tab added for a single exercise ("quiz round 1 (Ex 3)").
  A `meaning` card (Exercise III) shows a `sentence` (the word to define in a
  `span.target`) and is judged with key-word `senses`, as in the Greek decks; its
  `parts` name glossary entries (`{ gloss, label, note? }`), and the back shows each
  part as printed with the glossary's full set of meanings. A deck with no exercise
  tabs can set `allTitle` and a deck-wide `instruction`.
  `analysis: true` (both Exercise III decks; instructor, Oct 12, 2026) gives each meaning card an
  Analysis box above the meaning: the student types the word's elements in order ("dif- fid -ent";
  spacing, hyphens, "+" and the book's brackets do not matter, and an English ending such as -ed may
  be added). Each element counts in the form printed on the card or any form of its glossary entry
  (the build lists them as `accept`); the card is right when both boxes are.
  Since Oct 14, 2026 (after students' answers in the class Sheet were reviewed): other words in the box
  are skipped, so meanings copied from the back do no harm; a connecting -i- may be left out, typed on
  its own or joined to the element before it; two elements may be typed as one piece ("potent"); a form
  of any element typed after the last one counts as an extra element. The box is labelled "Analysis
  (forms only)" with the example "e.g. pre- DIC- -tion", and the back shows a forms-only line
  ("dif- + FID- + -ent") above the elements and their meanings. The card is not checked until the box
  holds a piece for every element, one of them taken from the word (the student is not told how many).
  A deck whose boxes show "e.g." explains it on the entry card, and a pop-up repeats the explanation if
  a student types "e.g." in an answer. Answers saved in the round under way are marked again with the
  current rules when the deck opens.
  **Element boxes** (`elementBoxes: true` with `analysis: true`; instructor, Oct 20 and Oct 24, 2026;
  first for Lesson XII Exercise III; Lessons IX, X and XI added at the instructor's word, Oct 25, 2026,
  without re-judging past answers: answers saved in an earlier set of boxes keep their mark): instead of the
  Analysis box, three boxes, Prefixes, Bases and Suffixes, each asking for every element of that kind
  with its meaning, then Meaning in context. The glossary entry's `kind` (prefix, base, suffix) picks
  the box. In a box, every element of that kind must be there in a form the card accepts (any order),
  and for each one a meaning: any glossary meaning, a plain wording the glossary entry allows
  (`plainMeanings`, for grammatical suffixes such as -ED), or the answer key's wording on that card
  (`keyMeanings: { "FA": "to say, tell" }`, by glossary key). Wordings with commas give each meaning
  separately. A meaning counts when each of its content words is there in any ending; little words and
  the words "suffix" and "prefix" need not be typed. A box whose kind the word lacks is right when
  empty or "none". The card is right only when every box is, and the back marks each box. Before
  Check, the Bases box must share letters with the word. Plain and key wordings are accepted but not
  shown; the back shows the glossary's pills.
  A `boxes` card (Greek Introduction) has one box per part of the answer
  (`boxes: [{ label, check }]`; Enter moves to the next box). A box with
  `check: "greek"` accepts any of `greekForms` (ignoring accents, and treating k/c,
  kh/ch and y/u alike, with one slip allowed in longer words); `check: "names"` passes when the answer contains one of the card's `names` as whole words
  (for Greek Lesson II Exercise, from the word's `origin.names`, with the back showing each box's answer from
  the vocabulary list); `check: "deriv"`
  accepts any of `derivs`, or several of them typed together (Oct 14), and the card is not checked until it holds
  letters found in the word; a box with its own `senses` (Lesson X Exercise IV's Connection box, Oct 12, 2026) is
  judged against those, may allow up to `maxWords` words, and with `noPenalty: true` is not checked against
  other cards' terms (since Oct 14 such a box is right when it matches any one of its groups in two words
  or more, "to", "a", "an" and "the" not counted); any other box is judged with the card's `senses`. The card
  is right when every box is. An `order` card is answered by tapping its `steps`
  (`[language, form, meaning]`) in order, from Greek to English. A category's
  `example` appears on that exercise's start screen, and `help` replaces the
  desktop footer hint.

To change a word's definition, origin or key-word lists, edit its entry in `vocabulary.js`; to change which words a deck has, or its exercises, edit its file in `decks/`. To change
how every deck looks or behaves, edit `template.html`. Then rebuild from the
repository root:

```
node standard-deck/build.js
```

Do not edit the generated deck files (for example `Greek Mythology Flashcards.html`) by hand.

Each deck file sets `heading` (the title shown on the page and in the browser tab,
such as "Greek Mythology Words") and `title` (the deck name sent to the Google Sheet,
such as "Greek Mythology Words Flashcards"; keep it unchanged so Sheet rows stay together).

## Phones, tablets and desktop

- All devices: the name screen always opens Learn; an unfinished quiz resumes where it
  stopped when the Quiz tab is tapped. A hint shows on the first card only. Each card
  change moves the cards as a filmstrip: the next card travels in beside the current
  one with a fixed 16px gap (instant with "reduce motion"). One move asked for while
  the strip is moving waits its turn; any more are ignored.
- Touchscreens (phones and tablets): swipe left for the next card and right for the
  previous one; there are no Prev/Next buttons. The card follows the finger, a short
  fast flick counts, and the card carries the flick's speed as it leaves. Double-tap zoom is off (pinch zoom
  still works). In a quiz, a swipe left moves on only after the answer is checked.
- Phones (screens up to 600px wide): compact header, a card sized so the page fits the
  screen without scrolling, and
  "Still learning"/"Know it" (Learn) or Next (Quiz) pinned to the bottom of the screen.
- Desktop: Prev/Next buttons, arrow keys, and a two-finger trackpad (or sideways
  mouse) swipe. A new swipe counts if it comes at least 350ms after the last one and
  its speed climbs well above the last swipe's fading "coasting" signals. The browser's own back/forward swipe is switched off on the page.
- Text inputs use 16px type so iPhone Safari does not zoom in on them.

## Key-word lists

Each card has one or more `senses` (alternative meanings). An answer is correct when,
for at least one sense, it contains a term from every group, or one of that sense's
`star` terms (which cover all of its groups). An answer that matches its own card is
never refused for also containing another card's term (instructor, Oct 28, 2026). An
answer that matches nothing of its own is checked against the other cards: a term that
belongs only to another card names the card it seems mixed up with ("That answer mixes
in the meaning of ...").

- A word that fits two cards goes on both: a term that also belongs to the card being
  answered never counts against the answer, so lists may overlap.
- `accepted`: terms that fit the card's meaning without being required. They never
  count toward a correct answer and never count against it.
- `everyday`: common words (long, show, thinks) that still count for their own card
  but never count against an answer to another card. A group marked `generic: true`
  behaves the same way for all its terms.

When drafting a deck's lists, put every appropriate word on each card it fits, mark
common words as everyday, and test a set of natural answers for each card before building.
