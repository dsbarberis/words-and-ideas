# Standard deck

Every deck rebuilt to the standard design (Latin Roots look, Learn and Quiz modes,
Google Sheet reporting, teacher dashboard and presenter mode) is generated from
one template, so the decks stay identical apart from their content.

- `template.html`: the shared page (look, Learn and Quiz modes, answer judging, reporting).
- `decks/*.js`: one file per deck with its cards and the approved quiz key-word lists.
- `build.js`: writes each deck's HTML file to the repository root.

To change a deck's words or key-word lists, edit its file in `decks/`. To change
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
  change slides the old card off and the new one in (instant with "reduce motion").
  A move asked for while a card is still sliding is queued, so each swipe or tap moves
  exactly one card.
- Touchscreens (phones and tablets): swipe left for the next card and right for the
  previous one; there are no Prev/Next buttons. The card follows the finger, a short
  fast flick counts, and the card carries the flick's speed as it leaves. Double-tap zoom is off (pinch zoom
  still works). In a quiz, a swipe left moves on only after the answer is checked.
- Phones (screens up to 600px wide): compact header, a card sized so the page fits the
  screen without scrolling, and
  "Still learning"/"Know it" (Learn) or Next (Quiz) pinned to the bottom of the screen.
- Desktop: Prev/Next buttons, arrow keys, and a two-finger trackpad (or sideways
  mouse) swipe; a new swipe counts even while the last one's coasting signals are
  still arriving. The browser's own back/forward swipe is switched off on the page.
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
