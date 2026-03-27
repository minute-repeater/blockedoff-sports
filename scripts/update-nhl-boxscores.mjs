import { writeFileSync, readFileSync } from "fs";

const SCHEDULE_PATH = "src/data/schedules/nhl-2025-26.json";
const SCHEDULE_PRO_PATH = "src/data/schedules-pro/nhl-2025-26.json";

function boxScoreUrl(gameId) {
  return `https://api-web.nhle.com/v1/gamecenter/${gameId}/boxscore`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBoxScore(gameId) {
  try {
    const res = await fetch(boxScoreUrl(gameId), {
      headers: { "User-Agent": "Mozilla/5.0 (SportsCalendar)" },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatPlayerStats(boxData) {
  if (!boxData?.playerByGameStats) return null;

  const allPlayers = [];

  for (const side of ["awayTeam", "homeTeam"]) {
    const teamData = boxData.playerByGameStats[side];
    const teamCode = boxData[side]?.abbrev || "UNK";
    if (!teamData) continue;

    // Combine forwards, defense, goalies
    const skaters = [...(teamData.forwards || []), ...(teamData.defense || [])];
    const goalies = teamData.goalies || [];

    for (const p of skaters) {
      const goals = p.goals || 0;
      const assists = p.assists || 0;
      const points = p.points || 0;
      const plusMinus = p.plusMinus || 0;
      const shots = p.sog || 0;
      const hits = p.hits || 0;
      const toi = p.toi || "0:00";
      const name = p.name?.default || "Unknown";

      allPlayers.push({
        player: name,
        country: teamCode,
        points,
        goals,
        assists,
        stat: `${goals}G ${assists}A (${points} PTS)${plusMinus > 0 ? `, +${plusMinus}` : plusMinus < 0 ? `, ${plusMinus}` : ""}${hits >= 3 ? `, ${hits} HIT` : ""}${shots >= 4 ? `, ${shots} SOG` : ""}, ${toi} TOI`,
      });
    }

    // Add goalies with save stats
    for (const g of goalies) {
      const name = g.name?.default || "Unknown";
      const saves = g.saveShotsAgainst || g.saves || "";
      const savePctg = g.savePctg != null ? (g.savePctg * 100).toFixed(1) : null;
      const toi = g.toi || "0:00";

      // Only include goalies who actually played
      if (toi === "0:00" || toi === "00:00") continue;

      allPlayers.push({
        player: name,
        country: teamCode,
        points: -1, // Sort goalies after skaters with same points
        goals: 0,
        assists: 0,
        isGoalie: true,
        stat: `${saves}${savePctg ? ` (${savePctg}% SV)` : ""}, ${toi} TOI`,
      });
    }
  }

  // Sort: skaters by points (desc), then goals (desc); goalies at end
  allPlayers.sort((a, b) => {
    if (a.isGoalie && !b.isGoalie) return 1;
    if (!a.isGoalie && b.isGoalie) return -1;
    if (a.isGoalie && b.isGoalie) return 0;
    if (b.points !== a.points) return b.points - a.points;
    return b.goals - a.goals;
  });

  // Take top 6 skaters + goalies (max 2)
  const topSkaters = allPlayers.filter((p) => !p.isGoalie).slice(0, 6);
  const topGoalies = allPlayers.filter((p) => p.isGoalie).slice(0, 2);

  return [...topSkaters, ...topGoalies].map(({ player, country, stat }) => ({
    player,
    country,
    stat,
  }));
}

async function main() {
  console.log("Updating NHL box scores for completed games...");

  const events = JSON.parse(readFileSync(SCHEDULE_PATH, "utf-8"));

  const needsUpdate = events.filter((e) => e.score && !e.playerStats);
  console.log(`Found ${needsUpdate.length} completed games without box scores.`);

  if (needsUpdate.length === 0) {
    console.log("All completed games already have box scores.");
    return;
  }

  // Process most recent 200 games per run
  const toProcess = needsUpdate.slice(-200);
  console.log(`Processing ${toProcess.length} games...`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const event = toProcess[i];
    const gameId = event.id.replace("nhl-", "");

    const boxData = await fetchBoxScore(gameId);
    if (!boxData) {
      failed++;
      await sleep(100);
      continue;
    }

    const playerStats = formatPlayerStats(boxData);
    if (playerStats && playerStats.length > 0) {
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

    await sleep(200); // Be polite to NHL API
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
