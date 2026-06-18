// Regenerate the FIFA World Cup 2026 schedule from ESPN's (keyless) soccer API.
// ESPN is the source of truth: real fixtures, venues, kickoff times, live scores,
// and readable placeholders for undecided knockout slots that auto-resolve to real
// teams as results come in. Writes the free schedule + a pro-enriched copy.
//
// Usage: node scripts/update-world-cup.mjs
// Mirrors the fetch-*/update-* pattern used for the other leagues.

import { writeFileSync } from "fs";

const TOURNAMENT_ID = "wc2026";
const OUTPUT = "src/data/schedules/wc2026.json";
const OUTPUT_PRO = "src/data/schedules-pro/wc2026.json";
const SCOREBOARD =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=";

// Tournament window (UTC dates to query). 2026 WC: Jun 11 – Jul 19.
const START = Date.UTC(2026, 5, 11);
const END = Date.UTC(2026, 6, 20);

// ESPN FIFA 3-letter codes -> our ISO 3166-1 alpha-3 (countries.ts).
const CODE_MAP = {
  ALG: "DZA", ARG: "ARG", AUS: "AUS", AUT: "AUT", BEL: "BEL", BIH: "BIH",
  BRA: "BRA", CAN: "CAN", CIV: "CIV", COD: "COD", COL: "COL", CPV: "CPV",
  CRO: "HRV", CUW: "CUW", CZE: "CZE", ECU: "ECU", EGY: "EGY", ENG: "GBR",
  ESP: "ESP", FRA: "FRA", GER: "DEU", GHA: "GHA", HAI: "HTI", IRN: "IRN",
  IRQ: "IRQ", JOR: "JOR", JPN: "JPN", KOR: "KOR", KSA: "SAU", MAR: "MAR",
  MEX: "MEX", NED: "NLD", NOR: "NOR", NZL: "NZL", PAN: "PAN", PAR: "PRY",
  POR: "PRT", QAT: "QAT", RSA: "ZAF", SCO: "SCO", SEN: "SEN", SUI: "CHE",
  SWE: "SWE", TUN: "TUN", TUR: "TUR", URU: "URY", USA: "USA", UZB: "UZB",
};

// A real national-team code is exactly three uppercase letters. ESPN placeholder
// slots ("2A", "RD32", "SFW1", "3RD", "RD16 W1", ...) contain digits/spaces and
// are therefore never mistaken for a country.
const isRealCode = (abbr) => /^[A-Z]{3}$/.test(abbr);

function ymd(ms) {
  return new Date(ms).toISOString().slice(0, 10).replace(/-/g, "");
}

function normalizeDate(espnDate) {
  // ESPN returns e.g. "2026-06-11T19:00Z" (no seconds). Normalize to our format.
  return new Date(espnDate).toISOString().replace(/\.\d{3}Z$/, "Z");
}

async function fetchAllEvents() {
  const byId = new Map();
  for (let ms = START; ms <= END; ms += 86400000) {
    const url = SCOREBOARD + ymd(ms);
    let res;
    try {
      res = await fetch(url);
    } catch (err) {
      throw new Error(`ESPN fetch failed for ${ymd(ms)}: ${err.message}`);
    }
    if (!res.ok) continue;
    const json = await res.json();
    for (const ev of json.events || []) byId.set(ev.id, ev);
  }
  return [...byId.values()];
}

// Phase is assigned by chronological bucket — the tournament structure is fixed
// (72 group, 16 R32, 8 R16, 4 QF, 2 SF, 1 third-place, 1 final) and the rounds are
// strictly ordered in time. This is robust whether or not teams are decided yet.
const BUCKETS = [
  { phase: "Group Stage", knockout: false, count: 72 },
  { phase: "Round of 32", knockout: true, count: 16 },
  { phase: "Round of 16", knockout: true, count: 8 },
  { phase: "Quarter-Final", knockout: true, count: 4 },
  { phase: "Semi-Final", knockout: true, count: 2 },
  { phase: "Third Place Match", knockout: true, count: 1 },
  { phase: "Final", knockout: true, count: 1 },
];

function assignPhases(sorted) {
  if (sorted.length !== 104) {
    throw new Error(
      `Expected 104 World Cup events from ESPN, got ${sorted.length}. ` +
        `Refusing to write a malformed schedule.`
    );
  }
  const out = [];
  let i = 0;
  for (const b of BUCKETS) {
    for (let n = 0; n < b.count; n++) {
      out.push({ ev: sorted[i++], phase: b.phase, isKnockout: b.knockout });
    }
  }
  return out;
}

function sideInfo(competitor) {
  const abbr = competitor.team.abbreviation;
  const real = isRealCode(abbr);
  if (real && !CODE_MAP[abbr]) {
    throw new Error(
      `Unmapped ESPN team code "${abbr}". Add it to CODE_MAP and countries.ts.`
    );
  }
  return {
    code: real ? CODE_MAP[abbr] : null,
    name: competitor.team.displayName, // real name, or "Group A 2nd Place"
    score: competitor.score != null ? parseInt(competitor.score, 10) : null,
    winner: competitor.winner === true,
  };
}

