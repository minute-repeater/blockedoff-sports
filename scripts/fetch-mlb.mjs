import { writeFileSync } from "fs";

const TOURNAMENT_ID = "mlb-2026";
const OUTPUT = "src/data/schedules/mlb-2026.json";
const OUTPUT_PRO = "src/data/schedules-pro/mlb-2026.json";
const BASE_URL = "https://statsapi.mlb.com/api/v1/schedule";

// MLB team ID -> our team code
const TEAM_CODE_MAP = {
  109: "ARI", 144: "ATL", 110: "BAL", 111: "BOS", 112: "CHC",
  145: "CHW", 113: "CIN", 114: "CLE", 115: "COL", 116: "DET",
  117: "HOU", 118: "KCR", 108: "LAA", 119: "LAD", 146: "MIA",
  158: "MIL", 142: "MIN", 121: "NYM", 147: "NYY", 133: "OAK",
  143: "PHI", 134: "PIT", 135: "SDP", 136: "SEA", 137: "SFG",
  138: "STL", 139: "TBR", 140: "TEX", 141: "TOR", 120: "WSN",
};

const TEAM_NAMES = {
  ARI: "D-backs", ATL: "Braves", BAL: "Orioles", BOS: "Red Sox", CHC: "Cubs",
  CHW: "White Sox", CIN: "Reds", CLE: "Guardians", COL: "Rockies", DET: "Tigers",
  HOU: "Astros", KCR: "Royals", LAA: "Angels", LAD: "Dodgers", MIA: "Marlins",
  MIL: "Brewers", MIN: "Twins", NYM: "Mets", NYY: "Yankees", OAK: "Athletics",
  PHI: "Phillies", PIT: "Pirates", SDP: "Padres", SEA: "Mariners", SFG: "Giants",
  STL: "Cardinals", TBR: "Rays", TEX: "Rangers", TOR: "Blue Jays", WSN: "Nationals",
};

const VENUE_CITIES = {
  "Chase Field": "Phoenix", "Truist Park": "Atlanta", "Camden Yards": "Baltimore",
  "Oriole Park at Camden Yards": "Baltimore", "Fenway Park": "Boston",
  "Wrigley Field": "Chicago", "Guaranteed Rate Field": "Chicago",
  "Rate Field": "Chicago", "Great American Ball Park": "Cincinnati",
  "Progressive Field": "Cleveland", "Coors Field": "Denver",
  "Comerica Park": "Detroit", "Minute Maid Park": "Houston",
  "Kauffman Stadium": "Kansas City", "Angel Stadium": "Anaheim",
  "Angel Stadium of Anaheim": "Anaheim", "Dodger Stadium": "Los Angeles",
  "loanDepot park": "Miami", "American Family Field": "Milwaukee",
  "Target Field": "Minneapolis", "Citi Field": "New York",
  "Yankee Stadium": "New York", "Sutter Health Park": "Sacramento",
  "Oakland Coliseum": "Oakland", "Citizens Bank Park": "Philadelphia",
  "PNC Park": "Pittsburgh", "Petco Park": "San Diego",
  "T-Mobile Park": "Seattle", "Oracle Park": "San Francisco",
  "Busch Stadium": "St. Louis", "Tropicana Field": "St. Petersburg",
  "Globe Life Field": "Arlington", "Rogers Centre": "Toronto",
  "Nationals Park": "Washington",
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchChunk(startDate, endDate) {
  const url = `${BASE_URL}?sportId=1&season=2026&gameType=R&startDate=${startDate}&endDate=${endDate}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (SportCalendar)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  console.log("Fetching MLB 2026 schedule...");

  const events = [];
  const seen = new Set();

  // Fetch in monthly chunks: March 26 -> September 28 (regular season)
  const chunks = [
    ["2026-03-26", "2026-04-30"],
    ["2026-05-01", "2026-05-31"],
    ["2026-06-01", "2026-06-30"],
    ["2026-07-01", "2026-07-31"],
    ["2026-08-01", "2026-08-31"],
    ["2026-09-01", "2026-09-28"],
  ];

  for (const [start, end] of chunks) {
    process.stdout.write(`\r  Fetching ${start} to ${end}...`);
    try {
      const data = await fetchChunk(start, end);

      for (const day of data.dates || []) {
        for (const g of day.games || []) {
          if (seen.has(g.gamePk)) continue;
          seen.add(g.gamePk);

          const awayTeam = g.teams?.away?.team;
          const homeTeam = g.teams?.home?.team;
          const awayCode = TEAM_CODE_MAP[awayTeam?.id] || "UNK";
          const homeCode = TEAM_CODE_MAP[homeTeam?.id] || "UNK";

          if (awayCode === "UNK" || homeCode === "UNK") continue;

          const awayName = TEAM_NAMES[awayCode] || awayTeam?.name;
          const homeName = TEAM_NAMES[homeCode] || homeTeam?.name;

          const venueName = g.venue?.name || "TBD";
          const city = VENUE_CITIES[venueName] || "TBD";

          let score = undefined;
          let result = undefined;
          const status = g.status?.detailedState;
          if (status === "Final" || status?.startsWith("Final")) {
            const as = g.teams?.away?.score;
            const hs = g.teams?.home?.score;
            if (as != null && hs != null) {
              score = `${as}-${hs}`;
              if (as > hs) result = { [awayCode]: "W", [homeCode]: "L" };
              else if (hs > as) result = { [awayCode]: "L", [homeCode]: "W" };
            }
          }

          // Determine doubleheader game number
          const gameNum = g.gameNumber || 1;
          const suffix = gameNum > 1 ? ` (Game ${gameNum})` : "";

          const event = {
            id: `mlb-${g.gamePk}`,
            tournamentId: TOURNAMENT_ID,
            sport: "baseball",
            phase: "Regular Season",
            isKnockout: false,
            summary: `${awayName} @ ${homeName}${suffix}`,
            countryCodesInvolved: [awayCode, homeCode],
            dateUTC: g.gameDate,
            timeTBD: false,
            durationMinutes: 180,
            venue: venueName,
            city,
          };

          if (score) event.score = score;
          if (result) event.result = result;

          events.push(event);
        }
      }
    } catch (err) {
      console.error(`\nError for ${start}-${end}:`, err.message);
    }

    await sleep(300);
  }

  console.log("");

  events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

  writeFileSync(OUTPUT, JSON.stringify(events, null, 2));
  writeFileSync(OUTPUT_PRO, JSON.stringify(events, null, 2));

  console.log(`Done! ${events.length} total games written to ${OUTPUT}`);
}

main().catch(console.error);
