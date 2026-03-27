import { readFileSync, writeFileSync } from "fs";

/**
 * Generate schedule-pro.json from schedule.json
 * Enriches each event with proData: broadcasts, preGame context,
 * detailed box scores, and lineup notes.
 */

const schedule = JSON.parse(readFileSync("src/data/schedule.json", "utf-8"));
const today = new Date("2026-02-23");

// ── Broadcast mappings by tournament/sport ──────────────────────────

const broadcastMap = {
  "wc2026": [
    { country: "US", channel: "FOX / FS1" },
    { country: "CA", channel: "TSN / CTV" },
    { country: "UK", channel: "BBC / ITV" },
    { country: "MX", channel: "Televisa / TV Azteca" },
  ],
  "ucl-2025-26": [
    { country: "US", channel: "CBS / Paramount+" },
    { country: "CA", channel: "DAZN" },
    { country: "UK", channel: "TNT Sports" },
  ],
  "nba-playoffs-2026": [
    { country: "US", channel: "ESPN / TNT / ABC" },
    { country: "CA", channel: "TSN / Sportsnet" },
    { country: "UK", channel: "Sky Sports" },
  ],
  "march-madness-2026": [
    { country: "US", channel: "CBS / TBS / TNT / truTV" },
    { country: "CA", channel: "TSN" },
  ],
  "f1-2026": [
    { country: "US", channel: "ESPN" },
    { country: "CA", channel: "TSN" },
    { country: "UK", channel: "Sky Sports F1" },
  ],
  "tennis-slams-2026": [
    { country: "US", channel: "ESPN" },
    { country: "CA", channel: "TSN" },
    { country: "UK", channel: "BBC / Sky Sports" },
  ],
  "oly-winter-2026": [
    { country: "US", channel: "NBC / Peacock" },
    { country: "CA", channel: "CBC" },
    { country: "UK", channel: "BBC / Eurosport" },
  ],
  "oly2028": [
    { country: "US", channel: "NBC / Peacock" },
    { country: "CA", channel: "CBC" },
    { country: "UK", channel: "BBC / Eurosport" },
  ],
};

// ── Helper: pick random item from array ──────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

// ── Sport-specific stat generators ───────────────────────────────────

function generateSoccerBoxScore(ev) {
  const teams = ev.countryCodesInvolved;
  if (teams.length < 2) return [];
  const players = [];
  // Generate 3-4 key player stat lines per team
  const soccerActions = ["Goal", "Assist", "Key Pass", "Save", "Tackle"];
  for (const team of teams.slice(0, 2)) {
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const mins = 10 + Math.floor(Math.random() * 80);
      const shots = Math.floor(Math.random() * 5);
      const passes = 20 + Math.floor(Math.random() * 60);
      const passAcc = 70 + Math.floor(Math.random() * 25);
      players.push({
        player: `Player ${i + 1}`,
        country: team,
        statLine: `${mins} min, ${shots} shots, ${passes}/${Math.floor(passes * passAcc / 100)} passes (${passAcc}%)`,
      });
    }
  }
  return players;
}

function generateBasketballBoxScore(ev) {
  const teams = ev.countryCodesInvolved;
  if (teams.length < 2) return [];
  const players = [];
  for (const team of teams.slice(0, 2)) {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const pts = 8 + Math.floor(Math.random() * 25);
      const reb = Math.floor(Math.random() * 12);
      const ast = Math.floor(Math.random() * 10);
      const fg = 3 + Math.floor(Math.random() * 10);
      const fga = fg + Math.floor(Math.random() * 8);
      players.push({
        player: `Player ${i + 1}`,
        country: team,
        statLine: `${pts} PTS, ${reb} REB, ${ast} AST, ${fg}-${fga} FG`,
      });
    }
  }
  return players;
}

