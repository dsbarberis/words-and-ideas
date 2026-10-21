# Deck tests

One command runs every test on the built decks. Run it before every publish, after
`node standard-deck/build.js`:

    NODE_PATH=$(npm root -g) node standard-deck/tests/run.js

It needs Node and Playwright (both installed in Claude's cloud sessions). It changes
no file in the repository and sends nothing to the class Sheet: it builds into a
temporary folder, and the test copies of the decks have their Sheet sending cut off
and every web request blocked. It ends with "all tests passed" (exit code 0) or lists
each failure (exit code 1). Do not publish until it passes.

| Test | What it checks | Why |
|---|---|---|
| build matches | The deck files in the repository are exactly what `build.js` makes from the deck sources, and `build-report.md` is current | A deck edited by hand, or changed without meaning to, shows up before students see it |
| no working notes on cards | No wording-source mark ("Claude, unchecked", "checked by Claude", "Claude's condensation", "no answer key was supplied") or page note reaches a deck's card data | Import procedure, Stage 5: no working notes on cards (Oct 5, "sybarite (from p. 176 reading)") |
| decks load | Every deck opens without a script error | One template serves every deck, so a template change can break decks no one opened |
| model answers | Every Exercise Deck card accepts its own answer, typed as the back prints it | The Oct 12 mistake: a key-word change made impend and magnate reject their own answers, and students typing what the back showed were marked wrong for about 41 hours. Run on the Oct 14 backup of Lesson X Exercise IV, this test flags both cards |
| stuck card has a way on | In every deck with a card that refuses to check until the analysis or base is typed, two refused checks show a message and a "Show the answer" button, and that button marks the card missed and turns on Next | Oct 21, 2026: a student who could not give the elements was stuck on an Exercise III card with Next off, and took it for a freeze. Run on the Oct 21 morning decks, this test flags Lesson XI Exercise III and Lesson X Exercise IV |

A printed answer longer than its box allows is listed as a note, not a failure: the
deck asks the student to shorten it rather than marking it wrong.

**Adding tests.** Each new deck problem adds a test here, so it cannot come back
unnoticed (Deck Creation Practices form, Oct 15, 2026). Still to add: a set of natural
answers for each typed card, and simulated Learn and Quiz passes with the Sheet rows
they would send.
