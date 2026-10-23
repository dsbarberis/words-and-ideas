// Shared part 1.6: the data layer (Tools and tests desk). One way for every page to reach
// its saved data, the class Sheet and browser storage, with the same failures shown the same way.
// No Sheet ID, form address or setting lives here: pages pass them in, filled at build time.
window.SP = window.SP || {};
(function (SP) {
  // connect(["db","user","mcp"]) never throws. A service the page can't use comes back null,
  // and available is false when none of them could be reached (page opened outside claude.ai).
  SP.connect = async function (names) {
    const out = { available: false, userId: null };
    const c = window.claude;
    for (const n of names) {
      out[n] = null;
      if (!c || typeof c.use !== "function") continue;
      try { out[n] = (await c.use(n)) || null; } catch (e) { out[n] = null; }
      if (out[n]) out.available = true;
    }
    if (out.user && typeof out.user.id === "function") { try { out.userId = (await out.user.id()) || null; } catch (e) { out.userId = null; } }
    return out;
  };

  // saver(save, {delay, statusEl}) waits for a pause in changes, then saves the latest value once.
  // Changes made while a save runs are kept and saved next. The status line says what happened.
  SP.saver = function (save, opts) {
    opts = opts || {};
    const delay = opts.delay == null ? 1200 : opts.delay, el = opts.statusEl || null;
    let pending, hasPending = false, timer = null, running = null;
    const say = k => { if (el && SP.status) SP.status(el, k); };
    const api = { state: "saved", saves: 0 };
    if (typeof save !== "function") { api.state = "notHere"; say("notHere"); api.queue = () => {}; api.flush = async () => false; return api; }
    async function run() {
      while (running) await running.catch(() => {});
      clearTimeout(timer); timer = null;
      if (!hasPending) return api.state !== "cantSave";
      const v = pending; hasPending = false; api.state = "saving"; say("saving");
      running = Promise.resolve().then(() => save(v));
      try { await running; api.saves++; if (!hasPending) { api.state = "saved"; say("saved"); } return true; }
      catch (e) { if (!hasPending) { pending = v; hasPending = true; } api.state = "cantSave"; say("cantSave"); api.error = e; return false; }
      finally { running = null; }
    }
    api.queue = function (v) { pending = v; hasPending = true; clearTimeout(timer); timer = setTimeout(run, delay); };
    api.flush = function () { clearTimeout(timer); return run(); };
    return api;
  };

  // Plain messages for connector failures, shared by every page that reads the Sheet.
  const MESSAGES = {
    needs_reauth: "Your Google Drive connection has expired. Reconnect Google Drive in claude.ai Settings → Connectors, then reload this page.",
    server_not_connected: "Google Drive is not connected to your claude.ai account. Add it in claude.ai Settings → Connectors, then reload this page.",
    selection_required: "You have more than one Google Drive connection. Choose one when claude.ai asks, then reload this page.",
    not_in_manifest: "Google Drive is turned off for this page. Turn it on in this page's Permissions menu, then reload.",
    approval_required: "Reading the Sheet needs your approval. Reload the page and choose Allow.",
    blocked_by_policy: "Your organization's policy blocks this Google Drive tool.",
    tool_error: "Google Drive could not return the Sheet (it may have been moved, renamed into another format, or unshared).",
    bad_shape: "Google Drive answered in an unexpected format, so the Sheet could not be read.",
    not_granted: "This view of the page has no connector access. Open it on claude.ai while signed in.",
    capability_disabled: "This view of the page has no connector access. Open it on claude.ai while signed in.",
    not_set: "This page was built without the Sheet's details, so it can't read the Sheet.",
  };
  const FALLBACK = "The Sheet could not be read just now (Google Drive did not answer). Reload the page to try again.";
  SP.sheetError = function (e) { const code = (e && e.code) || "upstream_error"; return { code, message: MESSAGES[code] || FALLBACK }; };

  // readSheet(mcp, {server, fileId}) returns the Sheet as CSV text. It retries once when the
  // connector says to, waiting at most 10 seconds. A fileId still holding its build marker is refused.
  SP.readSheet = async function (mcp, o) {
    if (!mcp) throw { code: "not_granted" };
    if (!o || !o.fileId || /^__.*__$/.test(o.fileId)) throw { code: "not_set" };
    const wait = o.sleep || (ms => new Promise(r => setTimeout(r, ms)));
    for (let attempt = 0; ; attempt++) {
      try {
        const r = await mcp.callTool(o.server || "Google Drive", "download_file_content", { fileId: o.fileId, exportMimeType: "text/csv" }, { cache: false });
        let p = r && r.payload;
        if (!p || typeof p.content !== "string") { const tb = ((r && r.content) || []).find(b => b.type === "text"); try { p = tb ? JSON.parse(tb.text) : null; } catch (e) { p = null; } }
        if (!p || typeof p.content !== "string") throw { code: "bad_shape" };
        let bin; try { bin = atob(p.content); } catch (e) { throw { code: "bad_shape" }; }
        const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder("utf-8").decode(bytes);
      } catch (e) {
        if (e && e.retryable && attempt === 0) { await wait(Math.min(e.retryAfterMs || 3000, 10000)); continue; }
        throw e;
      }
    }
  };

  // parseCsv: the dashboard's parser, unchanged (quoted fields, doubled quotes, CRLF, embedded newlines).
  SP.parseCsv = function (t) { const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < t.length; i++) { const c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true; else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c; }
    if (f || row.length) { row.push(f); rows.push(row); } return rows; };

  // csvObjects(rows): the first row names the columns; blank rows are dropped; short rows get "".
  SP.csvObjects = function (rows) {
    if (!rows.length) return [];
    const head = rows[0].map(h => h.trim());
    return rows.slice(1).filter(r => r.some(x => x.trim() !== "")).map(r => { const o = {}; head.forEach((h, i) => { o[h] = r[i] == null ? "" : r[i]; }); return o; });
  };

  // localStore(prefix): browser storage for per-viewer conveniences only (a remembered tab or filter).
  // Every call is wrapped, so a blocked or empty store never breaks the page.
  SP.localStore = function (prefix) {
    const k = n => (prefix || "sp") + ":" + n;
    return {
      get(n, dflt) { try { const v = window.localStorage.getItem(k(n)); return v == null ? dflt : JSON.parse(v); } catch (e) { return dflt; } },
      set(n, v) { try { window.localStorage.setItem(k(n), JSON.stringify(v)); return true; } catch (e) { return false; } },
      remove(n) { try { window.localStorage.removeItem(k(n)); return true; } catch (e) { return false; } },
    };
  };

  // sheetPost(action, fields, payload): the decks' row to the class Sheet, sent as a hidden form post.
  // It never sends from a test: when window.__SP_TEST__ is set, the row is recorded there instead.
  // It also refuses when the address still holds its build marker. Returns true only if sent.
  SP.sheetPost = function (action, fields, payload) {
    const entries = [];
    Object.keys(payload).forEach(key => { const name = fields[key]; if (name) entries.push([name, String(payload[key])]); });
    if (window.__SP_TEST__) { (window.__SP_TEST__.sent = window.__SP_TEST__.sent || []).push({ action, entries }); return false; }
    if (!action || /__.*__/.test(action)) return false;
    try {
      const sinkId = "gform_sink";
      let iframe = document.getElementById(sinkId);
      if (!iframe) { iframe = document.createElement("iframe"); iframe.name = sinkId; iframe.id = sinkId; iframe.style.display = "none"; document.body.appendChild(iframe); }
      const form = document.createElement("form");
      form.action = action; form.method = "POST"; form.target = sinkId; form.style.display = "none";
      for (const [n, v] of entries) { const input = document.createElement("input"); input.name = n; input.value = v; form.appendChild(input); }
      document.body.appendChild(form); form.submit();
      setTimeout(() => { if (form.parentNode) form.parentNode.removeChild(form); }, 3000);
      return true;
    } catch (e) { return false; } // best effort only: never block the student
  };
})(window.SP);
