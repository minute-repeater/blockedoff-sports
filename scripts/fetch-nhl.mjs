import { writeFileSync } from "fs";

const TOURNAMENT_ID = "nhl-2025-26";
const OUTPUT = "src/data/schedules/nhl-2025-26.json";
const OUTPUT_PRO = "src/data/schedules-pro/nhl-2025-26.json";
const BASE_URL = "https://api-web.nhle.com/v1/schedule";

const TEAM_NAMES = {
  ANA: "Ducks", BOS: "Bruins", BUF: "Sabres", CGY: "Flames", CAR: "Hurricanes",
  CHI: "Blackhawks", COL: "Avalanche", CBJ: "Blue Jackets", DAL: "Stars", DET: "Red Wings",
  EDM: "Oilers", FLA: "Panthers", LAK: "Kings", MIN: "Wild", MTL: "Canadiens",
  NSH: "Predators", NJD: "Devils", NYI: "Islanders", NYR: "Rangers", OTT: "Senators",
  PHI: "Flyers", PIT: "Penguins", SJS: "Sharks", SEA: "Kraken", STL: "Blues",
  TBL: "Lightning", TOR: "Maple Leafs", UTA: "Utah HC", VAN: "Canucks",
  VGK: "Golden Knights", WSH: "Capitals", WPG: "Jets",
};

// Venue city mapping (NHL API doesn't provide city separately)
const VENUE_CITIES = {
  "Amerant Bank Arena": "Sunrise",
  "TD Garden": "Boston",
  "KeyBank Center": "Buffalo",
  "Scotiabank Saddledome": "Calgary",
  "PNC Arena": "Raleigh",
  "United Center": "Chicago",
  "Ball Arena": "Denver",
  "Nationwide Arena": "Columbus",
  "American Airlines Center": "Dallas",
  "Little Caesars Arena": "Detroit",
  "Rogers Place": "Edmonton",
  "Crypto.com Arena": "Los Angeles",
  "Xcel Energy Center": "St. Paul",
  "Centre Bell": "Montreal",
  "Bridgestone Arena": "Nashville",
  "Prudential Center": "Newark",
  "UBS Arena": "Elmont",
  "Madison Square Garden": "New York",
  "Canadian Tire Centre": "Ottawa",
  "Wells Fargo Center": "Philadelphia",
  "PPG Paints Arena": "Pittsburgh",
  "SAP Center": "San Jose",
  "Climate Pledge Arena": "Seattle",
  "Enterprise Center": "St. Louis",
  "Amalie Arena": "Tampa",
  "Scotiabank Arena": "Toronto",
  "Delta Center": "Salt Lake City",
  "Rogers Arena": "Vancouver",
  "T-Mobile Arena": "Las Vegas",
  "Capital One Arena": "Washington",
  "Canada Life Centre": "Winnipeg",
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchWeek(date) {
  const res = await fetch(`${BASE_URL}/${date}`, {
    headers: { "User-Agent": "Mozilla/5.0 (SportCalendar)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${date}`);
  return res.json();
}

async function main() {
  console.log("Fetching NHL 2025-26 schedule...");

  const events = [];
  const seen = new Set();
  let currentDate = "2025-10-07"; // Regular season start
  const endDate = "2026-07-01";

  while (currentDate < endDate) {
    process.stdout.write(`\r  Fetching week of ${currentDate}...`);
    try {
      const data = await fetchWeek(currentDate);

      for (const day of data.gameWeek || []) {
        for (const g of day.games || []) {
          // Skip preseason (gameType 1) and all-star (gameType 4)
          if (g.gameType === 1) continue;
          if (seen.has(g.id)) continue;
          seen.add(g.id);

          const away = g.awayTeam;
          const home = g.homeTeam;
          const awayCode = away.abbrev;
          const homeCode = home.abbrev;
          const awayName = TEAM_NAMES[awayCode] || away.commonName?.default || awayCode;
          const homeName = TEAM_NAMES[homeCode] || home.commonName?.default || homeCode;

          const venueName = g.venue?.default || "TBD";
          const city = VENUE_CITIES[venueName] || home.placeName?.default || "TBD";

          const isPlayoff = g.gameType === 3;
          let phase = "Regular Season";
          if (isPlayoff) phase = "NHL Playoffs";
          if (g.gameType === 4) phase = "All-Star";

          let score = undefined;
          let result = undefined;
          if ((g.gameState === "OFF" || g.gameState === "FINAL") && away.score != null && home.score != null) {
            score = `${away.score}-${home.score}`;
            if (away.score > home.score) {
              result = { [awayCode]: "W", [homeCode]: "L" };
            } else if (home.score > away.score) {
              result = { [awayCode]: "L", [homeCode]: "W" };
            }
          }

          const event = {
            id: `nhl-${g.id}`,
            tournamentId: TOURNAMENT_ID,
            sport: "hockey",
            phase,
            isKnockout: isPlayoff,
            summary: `${awayName} @ ${homeName}`,
            countryCodesInvolved: [awayCode, homeCode],
            dateUTC: g.startTimeUTC,
            timeTBD: false,
            durationMinutes: 150,
            venue: venueName,
            city,
          };

          if (score) event.score = score;
          if (result) event.result = result;

          events.push(event);
        }
      }

      // Move to next week
      const next = data.nextStartDate;
      if (!next || next <= currentDate) break;
      currentDate = next;
    } catch (err) {
      console.error(`\nError fetching ${currentDate}:`, err.message);
      // Try next week manually
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      currentDate = d.toISOString().split("T")[0];
    }

    await sleep(200); // Be polite to the API
  }

  console.log(""); // newline after progress dots

  // Sort by date
  events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

  writeFileSync(OUTPUT, JSON.stringify(events, null, 2));
  writeFileSync(OUTPUT_PRO, JSON.stringify(events, null, 2));

  const regular = events.filter(e => e.phase === "Regular Season").length;
  const playoff = events.filter(e => e.isKnockout).length;
  console.log(`Done! ${events.length} total games written to ${OUTPUT}`);
  console.log(`  Regular season: ${regular}`);
  console.log(`  Playoffs: ${playoff}`);
}

main().catch(console.error);
