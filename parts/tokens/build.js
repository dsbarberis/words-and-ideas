// Builds the shared colour and type stylesheets from tokens.json (Tools and tests desk, Oct 18, 2026).
//   node parts/tokens/build.js          writes parts/tokens/dist/*.css
//   node parts/tokens/build.js --check  writes nothing; exit 1 if dist/ is out of date
// Never edit dist/ by hand. Each file holds one theme: light values on :root, and (except
// course-nodark, for the decks, which have no dark theme) the dark values for the device's
// dark setting and for data-theme="dark", with data-theme="light" forcing light.
const fs = require("fs"), path = require("path");
const here = __dirname, dist = path.join(here, "dist");
const T = JSON.parse(fs.readFileSync(path.join(here, "tokens.json"), "utf8"));

function block(sel, vals) {
  return sel + " {\n" + Object.keys(T.names).filter(k => k in vals)
    .map(k => "  --" + k + ": " + vals[k] + ";").join("\n") + "\n}\n";
}
function sheet(light, dark) {
  const head = "/* Built by parts/tokens/build.js from tokens.json. Do not edit by hand. */\n";
  let s = head + block(":root", T.themes[light]);
  if (dark) {
    const inner = block(":root:not([data-theme=\"light\"])", T.themes[dark]).replace(/^/gm, "  ").trimEnd();
    s += "@media (prefers-color-scheme: dark) {\n" + inner + "\n}\n" + block(":root[data-theme=\"dark\"]", T.themes[dark]);
  }
  return s;
}
const out = {
  "course.css": sheet("course-light", "course-dark"),
  "course-nodark.css": sheet("course-light", null),
  "working.css": sheet("working-light", "working-dark"),
};
if (process.argv.includes("--check")) {
  const stale = Object.keys(out).filter(f => !fs.existsSync(path.join(dist, f)) || fs.readFileSync(path.join(dist, f), "utf8") !== out[f]);
  if (stale.length) { console.log("out of date: " + stale.join(", ") + " (run node parts/tokens/build.js)"); process.exit(1); }
  console.log("dist/ matches tokens.json");
} else {
  fs.mkdirSync(dist, { recursive: true });
  for (const [f, s] of Object.entries(out)) fs.writeFileSync(path.join(dist, f), s);
  console.log("wrote " + Object.keys(out).join(", "));
}
module.exports = { sheet };
