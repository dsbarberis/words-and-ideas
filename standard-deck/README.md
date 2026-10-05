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
