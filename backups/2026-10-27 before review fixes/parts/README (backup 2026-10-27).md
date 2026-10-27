# Shared parts

The parts every page is built from, and their saved tests. Owner: the Tools and tests desk
(Governance Register, D-29). The plan is in the project's shared folder:
proposals/shared-parts/migration-plan-2026-10-18.md.

**No page uses these parts yet.** Pages move onto them one at a time (plan, stage 2), each
with no visible change and no change to stored data.

**This repository is public.** Nothing private goes into a part: no Sheet ID, form ID,
document path or setting. Those stay in the private shared folder and are put in at build
time (plan, rule 7). A saved test will fail the build if one appears (`check/private-check.js`, part 1.8).

## Parts so far

| Part | Files | Its test |
|---|---|---|
| 1.1 Page check and test harness | `check/page-check.js`, `check/stand-in.js` | `tests/test-page-check.js` |
| 1.2 Colours and type | `tokens/tokens.json` (edit this), `tokens/build.js`, `tokens/dist/` (built; never edit) | `tests/test-tokens.js` |
| 1.3 Page shell: base type, focus, status line, glyphs, dialog, tabs, Next Unanswered, escaping, title case | `shell/shell.css`, `shell/shell.js` | `tests/test-shell.js` |
| 1.4 Table: sorting both ways, ties in default order, "—" last, pinned headings and first column, Show all | `table/table.css`, `table/table.js` | `tests/test-table.js` |
| 1.5 Filter chips and saved views | `chips/chips.css`, `chips/chips.js` | `tests/test-chips.js` |
| 1.6 Data layer: connect (never throws), one saver with the status line, reading the class Sheet with plain failure messages, CSV, browser storage for conveniences only, the decks' Sheet row (never sent from a test) | `data/data.js` | `tests/test-data.js` |
| 1.7 Form kit on the parts: the approval form template, its build, a question helper and a field check. Looks and saves exactly as the kit it replaces (copy kept in `form-kit/reference/`) | `form-kit/template.html`, `form-kit/build-form.py`, `form-kit/formkit.py`, `form-kit/check_form.py` | `tests/test-form-kit.js` |
| 1.8 Build step (puts parts into a page where it marks them, and private settings from a file in the shared folder) and the private-settings check | `build/build_page.py`, `check/private-check.js` | `tests/test-private.js` |
| 1.9 Data contract runner: records what a page reads and writes (database, browser storage, web requests), with times as placeholders, and checks a moved page does the same. The steps and records live in the shared folder beside the pages (tools/shared-parts/contracts/) | `check/contract.js` | `tests/test-contract.js` |
| 1.10 Deck simulation: a Learn pass, an unfinished pass and two quiz rounds on each built deck, at a fixed time with seeded randomness; the Sheet rows (as blocked posts, byte for byte), saved attempts and browser storage are recorded before a move and compared after. Stops if it cannot find the code that sends to the Sheet. Records hold the form's address, so they live in the shared folder (tools/shared-parts/contracts/decks/) | `check/deck-sim.js` | `tests/test-deck-sim.js` |
| 1.11 Data feed check (Oct 20, 2026; this desk owns the data feed): is the class Google Sheet still receiving good rows? Header row, deck names, pass modes and test names in rows added since the last check, and no rows for three days during term. Reads only; names no student. A page that already reads the Google Sheet calls it; the agreement it checks is filled in at build time from the data feed settings | `data/feed-check.js` | `tests/test-feed-check.js` |

## Building a page from the parts (1.8)

A page marks where each part goes with an empty label, in a style or script block:

    /* shared-part: tokens/dist/working.css */ /* /shared-part: tokens/dist/working.css */

and writes each private setting as `__NAME__`. Then:

    python3 -I parts/build/build_page.py SOURCE.html OUT.html --settings /path/in/the/shared/folder/settings.json

