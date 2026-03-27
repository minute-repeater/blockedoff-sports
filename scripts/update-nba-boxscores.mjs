import { writeFileSync, readFileSync } from "fs";

const SCHEDULE_PATH = "src/data/schedules/nba-playoffs-2026.json";
const SCHEDULE_PRO_PATH = "src/data/schedules-pro/nba-playoffs-2026.json";

// NBA box score API
function boxScoreUrl(gameId) {
  return `https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBoxScore(gameId) {
  const url = boxScoreUrl(gameId);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (SportsCalendar)",
        "Accept": "application/json",
        "Referer": "https://www.nba.com/",
        "Origin": "https://www.nba.com",
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatPlayerStats(boxData) {
  if (!boxData?.game) return null;

  const game = boxData.game;
  const awayTeam = game.awayTeam;
  const homeTeam = game.homeTeam;

  if (!awayTeam?.players || !homeTeam?.players) return null;

  const allPlayers = [];

  for (const team of [awayTeam, homeTeam]) {
    const teamCode = team.teamTricode;
    for (const p of team.players) {
      const stats = p.statistics;
      if (!stats || stats.minutes === "PT00M00.00S" || stats.minutes === "") continue;

      // Parse minutes from "PT32M15.00S" format
      const minMatch = stats.minutes?.match(/PT(\d+)M/);
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      if (minutes === 0) continue;

      const pts = stats.points || 0;
      const reb = stats.reboundsTotal || 0;
      const ast = stats.assists || 0;
      const stl = stats.steals || 0;
      const blk = stats.blocks || 0;

      allPlayers.push({
        player: `${p.firstName} ${p.familyName}`,
        country: teamCode,
        pts, reb, ast, stl, blk, minutes,
        stat: `${pts} PTS, ${reb} REB, ${ast} AST${stl >= 3 ? `, ${stl} STL` : ""}${blk >= 3 ? `, ${blk} BLK` : ""} (${minutes} MIN)`,
      });
    }
  }

  // Sort by points descending, take top 8 performers
  allPlayers.sort((a, b) => b.pts - a.pts);
  return allPlayers.slice(0, 8).map(({ player, country, stat }) => ({
    player,
    country,
    stat,
  }));
}

async function main() {
  console.log("Updating NBA box scores for completed games...");

  const events = JSON.parse(readFileSync(SCHEDULE_PATH, "utf-8"));

  // Find completed games without playerStats
  const needsUpdate = events.filter(
    (e) => e.score && !e.playerStats
  );

  console.log(`Found ${needsUpdate.length} completed games without box scores.`);

  if (needsUpdate.length === 0) {
    console.log("All completed games already have box scores.");
    return;
  }

  // Process in batches to avoid rate limits
  // Limit to most recent 200 games per run to keep it manageable
  const toProcess = needsUpdate.slice(-200);
  console.log(`Processing ${toProcess.length} games (most recent first)...`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const event = toProcess[i];
    // Extract raw game ID from event id (e.g., "nba-0022500001" -> "0022500001")
    const gameId = event.id.replace("nba-", "");

    const boxData = await fetchBoxScore(gameId);
    if (!boxData) {
      failed++;
      if (i % 50 === 0) console.log(`  [${i + 1}/${toProcess.length}] Failed: ${event.summary}`);
      await sleep(100);
      continue;
    }

    const playerStats = formatPlayerStats(boxData);
    if (playerStats && playerStats.length > 0) {
      // Find the event in the main array and update it
      const idx = events.findIndex((e) => e.id === event.id);
      if (idx !== -1) {
        events[idx].playerStats = playerStats;
        updated++;
      }
    } else {
      failed++;
    }

    if ((i + 1) % 50 === 0) {
      console.log(`  Progress: ${i + 1}/${toProcess.length} (${updated} updated, ${failed} failed)`);
    }

    // Small delay to be polite to the API
    await sleep(150);
  }

  if (updated > 0) {
    writeFileSync(SCHEDULE_PATH, JSON.stringify(events, null, 2));
    writeFileSync(SCHEDULE_PRO_PATH, JSON.stringify(events, null, 2));
    console.log(`\nDone! Updated ${updated} games with box scores. (${failed} failed)`);
  } else {
    console.log(`\nNo box scores were retrieved. (${failed} failed)`);
  }
}

main().catch(console.error);
