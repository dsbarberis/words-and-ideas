"""Build an approval form page on the shared parts (part 1.7).

Usage: python3 -I parts/form-kit/build-form.py FORM.json OUT.html --zones TIME-ZONES.json

TIME-ZONES.json is Setup's zone file in the shared folder (settings/time-zones.json): times on the
page are shown in its "architect" zone, with zone letters. The zone is never assumed.

Runs the field check first and refuses a form with errors. Then puts the shared parts and
the form's data into template.html with the build step (parts/build/build_page.py). The
page looks and saves exactly as one built by forms/build-form.py in the shared folder.
Form files stay in the private shared folder; only the kit lives in this public repository.
"""
import html, json, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE)); sys.path.insert(0, str(HERE.parent / "build"))
import check_form, build_page  # noqa: E402


def build_form(data, zone=None):
    errors, _ = check_form.check(data)
    if errors:
        raise build_page.BuildError("the field check found: " + "; ".join(errors))
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    page, _ = build_page.build((HERE / "template.html").read_text(encoding="utf-8"),
                               dict({"TITLE": html.escape(data["title"], quote=False), "DATA": blob}, **({"TIME_ZONE": zone} if zone else {})))
    return page


def main(argv):
    argv = list(argv); zone = None
    if "--zones" in argv:
        i = argv.index("--zones"); zone = json.loads(pathlib.Path(argv[i + 1]).read_text(encoding="utf-8"))["architect"]; del argv[i:i + 2]
    if len(argv) != 3:
        print(__doc__); return 2
    data = json.loads(pathlib.Path(argv[1]).read_text(encoding="utf-8"))
    try:
        page = build_form(data, zone)
    except build_page.BuildError as e:
        print("build refused:", e); return 1
    pathlib.Path(argv[2]).write_text(page, encoding="utf-8")
    print("wrote", argv[2]); return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
