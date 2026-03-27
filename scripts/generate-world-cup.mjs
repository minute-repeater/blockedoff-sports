import { writeFileSync, readFileSync } from "fs";

const TOURNAMENT_ID = "wc2026";
const OUTPUT = "src/data/schedules/wc2026.json";
const OUTPUT_PRO = "src/data/schedules-pro/wc2026.json";

// Groups from Dec 2025 draw
const groups = {
  A: ["MEX", "ZAF", "KOR", "TBD1"],
  B: ["CAN", "TBD2", "QAT", "CHE"],
  C: ["BRA", "MAR", "HTI", "SCO"],
  D: ["USA", "PRY", "AUS", "TBD3"],
  E: ["DEU", "CUW", "CIV", "ECU"],
  F: ["NLD", "JPN", "TBD4", "TUN"],
  G: ["BEL", "EGY", "IRN", "NZL"],
  H: ["ESP", "CPV", "SAU", "URY"],
  I: ["FRA", "SEN", "TBD5", "NOR"],
  J: ["ARG", "DZA", "AUT", "JOR"],
  K: ["PRT", "TBD6", "UZB", "COL"],
  L: ["GBR", "HRV", "GHA", "PAN"],
};

const COUNTRY_NAMES = {
  MEX: "Mexico", ZAF: "South Africa", KOR: "South Korea", TBD1: "TBD (Playoff D)",
  CAN: "Canada", TBD2: "TBD (Playoff A)", QAT: "Qatar", CHE: "Switzerland",
  BRA: "Brazil", MAR: "Morocco", HTI: "Haiti", SCO: "Scotland",
  USA: "United States", PRY: "Paraguay", AUS: "Australia", TBD3: "TBD (Playoff C)",
  DEU: "Germany", CUW: "Curaçao", CIV: "Ivory Coast", ECU: "Ecuador",
  NLD: "Netherlands", JPN: "Japan", TBD4: "TBD (Playoff B)", TUN: "Tunisia",
  BEL: "Belgium", EGY: "Egypt", IRN: "Iran", NZL: "New Zealand",
  ESP: "Spain", CPV: "Cape Verde", SAU: "Saudi Arabia", URY: "Uruguay",
  FRA: "France", SEN: "Senegal", TBD5: "TBD (Playoff 2)", NOR: "Norway",
  ARG: "Argentina", DZA: "Algeria", AUT: "Austria", JOR: "Jordan",
  PRT: "Portugal", TBD6: "TBD (Playoff 1)", UZB: "Uzbekistan", COL: "Colombia",
  GBR: "England", HRV: "Croatia", GHA: "Ghana", PAN: "Panama",
};

// Venues grouped by region
const venues = [
  { name: "Estadio Azteca", city: "Mexico City" },
  { name: "Estadio Akron", city: "Guadalajara" },
  { name: "Estadio BBVA", city: "Monterrey" },
  { name: "BMO Field", city: "Toronto" },
  { name: "BC Place", city: "Vancouver" },
  { name: "SoFi Stadium", city: "Los Angeles" },
  { name: "Levi's Stadium", city: "San Francisco" },
  { name: "Lumen Field", city: "Seattle" },
  { name: "AT&T Stadium", city: "Dallas" },
  { name: "NRG Stadium", city: "Houston" },
  { name: "GEHA Field at Arrowhead", city: "Kansas City" },
  { name: "Mercedes-Benz Stadium", city: "Atlanta" },
  { name: "Hard Rock Stadium", city: "Miami" },
  { name: "MetLife Stadium", city: "East Rutherford" },
  { name: "Gillette Stadium", city: "Foxborough" },
  { name: "Lincoln Financial Field", city: "Philadelphia" },
];

// Match schedule: 3 matchdays per group, 6 matches per matchday
// Matchday 1: June 11-15, Matchday 2: June 17-21, Matchday 3: June 23-27

function getMatchday1Date(groupIdx) {
  const day = 11 + Math.floor(groupIdx / 3); // June 11-14
  return `2026-06-${String(day).padStart(2, "0")}`;
}

function getMatchday2Date(groupIdx) {
  const day = 17 + Math.floor(groupIdx / 3);
  return `2026-06-${String(day).padStart(2, "0")}`;
}

function getMatchday3Date(groupIdx) {
  const day = 23 + Math.floor(groupIdx / 3);
  return `2026-06-${String(day).padStart(2, "0")}`;
}

const times = ["15:00:00Z", "18:00:00Z", "21:00:00Z", "00:00:00Z"];

function shortName(code) {
  const full = COUNTRY_NAMES[code] || code;
  // Return a short version for TBD teams
  if (full.startsWith("TBD")) return full;
  return full;
}