function generateTennisBoxScore(ev) {
  const players = [];
  for (const code of ev.countryCodesInvolved.slice(0, 2)) {
    const aces = Math.floor(Math.random() * 20);
    const df = Math.floor(Math.random() * 6);
    const winners = 15 + Math.floor(Math.random() * 35);
    const ue = 10 + Math.floor(Math.random() * 25);
    const firstServe = 55 + Math.floor(Math.random() * 20);
    players.push({
      player: code,
      country: code,
      statLine: `${aces} aces, ${df} DF, ${winners} winners, ${ue} UE, ${firstServe}% 1st serve`,
    });
  }
  return players;
}

function generateF1BoxScore(ev) {
  // F1 race results — top 5
  const constructors = ["RBR", "FER", "MCL", "MER", "AMR", "ALP", "VCA", "WIL", "SAU", "HAA"];
  const driversByTeam = {
    RBR: ["Verstappen", "Lawson"],
    FER: ["Hamilton", "Leclerc"],
    MCL: ["Norris", "Piastri"],
    MER: ["Russell", "Antonelli"],
    AMR: ["Alonso", "Stroll"],
    ALP: ["Gasly", "Doohan"],
    VCA: ["Tsunoda", "Hadjar"],
    WIL: ["Sainz", "Albon"],
    SAU: ["Hulkenberg", "Bortoleto"],
    HAA: ["Bearman", "Ocon"],
  };
  const shuffled = [...constructors].sort(() => Math.random() - 0.5);
  const results = [];
  for (let i = 0; i < 5; i++) {
    const team = shuffled[i];
    const driver = pick(driversByTeam[team]);
    const gap = i === 0 ? "Leader" : `+${(Math.random() * 30 + 1).toFixed(3)}s`;
    results.push({
      player: driver,
      country: team,
      statLine: `P${i + 1} — ${gap}, ${15 + Math.floor(Math.random() * 45)} laps led`,
    });
  }
  return results;
}

function generateWinterOlympicsBoxScore(ev) {
  // Already have scores like "Gold: NOR, Silver: AUT, Bronze: CHE"
  // Add athlete detail
  const athletes = [];
  const teams = ev.countryCodesInvolved.slice(0, 3);
  const medals = ["Gold", "Silver", "Bronze"];
  for (let i = 0; i < Math.min(3, teams.length); i++) {
    athletes.push({
      player: `Athlete (${medals[i]})`,
      country: teams[i],
      statLine: `${medals[i]} medal — ${ev.sport}`,
    });
  }
  return athletes;
}

// ── Pre-game context generators ──────────────────────────────────────

function generateSoccerPreGame(ev) {
  const teams = ev.countryCodesInvolved;
  if (teams.length < 2) return {};
  const t1 = teams[0], t2 = teams[1];
  const w1 = Math.floor(Math.random() * 5);
  const d = Math.floor(Math.random() * 3);
  const w2 = Math.floor(Math.random() * 5);
  const forms = ["W", "W", "L", "D", "W", "L", "W", "D"];
  return {
    h2hRecord: `${t1} leads ${w1}-${d}-${w2} in last ${w1 + d + w2} meetings`,
    formGuide: `${t1}: ${pickN(forms, 5).join("")} | ${t2}: ${pickN(forms, 5).join("")}`,
    bettingLine: `${pick([t1, t2, "Draw"])} ${pick(["-0.5", "-1.0", "-1.5", "+0.5", "PK"])}, O/U ${pick(["1.5", "2.0", "2.5", "3.0", "3.5"])}`,
    injuryReport: generateInjuries(ev),
  };
}

function generateBasketballPreGame(ev) {
  const teams = ev.countryCodesInvolved;
  if (teams.length < 2) return {};
  const t1 = teams[0], t2 = teams[1];
  const spread = (Math.random() * 12 + 1).toFixed(1);
  const total = (200 + Math.random() * 30).toFixed(1);
  return {
    h2hRecord: `Season series: ${t1} ${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)} ${t2}`,
    bettingLine: `${pick([t1, t2])} -${spread}, O/U ${total}`,
    injuryReport: generateInjuries(ev),
  };
}

function generateTennisPreGame(ev) {
  const players = ev.countryCodesInvolved;
  if (players.length < 2) return {};
  const p1 = players[0], p2 = players[1];
  const w1 = Math.floor(Math.random() * 8);
  const w2 = Math.floor(Math.random() * 8);
  return {
    h2hRecord: `H2H: ${p1} ${w1}-${w2} ${p2}`,
    bettingLine: `${pick([p1, p2])} -${pick(["1.5", "2.5", "3.5"])} sets`,
  };
}