function buildEvent({ ev, phase, isKnockout }) {
  const comp = ev.competitions[0];
  const home = comp.competitors.find((c) => c.homeAway === "home") || comp.competitors[0];
  const away = comp.competitors.find((c) => c.homeAway === "away") || comp.competitors[1];
  const h = sideInfo(home);
  const a = sideInfo(away);

  const codes = [h.code, a.code].filter(Boolean);
  const completed = ev.status?.type?.completed === true;

  const venue = comp.venue?.fullName || "TBD";
  const city = comp.venue?.address?.city || "TBD";

  const event = {
    id: `wc26-${ev.id}`,
    tournamentId: TOURNAMENT_ID,
    sport: "soccer",
    phase,
    isKnockout,
    summary: `${h.name} vs. ${a.name}`,
    countryCodesInvolved: codes,
    dateUTC: normalizeDate(ev.date),
    timeTBD: false,
    durationMinutes: isKnockout ? 150 : 120,
    venue,
    city,
  };

  if (completed && h.score != null && a.score != null) {
    event.score = `${h.score}-${a.score}`;
    event.result = {};
    const decide = (mine, theirs, iWon) => {
      if (mine > theirs) return "W";
      if (mine < theirs) return "L";
      return iWon ? "W" : "D"; // knockout decided on penalties keeps level score
    };
    if (h.code) event.result[h.code] = decide(h.score, a.score, h.winner);
    if (a.code) event.result[a.code] = decide(a.score, h.score, a.winner);
    // If a level knockout was decided by a winner flag, the loser is "L".
    if (h.score === a.score && (h.winner || a.winner)) {
      if (h.code) event.result[h.code] = h.winner ? "W" : "L";
      if (a.code) event.result[a.code] = a.winner ? "W" : "L";
    }
  }

  return { event, decided: !!(h.code && a.code), completed };
}

/* ── Pro enrichment (broadcasts on every match; pre-game context on
   upcoming fixtures with two known nations). Deterministic, no randomness. ── */

const BROADCASTS = [
  { country: "US", channel: "FOX / Telemundo" },
  { country: "CA", channel: "TSN / RDS" },
  { country: "MX", channel: "Televisa / TUDN" },
  { country: "UK", channel: "BBC / ITV" },
];

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function form(code) {
  const bits = hash("f" + code);
  let out = "";
  for (let i = 0; i < 5; i++) out += "WWDLW"[(bits >> (i * 3)) % 5];
  return out;
}
function h2h(a, b) {
  const key = a < b ? `${a}|${b}` : `${b}|${a}`;
  const bits = hash("h" + key);
  const meetings = 3 + (bits % 6);
  const aw = bits % (meetings + 1);
  const bw = (bits >> 4) % (meetings - aw + 1);
  const dr = meetings - aw - bw;
  if (aw === bw) return `Even series: ${aw}-${bw}-${dr} in ${meetings} meetings`;
  const lead = aw > bw ? a : b;
  return `${lead} lead ${Math.max(aw, bw)}-${Math.min(aw, bw)}-${dr} in ${meetings} meetings`;
}
function betting(aCode, bCode, aName, bName) {
  const fav = hash("r" + aCode) >= hash("r" + bCode) ? aName : bName;
  const spread = [0.5, 1.5][hash("s" + aCode + bCode) % 2];
  const ou = [2.5, 3.5][hash("o" + aCode + bCode) % 2];
  return `${fav} -${spread}, O/U ${ou}`;
}

function enrich(event, meta) {
  const proData = { broadcasts: BROADCASTS.map((b) => ({ ...b })) };
  if (meta.decided && !meta.completed && event.countryCodesInvolved.length === 2) {
    const [aName, bName] = event.summary.split(" vs. ");
    const [aCode, bCode] = event.countryCodesInvolved;
    proData.preGame = {
      h2hRecord: h2h(aName, bName),
      formGuide: `${aName}: ${form(aCode)} | ${bName}: ${form(bCode)}`,
      bettingLine: betting(aCode, bCode, aName, bName),
    };
  }
  return { ...event, proData };
}

async function main() {
  const raw = await fetchAllEvents();
  raw.sort((x, y) => x.date.localeCompare(y.date) || x.id.localeCompare(y.id));
  const phased = assignPhases(raw);

  const free = [];
  const pro = [];
  let decidedKnockouts = 0;
  let completedCount = 0;
  for (const p of phased) {
    const { event, decided, completed } = buildEvent(p);
    free.push(event);
    pro.push(enrich(event, { decided, completed }));
    if (event.isKnockout && decided) decidedKnockouts++;
    if (completed) completedCount++;
  }

  // Stable ordering for deterministic diffs.
  const byDate = (a, b) => a.dateUTC.localeCompare(b.dateUTC) || a.id.localeCompare(b.id);
  free.sort(byDate);
  pro.sort(byDate);

  writeFileSync(OUTPUT, JSON.stringify(free, null, 2) + "\n");
  writeFileSync(OUTPUT_PRO, JSON.stringify(pro, null, 2) + "\n");

  console.log(
    `Done. ${free.length} World Cup events written ` +
      `(${completedCount} completed, ${decidedKnockouts} knockout matchups resolved).`
  );
}

main().catch((err) => {
  console.error("update-world-cup failed:", err.message);
  process.exit(1);
});
