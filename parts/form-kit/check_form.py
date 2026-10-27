"""Field check for approval form files (part 1.7): python3 -I parts/form-kit/check_form.py FORM.json [...]

Checks a form's JSON against what the template reads (forms/README.md in the shared folder
describes the fields). Errors would break the page or lose an answer, and stop the build.
Errors also cover a form that doesn't say who its Submit tells, and a real choice with no For and
Against table (R-158). Warnings are worth a look but do not stop it; one is a new rule with no breach line. Exit 1 if any file has an error.
"""
import json, pathlib, re, sys

ID = re.compile(r"^[\w-]+$")   # no dots: answers are keyed "question.item"
TOP = {"formId", "title", "subtitle", "introHtml", "questions", "notify"}
Q = {"id", "section", "title", "prompt", "detailsHtml", "clarify", "options", "items", "type", "columns", "rows", "combine", "combineLabel", "extra", "noRec", "breach", "newRule", "realChoice", "supportHtml", "html"}
OPT = {"value", "label", "note", "rec", "text", "prefill"}
ITEM = {"id", "label", "detailsHtml", "options", "clarify"}
COL = {"key", "label", "bulkLabel"}
ROW = {"id", "label", "sub", "cells", "rec", "clarify", "breach", "newRule"}


def _html(q):
    """The question's own details, where a For and Against table would be."""
    return " ".join(str(q.get(k) or "") for k in ("detailsHtml", "supportHtml", "html")) + " ".join(
        str(o.get("detailsHtml") or "") for o in q.get("options", []) if isinstance(o, dict))


