// Page shell (part 1.3): small helpers every page uses, drawn once.
// window.SP = { esc, theme, status, STATUS, dialog, tabs, nextUnanswered, titleCase }
(function () {
  // Escape text before it goes into HTML. Every page had its own copy (inventory, section 2).
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Light, dark, or the device's setting. A chosen theme is a per-viewer convenience, so it
  // lives in browser storage, and the page works without it.
  const THEME_KEY = "sp-theme";
  function theme(set) {
    const root = document.documentElement;
    if (set === "light" || set === "dark") root.setAttribute("data-theme", set);
    else if (set === "device") root.removeAttribute("data-theme");
    if (set !== undefined) { try { set === "device" ? localStorage.removeItem(THEME_KEY) : localStorage.setItem(THEME_KEY, set); } catch (e) {} }
    return root.getAttribute("data-theme") || "device";
  }
  try { const t = localStorage.getItem(THEME_KEY); if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t); } catch (e) {}

  // Status line wording, the same on every page (general design checklist, section 5).
  // DRAFT wording, to go to the architect before the first page uses it.
  const STATUS = {
    loading: ["Loading…", ""],
    saved: ["Saved", "ok"],
    saving: ["Saving…", ""],
    cantRead: ["Couldn't read your saved work. Reload the page to try again.", "bad"],
    cantSave: ["Couldn't save. Your changes are kept on this page until saving works again.", "bad"],
    notHere: ["This page can't save in this view. Open it from the project while signed in.", "warn"],
  };
  function status(el, key, extra) {
    const s = STATUS[key]; if (!s) throw new Error("unknown status " + key);
    el.classList.add("sp-status"); el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
    el.textContent = s[0] + (extra ? " " + extra : "");
    if (s[1]) el.dataset.kind = s[1]; else delete el.dataset.kind;
  }

  // Dialog: native <dialog>; Escape closes it; focus goes back to what opened it.
  function dialog(title, bodyHtml) {
    const d = document.createElement("dialog"); d.className = "sp-dialog";
    d.setAttribute("aria-label", title);
    d.innerHTML = '<button type="button" class="sp-close" aria-label="Close">Close</button><h2>' + esc(title) + "</h2>" + bodyHtml;
    const back = document.activeElement;
    d.querySelector(".sp-close").addEventListener("click", () => d.close());
    d.addEventListener("close", () => { d.remove(); if (back && back.focus) back.focus(); });
    document.body.appendChild(d); d.showModal();
    return d;
  }

  // Tabs: role=tablist on a container of buttons, each with data-panel naming its panel's id.
  // Arrow keys, Home and End move between tabs (the W3C tabs pattern).
  function tabs(list, onChange) {
    list.classList.add("sp-tabs"); list.setAttribute("role", "tablist");
    const all = [...list.querySelectorAll("button")];
    function select(t, focus) {
      all.forEach(b => { const on = b === t; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1;
        const p = document.getElementById(b.dataset.panel); if (p) p.hidden = !on; });
      if (focus) t.focus();
      if (onChange) onChange(t.dataset.panel);
    }
    all.forEach((b, i) => {
      b.setAttribute("role", "tab"); b.type = "button";
      const p = document.getElementById(b.dataset.panel);
      if (p) { p.setAttribute("role", "tabpanel"); if (!b.id) b.id = "tab-" + b.dataset.panel; p.setAttribute("aria-labelledby", b.id); b.setAttribute("aria-controls", p.id); }
      b.addEventListener("click", () => select(b));
      b.addEventListener("keydown", e => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: all.length - 1 }[e.key];
        if (k === undefined) return; e.preventDefault(); select(all[(k + all.length) % all.length], true);
      });
    });
    select(all.find(b => b.getAttribute("aria-selected") === "true") || all[0]);
    return { select: name => select(all.find(b => b.dataset.panel === name)) };
  }

  // "Next Unanswered": one name and one behaviour on every page (checklist section 3).
  // items() returns the elements in order; open(el) says whether one still needs an answer.
  function nextUnanswered(button, items, open) {
    button.classList.add("sp-next"); button.type = "button"; button.textContent = "Next Unanswered";
    function refresh() { button.disabled = !items().some(open); }
    button.addEventListener("click", () => {
      const list = items(), y = window.scrollY + 1;
      const next = list.find(e => open(e) && e.getBoundingClientRect().top + window.scrollY > y + 8) || list.find(open);
      if (!next) return;
      next.scrollIntoView({ block: "center" });
      const f = next.querySelector("input, button, select, textarea, [tabindex]"); (f || next).focus({ preventScroll: true });
    });
    refresh();
    return { refresh };
  }

  // Title case in Apple's style, for buttons, tabs and menu titles (checklist section 3).
  const SMALL = /^(a|an|the|and|but|or|nor|for|so|yet|as|at|by|in|of|off|on|out|per|to|up|via)$/i;
  function titleCase(s) {
    const w = String(s).split(" ");
    return w.map((x, i) => (i > 0 && i < w.length - 1 && SMALL.test(x)) ? x.toLowerCase() : x.charAt(0).toUpperCase() + x.slice(1)).join(" ");
  }

  window.SP = { esc, theme, status, STATUS, dialog, tabs, nextUnanswered, titleCase };
})();
