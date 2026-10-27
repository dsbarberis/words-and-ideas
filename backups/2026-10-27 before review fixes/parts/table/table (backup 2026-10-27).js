// Table (part 1.4): SP.table(box, { columns, rows, defaultSort, limit, title })
//   columns: [{ key, label, num?: true, wrap?: true, value?: row => sortable value, show?: row => text }]
//   rows: plain objects. Empty values ("" , null, undefined) show as "—" and sort last both ways.
//   Every heading sorts; a second click reverses; the default order breaks ties; the active
//   heading shows ▲ or ▼ and aria-sort. limit: rows shown until "Show all" is switched on.
// Needs shell.js (SP.esc) and table.css.
(function () {
  const isEmpty = v => v === "" || v === null || v === undefined || (typeof v === "number" && isNaN(v));
  function table(box, opt) {
    const cols = opt.columns, base = opt.rows.map((r, i) => ({ r, i }));
    let sortKey = null, dir = 1, showAll = !opt.limit;
    const val = (c, r) => (c.value ? c.value(r) : r[c.key]);
    const head = document.createElement("div"); head.className = "sp-table-head";
    const wrap = document.createElement("div"); wrap.className = "sp-table-box";
    box.replaceChildren(head, wrap);
    function render() {
      let list = base.slice();
      if (sortKey) {
        const c = cols.find(x => x.key === sortKey);
        list.sort((a, b) => {
          const x = val(c, a.r), y = val(c, b.r), ex = isEmpty(x), ey = isEmpty(y);
          if (ex || ey) return ex && ey ? a.i - b.i : ex ? 1 : -1;      // empty last, both ways
          const d = c.num ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true, sensitivity: "base" });
          return d ? d * dir : a.i - b.i;                                // default order breaks ties
        });
      }
      const shown = showAll ? list : list.slice(0, opt.limit);
      head.innerHTML = "";
      if (opt.limit && list.length > opt.limit) {
        const l = document.createElement("label");
        l.innerHTML = '<input type="checkbox"' + (showAll ? " checked" : "") + "> Show all";
        l.querySelector("input").addEventListener("change", e => { showAll = e.target.checked; render(); });
        head.appendChild(l);
      }
      const t = document.createElement("strong"); t.textContent = (opt.title || "") + " (" + (showAll ? list.length : shown.length + " of " + list.length) + ")"; head.appendChild(t);
      const th = cols.map(c => {
        const on = c.key === sortKey, aria = on ? (dir > 0 ? "ascending" : "descending") : "none";
        return `<th scope="col" class="${c.num ? "num" : ""}${c.wrap ? " wrap" : ""}" aria-sort="${aria}"><button type="button" data-key="${SP.esc(c.key)}">${SP.esc(c.label)}<span class="sp-ind" aria-hidden="true">${on ? (dir > 0 ? "▲" : "▼") : ""}</span></button></th>`;
      }).join("");
      const tb = shown.map(({ r }) => "<tr>" + cols.map(c => {
        const v = c.show ? c.show(r) : val(c, r), e = isEmpty(v);
        return `<td class="${c.num ? "num" : ""}${c.wrap ? " wrap" : ""}${e ? " empty" : ""}">${e ? "—" : SP.esc(v)}</td>`;
      }).join("") + "</tr>").join("");
      wrap.innerHTML = `<table class="sp-table"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`;
      wrap.querySelectorAll("th button").forEach(b => b.addEventListener("click", () => {
        const k = b.dataset.key; if (k === sortKey) dir = -dir; else { sortKey = k; dir = 1; }
        render(); const again = wrap.querySelector(`th button[data-key="${CSS.escape(k)}"]`); if (again) again.focus();
      }));
    }
    if (opt.defaultSort) { sortKey = opt.defaultSort.key; dir = opt.defaultSort.dir === "desc" ? -1 : 1; }
    render();
    return { sortBy(k, d) { sortKey = k; dir = d === "desc" ? -1 : 1; render(); }, render };
  }
  window.SP = Object.assign(window.SP || {}, { table });
})();
