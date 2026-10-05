// Builds every standard deck from template.html and the data files in decks/.
// Usage (from the repository root): node standard-deck/build.js
const fs = require("fs");
const path = require("path");

const here = __dirname;
const template = fs.readFileSync(path.join(here, "template.html"), "utf8");

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

for (const file of fs.readdirSync(path.join(here, "decks")).filter(f => f.endsWith(".js")).sort()) {
  const deck = require(path.join(here, "decks", file));
  const { output, ...data } = deck;
  const json = JSON.stringify(data, null, 2).replace(/<\//g, "<\\/");
  const html = template
    .split("{{TITLE}}").join(escHtml(deck.title))
    .split("{{SUBTITLE}}").join(escHtml(deck.subtitle))
    .replace("{{DECK_JSON}}", () => json);
  fs.writeFileSync(path.join(here, "..", output), html);
  console.log("built " + output + " (" + deck.cards.length + " cards)");
}