function generateF1PreGame(ev) {
  return {
    formGuide: "Constructor standings: RBR leads, FER 2nd, MCL 3rd",
    bettingLine: `Race winner: ${pick(["Verstappen", "Hamilton", "Norris", "Leclerc"])} (favorite)`,
  };
}

function generateInjuries(ev) {
  const injuryTypes = [
    "hamstring — Questionable",
    "knee — Doubtful",
    "ankle — Day-to-day",
    "shoulder — Out",
    "calf — Probable",
    "concussion protocol — Questionable",
    "groin — Day-to-day",
  ];
  // 50% chance of having injuries
  if (Math.random() > 0.5) return [];
  const count = 1 + Math.floor(Math.random() * 2);
  const injuries = [];
  for (let i = 0; i < count; i++) {
    injuries.push(`Player (${pick(ev.countryCodesInvolved)}) — ${pick(injuryTypes)}`);
  }
  return injuries;
}

// ── Lineup notes generators ──────────────────────────────────────────

function generateSoccerLineup(ev) {
  const teams = ev.countryCodesInvolved.slice(0, 2);
  const formations = ["4-3-3", "4-2-3-1", "3-5-2", "4-4-2", "3-4-3"];
  return teams.map((t) => `${t}: Expected ${pick(formations)}`);
}

function generateBasketballLineup(ev) {
  const teams = ev.countryCodesInvolved.slice(0, 2);
  return teams.map((t) => `${t}: Standard starting five expected`);
}

// ── Main enrichment ──────────────────────────────────────────────────

let enriched = 0;

const proSchedule = schedule.map((ev) => {
  const eventDate = new Date(ev.dateUTC);
  const isPast = ev.score != null;
  const isFuture = !isPast && eventDate > today;

  const proData = {};

  // Broadcasts for all events
  const broadcasts = broadcastMap[ev.tournamentId];
  if (broadcasts) {
    proData.broadcasts = broadcasts;
  }

  if (isPast) {
    // Past events: detailed box scores
    let boxScore = [];
    switch (ev.sport) {
      case "soccer":
        boxScore = generateSoccerBoxScore(ev);
        break;
      case "basketball":
        boxScore = generateBasketballBoxScore(ev);
        break;
      case "tennis":
        boxScore = generateTennisBoxScore(ev);
        break;
      case "formula-1":
        boxScore = generateF1BoxScore(ev);
        break;
      default:
        if (ev.tournamentId.includes("oly")) {
          boxScore = generateWinterOlympicsBoxScore(ev);
        }
        break;
    }
    if (boxScore.length > 0) {
      proData.detailedBoxScore = boxScore;
    }
  }

  if (isFuture) {
    // Future events: pre-game context + lineup notes
    let preGame = {};
    let lineupNotes = [];

    switch (ev.sport) {
      case "soccer":
        preGame = generateSoccerPreGame(ev);
        lineupNotes = generateSoccerLineup(ev);
        break;
      case "basketball":
        preGame = generateBasketballPreGame(ev);
        lineupNotes = generateBasketballLineup(ev);
        break;
      case "tennis":
        preGame = generateTennisPreGame(ev);
        break;
      case "formula-1":
        preGame = generateF1PreGame(ev);
        break;
      default:
        break;
    }

    if (Object.keys(preGame).length > 0) {
      proData.preGame = preGame;
    }
    if (lineupNotes.length > 0) {
      proData.lineupNotes = lineupNotes;
    }
  }

  if (Object.keys(proData).length > 0) {
    enriched++;
    return { ...ev, proData };
  }

  return ev;
});

writeFileSync(
  "src/data/schedule-pro.json",
  JSON.stringify(proSchedule, null, 2) + "\n"
);

console.log(`Enriched ${enriched} / ${schedule.length} events with pro data`);
console.log(`Written to src/data/schedule-pro.json`);
