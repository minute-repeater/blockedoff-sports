import { writeFileSync, readFileSync } from "fs";

const TOURNAMENT_ID = "f1-2026";
const OUTPUT = "src/data/schedules/f1-2026.json";
const OUTPUT_PRO = "src/data/schedules-pro/f1-2026.json";

const ALL_TEAMS = ["RBR", "FER", "MCL", "MER", "AMR", "ALP", "VCA", "WIL", "SAU", "HAA"];

// Corrected 2026 F1 calendar — 22 races (Bahrain & Saudi cancelled)
const races = [
  { name: "Australian Grand Prix", date: "2026-03-08T05:00:00Z", circuit: "Albert Park Circuit", city: "Melbourne" },
  { name: "Chinese Grand Prix", date: "2026-03-15T07:00:00Z", circuit: "Shanghai International Circuit", city: "Shanghai" },
  { name: "Japanese Grand Prix", date: "2026-03-29T06:00:00Z", circuit: "Suzuka International Racing Course", city: "Suzuka" },
  { name: "Miami Grand Prix", date: "2026-05-03T20:00:00Z", circuit: "Miami International Autodrome", city: "Miami" },
  { name: "Canadian Grand Prix", date: "2026-05-24T18:00:00Z", circuit: "Circuit Gilles Villeneuve", city: "Montreal" },
  { name: "Monaco Grand Prix", date: "2026-06-07T13:00:00Z", circuit: "Circuit de Monaco", city: "Monte Carlo" },
  { name: "Barcelona-Catalunya Grand Prix", date: "2026-06-14T13:00:00Z", circuit: "Circuit de Barcelona-Catalunya", city: "Barcelona" },
  { name: "Austrian Grand Prix", date: "2026-06-28T13:00:00Z", circuit: "Red Bull Ring", city: "Spielberg" },
  { name: "British Grand Prix", date: "2026-07-05T14:00:00Z", circuit: "Silverstone Circuit", city: "Silverstone" },
  { name: "Belgian Grand Prix", date: "2026-07-19T13:00:00Z", circuit: "Circuit de Spa-Francorchamps", city: "Stavelot" },
  { name: "Hungarian Grand Prix", date: "2026-07-26T13:00:00Z", circuit: "Hungaroring", city: "Budapest" },
  { name: "Dutch Grand Prix", date: "2026-08-23T13:00:00Z", circuit: "Circuit Zandvoort", city: "Zandvoort" },
  { name: "Italian Grand Prix", date: "2026-09-06T13:00:00Z", circuit: "Autodromo Nazionale Monza", city: "Monza" },
  { name: "Spanish Grand Prix", date: "2026-09-13T13:00:00Z", circuit: "Madring Circuit", city: "Madrid" },
  { name: "Azerbaijan Grand Prix", date: "2026-09-26T11:00:00Z", circuit: "Baku City Circuit", city: "Baku" },
  { name: "Singapore Grand Prix", date: "2026-10-11T12:00:00Z", circuit: "Marina Bay Street Circuit", city: "Singapore" },
  { name: "United States Grand Prix", date: "2026-10-25T19:00:00Z", circuit: "Circuit of the Americas", city: "Austin" },
  { name: "Mexico City Grand Prix", date: "2026-11-01T20:00:00Z", circuit: "Autodromo Hermanos Rodriguez", city: "Mexico City" },
  { name: "São Paulo Grand Prix", date: "2026-11-08T17:00:00Z", circuit: "Autodromo Jose Carlos Pace", city: "São Paulo" },
  { name: "Las Vegas Grand Prix", date: "2026-11-21T06:00:00Z", circuit: "Las Vegas Street Circuit", city: "Las Vegas" },
  { name: "Qatar Grand Prix", date: "2026-11-29T16:00:00Z", circuit: "Lusail International Circuit", city: "Lusail" },
  { name: "Abu Dhabi Grand Prix", date: "2026-12-06T13:00:00Z", circuit: "Yas Marina Circuit", city: "Abu Dhabi" },
];

const events = races.map((race, i) => ({
  id: `f1-2026-r${String(i + 1).padStart(2, "0")}`,
  tournamentId: TOURNAMENT_ID,
  sport: "formula-1",
  phase: `Round ${i + 1}`,
  isKnockout: false,
  summary: race.name,
  countryCodesInvolved: ALL_TEAMS,
  dateUTC: race.date,
  timeTBD: false,
  durationMinutes: 120,
  venue: race.circuit,
  city: race.city,
}));

writeFileSync(OUTPUT, JSON.stringify(events, null, 2));
writeFileSync(OUTPUT_PRO, JSON.stringify(events, null, 2));
console.log(`Done! ${events.length} F1 races written.`);

// Update tournaments.json: Sauber -> Audi
const tournamentsPath = "src/data/tournaments.json";
const tournaments = JSON.parse(readFileSync(tournamentsPath, "utf-8"));
const f1 = tournaments.find(t => t.id === TOURNAMENT_ID);
if (f1) {
  f1.startDate = "2026-03-08";
  const sauber = f1.teams.find(t => t.code === "SAU");
  if (sauber) {
    sauber.name = "Audi F1 Team";
    sauber.shortName = "Audi";
    sauber.color = "#E2001A";
    delete sauber.textColor;
  }
  writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));
  console.log("Updated F1 tournament: Sauber -> Audi, start date corrected.");
}
