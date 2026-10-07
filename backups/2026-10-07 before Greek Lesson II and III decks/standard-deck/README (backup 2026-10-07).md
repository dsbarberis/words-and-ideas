# Standard deck

Every deck rebuilt to the standard design (Latin Roots look, Learn and Quiz modes,
Google Sheet reporting, teacher dashboard and presenter mode) is generated from
one template, so the decks stay identical apart from their content.

- `template.html`: the shared page (look, Learn and Quiz modes, answer judging, reporting).
- `decks/*.js`: one file per deck with its cards and the approved quiz key-word lists.
- `glossary.js`: every base, prefix and suffix used in the decks, once, with its forms
  and its full set of meanings. Decks point to entries (`gloss: "PED"`) instead of
  repeating the meanings, so all decks agree. Change a meaning here and rebuild.
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

Before changing any file, keep a renamed copy of it in `backups/` (see `backups/README.md`).

## Two deck types

- **Flashcard Deck** (Greek Mythology, Greek History, Latin Roots): Learn and
  Quiz modes, for content to be memorized.
  - Latin Roots (`decks/latin-roots.js`, built as `index.html`) is a meanings deck
    (`answer: "meanings"`): each card is a glossary entry, with its forms on the front
    and its meanings (one per line) and examples on the back. In the quiz the student
    types the meanings one per line ("+ Add another meaning", or Enter), and every
    meaning is required. `keys` holds one key-word list per meaning, in the glossary's
    order. A line that matches only another card's wording makes the answer wrong;
    a line that matches nothing is ignored. `quizBySet: true` makes the quiz cover
    the selected tab (All, Bases, Prefixes or Still Learning), with Sheet rows such as
    "quiz round 1 (Bases)". The old page's Know it / Still learning marks carry over
    once (`legacy.knownPrefix` / `learningPrefix`).
- **Exercise Deck** (`type: "exercise"`; Lesson IX, Exercise III, Greek Introduction): Quiz mode only. The name
  screen opens the quiz. Tabs: All, one per exercise (`categories`), and Missed; the
  quiz covers the selected tab, and each tab's unfinished quiz resumes separately.
  `round1: "book"` keeps Round 1 in the workbook's order (later rounds are shuffled).
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
  A `boxes` card (Greek Introduction) has one box per part of the answer
  (`boxes: [{ label, check }]`; Enter moves to the next box). A box with
  `check: "greek"` accepts any of `greekForms` (ignoring accents, and treating k/c,
  kh/ch and y/u alike, with one slip allowed in longer words); `check: "deriv"`
  accepts any of `derivs`; any other box is judged with the card's `senses`. The card
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
`star` terms (which cover all of its groups), and it contains no term that belongs
only to other cards in the deck.

- A word that fits two cards goes on both: a term that also belongs to the card being
  answered never counts against the answer, so lists may overlap.
- `accepted`: terms that fit the card's meaning without being required. They never
  count toward a correct answer and never count against it.
- `everyday`: common words (long, show, thinks) that still count for their own card
  but never count against an answer to another card. A group marked `generic: true`
  behaves the same way for all its terms.

When drafting a deck's lists, put every appropriate word on each card it fits, mark
common words as everyday, and test a set of natural answers for each card before building.
