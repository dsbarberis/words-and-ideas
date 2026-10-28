# Deck tests

One command runs every test on the built decks. Run it before every publish, after
`node standard-deck/build.js`:

    NODE_PATH=$(npm root -g) node standard-deck/tests/run.js

It needs Node and Playwright (both installed in Claude's cloud sessions). GitHub also
runs it on every pull request to main (.github/workflows/deck-tests.yml), and branch
protection holds the merge until it passes. It changes
no file in the repository and sends nothing to the class Sheet: it builds into a
temporary folder, and the test copies of the decks have their Sheet sending cut off
and every web request blocked. It ends with "all tests passed" (exit code 0) or lists
each failure (exit code 1). Do not publish until it passes.

| Test | What it checks | Why |
|---|---|---|
| build matches | The deck files in the repository are exactly what `build.js` makes from the deck sources, and `build-report.md` is current | A deck edited by hand, or changed without meaning to, shows up before students see it |
| deck versions | Every built deck carries a `DECK_VERSION` of 12 hex digits and its own file name (`DECK_PAGE`), both matching `deck-versions.json`, and the file lists no page that is not a built deck; "build matches" also checks `deck-versions.json` is what a fresh build writes | The reload prompt (Old Deck Pages plan, Oct 28, 2026): a page whose version does not match the file would offer a reload that never ends, or never offer one |
| no working notes on cards | No wording-source mark ("Claude, unchecked", "checked by Claude", "Claude's condensation", "no answer key was supplied") or page note reaches a deck's card data | Import procedure, Stage 5: no working notes on cards (Oct 5, "sybarite (from p. 176 reading)") |
| card keys frozen | Every deck's first cards keep the keys and order listed in `card-keys.json`, and every card's key is present and used once | Records on students' devices and the Sheet's "i" name cards by position; a card moved or renamed would carry another card's progress (release A, Oct 28, 2026) |
| decks load | Every deck opens without a script error | One template serves every deck, so a template change can break decks no one opened |
| model answers | Every Exercise Deck card accepts its own answer, typed as the back prints it | The Oct 12 mistake: a key-word change made impend and magnate reject their own answers, and students typing what the back showed were marked wrong for about 41 hours. Run on the Oct 14 backup of Lesson X Exercise IV, this test flags both cards |
| answer effort | Every printed answer passes the good-faith gate, the copy prompt and the judging; every printed note of five words or more typed into a box is caught; a derivative typed with its note asks for just the derivative; lists of two accepted answers joined by "or", "and", a comma or a slash pass, and a list with one wrong item fails; a missed question comes back after at least 3 others, review questions are ones already right and never count, and a round with nothing to review opens after a pause; in element boxes (Prefixes, Bases, Suffixes), the forms without their meanings, or a box missing one of its elements, are wrong (instructor, Oct 24, 2026) | Answer Effort form (Oct 21, 2026): students copying the printed key, and right answers refused for extra words |
| answer effort in the deck | The same lists typed into the boxes and checked with the deck's own Check button; a missed question keeps its back hidden and off the page, and its front shows the marks, the "comes back later" line and the study line | The rules must hold where students meet them, not only in the judging code |
| records kept by element | In Latin Roots and Lesson X Exercise III: records written by position under the old names (Know It and Still Learning, where marks came from, spacing, a Learn pass under way, a quiz in round 2 with review and next-round plans) are read intact and written by key under the new names; the old records are left untouched; a second load changes nothing; a record by key reaches its card and an unknown key is dropped; an old position at or past the frozen cards is dropped (a real check once cards are added after them); an old record written later by a tab still open on the earlier deck is taken as newer; storage failing partway leaves the move to run again; Latin Roots sends "e" beside "i" to the Sheet, other decks do not | Release A of the Latin Roots Lesson Filter plan (Oct 28, 2026): adding cards by lesson must never move a student's progress to another card |
| Flashcard quizzes | Latin Roots: each meaning group answers with any one synonym, a card is right only with every group, every printed meaning and key word passes the gate, and little words or the root's own forms are refused unless they are a meaning. Greek History and Greek Mythology: the printed definition passes the gate, little words and the headword typed back do not; an answer matching its own card plus another card's term (one that alone is refused as a mix-up) is right, and a deck where no card could be checked fails (other-card rule, Oct 28, 2026). All three: a missed card comes back after 3 others; through the deck, a miss leaves the back and the count off the page, and a right answer shows the count and one pill per meaning | Meaning Clouds form and "Every quiz" (Oct 23, 2026); the separate review of pull request 39 found AD- "to" and -INE "of" refused, which no test then covered |

A printed answer longer than its box allows is listed as a note, not a failure: the
deck asks the student to shorten it rather than marking it wrong.

**Adding tests.** Each new deck problem adds a test here, so it cannot come back
unnoticed (Deck Creation Practices form, Oct 15, 2026). Still to add: a set of natural
answers for each typed card, and simulated Learn and Quiz passes with the Sheet rows
they would send.
