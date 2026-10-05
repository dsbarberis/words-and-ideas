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
`star` terms (which cover all of its groups). A group marked `generic: true` never
triggers the penalty for mixing in another word's meaning. Within a deck, the
non-generic lists should not overlap.
