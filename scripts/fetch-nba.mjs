import { writeFileSync } from "fs";

const API_URL = "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json";
const TOURNAMENT_ID = "nba-playoffs-2026";
const OUTPUT = "src/data/schedules/nba-playoffs-2026.json";
const OUTPUT_PRO = "src/data/schedules-pro/nba-playoffs-2026.json";

// NBA team tricode -> our short display name
const TEAM_NAMES = {
  ATL: "Hawks", BOS: "Celtics", BKN: "Nets", CHA: "Hornets", CHI: "Bulls",
  CLE: "Cavaliers", DAL: "Mavericks", DEN: "Nuggets", DET: "Pistons", GSW: "Warriors",
  HOU: "Rockets", IND: "Pacers", LAC: "Clippers", LAL: "Lakers", MEM: "Grizzlies",
  MIA: "Heat", MIL: "Bucks", MIN: "Timberwolves", NOP: "Pelicans", NYK: "Knicks",
  OKC: "Thunder", ORL: "Magic", PHI: "76ers", PHX: "Suns", POR: "Trail Blazers",
  SAC: "Kings", SAS: "Spurs", TOR: "Raptors", UTA: "Jazz", WAS: "Wizards",
};

function gamePhase(gameId, gameSubtype, weekName) {
  if (gameId.startsWith("001")) return "Preseason";
  if (gameId.startsWith("004")) return "NBA Playoffs";
  if (gameId.startsWith("005")) return "Play-In Tournament";
  return weekName || "Regular Season";
}

function isKnockout(gameId) {
  return gameId.startsWith("004") || gameId.startsWith("005");
}

async function main() {
  console.log("Fetching NBA 2025-26 schedule...");
  const res = await fetch(API_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (SportCalendar)" },
  });
  const data = await res.json();
  const gameDates = data.leagueSchedule.gameDates;

  const events = [];
  let regularCount = 0;
  let playoffCount = 0;
  let preseasonSkipped = 0;

  for (const gd of gameDates) {
    for (const g of gd.games) {
      // Skip preseason games
      if (g.gameId.startsWith("001")) {
        preseasonSkipped++;
        continue;
      }

      // Skip All-Star related games (gameId prefix 002, gameSubtype = "ASG" or similar)
      const isAllStar = g.gameSubtype === "ASG" || g.gameLabel?.includes("All-Star");

      const away = g.awayTeam;
      const home = g.homeTeam;
      const awayCode = away.teamTricode;
      const homeCode = home.teamTricode;

      // Build datetime - use gameDateTimeUTC
      const dateUTC = g.gameDateTimeUTC || g.gameDateTimeEst;
      const timeTBD = g.gameStatus === 1 && !g.gameTimeUTC?.includes("T");

      // Determine phase
      let phase;
      if (isAllStar) {
        phase = "All-Star Weekend";
      } else if (g.gameId.startsWith("005")) {
        phase = "Play-In Tournament";
      } else if (g.gameId.startsWith("004")) {
        // Playoff series info
        phase = g.seriesText || "NBA Playoffs";
      } else {
        phase = "Regular Season";
      }

      // Build summary
      const awayName = TEAM_NAMES[awayCode] || away.teamName;
      const homeName = TEAM_NAMES[homeCode] || home.teamName;
      const summary = isAllStar
        ? g.gameLabel || "NBA All-Star Game"
        : `${awayName} @ ${homeName}`;

      // Build score for completed games
      let score = undefined;
      let result = undefined;
      if (g.gameStatus === 3 && away.score != null && home.score != null) {
        score = `${away.score}-${home.score}`;
        if (away.score > home.score) {
          result = { [awayCode]: "W", [homeCode]: "L" };
        } else if (home.score > away.score) {
          result = { [awayCode]: "L", [homeCode]: "W" };
        } else {
          result = { [awayCode]: "D", [homeCode]: "D" };
        }
      }

      const event = {
        id: `nba-${g.gameId}`,
        tournamentId: TOURNAMENT_ID,
        sport: "basketball",
        phase,
        isKnockout: isKnockout(g.gameId),
        summary,
        countryCodesInvolved: isAllStar ? [] : [awayCode, homeCode],
        dateUTC,
        timeTBD: false,
        durationMinutes: 150,
        venue: g.arenaName || "TBD",
        city: g.arenaCity || "TBD",
      };

      if (score) event.score = score;
      if (result) event.result = result;

      events.push(event);

      if (g.gameId.startsWith("002")) regularCount++;
      if (g.gameId.startsWith("004") || g.gameId.startsWith("005")) playoffCount++;
    }
  }

  // Sort by date
  events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

  writeFileSync(OUTPUT, JSON.stringify(events, null, 2));
  writeFileSync(OUTPUT_PRO, JSON.stringify(events, null, 2));

  console.log(`Done! ${events.length} total games written to ${OUTPUT}`);
  console.log(`  Regular season: ${regularCount}`);
  console.log(`  Playoffs/Play-In: ${playoffCount}`);
  console.log(`  Preseason skipped: ${preseasonSkipped}`);
}

main().catch(console.error);
