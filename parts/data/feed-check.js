// Shared part 1.11: the data feed check (Tools and tests desk, owner of the data feed since Oct 20, 2026).
// Is the class Google Sheet still receiving good rows? It only reads; it never changes a row.
// A page that already reads the Google Sheet (the Class Results Dashboard) calls it on the rows it has:
//   const r = SP.feedCheck(rows, FEED, saved, { now: new Date(), term: {first, last}, zone: "America/Chicago" });
//   rows: the Google Sheet as a list of lists, header row first (SP.parseCsv gives this).
//   FEED: the agreement's checkable parts, filled at build time from the data feed settings
//         (header, decks, passModes, testNames, gapDays, sheetTimeZone). No address or ID.
//   saved: what the last call returned as r.state (null the first time).
// r.faults: plain sentences, empty when all is well. r.kinds: one code per fault, in the same order: header,
// empty, unread, stale (the check had not run), deck, mode, test, norows, gap. r.state: counts and times only.
// Faults: the header row changed; a row added since the last check names a deck or pass mode outside the
// agreement, or carries a test name; no row for gapDays days during term (all year without term dates);
// the check had not run for more than two days. It names decks and pass modes, never a student, and does not
// quote a test name either (a name is a cell a student typed); the row can be found in the Google Sheet.
// Rows are "added since the last check" when their Timestamp is newer than the newest one seen last time.
// The first call only records where things stand.
(function (SP) {
  const TS = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/;
  const DAY = 86400000;

  // The Google Sheet writes times in its own zone; turn one into an absolute time.
  function offsetMs(zone, ms) {
    const p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })
      .formatToParts(new Date(ms)).forEach(x => { p[x.type] = x.value; });
    return Date.UTC(+p.year, p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - ms;
  }
  function parseStamp(s, zone) {
    const m = TS.exec(String(s || "").trim());
    if (!m) return null;
    const wall = Date.UTC(+m[3], m[1] - 1, +m[2], +m[4], +m[5], +m[6]);
    let t = wall - offsetMs(zone, wall);
    t = wall - offsetMs(zone, t);  // second pass settles the hour around a clock change
    return t;
  }
  // Times people read: the zone's local time with zone letters, as "Oct 20, 10:00 a.m. CDT".
  function localTime(ms, zone) {
    const p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: zone, month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" })
      .formatToParts(new Date(ms)).forEach(x => { p[x.type] = x.value; });
    const t = p.hour === "12" && p.minute === "00" && p.dayPeriod === "PM" ? "noon" : p.hour + ":" + p.minute + " " + (p.dayPeriod === "AM" ? "a.m." : "p.m.");
    return p.month + " " + p.day + ", " + t + " " + p.timeZoneName;
  }
  function dayIn(ms, zone) {
    const p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(ms)).forEach(x => { p[x.type] = x.value; });
    return p.year + "-" + p.month + "-" + p.day;
  }
  const addDays = (iso, n) => new Date(Date.parse(iso + "T00:00:00Z") + n * DAY).toISOString().slice(0, 10);
  const isTestName = (n, r) => { n = String(n || "").trim().toLowerCase(); return (r.contains || []).some(c => n.includes(c)) || (r.startsWith || []).some(s => n.startsWith(s)); };

  // The test-name rule in words, from the settings: one containing "sample" or beginning with "test".
  const testRule = r => {
    const q = a => a.map(x => "\"" + x + "\"").join(" or ");
    const parts = [(r.contains || []).length ? "containing " + q(r.contains) : "", (r.startsWith || []).length ? "beginning with " + q(r.startsWith) : ""].filter(Boolean);
    return parts.length ? "one " + parts.join(" or ") : "a name the settings mark as a test";
  };
  SP.feedCheck = function (rows, feed, saved, opts) {
    opts = opts || {};
    const now = +(opts.now || new Date()), zone = feed.sheetTimeZone || "America/Chicago", shown = opts.zone || zone;
    const faults = [], kinds = [], prev = saved || {};
    const add = (k, t) => { kinds.push(k); faults.push(t); };
    if (!rows || !rows.length) return { faults: ["The Google Sheet came back empty: no header row and no rows."], kinds: ["empty"], state: prev };
    const want = feed.header, header = rows[0].map(h => String(h).trim()), body = rows.slice(1);
    const headerOk = want.every((h, i) => header[i] === h) && header.slice(want.length).every(h => !h);
    if (!headerOk) add("header", "The Google Sheet's header row has changed: expected " + want.join(" | ") + "; found " + header.join(" | ") + ".");

    const stamps = body.map(r => parseStamp(r[0], zone));
    const unread = stamps.filter(t => t == null).length;
    if (unread) add("unread", unread + " row(s) have a Timestamp the check cannot read.");
    const newest = stamps.reduce((a, t) => (t != null && (a == null || t > a) ? t : a), null);

    if (prev.lastRun && now - Date.parse(prev.lastRun) > 2 * DAY) add("stale", "The feed check had not run since " + localTime(Date.parse(prev.lastRun), shown) + ".");

    const last = prev.newestRow ? Date.parse(prev.newestRow) : null;
    if (headerOk && last != null) {
      const decks = new Set(feed.decks), modes = feed.passModes.map(p => new RegExp(p));
      let tests = 0;
      const odd = { deck: {}, mode: {} }, bump = (o, k) => { o[k] = (o[k] || 0) + 1; };
      body.forEach((r, i) => {
        if (stamps[i] == null || stamps[i] <= last || r.length < want.length) return;
        const d = String(r[1]).trim(), n = r[2], m = String(r[3]).trim();
        if (!decks.has(d)) bump(odd.deck, d);
        if (!modes.some(re => re.test(m))) bump(odd.mode, m);
        if (isTestName(n, feed.testNames || {})) tests++;
      });
      Object.keys(odd.deck).sort().forEach(d => add("deck", odd.deck[d] + " new row(s) name a deck not in the row agreement: \"" + d + "\"."));
      Object.keys(odd.mode).sort().forEach(m => add("mode", odd.mode[m] + " new row(s) have a pass mode not in the row agreement: \"" + m + "\"."));
      if (tests) add("test", tests + " new row(s) carry a test name (" + testRule(feed.testNames || {}) + "). Test rows must never reach the class Google Sheet.");
    }

    const gap = feed.gapDays || 3, term = opts.term || feed.term || {}, today = dayIn(now, zone);
    let inTerm = !(term.first && term.last) || (term.first <= today && today <= term.last);
    if (inTerm && term.first && addDays(term.first, gap) > today) inTerm = false;  // give a new term gapDays first
    if (inTerm) {
      if (newest == null) add("norows", "The Google Sheet has no rows with a readable Timestamp.");
      else if (now - newest > gap * DAY) add("gap", "No new row since " + localTime(newest, shown) + ": more than " + gap + " days.");
    }
    const keep = [newest, last].filter(t => t != null);
    return { faults: faults, kinds: kinds, state: { lastRun: new Date(now).toISOString(), rows: body.length, newestRow: keep.length ? new Date(Math.max.apply(null, keep)).toISOString() : null, faults: faults.length } };
  };
})(typeof window !== "undefined" ? (window.SP = window.SP || {}) : module.exports);
