import { writeFileSync, readFileSync } from "fs";

const TOURNAMENT_ID = "march-madness-women-2026";
const OUTPUT = "src/data/schedules/march-madness-women-2026.json";
const OUTPUT_PRO = "src/data/schedules-pro/march-madness-women-2026.json";

// Known: #1 seeds are UConn, UCLA, Texas, South Carolina
// UConn is undefeated favorite. (10) Virginia beat (2) Iowa. (6) Notre Dame beat (3) Ohio State.
// Sweet 16 in progress March 27-28. Final Four in San Antonio April 4. Championship April 6.

const TEAMS = {
  WUCON: { name: "UConn Huskies", short: "UConn", color: "#000E2F" },
  WUCLA: { name: "UCLA Bruins", short: "UCLA", color: "#2D68C4" },
  WTEX: { name: "Texas Longhorns", short: "Texas", color: "#BF5700" },
  WUSC: { name: "South Carolina Gamecocks", short: "S. Carolina", color: "#73000A" },
  WIOW: { name: "Iowa Hawkeyes", short: "Iowa", color: "#FFCD00", textColor: "#0f172a" },
  WND: { name: "Notre Dame Fighting Irish", short: "Notre Dame", color: "#0C2340" },
  WLSU: { name: "LSU Tigers", short: "LSU", color: "#461D7C" },
  WDUKE: { name: "Duke Blue Devils", short: "Duke", color: "#003087" },
  WSTAN: { name: "Stanford Cardinal", short: "Stanford", color: "#8C1515" },
  WNCST: { name: "NC State Wolfpack", short: "NC State", color: "#CC0000" },
  WBAY: { name: "Baylor Bears", short: "Baylor", color: "#154734" },
  WUSC2: { name: "USC Trojans", short: "USC", color: "#990000" },
  WVIR: { name: "Virginia Cavaliers", short: "Virginia", color: "#232D4B" },
  WOLE: { name: "Ole Miss Rebels", short: "Ole Miss", color: "#CE1126" },
  WKST: { name: "Kansas State Wildcats", short: "Kansas St", color: "#512888" },
  WLOU: { name: "Louisville Cardinals", short: "Louisville", color: "#AD0000" },
  WOHST: { name: "Ohio State Buckeyes", short: "Ohio State", color: "#BB0000" },
  WTEN: { name: "Tennessee Lady Vols", short: "Tennessee", color: "#FF8200" },
  WORI: { name: "Oregon Ducks", short: "Oregon", color: "#154733" },
  WCRE: { name: "Creighton Bluejays", short: "Creighton", color: "#005CA9" },
  WMAR: { name: "Maryland Terrapins", short: "Maryland", color: "#E03A3E" },
  WNEB: { name: "Nebraska Cornhuskers", short: "Nebraska", color: "#E41C38" },
  WGEO: { name: "Georgia Bulldogs", short: "Georgia", color: "#BA0C2F" },
  WOKST: { name: "Oklahoma State Cowgirls", short: "OK State", color: "#FF7300" },
  WMSU: { name: "Michigan State Spartans", short: "Michigan St", color: "#18453B" },
  WNCAA16: { name: "Gonzaga Bulldogs", short: "Gonzaga", color: "#002967" },
  WTCU: { name: "TCU Horned Frogs", short: "TCU", color: "#4D1979" },
  WWVU: { name: "West Virginia Mountaineers", short: "WVU", color: "#002855" },
  WSYR: { name: "Syracuse Orange", short: "Syracuse", color: "#F76900" },
  WFLA: { name: "Florida Gators", short: "Florida", color: "#0021A5" },
  WUTAH: { name: "Utah Utes", short: "Utah", color: "#CC0000" },
  WRICH: { name: "Richmond Spiders", short: "Richmond", color: "#990000" },
};

