// Integrity gate for schedule data. Run before every build / in CI so malformed
// data can never deploy. Catches the bug classes that have actually bitten us:
// invalid/overflow dates, country codes that don't resolve to a flag, stale "(TBD)"
// knockout rows, bad durations, and duplicate ids.
//
// Usage: node scripts/validate-schedules.mjs   (exits non-zero on any error)

import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const DIRS = ["src/data/schedules", "src/data/schedules-pro"];
const errors = []; // fatal — block the build/deploy
const warnings = []; // advisory — surfaced but non-fatal
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// Tournaments kept fresh by an automated updater — staleness here is a real signal.
const AUTO_UPDATED = new Set(["wc2026"]);

// Which tournaments pick by country (their codes must resolve in countries.ts).
const tournaments = JSON.parse(readFileSync("src/data/tournaments.json", "utf8"));
const countryTournaments = new Set(
  tournaments.filter((t) => t.selectionType === "country").map((t) => t.id)
);

// Valid country codes, parsed straight from countries.ts source.
const countriesSrc = readFileSync("src/data/countries.ts", "utf8");
const validCountryCodes = new Set(
  [...countriesSrc.matchAll(/code:\s*"([A-Z]{3})"/g)].map((m) => m[1])
);

function checkDate(file, ev) {
  const d = new Date(ev.dateUTC);
  if (isNaN(d.getTime())) {
    err(file, `${ev.id}: unparseable dateUTC "${ev.dateUTC}"`);
    return;
  }
  // Reject silent month/day rollover (e.g. "2026-06-31" -> July 1).
  const written = String(ev.dateUTC).slice(0, 10);
  const normalized = d.toISOString().slice(0, 10);
  if (written !== normalized) {
    err(file, `${ev.id}: dateUTC "${ev.dateUTC}" rolls over to ${normalized} (invalid calendar date)`);
  }
}

function validateFile(file) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    err(file, `invalid JSON: ${e.message}`);
    return;
  }
  if (!Array.isArray(data) || data.length === 0) {
    err(file, "expected a non-empty array of events");
    return;
  }

  const seen = new Set();
  const now = Date.now();
  for (const ev of data) {
    if (!ev.id) {
      err(file, `event with missing id (summary: ${ev.summary})`);
      continue;
    }
    if (seen.has(ev.id)) err(file, `duplicate id "${ev.id}"`);
    seen.add(ev.id);

    if (!ev.summary) err(file, `${ev.id}: missing summary`);
    checkDate(file, ev);

    if (!(Number(ev.durationMinutes) > 0)) {
      err(file, `${ev.id}: durationMinutes must be > 0 (got ${ev.durationMinutes})`);
    }

    // Country tournaments: every involved code must resolve to a flag/name.
    if (countryTournaments.has(ev.tournamentId)) {
      for (const code of ev.countryCodesInvolved || []) {
        if (!validCountryCodes.has(code)) {
          err(file, `${ev.id}: country code "${code}" not found in countries.ts`);
        }
      }
    }

    // Freshness signal for auto-updated tournaments: a knockout in the past should
    // have two resolved teams. Advisory only — tolerates brief provider lag.
    const t = new Date(ev.dateUTC).getTime();
    if (AUTO_UPDATED.has(ev.tournamentId) && ev.isKnockout && t < now) {
      const unresolved = /\(TBD\)/.test(ev.summary || "") || (ev.countryCodesInvolved || []).length < 2;
      if (unresolved) {
        warn(file, `${ev.id}: knockout match in the past isn't fully resolved — updater may be stale`);
      }
    }
  }
}

let files = 0;
for (const dir of DIRS) {
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    files++;
    validateFile(join(dir, f));
  }
}

if (warnings.length) {
  console.warn(`⚠ ${warnings.length} warning${warnings.length > 1 ? "s" : ""}:`);
  for (const w of warnings) console.warn("  - " + w);
}
if (errors.length) {
  console.error(`✗ Schedule validation failed (${errors.length} issue${errors.length > 1 ? "s" : ""}):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ Schedule validation passed (${files} files).`);
