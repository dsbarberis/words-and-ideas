// Filter chips and saved views (part 1.5). Needs shell.js.
//
// SP.chips(box, { groups: [{ key, label, multi?: true, options: [{ value, label, count? }] }], state?, onChange })
//   A chip is a toggle button (aria-pressed). A second click on a pressed chip clears it
//   (general design checklist, section 4). "Clear Filters" appears when anything is pressed.
//   state: { groupKey: [values] }. Returns { get(), set(state) }.
//
// SP.views(box, { store: { load: async () => [{name, state}], save: async list => {} }, get, set })
//   Saved views: "Save View" names the current state; each saved view can be applied or deleted.
//   The page chooses where the list is kept (its database, or browser storage for a convenience).
(function () {
  function chips(box, opt) {
    let state = JSON.parse(JSON.stringify(opt.state || {}));
    function render() {
      box.className = "sp-chips"; box.setAttribute("role", "group"); box.setAttribute("aria-label", opt.label || "Filters");
      const any = Object.values(state).some(v => v && v.length);
      box.innerHTML = opt.groups.map(g => `<span class="sp-group"><span class="sp-group-label">${SP.esc(g.label)}</span>` +
        g.options.map(o => { const on = (state[g.key] || []).map(String).includes(String(o.value));
          return `<button type="button" class="sp-chip" aria-pressed="${on}" data-g="${SP.esc(g.key)}" data-v="${SP.esc(o.value)}">${SP.esc(o.label)}${o.count != null ? `<span class="n">${SP.esc(o.count)}</span>` : ""}</button>`; }).join("") + "</span>").join("") +
        (any ? '<button type="button" class="sp-clear">Clear Filters</button>' : "");
      box.querySelectorAll(".sp-chip").forEach(b => b.addEventListener("click", () => {
        const g = opt.groups.find(x => x.key === b.dataset.g), v = b.dataset.v, cur = state[g.key] || [];
        // The button carries the value as text; keep the option's own value (a number stays a number).
        const o = g.options.find(x => String(x.value) === v), real = o ? o.value : v, has = cur.some(x => String(x) === v);
        state[g.key] = has ? cur.filter(x => String(x) !== v) : (g.multi ? cur.concat([real]) : [real]);
        render(); const again = box.querySelector(`.sp-chip[data-g="${CSS.escape(g.key)}"][data-v="${CSS.escape(v)}"]`); if (again) again.focus();
        if (opt.onChange) opt.onChange(api.get());
      }));
      const c = box.querySelector(".sp-clear");
      if (c) c.addEventListener("click", () => { state = {}; render(); const f = box.querySelector(".sp-chip"); if (f) f.focus(); if (opt.onChange) opt.onChange(api.get()); });
    }
    const api = { get: () => JSON.parse(JSON.stringify(state)), set(s) { state = JSON.parse(JSON.stringify(s || {})); render(); } };
    render();
    return api;
  }

  function views(box, opt) {
    let list = [];
    async function load() { try { list = (await opt.store.load()) || []; } catch (e) { list = []; } render(); }
    async function save() { await opt.store.save(list); render(); }
    function render() {
      box.className = "sp-views";
      box.innerHTML = (list.length ? list.map((v, i) => `<span class="sp-view"><button type="button" data-i="${i}" class="apply">${SP.esc(v.name)}</button><button type="button" data-i="${i}" class="del" aria-label="Delete the view ${SP.esc(v.name)}">Delete</button></span>`).join("")
        : '<span class="sp-empty">No saved views yet. Set the filters, then Save View.</span>') + '<button type="button" class="sp-save">Save View</button>';
      box.querySelectorAll(".apply").forEach(b => b.addEventListener("click", () => opt.set(JSON.parse(JSON.stringify(list[+b.dataset.i].state)))));
      box.querySelectorAll(".del").forEach(b => b.addEventListener("click", () => { list.splice(+b.dataset.i, 1); save(); }));
      box.querySelector(".sp-save").addEventListener("click", () => {
        const name = (opt.ask ? opt.ask() : prompt("Name this view")) || ""; if (!name.trim()) return;
        const at = list.findIndex(v => v.name === name.trim()), v = { name: name.trim(), state: opt.get() };
        if (at >= 0) list[at] = v; else list.push(v); save();
      });
    }
    load();
    return { reload: load, list: () => list.slice() };
  }
  window.SP = Object.assign(window.SP || {}, { chips, views });
})();