The labels stay in the built page, so the shared-parts scan can tell it was built from the
parts. The build refuses a settings file inside this repository and a page with a setting
left unfilled. `node parts/check/private-check.js` fails on anything that looks private
(Google file or form IDs, form field names, artifact, session or routine IDs, shared-folder
paths, email addresses); with `SP_PRIVATE_SETTINGS=FILE` it also looks for that file's values.

The data feed exception (Oct 20, 2026): deck pages must carry the Google Form's posting address
and its entry codes, because a student's browser posts to it. With `--feed FILE` (the data feed
settings, kept in the shared folder), those exact values pass in the files the settings list:
the decks at the top of the repository, the deck template, and old copies under backups/.
Anything else, or any other address or code, still fails. Run it over the whole repository on
every deck build and in the nightly audit:
`node parts/check/private-check.js --feed <settings>/data-feed.json .`

## Approval forms (1.7)

    python3 -I parts/form-kit/check_form.py FORM.json        # the field check
    python3 -I parts/form-kit/build-form.py FORM.json OUT.html --zones settings/time-zones.json   # Setup's zone file, from the shared folder

A maker script can build its questions with `formkit.py` (`question`, `opt`, `other`, `clar`,
`items_question`, `item`, `table`, `column`, `row`, `form`, `save`); `form()` runs the field
check. Form files stay in the private shared folder. All 44 saved forms passed the field check
on Oct 18, 2026. New forms use this kit (plan, stage 2); an open form is never rebuilt.

## Running the tests

    node parts/tokens/build.js                                   # after any change to tokens.json
    NODE_PATH=$(npm root -g) node parts/tests/run.js             # every parts test

`run.js` ends with "all parts tests passed" (exit 0) or lists each failure (exit 1).
They need Node and Playwright, both installed in Claude's cloud sessions.

## Colours and type (1.2)

One set of names by job (`--bg`, `--surface`, `--ink`, `--ink-soft`, `--accent`, and so on;
the full list with each name's job is in `tokens.json`), in two themes:

- **course** (parchment), for the decks and the Class Results Dashboard. Light values are the
  decks'; dark values are the dashboard's. The decks use `course-nodark.css`: they have no dark
  theme.
- **working** (neutral), for forms, the pending board and review pages. Values are the form kit's.

`warn` and `warn-soft` in the course theme are new (no course page shows a warning colour today).

**Contrast.** Every text pair must meet WCAG 2.2 AA (4.5:1) and every control pair 3:1, in all
four themes. Five pairs in the course theme fall short today: the decks' gold (2.52 and 2.89),
the decks' sage on the page background (4.49), and the dashboard's faintest text (3.04 and 3.49).
They are listed in `tokens.json` as exceptions, counted by the test, until the architect decides
the look (plan, section 9, decision 2). The test fails if a listed exception starts passing, so
the list cannot go stale.

## Page check (1.1)

    NODE_PATH=$(npm root -g) node parts/check/page-check.js PAGE.html --out DIR [--baseline DIR] [--no-dark]

Loads a page at 390, 820 and 1280 px, light and dark, with a stand-in for claude.ai and every web
request blocked. It fails on script errors, sideways scroll, clickable targets under 24 px (a
radio or checkbox counts with its label), and indicator glyphs not drawn at a fixed size. With
`--baseline` it compares each screenshot with the one taken before a move: a shot fails when more
than 0.1% of its pixels change noticeably, or the page's size changes. `--states FILE.js` adds
states such as a dialog open or a column sorted. `--strict` fails on any pixel changed by
more than 4 levels, for a move meant to be identical (the normal comparison lets a slight tint through). The stand-in records every database read and
write in `report.json`, which the data contract tests (part 1.9) will compare.

Not yet in the page check: an automated accessibility scan (axe-core), which needs a copy saved
here because the test browser has no web access.

## Status line wording (1.3)

`shell.js` holds the fixed wording (`STATUS`): loading, saving, saved, couldn't read, couldn't save,
and "can't save in this view". It is a draft and goes to the architect before the first page uses it.
