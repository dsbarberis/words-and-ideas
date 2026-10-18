"""Build step (part 1.8): put the shared parts into a page, and its private settings.

A page marks where a part goes with an empty label, in a style or script block:
    /* shared-part: tokens/dist/working.css */ /* /shared-part: tokens/dist/working.css */
or in HTML:
    <!-- shared-part: NAME --><!-- /shared-part: NAME -->
The build copies parts/NAME between the two labels. The labels stay, so the scan
(tools/shared-parts/scan-copies.py in the shared folder) can tell a page built from the
parts from one that keeps its own copy.

Private settings (a Sheet ID, a form address) are written in a page as __NAME__ and filled
from a JSON file kept in the private shared folder, never in this public repository. The
build refuses a settings file inside the repository, and refuses to write a page that
still has an unfilled __NAME__.

Usage: python3 -I parts/build/build_page.py SOURCE.html OUT.html [--settings FILE.json]
"""
import json, pathlib, re, sys

PARTS = pathlib.Path(__file__).resolve().parent.parent
REPO = PARTS.parent
LABEL = re.compile(r"((?:<!--|/\*)\s*shared-part:\s*([\w./-]+)\s*(?:-->|\*/))(.*?)((?:<!--|/\*)\s*/shared-part:\s*\2\s*(?:-->|\*/))", re.S)
MARKER = re.compile(r"__([A-Z][A-Z0-9_]*)__")


class BuildError(Exception):
    pass


def fill_parts(text, parts=PARTS):
    """Copy each labelled part in. Returns (text, names used)."""
    used = []
    def sub(m):
        name = m.group(2)
        home = (parts / name).resolve()
        if parts.resolve() not in home.parents or not home.is_file():
            raise BuildError(f"no part named {name}")
        body = home.read_text(encoding="utf-8").strip()
        if re.search(r"</(script|style)", body, re.I):
            raise BuildError(f"part {name} contains a closing script or style tag")
        used.append(name)
        return m.group(1) + "\n" + body + "\n" + m.group(4)
    return LABEL.sub(sub, text), used


def load_settings(path):
    p = pathlib.Path(path).resolve()
    if p == REPO or REPO in p.parents:
        raise BuildError("the settings file is inside the public repository; keep it in the private shared folder")
    data = json.loads(p.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in data.items()):
        raise BuildError("the settings file must be one JSON object of names to text")
    return data


def fill_settings(text, settings):
    return MARKER.sub(lambda m: settings.get(m.group(1), m.group(0)), text)


def unfilled(text):
    return sorted(set(MARKER.findall(text)))


def build(source_text, settings=None, parts=PARTS):
    """Markers are checked in the page's own text only: the parts may mention a marker by
    name (data.js refuses an address still holding one), and form data is inserted as is."""
    settings = settings or {}
    own = LABEL.sub(lambda m: m.group(1) + m.group(4), source_text)   # the page's text without its parts
    left = [m for m in unfilled(own) if m not in settings]
    if left:
        raise BuildError("unfilled setting(s): " + ", ".join(left))
    text, used = fill_parts(source_text, parts)
    return fill_settings(text, settings), used


def main(argv):
    args = argv[1:]
    settings = None
    if "--settings" in args:
        i = args.index("--settings"); settings = args[i + 1]; del args[i:i + 2]
    if len(args) != 2:
        print(__doc__); return 2
    try:
        settings = load_settings(settings) if settings else {}
        text, used = build(pathlib.Path(args[0]).read_text(encoding="utf-8"), settings)
    except BuildError as e:
        print("build refused:", e); return 1
    pathlib.Path(args[1]).write_text(text, encoding="utf-8")
    print("wrote", args[1], "with parts:", ", ".join(used) or "none")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
