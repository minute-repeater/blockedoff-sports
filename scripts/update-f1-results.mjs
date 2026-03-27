import { writeFileSync, readFileSync } from "fs";

const SCHEDULE_PATH = "src/data/schedules/f1-2026.json";
const SCHEDULE_PRO_PATH = "src/data/schedules-pro/f1-2026.json";
const API_BASE = "https://api.jolpi.ca/ergast/f1/2026";

// Ergast constructor ID -> our team code
const CONSTRUCTOR_MAP = {
  mercedes: "MER",
  ferrari: "FER",
  mclaren: "MCL",
  red_bull: "RBR",
  haas: "HAA",
  rb: "VCA",
  audi: "SAU",
  alpine: "ALP",
  williams: "WIL",
  cadillac: "CAD",
  aston_martin: "AMR",
};

async function fetchResults() {
  const res = await fetch(`${API_BASE}/results/`, {
    headers: { "User-Agent": "Mozilla/5.0 (SportsCalendar)" },
  });
  return res.json();
}

async function main() {
  console.log("Fetching F1 2026 results...");

  const data = await fetchResults();
  const races = data?.MRData?.RaceTable?.Races || [];
  console.log(`Found results for ${races.length} completed races.`);

  if (races.length === 0) {
    console.log("No results to update.");
    return;
  }

  // Load current schedule
  const events = JSON.parse(readFileSync(SCHEDULE_PATH, "utf-8"));

  let updated = 0;

  for (const race of races) {
    const roundNum = parseInt(race.round);
    const eventId = `f1-2026-r${String(roundNum).padStart(2, "0")}`;
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      console.log(`  Warning: No event found for round ${roundNum} (${race.raceName})`);
      continue;
    }

    if (event.score) {
      // Already has results
      continue;
    }

    const results = race.Results || [];
    if (results.length === 0) continue;

    // Build podium score string
    const top3 = results.slice(0, 3);
    const podiumStr = top3
      .map((r, i) => {
        const pos = i === 0 ? "P1" : i === 1 ? "P2" : "P3";
        return `${pos}: ${r.Driver?.givenName} ${r.Driver?.familyName}`;
      })
      .join(" | ");

    event.score = podiumStr;

    // Build result map: winning constructor gets "W"
    const winnerConstructor = CONSTRUCTOR_MAP[results[0]?.Constructor?.constructorId];
    if (winnerConstructor) {
      event.result = { [winnerConstructor]: "W" };
    }

    // Build player stats for top 10
    event.playerStats = results.slice(0, 10).map((r) => ({
      player: `${r.Driver?.givenName} ${r.Driver?.familyName}`,
      country: CONSTRUCTOR_MAP[r.Constructor?.constructorId] || "UNK",
      stat: `P${r.position}${r.FastestLap?.rank === "1" ? " + Fastest Lap" : ""}${r.status !== "Finished" ? ` (${r.status})` : ""}`,
    }));

    console.log(`  Updated R${roundNum}: ${race.raceName} — Winner: ${results[0].Driver?.familyName}`);
    updated++;
  }

  if (updated > 0) {
    writeFileSync(SCHEDULE_PATH, JSON.stringify(events, null, 2));
    writeFileSync(SCHEDULE_PRO_PATH, JSON.stringify(events, null, 2));
    console.log(`\nDone! Updated ${updated} race(s) with results.`);
  } else {
    console.log("\nNo new results to update.");
  }
}

main().catch(console.error);
