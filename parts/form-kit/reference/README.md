# Reference: the form kit before the shared parts

Copies of `forms/approval-form-template.html` and `forms/build-form.py` from the project's
shared folder, as they stood on Oct 18, 2026, when the kit moved onto the shared parts
(part 1.7). The saved test (`parts/tests/test-form-kit.js`) builds the same form both ways
and checks the two pages look the same and read and write the same data.

Never edit these to make the test pass. When the architect approves a change to how forms
look, the change goes into `../template.html`, and the test's comparison is updated with it.