const events = [];
let eventNum = 0;

const groupEntries = Object.entries(groups);

for (let gi = 0; gi < groupEntries.length; gi++) {
  const [letter, teams] = groupEntries[gi];
  const venueIdx = gi % venues.length;

  // Generate round-robin: 6 matches per group (3 matchdays, 2 matches each)
  // MD1: 1v2, 3v4
  // MD2: 1v3, 2v4
  // MD3: 1v4, 2v3
  const matchups = [
    { md: 1, a: 0, b: 1 },
    { md: 1, c: 2, d: 3 },
    { md: 2, a: 0, b: 2 },
    { md: 2, c: 1, d: 3 },
    { md: 3, a: 0, b: 3 },
    { md: 3, c: 2, d: 1 },
  ];

  for (let mi = 0; mi < matchups.length; mi++) {
    const m = matchups[mi];
    const t1Idx = m.a !== undefined ? m.a : m.c;
    const t2Idx = m.b !== undefined ? m.b : m.d;
    const t1 = teams[t1Idx];
    const t2 = teams[t2Idx];

    let dateStr;
    if (m.md === 1) dateStr = getMatchday1Date(gi);
    else if (m.md === 2) dateStr = getMatchday2Date(gi);
    else dateStr = getMatchday3Date(gi);

    const timeIdx = mi % times.length;
    const dateUTC = `${dateStr}T${times[timeIdx]}`;

    const v = venues[(venueIdx + mi) % venues.length];

    eventNum++;
    events.push({
      id: `wc26-grp-${letter.toLowerCase()}-m${mi + 1}`,
      tournamentId: TOURNAMENT_ID,
      sport: "soccer",
      phase: `Group ${letter}`,
      isKnockout: false,
      summary: `${shortName(t1)} vs. ${shortName(t2)}`,
      countryCodesInvolved: [t1, t2],
      dateUTC,
      timeTBD: false,
      durationMinutes: 120,
      venue: v.name,
      city: v.city,
    });
  }
}

// Knockout rounds — all TBD matchups
const knockoutRounds = [
  // Round of 32: June 28 - July 3 (16 matches)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `wc26-r32-${i + 1}`,
    phase: "Round of 32",
    date: `2026-06-${28 + Math.floor(i / 3)}`,
    time: times[i % 4],
  })),
  // Round of 16: July 4-7 (8 matches)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `wc26-r16-${i + 1}`,
    phase: "Round of 16",
    date: `2026-07-0${4 + Math.floor(i / 2)}`,
    time: times[i % 4],
  })),
  // Quarter-finals: July 9-11 (4 matches)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `wc26-qf-${i + 1}`,
    phase: "Quarter-Final",
    date: `2026-07-${9 + Math.floor(i / 2)}`,
    time: i % 2 === 0 ? "18:00:00Z" : "21:00:00Z",
  })),
  // Semi-finals: July 14-15
  { id: "wc26-sf-1", phase: "Semi-Final", date: "2026-07-14", time: "20:00:00Z" },
  { id: "wc26-sf-2", phase: "Semi-Final", date: "2026-07-15", time: "20:00:00Z" },
  // Third-place: July 18
  { id: "wc26-3rd", phase: "Third Place Match", date: "2026-07-18", time: "20:00:00Z" },
  // Final: July 19
  { id: "wc26-final", phase: "Final", date: "2026-07-19", time: "20:00:00Z" },
];

for (const ko of knockoutRounds) {
  const v = ko.id === "wc26-final"
    ? venues[13] // MetLife
    : ko.id === "wc26-3rd"
    ? venues[12] // Hard Rock
    : venues[Math.floor(Math.random() * venues.length)];

  events.push({
    id: ko.id,
    tournamentId: TOURNAMENT_ID,
    sport: "soccer",
    phase: ko.phase,
    isKnockout: true,
    summary: `${ko.phase} (TBD)`,
    countryCodesInvolved: [],
    dateUTC: `${ko.date}T${ko.time}`,
    timeTBD: false,
    durationMinutes: 150,
    venue: v.name,
    city: v.city,
  });
}

events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

writeFileSync(OUTPUT, JSON.stringify(events, null, 2));
writeFileSync(OUTPUT_PRO, JSON.stringify(events, null, 2));

console.log(`Done! ${events.length} World Cup events (${events.filter(e => !e.isKnockout).length} group + ${events.filter(e => e.isKnockout).length} knockout)`);

// Update countries.ts with missing World Cup nations
const countriesPath = "src/data/countries.ts";
let countriesSrc = readFileSync(countriesPath, "utf-8");