def _for_against(h):
    cells = [re.sub(r"[^a-z]", "", re.sub(r"<[^>]+>|&nbsp;|&#160;", " ", x).lower())[:7]
             for x in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", h, re.S | re.I)]
    return any(c.startswith("for") and not c.startswith("form") for c in cells) and any(c.startswith("against") for c in cells)


def _rules(q):
    """The new rules a question proposes: its rows when it is a table, else the question itself."""
    marked = q.get("newRule") or "new rule" in str(q.get("section", "")).lower()
    rows = [r for r in q.get("rows", []) if isinstance(r, dict)]
    if rows:
        return [r for r in rows if marked or r.get("newRule")]
    return [q] if marked else []


def check(form):
    errors, warnings = [], []
    E, W = errors.append, warnings.append
    def s(v): return isinstance(v, str) and v.strip() != ""
    def unknown(obj, allowed, where):
        for k in obj:
            if k not in allowed: W(f"{where}: unknown field '{k}' (the template ignores it)")
    def options(opts, where):
        if not isinstance(opts, list) or not opts: E(f"{where}: needs a non-empty options list"); return
        seen, recs = set(), 0
        for i, o in enumerate(opts):
            w = f"{where}, option {i + 1}"
            if not isinstance(o, dict): E(f"{w}: not an object"); continue
            unknown(o, OPT, w)
            if not isinstance(o.get("value"), (str, int)) or o.get("value") == "": E(f"{w}: needs a value")
            elif o["value"] in seen: E(f"{w}: value '{o['value']}' is used twice")
            else: seen.add(o["value"])
            if not s(o.get("label")): E(f"{w}: needs a label")
            if o.get("rec") is True: recs += 1
            elif "rec" in o and o["rec"] is not False: E(f"{w}: rec must be true or false")
            if "text" in o and not s(o["text"]): E(f"{w}: text (the box's placeholder) must be words")
            if "prefill" in o and "text" not in o: E(f"{w}: prefill without text (no box opens to show it)")
        if recs > 1: E(f"{where}: {recs} options are marked recommended; at most one")
    if not isinstance(form, dict): return ["the file is not one JSON object"], []
    unknown(form, TOP, "form")
    if not (isinstance(form.get("formId"), str) and ID.match(form["formId"])): E("form: formId must be letters, digits, - or _")
    if not s(form.get("title")): E("form: needs a title")
    # Submit Tells Claude: a form says who its Submit tells; "notify": null means no one (the Architect's
    # "Refuse", Oct 27, 2026). The kit's page cannot tell anyone yet, so a form that names a desk is
    # built with the shared folder's own form builder until it can.
    if "notify" not in form: E('form: does not say who its Submit tells; add "notify": null if no one needs telling')
    elif form["notify"] is not None: E("form: names a desk to tell on Submit, which the kit's page cannot do yet; build it with the shared folder's form builder")
    qs = form.get("questions")
    if not isinstance(qs, list) or not qs: E("form: needs a non-empty questions list"); return errors, warnings
    ids = set()
    for n, q in enumerate(qs, 1):
        w = f"Q{n}"
        if not isinstance(q, dict): E(f"{w}: not an object"); continue
        unknown(q, Q, w)
        qid = q.get("id")
        if not (isinstance(qid, str) and ID.match(qid)): E(f"{w}: id must be letters, digits, - or _")
        elif qid in ids: E(f"{w}: id '{qid}' is used twice")
        else: ids.add(qid)
        if not s(q.get("title")): E(f"{w}: needs a title")
        if "clarify" in q and not s(q["clarify"]): E(f"{w}: clarify must be words")
        # Pros and Cons on Every Real Choice (R-158): a real choice shows a For and Against table.
        if (q.get("realChoice") or "real choice" in str(q.get("section", "")).lower()) and not _for_against(_html(q)):
            E(f"{w}: a real choice with no For and Against table in its details (R-158)")
        # The Counter Ladder (R-147): every new rule says how a breach is found.
        for x in _rules(q):
            if not s(x.get("breach")): W(f"{w}: {x.get('id') or x.get('label')}: a new rule with no \"How a breach is found\" line; add \"breach\" to it")
        # The template reads items first (they may share the question's options), then a table.
        kinds = (["items"] if "items" in q else []) + (["table"] if q.get("type") == "table" else []) + (["options"] if "options" in q and "items" not in q and q.get("type") != "table" else [])
        if "type" in q and q["type"] != "table": E(f"{w}: unknown type '{q['type']}'")
        if len(kinds) != 1: E(f"{w}: needs exactly one of options, items or type \"table\" (has {', '.join(kinds) or 'none'})"); continue
        if kinds == ["options"]: options(q["options"], w)
        elif kinds == ["items"]:
            items = q["items"]
            if not isinstance(items, list) or not items: E(f"{w}: items must be a non-empty list"); continue
            iids = set()
            for i, it in enumerate(items, 1):
                wi = f"{w}, item {i}"
                if not isinstance(it, dict): E(f"{wi}: not an object"); continue
                unknown(it, ITEM, wi)
                if not (isinstance(it.get("id"), str) and ID.match(it["id"])): E(f"{wi}: id must be letters, digits, - or _")
                elif it["id"] in iids or it["id"] == "comment": E(f"{wi}: id '{it['id']}' is used twice or is reserved")
                else: iids.add(it["id"])
                if not s(it.get("label")): E(f"{wi}: needs a label")
                if "options" in it: options(it["options"], wi)
                elif "options" in q: options(q["options"], w)
                else: E(f"{wi}: has no options, and the question has none to share")
        else:
            cols, rows = q.get("columns"), q.get("rows")
            keys = []
            if not isinstance(cols, list) or not cols: E(f"{w}: a table needs columns"); continue
            for i, c in enumerate(cols, 1):
                if not isinstance(c, dict): E(f"{w}, column {i}: not an object"); continue
                unknown(c, COL, f"{w}, column {i}")
                if not s(c.get("key")): E(f"{w}, column {i}: needs a key")
                elif c["key"] in keys or c["key"] == "combine": E(f"{w}, column {i}: key '{c['key']}' is used twice or is reserved")
                else: keys.append(c["key"])
                if not s(c.get("label")): E(f"{w}, column {i}: needs a label")
            if not isinstance(rows, list) or not rows: E(f"{w}: a table needs rows"); continue
            ex = q.get("extra")
            if ex is not None:
                if not (isinstance(ex, dict) and s(ex.get("value")) and s(ex.get("label"))): E(f"{w}: extra needs a value and a label")
                elif ex["value"] in keys or ex["value"] == "combine": E(f"{w}: extra's value '{ex['value']}' is also a column")
            rids = set()
            for i, r in enumerate(rows, 1):
                wr = f"{w}, row {i}"
                if not isinstance(r, dict): E(f"{wr}: not an object"); continue
                unknown(r, ROW, wr)
                if r.get("id") in (None, "") or not ID.match(str(r["id"])): E(f"{wr}: id must be letters, digits, - or _")
                elif str(r["id"]) in rids or r["id"] == "comment": E(f"{wr}: id '{r['id']}' is used twice or is reserved")
                else: rids.add(str(r["id"]))
                if not s(r.get("label")): E(f"{wr}: needs a label")
                cells = r.get("cells")
                if not isinstance(cells, dict): E(f"{wr}: needs cells keyed by column"); continue
                for k in cells:
                    if k not in keys: E(f"{wr}: cell '{k}' has no column")
                if "rec" in r and r["rec"] not in keys and not (ex and r["rec"] == ex.get("value")): E(f"{wr}: rec '{r['rec']}' is not a column")
                if not any(isinstance(cells.get(k), str) and cells[k].strip() for k in keys) and not ex and not q.get("combine"):
                    E(f"{wr}: every cell is empty, so the row can't be answered")
    return errors, warnings


def main(paths):
    bad = 0
    for p in paths:
        try: form = json.loads(pathlib.Path(p).read_text(encoding="utf-8"))
        except (OSError, ValueError) as e: print(f"{p}: ERROR can't read: {e}"); bad += 1; continue
        errors, warnings = check(form)
        for e in errors: print(f"{p}: ERROR {e}")
        for w in warnings: print(f"{p}: warning {w}")
        if errors: bad += 1
        else: print(f"{p}: ok" + (f" ({len(warnings)} warning(s))" if warnings else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    if len(sys.argv) < 2: print(__doc__); sys.exit(2)
    sys.exit(main(sys.argv[1:]))
