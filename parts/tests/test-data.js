// Saved test for part 1.6, the data layer.  NODE_PATH=$(npm root -g) node parts/tests/test-data.js
// Uses made-up data only. Every request that is not a local file is blocked, so nothing can leave.
const fs = require("fs"), os = require("os"), path = require("path");
const { chromium } = require("playwright");
const P = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(P, f), "utf8");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "data-test-"));
const page = path.join(tmp, "sample.html");
fs.writeFileSync(page, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Data sample</title></head>
<body><p id="st"></p><script>${read("shell/shell.js")}${read("data/data.js")}</script></body></html>`);
const b64 = s => Buffer.from(s, "utf8").toString("base64");
let fails = 0;
const ok = (name, cond, got) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : "  (got " + JSON.stringify(got) + ")")); };
(async () => {
  const b = await chromium.launch();
  const sent = [];
  async function open(cfg, extra) {
    const ctx = await b.newContext();
    await ctx.route("**/*", r => { if (r.request().url().startsWith("file:")) return r.continue(); sent.push(r.request().url()); return r.abort(); });
    const p = await ctx.newPage();
    if (cfg) { await p.addInitScript(c => { window.__STANDIN_CONFIG = c; }, cfg); await p.addInitScript({ path: path.join(P, "check", "stand-in.js") }); }
    if (extra) await p.addInitScript(extra);
    const errs = []; p.on("pageerror", e => errs.push(e.message));
    await p.goto("file://" + page); p.errs = errs; return p;
  }

  // connect
  let p = await open({ available: true, userId: "u_sample" });
  let c = await p.evaluate(async () => { const c = await SP.connect(["db", "user", "mcp", "nonsense"]); return { a: c.available, u: c.userId, db: !!c.db, mcp: !!c.mcp, n: c.nonsense }; });
  ok("connect reaches the services and the viewer's id", c.a && c.u === "u_sample" && c.db && c.mcp && c.n === null, c);
  const p0 = await open(null);
  c = await p0.evaluate(async () => { const c = await SP.connect(["db", "user"]); return { a: c.available, db: c.db, u: c.userId }; });
  ok("outside claude.ai connect gives nulls and does not throw", !c.a && c.db === null && c.u === null && !p0.errs.length, c);
  const p1 = await open({ available: false });
  c = await p1.evaluate(async () => (await SP.connect(["db"])).available);
  ok("when the runtime offers nothing, available is false", c === false, c);
  const pt = await open(null, () => { window.claude = { use: async () => { throw new Error("boom"); } }; });
  c = await pt.evaluate(async () => { const c = await SP.connect(["db", "user"]); return c.db === null && c.userId === null; });
  ok("a service that throws becomes null", c, c);

  // saver
  c = await p.evaluate(async () => {
    const { db } = await SP.connect(["db"]); const st = document.getElementById("st");
    const s = SP.saver(v => db.doc("drafts/current").set(v), { delay: 50, statusEl: st });
    s.queue({ a: 1 }); s.queue({ a: 2 }); s.queue({ a: 3 });
    const mid = st.textContent;
    await new Promise(r => setTimeout(r, 200));
    const sets = __standin.log.filter(x => x[0] === "set");
    return { saves: s.saves, sets: sets.length, last: __standin.docs["drafts/current"], status: st.textContent, mid };
  });
  ok("quick changes are saved once, with the latest value", c.saves === 1 && c.sets === 1 && c.last.a === 3, c);
  ok("the status line says Saved after saving", c.status === "Saved", c);
  c = await p.evaluate(async () => {
    const st = document.getElementById("st"); let calls = 0, fail = true;
    const s = SP.saver(async v => { calls++; if (fail) throw new Error("offline"); window.__kept = v; }, { delay: 20, statusEl: st });
    s.queue("x"); await new Promise(r => setTimeout(r, 80));
    const failed = { state: s.state, status: st.textContent, kind: st.dataset.kind };
    fail = false; const again = await s.flush();
    return { failed, again, kept: window.__kept, state: s.state, calls };
  });
  ok("a failed save shows Couldn't save and keeps the change", c.failed.state === "cantSave" && c.failed.status.startsWith("Couldn't save") && c.failed.kind === "bad", c.failed);
  ok("the kept change saves on the next try", c.again === true && c.kept === "x" && c.state === "saved" && c.calls === 2, c);
  c = await p.evaluate(async () => {
    let order = [], release; const gate = new Promise(r => { release = r; });
    const s = SP.saver(async v => { order.push("start " + v); if (v === 1) await gate; order.push("end " + v); }, { delay: 10 });
    s.queue(1); await new Promise(r => setTimeout(r, 30)); s.queue(2); await new Promise(r => setTimeout(r, 30));
    release(); await s.flush(); await new Promise(r => setTimeout(r, 30));
    return order;
  });
  ok("a change made during a save is saved after it, never at the same time", JSON.stringify(c) === JSON.stringify(["start 1", "end 1", "start 2", "end 2"]), c);
  c = await p.evaluate(() => { const st = document.getElementById("st"); const s = SP.saver(null, { statusEl: st }); s.queue(1); return { state: s.state, t: st.textContent }; });
  ok("with nowhere to save, the status says so", c.state === "notHere" && c.t.startsWith("This page can't save"), c);

  // readSheet
  const csv = 'Name,Score\r\n"Sample, One",3\r\nSample Two,"say ""hi"""\r\n\r\n';
  const pr = await open({ available: true, tools: { download_file_content: { payload: { content: b64(csv) } } } });
  c = await pr.evaluate(async () => { const { mcp } = await SP.connect(["mcp"]); const t = await SP.readSheet(mcp, { fileId: "sample-file" }); return { t, call: __standin.log.find(x => x[0] === "callTool") }; });
  ok("readSheet decodes the CSV the connector returns", c.t === csv, c.t);
  ok("readSheet asks for the file as CSV from Google Drive", c.call[1] === "Google Drive" && c.call[2] === "download_file_content" && c.call[3].fileId === "sample-file" && c.call[3].exportMimeType === "text/csv", c.call);
  const pr2 = await open({ available: true, tools: { download_file_content: { content: [{ type: "text", text: JSON.stringify({ content: b64("A\nÉtienne") }) }] } } });
  c = await pr2.evaluate(async () => SP.readSheet((await SP.connect(["mcp"])).mcp, { fileId: "f" }));
  ok("readSheet also reads the text-block form, keeping accents", c === "A\nÉtienne", c);
  c = await pr.evaluate(async () => {
    let n = 0, waited = []; const mcp = { async callTool() { n++; if (n === 1) throw { code: "rate_limited", retryable: true, retryAfterMs: 60000 }; return { payload: { content: btoa("ok") } }; } };
    const t = await SP.readSheet(mcp, { fileId: "f", sleep: async ms => waited.push(ms) }); return { t, n, waited };
  });
  ok("a retryable failure is tried once more, waiting at most 10 seconds", c.t === "ok" && c.n === 2 && c.waited[0] === 10000, c);
  c = await pr.evaluate(async () => {
    let n = 0; const mcp = { async callTool() { n++; throw { code: "rate_limited", retryable: true }; } };
    try { await SP.readSheet(mcp, { fileId: "f", sleep: async () => {} }); return "no throw"; } catch (e) { return { code: e.code, n }; }
  });
  ok("it gives up after one retry", c.code === "rate_limited" && c.n === 2, c);
  c = await pr.evaluate(async () => {
    const out = {};
    for (const [k, id, mcp] of [["noMcp", "f", null], ["marker", "__SHEET_ID__", {}], ["empty", "", {}], ["shape", "f", { async callTool() { return { payload: {} }; } }], ["b64", "f", { async callTool() { return { payload: { content: "%%%" } }; } }]]) {
      try { await SP.readSheet(mcp, { fileId: id }); out[k] = "no throw"; } catch (e) { out[k] = e.code; }
    }
    return out;
  });
  ok("missing access, an unfilled build marker and bad answers are refused with a code", JSON.stringify(c) === JSON.stringify({ noMcp: "not_granted", marker: "not_set", empty: "not_set", shape: "bad_shape", b64: "bad_shape" }), c);
  c = await pr.evaluate(() => ["needs_reauth", "not_in_manifest", "made_up", undefined].map(k => SP.sheetError(k ? { code: k } : null)));
  ok("every failure gets a plain message, unknown ones the general one", c[0].message.includes("Reconnect Google Drive") && c[1].message.includes("Permissions") && c[2].message.startsWith("The Sheet could not be read just now") && c[3].code === "upstream_error", c);

  // CSV
  c = await pr.evaluate(t => ({ rows: SP.parseCsv(t), objs: SP.csvObjects(SP.parseCsv(t)) }), csv);
  ok("parseCsv handles quotes, commas in quotes and CRLF", JSON.stringify(c.rows.slice(0, 3)) === JSON.stringify([["Name", "Score"], ["Sample, One", "3"], ["Sample Two", 'say "hi"']]), c.rows);
  ok("csvObjects names columns from the first row and drops blank rows", c.objs.length === 2 && c.objs[0].Name === "Sample, One" && c.objs[1].Score === 'say "hi"', c.objs);
  c = await pr.evaluate(() => ({ nl: SP.parseCsv('a,"line\nbreak"\nb,'), short: SP.csvObjects(SP.parseCsv("x,y\n1")), none: SP.csvObjects([]) }));
  ok("a newline inside quotes stays in the field; a short row gets empty values", c.nl[0][1] === "line\nbreak" && c.nl[1][1] === "" && c.short[0].y === "" && c.none.length === 0, c);

  // local storage
  c = await p.evaluate(() => { const s = SP.localStore("sample"); s.set("tab", "scores"); const a = s.get("tab"); s.remove("tab"); return { a, b: s.get("tab", "home"), raw: localStorage.getItem("sample:tab") }; });
  ok("localStore remembers and forgets per-viewer choices", c.a === "scores" && c.b === "home" && c.raw === null, c);
  const pb = await open(null, () => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
  c = await pb.evaluate(() => { const s = SP.localStore("x"); return { set: s.set("a", 1), get: s.get("a", "dflt"), rm: s.remove("a") }; });
  ok("blocked browser storage gives defaults and never breaks the page", c.set === false && c.get === "dflt" && c.rm === false && !pb.errs.length, c);
  await p.evaluate(() => localStorage.setItem("sample:bad", "{not json"));
  ok("a damaged stored value gives the default", await p.evaluate(() => SP.localStore("sample").get("bad", 7)) === 7, null);

  // sheetPost
  const pp = await open(null, () => { window.__SP_TEST__ = {}; });
  c = await pp.evaluate(() => { const r = SP.sheetPost("https://example.invalid/formResponse", { deck: "entry.1", name: "entry.2" }, { deck: "Sample Deck", name: "Test Student", extra: "dropped" }); return { r, sent: window.__SP_TEST__.sent, forms: document.forms.length, frames: document.querySelectorAll("iframe").length }; });
  ok("in a test, sheetPost records the row and sends nothing", c.r === false && c.forms === 0 && c.frames === 0 && JSON.stringify(c.sent[0].entries) === JSON.stringify([["entry.1", "Sample Deck"], ["entry.2", "Test Student"]]), c);
  c = await p.evaluate(() => ({ marker: SP.sheetPost("__GFORM_ACTION__", { a: "entry.1" }, { a: 1 }), empty: SP.sheetPost("", { a: "entry.1" }, { a: 1 }), forms: document.forms.length }));
  ok("sheetPost refuses an unfilled or empty address", c.marker === false && c.empty === false && c.forms === 0, c);
  c = await p.evaluate(() => { const r = SP.sheetPost("https://example.invalid/formResponse", { a: "entry.1" }, { a: "v" }); const f = document.forms[0]; return { r, action: f && f.action, method: f && f.method, target: f && f.target, input: f && f.elements[0].name + "=" + f.elements[0].value, frame: !!document.getElementById("gform_sink") }; });
  await p.waitForTimeout(300);
  ok("outside a test it builds the same hidden form post as the decks", c.r === true && c.method === "post" && c.target === "gform_sink" && c.input === "entry.1=v" && c.frame, c);
  ok("the post went to the blocked test address only", sent.length >= 1 && sent.every(u => u.startsWith("https://example.invalid/")), sent);

  ok("no script errors on any sample page", [p, p0, p1, pt, pr, pr2, pb, pp].every(x => !x.errs.length), [p, p0, p1, pt, pr, pr2, pb, pp].map(x => x.errs));
  await b.close(); fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fails ? fails + " failure(s)" : "all data tests passed"); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
