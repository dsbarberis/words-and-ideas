// Builds every standard deck from template.html and the data files in decks/.
// Usage (from the repository root): node standard-deck/build.js
const fs = require("fs");
const path = require("path");

const here = __dirname;
const template = fs.readFileSync(path.join(here, "template.html"), "utf8");
const glossary = require(path.join(here, "glossary.js"));

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Every spelling a glossary entry's forms allow, for typed answers:
// "DOM(IN)-" gives dom and domin; "CLUD-, CLUS-, [CLOS-]" gives clud, clus, clos.
function formsOf(forms) {
  const out = [];
  (forms.match(/[A-Z]+(?:\([A-Z]+\))?[A-Z]*/g) || []).forEach(function (f) {
    const m = f.match(/^([A-Z]*)\(([A-Z]+)\)([A-Z]*)$/);
    if (m) { out.push(m[1] + m[3], m[1] + m[2] + m[3]); } else out.push(f);
  });
  return out.map(function (f) { return f.toLowerCase(); }).filter(function (f, i, a) { return f && a.indexOf(f) === i; });
}

// A card that points to a glossary entry takes its forms and meanings from it.
// On a meanings deck (Latin Roots) the card IS the entry: its forms on the
// front, its meanings and examples on the back.
function resolveGlossary(card, file, deck) {
  if (!card.gloss) return card;
  const entry = glossary[card.gloss];
  if (!entry) throw new Error(file + ": no glossary entry \"" + card.gloss + "\"");
  const out = Object.assign({}, card);
  out.glossForms = entry.forms;
  out.glossMeanings = entry.meanings;
  if (card.kind === "typed" && !card.accept) out.accept = formsOf(entry.forms);
  if (!card.answerText) out.answerText = entry.forms;
  if (deck.answer === "meanings") {
    out.word = entry.forms;
    out.meanings = entry.meanings;
    out.origin = entry.examples || "";
    if (!card.keys || card.keys.length !== entry.meanings.length) {
      throw new Error(file + ": \"" + card.gloss + "\" needs one key-word list per meaning");
    }
    delete out.glossForms; delete out.glossMeanings; delete out.answerText;
  }
  return out;
}

for (const file of fs.readdirSync(path.join(here, "decks")).filter(f => f.endsWith(".js")).sort()) {
  const deck = require(path.join(here, "decks", file));
  const { output, ...data } = deck;
  data.cards = deck.cards.map(function (c) { return resolveGlossary(c, file, deck); });
  const json = JSON.stringify(data, null, 2).replace(/<\//g, "<\\/");
  const html = template
    .split("{{TITLE}}").join(escHtml(deck.heading || deck.title))
    .replace("{{DECK_JSON}}", () => json);
  fs.writeFileSync(path.join(here, "..", output), html);
  console.log("built " + output + " (" + deck.cards.length + " cards)");
}
