"""Build an approval form page from the shared template and one form's data.

Usage: python3 build-form.py <form.json> <output.html>

The template (approval-form-template.html) is the same for every form; each
proposal gets its own JSON file of questions. See README.md in this folder.
"""
import json
import pathlib
import sys

here = pathlib.Path(__file__).parent
data = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
template = (here / "approval-form-template.html").read_text(encoding="utf-8")
blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
page = template.replace("__TITLE__", data["title"]).replace("__DATA__", blob)
pathlib.Path(sys.argv[2]).write_text(page, encoding="utf-8")
print("wrote", sys.argv[2])
