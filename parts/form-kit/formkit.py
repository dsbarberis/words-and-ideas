"""Question helper for approval forms (part 1.7). A form's maker script imports it:

    import sys; sys.path.insert(0, "<repo>/parts/form-kit"); from formkit import *
    form("shared-look", "Shared Colours", [
        question("gold", "Which gold?", [opt("B", "B, darker", rec=True), opt("A", "A"), other()],
                 clarify=clar("the plan review, question 4.", "the gold on every deck.")),
    ], subtitle="...", intro_html="<p>...</p>")

Each helper returns the plain dictionaries the template reads, so a form built with it and a
form written by hand are the same file. form() runs the field check and stops on an error.
"""
import json, pathlib
import check_form

__all__ = ["opt", "other", "clar", "question", "items_question", "item", "table", "column", "row", "form", "save"]


def opt(value, label, rec=False, note=None, text=None, prefill=None):
    o = {"value": value, "label": label}
    if rec: o["rec"] = True
    if note: o["note"] = note
    if text: o["text"] = text
    if prefill: o["prefill"] = prefill
    return o


def other(label="Something else", text="What"):
    """The usual last choice, which opens a box for D's own answer."""
    return opt("other", label, text=text)


def clar(where, what, settled=None):
    """Clarify text in the form's fixed order (forms/README.md, rule 3)."""
    return f"Where it came from: {where} What it changes: {what}" + (f" Already settled: {settled}" if settled else "")


def _common(q, section, prompt, details_html, clarify):
    if section: q["section"] = section
    if prompt: q["prompt"] = prompt
    if details_html: q["detailsHtml"] = details_html
    if clarify: q["clarify"] = clarify
    return q


def question(id, title, options, section=None, prompt=None, details_html=None, clarify=None, breach=None):
    q = {"id": id, "title": title, "options": options}
    if breach: q["breach"] = breach   # a new rule: how a breach is found (R-147)
    return _common(q, section, prompt, details_html, clarify)


def item(id, label, options=None, details_html=None):
    it = {"id": id, "label": label}
    if options: it["options"] = options
    if details_html: it["detailsHtml"] = details_html
    return it


def items_question(id, title, items, options=None, section=None, prompt=None, details_html=None, clarify=None):
    q = {"id": id, "title": title, "items": items}
    if options: q["options"] = options
    return _common(q, section, prompt, details_html, clarify)


def column(key, label, bulk_label=None):
    c = {"key": key, "label": label}
    if bulk_label: c["bulkLabel"] = bulk_label
    return c


def row(id, label, cells, rec=None, sub=None, clarify=None, breach=None):
    r = {"id": id, "label": label, "cells": cells}
    if breach: r["breach"] = breach
    if rec: r["rec"] = rec
    if sub: r["sub"] = sub
    if clarify: r["clarify"] = clarify
    return r


def table(id, title, columns, rows, combine=False, combine_label=None, extra=None, section=None, prompt=None, details_html=None, clarify=None):
    q = {"id": id, "title": title, "type": "table", "columns": columns, "rows": rows}
    if combine: q["combine"] = True
    if combine_label: q["combineLabel"] = combine_label
    if extra: q["extra"] = extra
    return _common(q, section, prompt, details_html, clarify)


def form(form_id, title, questions, subtitle=None, intro_html=None, notify=None):
    f = {"formId": form_id, "title": title, "notify": notify}
    if subtitle: f["subtitle"] = subtitle
    if intro_html: f["introHtml"] = intro_html
    f["questions"] = questions
    errors, warnings = check_form.check(f)
    if errors:
        raise ValueError("field check: " + "; ".join(errors))
    for w in warnings: print("warning:", w)
    return f


def save(f, path):
    pathlib.Path(path).write_text(json.dumps(f, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("wrote", path)