// Regions: Albany (1-seed UConn), Portland (1-seed UCLA), Fort Worth (1-seed Texas), Sacramento (1-seed S. Carolina)
const games = [
  // === ALBANY REGION (1-seed UConn) ===
  // Round of 64
  { id: "wmm-alb-r64-1", r: "Round of 64", reg: "Albany", d: "2026-03-21T16:00:00Z", t1: "WUCON", s1: 1, t2: "WRICH", s2: 16, sc: "95-48", w: "WUCON", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r64-2", r: "Round of 64", reg: "Albany", d: "2026-03-21T18:30:00Z", t1: "WMSU", s1: 8, t2: "WOKST", s2: 9, sc: "67-62", w: "WMSU", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r64-3", r: "Round of 64", reg: "Albany", d: "2026-03-21T21:00:00Z", t1: "WNCST", s1: 5, t2: "WSYR", s2: 12, sc: "74-59", w: "WNCST", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r64-4", r: "Round of 64", reg: "Albany", d: "2026-03-21T23:30:00Z", t1: "WTEN", s1: 4, t2: "WFLA", s2: 13, sc: "81-64", w: "WTEN", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r64-5", r: "Round of 64", reg: "Albany", d: "2026-03-22T16:00:00Z", t1: "WND", s1: 6, t2: "WTCU", s2: 11, sc: "70-55", w: "WND", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r64-6", r: "Round of 64", reg: "Albany", d: "2026-03-22T18:30:00Z", t1: "WOHST", s1: 3, t2: "WWVU", s2: 14, sc: "85-60", w: "WOHST", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r64-7", r: "Round of 64", reg: "Albany", d: "2026-03-22T21:00:00Z", t1: "WCRE", s1: 7, t2: "WUTAH", s2: 10, sc: "66-63", w: "WCRE", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r64-8", r: "Round of 64", reg: "Albany", d: "2026-03-22T23:30:00Z", t1: "WIOW", s1: 2, t2: "WGEO", s2: 15, sc: "88-55", w: "WIOW", v: "MVP Arena", c: "Albany" },
  // Round of 32
  { id: "wmm-alb-r32-1", r: "Round of 32", reg: "Albany", d: "2026-03-23T16:00:00Z", t1: "WUCON", s1: 1, t2: "WMSU", s2: 8, sc: "89-52", w: "WUCON", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r32-2", r: "Round of 32", reg: "Albany", d: "2026-03-23T18:30:00Z", t1: "WTEN", s1: 4, t2: "WNCST", s2: 5, sc: "73-68", w: "WTEN", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r32-3", r: "Round of 32", reg: "Albany", d: "2026-03-24T16:00:00Z", t1: "WND", s1: 6, t2: "WOHST", s2: 3, sc: "71-66", w: "WND", v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-r32-4", r: "Round of 32", reg: "Albany", d: "2026-03-24T18:30:00Z", t1: "WVIR", s1: 10, t2: "WIOW", s2: 2, sc: "68-64", w: "WVIR", v: "MVP Arena", c: "Albany" },
  // Sweet 16
  { id: "wmm-alb-s16-1", r: "Sweet 16", reg: "Albany", d: "2026-03-27T19:00:00Z", t1: "WUCON", s1: 1, t2: "WTEN", s2: 4, v: "MVP Arena", c: "Albany" },
  { id: "wmm-alb-s16-2", r: "Sweet 16", reg: "Albany", d: "2026-03-27T21:30:00Z", t1: "WND", s1: 6, t2: "WVIR", s2: 10, v: "MVP Arena", c: "Albany" },

  // === PORTLAND REGION (1-seed UCLA) ===
  { id: "wmm-por-r64-1", r: "Round of 64", reg: "Portland", d: "2026-03-21T19:00:00Z", t1: "WUCLA", s1: 1, t2: "WNCAA16", s2: 16, sc: "91-50", w: "WUCLA", v: "Moda Center", c: "Portland" },
  { id: "wmm-por-r64-2", r: "Round of 64", reg: "Portland", d: "2026-03-21T21:30:00Z", t1: "WMAR", s1: 8, t2: "WNEB", s2: 9, sc: "72-70", w: "WMAR", v: "Moda Center", c: "Portland" },
  { id: "wmm-por-r64-3", r: "Round of 64", reg: "Portland", d: "2026-03-22T00:00:00Z", t1: "WBAY", s1: 5, t2: "WORI", s2: 12, sc: "65-68", w: "WORI", v: "Moda Center", c: "Portland" },
  { id: "wmm-por-r64-4", r: "Round of 64", reg: "Portland", d: "2026-03-22T16:00:00Z", t1: "WDUKE", s1: 4, t2: "WKST", s2: 13, sc: "79-60", w: "WDUKE", v: "Moda Center", c: "Portland" },
  { id: "wmm-por-r64-5", r: "Round of 64", reg: "Portland", d: "2026-03-22T19:00:00Z", t1: "WOLE", s1: 6, t2: "WLOU", s2: 11, sc: "77-71", w: "WOLE", v: "Moda Center", c: "Portland" },
  { id: "wmm-por-r64-6", r: "Round of 64", reg: "Portland", d: "2026-03-22T21:30:00Z", t1: "WLSU", s1: 3, t2: "WSTAN", s2: 14, sc: "82-67", w: "WLSU", v: "Moda Center", c: "Portland" },
  // Round of 32
  { id: "wmm-por-r32-1", r: "Round of 32", reg: "Portland", d: "2026-03-23T19:00:00Z", t1: "WUCLA", s1: 1, t2: "WMAR", s2: 8, sc: "85-60", w: "WUCLA", v: "Moda Center", c: "Portland" },
  { id: "wmm-por-r32-2", r: "Round of 32", reg: "Portland", d: "2026-03-23T21:30:00Z", t1: "WDUKE", s1: 4, t2: "WORI", s2: 12, sc: "76-72", w: "WDUKE", v: "Moda Center", c: "Portland" },
  { id: "wmm-por-r32-3", r: "Round of 32", reg: "Portland", d: "2026-03-24T19:00:00Z", t1: "WOLE", s1: 6, t2: "WLSU", s2: 3, sc: "64-73", w: "WLSU", v: "Moda Center", c: "Portland" },
  // Sweet 16
  { id: "wmm-por-s16-1", r: "Sweet 16", reg: "Portland", d: "2026-03-28T19:00:00Z", t1: "WUCLA", s1: 1, t2: "WDUKE", s2: 4, v: "Moda Center", c: "Portland" },
  { id: "wmm-por-s16-2", r: "Sweet 16", reg: "Portland", d: "2026-03-28T21:30:00Z", t1: "WLSU", s1: 3, t2: "WUSC2", s2: 7, v: "Moda Center", c: "Portland" },

  // === FORT WORTH REGION (1-seed Texas) ===
  { id: "wmm-fw-r64-1", r: "Round of 64", reg: "Fort Worth", d: "2026-03-21T17:00:00Z", t1: "WTEX", s1: 1, sc: "93-52", w: "WTEX", v: "Dickies Arena", c: "Fort Worth" },
  { id: "wmm-fw-r32-1", r: "Round of 32", reg: "Fort Worth", d: "2026-03-23T17:00:00Z", t1: "WTEX", s1: 1, sc: "80-55", w: "WTEX", v: "Dickies Arena", c: "Fort Worth" },
  { id: "wmm-fw-s16-1", r: "Sweet 16", reg: "Fort Worth", d: "2026-03-27T23:00:00Z", t1: "WTEX", s1: 1, v: "Dickies Arena", c: "Fort Worth" },

  // === SACRAMENTO REGION (1-seed South Carolina) ===
  { id: "wmm-sac-r64-1", r: "Round of 64", reg: "Sacramento", d: "2026-03-21T22:00:00Z", t1: "WUSC", s1: 1, sc: "100-48", w: "WUSC", v: "Golden 1 Center", c: "Sacramento" },
  { id: "wmm-sac-r32-1", r: "Round of 32", reg: "Sacramento", d: "2026-03-23T22:00:00Z", t1: "WUSC", s1: 1, sc: "86-62", w: "WUSC", v: "Golden 1 Center", c: "Sacramento" },
  { id: "wmm-sac-s16-1", r: "Sweet 16", reg: "Sacramento", d: "2026-03-28T23:00:00Z", t1: "WUSC", s1: 1, v: "Golden 1 Center", c: "Sacramento" },

  // Elite Eight
  { id: "wmm-e8-1", r: "Elite Eight", reg: "Albany", d: "2026-03-29T18:00:00Z", v: "MVP Arena", c: "Albany" },
  { id: "wmm-e8-2", r: "Elite Eight", reg: "Portland", d: "2026-03-29T20:30:00Z", v: "Moda Center", c: "Portland" },
  { id: "wmm-e8-3", r: "Elite Eight", reg: "Fort Worth", d: "2026-03-30T18:00:00Z", v: "Dickies Arena", c: "Fort Worth" },
  { id: "wmm-e8-4", r: "Elite Eight", reg: "Sacramento", d: "2026-03-30T20:30:00Z", v: "Golden 1 Center", c: "Sacramento" },

  // Final Four & Championship in San Antonio
  { id: "wmm-ff-1", r: "Final Four", reg: "", d: "2026-04-04T19:00:00Z", v: "Alamodome", c: "San Antonio" },
  { id: "wmm-ff-2", r: "Final Four", reg: "", d: "2026-04-04T21:30:00Z", v: "Alamodome", c: "San Antonio" },
  { id: "wmm-final", r: "National Championship", reg: "", d: "2026-04-06T20:00:00Z", v: "Alamodome", c: "San Antonio" },
];

const events = games.map(g => {
  const t1Info = g.t1 ? TEAMS[g.t1] : null;
  const t2Info = g.t2 ? TEAMS[g.t2] : null;

  let summary;
  if (t1Info && t2Info) {
    const s1 = g.s1 ? `(${g.s1}) ` : "";
    const s2 = g.s2 ? `(${g.s2}) ` : "";
    summary = `${s1}${t1Info.short} vs. ${s2}${t2Info.short}`;
  } else if (t1Info) {
    summary = `(${g.s1}) ${t1Info.short} vs. TBD`;
  } else {
    summary = `${g.r}${g.reg ? " — " + g.reg : ""} (TBD)`;
  }

  const codes = [g.t1, g.t2].filter(Boolean);

  const event = {
    id: g.id,
    tournamentId: TOURNAMENT_ID,
    sport: "basketball",
    phase: g.reg ? `${g.r} — ${g.reg}` : g.r,
    isKnockout: true,
    summary,
    countryCodesInvolved: codes,
    dateUTC: g.d,
    timeTBD: false,
    durationMinutes: 120,
    venue: g.v,
    city: g.c,
  };

  if (g.sc) {
    event.score = g.sc;
    if (g.w && g.t1 && g.t2) {
      const loser = g.w === g.t1 ? g.t2 : g.t1;
      event.result = { [g.w]: "W", [loser]: "L" };
    }
  }

  return event;
});

events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

writeFileSync(OUTPUT, JSON.stringify(events, null, 2));
writeFileSync(OUTPUT_PRO, JSON.stringify(events, null, 2));
console.log(`Done! ${events.length} Women's March Madness events written.`);

// Update tournaments.json with expanded team list
const tournamentsPath = "src/data/tournaments.json";
const tournaments = JSON.parse(readFileSync(tournamentsPath, "utf-8"));
const idx = tournaments.findIndex(t => t.id === TOURNAMENT_ID);
if (idx >= 0) {
  const allCodes = [...new Set(games.flatMap(g => [g.t1, g.t2].filter(Boolean)))];
  tournaments[idx].teams = allCodes.map(code => {
    const info = TEAMS[code];
    if (!info) return { code, name: code, shortName: code, color: "#666666" };
    const entry = { code, name: info.name, shortName: info.short, color: info.color };
    if (info.textColor) entry.textColor = info.textColor;
    return entry;
  });
  writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));
  console.log(`Updated tournaments.json with ${allCodes.length} women's teams.`);
}