const needed = [
  { code: "ZAF", name: "South Africa", alpha2: "ZA" },
  { code: "QAT", name: "Qatar", alpha2: "QA" },
  { code: "HTI", name: "Haiti", alpha2: "HT" },
  { code: "SCO", name: "Scotland", alpha2: "GB" }, // Uses GB flag
  { code: "PRY", name: "Paraguay", alpha2: "PY" },
  { code: "CUW", name: "Curaçao", alpha2: "CW" },
  { code: "CIV", name: "Ivory Coast", alpha2: "CI" },
  { code: "ECU", name: "Ecuador", alpha2: "EC" },
  { code: "TUN", name: "Tunisia", alpha2: "TN" },
  { code: "EGY", name: "Egypt", alpha2: "EG" },
  { code: "CPV", name: "Cape Verde", alpha2: "CV" },
  { code: "SAA", name: "Saudi Arabia", alpha2: "SA" }, // SAU conflicts with F1
  { code: "URY", name: "Uruguay", alpha2: "UY" },
  { code: "DZA", name: "Algeria", alpha2: "DZ" },
  { code: "JOR", name: "Jordan", alpha2: "JO" },
  { code: "UZB", name: "Uzbekistan", alpha2: "UZ" },
  { code: "COL", name: "Colombia", alpha2: "CO" },
  { code: "GHA", name: "Ghana", alpha2: "GH" },
  { code: "PAN", name: "Panama", alpha2: "PA" },
];

// Check which are missing
for (const c of needed) {
  if (!countriesSrc.includes(`"${c.code}"`)) {
    // Add before the closing ];
    const entry = `  { code: "${c.code}", name: "${c.name}", alpha2: "${c.alpha2}" },`;
    countriesSrc = countriesSrc.replace(
      /(\s*\];\s*\nexport const countries)/,
      `\n${entry}$1`
    );
    console.log(`  Added country: ${c.code} (${c.name})`);
  }
}

writeFileSync(countriesPath, countriesSrc);
console.log("Updated countries.ts with World Cup nations.");

// Also add countryColors for new countries
const colorsPath = "src/data/countryColors.ts";
let colorsSrc = readFileSync(colorsPath, "utf-8");

const newColors = {
  ZAF: '  ZAF: { accent: "#007749", accentHover: "#006340", textOnAccent: "#ffffff" },',
  QAT: '  QAT: { accent: "#8D1B3D", accentHover: "#751632", textOnAccent: "#ffffff" },',
  HTI: '  HTI: { accent: "#00209F", accentHover: "#001a82", textOnAccent: "#ffffff" },',
  SCO: '  SCO: { accent: "#003399", accentHover: "#002a80", textOnAccent: "#ffffff" },',
  PRY: '  PRY: { accent: "#D52B1E", accentHover: "#b52418", textOnAccent: "#ffffff" },',
  CUW: '  CUW: { accent: "#002B7F", accentHover: "#002366", textOnAccent: "#ffffff" },',
  CIV: '  CIV: { accent: "#F77F00", accentHover: "#d96e00", textOnAccent: "#0f172a" },',
  ECU: '  ECU: { accent: "#FFD100", accentHover: "#e6bc00", textOnAccent: "#0f172a" },',
  TUN: '  TUN: { accent: "#E70013", accentHover: "#c4000f", textOnAccent: "#ffffff" },',
  EGY: '  EGY: { accent: "#CE1126", accentHover: "#ae0e20", textOnAccent: "#ffffff" },',
  CPV: '  CPV: { accent: "#003893", accentHover: "#002e78", textOnAccent: "#ffffff" },',
  URY: '  URY: { accent: "#0038A8", accentHover: "#002f8a", textOnAccent: "#ffffff" },',
  DZA: '  DZA: { accent: "#006233", accentHover: "#004d29", textOnAccent: "#ffffff" },',
  JOR: '  JOR: { accent: "#007A33", accentHover: "#006329", textOnAccent: "#ffffff" },',
  UZB: '  UZB: { accent: "#1EB53A", accentHover: "#199a31", textOnAccent: "#ffffff" },',
  COL: '  COL: { accent: "#FCD116", accentHover: "#e3bb14", textOnAccent: "#0f172a" },',
  GHA: '  GHA: { accent: "#006B3F", accentHover: "#005733", textOnAccent: "#ffffff" },',
  PAN: '  PAN: { accent: "#DA121A", accentHover: "#b80f16", textOnAccent: "#ffffff" },',
};

for (const [code, line] of Object.entries(newColors)) {
  if (!colorsSrc.includes(code + ":")) {
    colorsSrc = colorsSrc.replace(
      /(};\s*\nexport const DEFAULT)/,
      `${line}\n$1`
    );
  }
}

writeFileSync(colorsPath, colorsSrc);
console.log("Updated countryColors.ts.");
