// A stand-in for claude.ai's page runtime (window.claude), for tests only (part 1.1).
// Injected before a page loads. It keeps the page's database in memory, records every read
// and write (the data contract tests read them), and answers connector calls from a seed.
// Config, set as window.__STANDIN_CONFIG before this runs:
//   { available: true|false, userId: "u_test", docs: {"path": {...}}, tools: {"tool name": result} }
// available:false makes every claude.use() resolve to null, as on a page opened outside claude.ai.
(function () {
  const cfg = window.__STANDIN_CONFIG || {};
  const docs = JSON.parse(JSON.stringify(cfg.docs || {}));
  const log = [];
  const S = (window.__standin = { docs, log, hot: null });
  const copy = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  function snap(path) { const d = docs[path]; return { id: path.split("/").pop(), exists: d !== undefined, data: () => copy(d) }; }
  function docRef(path) {
    return {
      id: path.split("/").pop(), path,
      async get() { log.push(["get", path]); return snap(path); },
      async set(v, opts) { log.push(["set", path, copy(v)]); docs[path] = opts && opts.merge ? Object.assign({}, docs[path] || {}, copy(v)) : copy(v); },
      async update(v) { log.push(["update", path, copy(v)]); docs[path] = Object.assign({}, docs[path] || {}, copy(v)); },
      async delete() { log.push(["delete", path]); delete docs[path]; },
    };
  }
  function query(coll, steps) {
    const q = {
      where(f, op, v) { return query(coll, steps.concat([["where", f, op, v]])); },
      orderBy(f, dir) { return query(coll, steps.concat([["orderBy", f, dir || "asc"]])); },
      limit(n) { return query(coll, steps.concat([["limit", n]])); },
      doc(id) { return docRef(coll + "/" + id); },
      async add(v) { const id = "auto" + Object.keys(docs).length; await docRef(coll + "/" + id).set(v); return docRef(coll + "/" + id); },
      async get() {
        log.push(["query", coll, steps]);
        let rows = Object.keys(docs).filter(p => p.startsWith(coll + "/") && !p.slice(coll.length + 1).includes("/")).map(snap);
        for (const s of steps) {
          if (s[0] === "where") rows = rows.filter(r => { const x = r.data()[s[1]]; return s[2] === "==" ? x === s[3] : s[2] === "<" ? x < s[3] : s[2] === ">" ? x > s[3] : true; });
          if (s[0] === "orderBy") rows.sort((a, b) => (a.data()[s[1]] > b.data()[s[1]] ? 1 : -1) * (s[2] === "desc" ? -1 : 1));
          if (s[0] === "limit") rows = rows.slice(0, s[1]);
        }
        return { docs: rows, size: rows.length, empty: !rows.length };
      },
    };
    return q;
  }
  const db = { doc: docRef, collection: c => query(c, []) };
  const services = {
    db,
    user: { async id() { return cfg.userId || "u_test"; } },
    mcp: { async callTool(server, tool, args) { log.push(["callTool", server, tool, copy(args)]); if (cfg.tools && tool in cfg.tools) return copy(cfg.tools[tool]); throw { code: "not_available_in_test" }; } },
    sample: null, assets: { async list() { return []; } },
  };
  window.claude = {
    async use(name) { log.push(["use", name]); if (cfg.available === false) return null; return services[name] || null; },
    hot: { data: null, snapshot(fn) { S.hot = fn; } },
  };
})();
