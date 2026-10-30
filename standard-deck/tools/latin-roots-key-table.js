// Writes key-table.json for Latin Roots: each key a student's records may still
// hold from the deck before one card per form (the keys in card-keys.json) and
// the new cards it becomes. Run once, when the cards change:
//   node tools/latin-roots-key-table.js tools/latin-roots-old-cards.json decks/latin-roots-cards.json
// "from": old key -> new keys (CAD -> CAD, CID, CAS; IN-not -> IN, IM).
// "needAll": a joined card (one spelling, two Latin words) -> the old keys that
// must all be Know It for it to start as Know It; "" stands for a meaning no old
// card asked, so such a card starts as Still Learning.
const path = require("path"), fs = require("fs");
const here = path.join(__dirname, "..");
const [OLD, CARDS] = process.argv.slice(2);
const G = require(path.join(here, "glossary.js"));
const D = OLD.endsWith(".json") ? JSON.parse(fs.readFileSync(path.resolve(OLD), "utf8")) : require(path.resolve(OLD)), C = require(path.resolve(CARDS));
const frozen = JSON.parse(fs.readFileSync(path.join(here, "card-keys.json"), "utf8"))[D.id];
const sp = f => { const b = f.replace(/-/g, "").toUpperCase().replace(/^\((.*)\)$/, "$1"); const m = b.match(/^(.*?)\(([^)]*)\)(.*)$/); return m ? [m[1] + m[3], m[1] + m[2] + m[3]] : [b]; };
const formsOf = s => String(s).replace(/\[[^\]]*\]/g, "").split(/,\s*/)
  .map(t => t.replace(/\((before|negative|directional|adjective)[^)]*\)/gi, "").trim().split(/\s+/)[0]).filter(t => /^\(?-?[A-Z]/.test(t));
const from = {}, oldByGloss = {};
D.cards.forEach((c, i) => {
  const k = c.id || c.gloss; oldByGloss[c.gloss] = k;
  const S = new Set([].concat(...formsOf(c.forms || G[c.gloss].forms).map(sp)));
  // The same Latin word: the same glossary entry, or one the glossary splits off
  // for another form of it (CID- and CAS- beside CAD-, with the same meanings).
  const fam = g => { const e = G[g] || {}; return (e.latin && e.latin[0] && e.latin[0].family) || null; };
  const same = g => g === c.gloss || (fam(g) && fam(g) === fam(c.gloss)) ||
    JSON.stringify((G[g] || {}).meanings) === JSON.stringify((G[c.gloss] || {}).meanings);
  const t = C.filter(x => x.glosses.some(same) && x.spellings.some(s => S.has(s))).map(x => x.key);
  if (!t.length) throw new Error("no new card for " + k);
  if (!(t.length === 1 && t[0] === k)) from[k] = t;
});
if (frozen) frozen.forEach(k => { if (!from[k] && !C.some(x => x.key === k)) throw new Error("frozen key " + k + " has no new card"); });
const needAll = {};
C.forEach(x => { if (x.glosses.length > 1) needAll[x.key] = x.glosses.map(g => oldByGloss[g] || ""); });
const file = path.join(here, "key-table.json");
const all = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
all[D.id] = { from, needAll };
fs.writeFileSync(file, JSON.stringify(all, null, 1) + "\n");
console.log(D.id + ":", Object.keys(from).length, "old keys split or joined,", Object.keys(needAll).length, "joined cards");
