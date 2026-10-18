# Shared parts

The parts every page is built from, and their saved tests. Owner: the Tools and tests desk
(Governance Register, D-29). The plan is in the project's shared folder:
proposals/shared-parts/migration-plan-2026-10-18.md.

**No page uses these parts yet.** Pages move onto them one at a time (plan, stage 2), each
with no visible change and no change to stored data.

**This repository is public.** Nothing private goes into a part: no Sheet ID, form ID,
document path or setting. Those stay in the private shared folder and are put in at build
time (plan, rule 7). A saved test will fail the build if one appears (part 1.8).

## Parts so far

| Part | Files | Its test |
|---|---|---|
| 1.1 Page check and test harness | `check/page-check.js`, `check/stand-in.js` | `tests/test-page-check.js` |
| 1.2 Colours and type | `tokens/tokens.json` (edit this), `tokens/build.js`, `tokens/dist/` (built; never edit) | `tests/test-tokens.js` |
| 1.3 Page shell: base type, focus, status line, glyphs, dialog, tabs, Next Unanswered, escaping, title case | `shell/shell.css`, `shell/shell.js` | `tests/test-shell.js` |
| 1.4 Table: sorting both ways, ties in default order, "—" last, pinned headings and first column, Show all | `table/table.css`, `table/table.js` | `tests/test-table.js` |
| 1.5 Filter chips and saved views | `chips/chips.css`, `chips/chips.js` | `tests/test-chips.js` |
| 1.6 Data layer: connect (never throws), one saver with the status line, reading the class Sheet with plain failure messages, CSV, browser storage for conveniences only, the decks' Sheet row (never sent from a test) | `data/data.js` | `tests/test-data.js` |

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
states such as a dialog open or a column sorted. The stand-in records every database read and
write in `report.json`, which the data contract tests (part 1.9) will compare.

Not yet in the page check: an automated accessibility scan (axe-core), which needs a copy saved
here because the test browser has no web access.

## Status line wording (1.3)

`shell.js` holds the fixed wording (`STATUS`): loading, saving, saved, couldn't read, couldn't save,
and "can't save in this view". It is a draft and goes to the architect before the first page uses it.
