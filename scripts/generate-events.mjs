import { writeFileSync, readFileSync } from "fs";

// Read existing events — keep only country-based tournament events
const allExisting = JSON.parse(readFileSync("src/data/schedule.json", "utf-8"));
const existing = allExisting.filter(
  (e) => !["f1-2026", "ucl-2025-26", "nba-playoffs-2026", "tennis-slams-2026", "march-madness-2026"].includes(e.tournamentId)
);
console.log(`Kept ${existing.length} existing country-based events`);

// ========== F1 2026 — uses CONSTRUCTOR team codes ==========
const f1AllTeams = ["RBR", "FER", "MCL", "MER", "AMR", "ALP", "VCA", "WIL", "SAU", "HAA"];

const f1Races = [
  { name: "Bahrain Grand Prix", date: "2026-03-08T15:00:00Z", circuit: "Bahrain International Circuit", city: "Sakhir" },
  { name: "Saudi Arabian Grand Prix", date: "2026-03-22T17:00:00Z", circuit: "Jeddah Corniche Circuit", city: "Jeddah" },
  { name: "Australian Grand Prix", date: "2026-04-05T05:00:00Z", circuit: "Albert Park Circuit", city: "Melbourne" },
  { name: "Japanese Grand Prix", date: "2026-04-19T06:00:00Z", circuit: "Suzuka International Racing Course", city: "Suzuka" },
  { name: "Chinese Grand Prix", date: "2026-05-03T07:00:00Z", circuit: "Shanghai International Circuit", city: "Shanghai" },
  { name: "Miami Grand Prix", date: "2026-05-17T20:00:00Z", circuit: "Miami International Autodrome", city: "Miami" },
  { name: "Emilia Romagna Grand Prix", date: "2026-05-31T13:00:00Z", circuit: "Autodromo Enzo e Dino Ferrari", city: "Imola" },
  { name: "Monaco Grand Prix", date: "2026-06-07T13:00:00Z", circuit: "Circuit de Monaco", city: "Monte Carlo" },
  { name: "Spanish Grand Prix", date: "2026-06-21T13:00:00Z", circuit: "Circuit de Barcelona-Catalunya", city: "Barcelona" },
  { name: "Canadian Grand Prix", date: "2026-06-28T18:00:00Z", circuit: "Circuit Gilles Villeneuve", city: "Montreal" },
  { name: "Austrian Grand Prix", date: "2026-07-05T13:00:00Z", circuit: "Red Bull Ring", city: "Spielberg" },
  { name: "British Grand Prix", date: "2026-07-19T14:00:00Z", circuit: "Silverstone Circuit", city: "Silverstone" },
  { name: "Belgian Grand Prix", date: "2026-07-26T13:00:00Z", circuit: "Circuit de Spa-Francorchamps", city: "Stavelot" },
  { name: "Hungarian Grand Prix", date: "2026-08-02T13:00:00Z", circuit: "Hungaroring", city: "Budapest" },
  { name: "Dutch Grand Prix", date: "2026-08-23T13:00:00Z", circuit: "Circuit Zandvoort", city: "Zandvoort" },
  { name: "Italian Grand Prix", date: "2026-08-30T13:00:00Z", circuit: "Autodromo Nazionale Monza", city: "Monza" },
  { name: "Azerbaijan Grand Prix", date: "2026-09-13T11:00:00Z", circuit: "Baku City Circuit", city: "Baku" },
  { name: "Singapore Grand Prix", date: "2026-09-27T12:00:00Z", circuit: "Marina Bay Street Circuit", city: "Singapore" },
  { name: "United States Grand Prix", date: "2026-10-18T19:00:00Z", circuit: "Circuit of the Americas", city: "Austin" },
  { name: "Mexico City Grand Prix", date: "2026-10-25T20:00:00Z", circuit: "Autodromo Hermanos Rodriguez", city: "Mexico City" },
  { name: "São Paulo Grand Prix", date: "2026-11-08T17:00:00Z", circuit: "Autodromo Jose Carlos Pace", city: "São Paulo" },
  { name: "Las Vegas Grand Prix", date: "2026-11-22T06:00:00Z", circuit: "Las Vegas Street Circuit", city: "Las Vegas" },
  { name: "Qatar Grand Prix", date: "2026-11-29T16:00:00Z", circuit: "Lusail International Circuit", city: "Lusail" },
  { name: "Abu Dhabi Grand Prix", date: "2026-12-06T13:00:00Z", circuit: "Yas Marina Circuit", city: "Abu Dhabi" },
];

const f1Events = f1Races.map((race, i) => ({
  id: `f1-2026-r${String(i + 1).padStart(2, "0")}`,
  tournamentId: "f1-2026",
  sport: "formula-1",
  phase: `Round ${i + 1}`,
  isKnockout: false,
  summary: race.name,
  countryCodesInvolved: f1AllTeams,
  dateUTC: race.date,
  timeTBD: false,
  durationMinutes: 120,
  venue: race.circuit,
  city: race.city,
}));

// ========== UCL 2025-26 — uses CLUB team codes ==========
const uclPlayoffs = [
  { id: "ucl-kpo-mci-rma-1", summary: "Man City vs. Real Madrid (1st Leg)", teams: ["MCI", "RMA"],
    date: "2026-02-11T20:00:00Z", venue: "Etihad Stadium", city: "Manchester",
    score: "3-2", result: { MCI: "W", RMA: "L" },
    playerStats: [{ player: "Erling Haaland", country: "NOR", stat: "2 Goals" }, { player: "Phil Foden", country: "GBR", stat: "1 Goal" }] },
  { id: "ucl-kpo-mci-rma-2", summary: "Real Madrid vs. Man City (2nd Leg)", teams: ["RMA", "MCI"],
    date: "2026-02-18T20:00:00Z", venue: "Santiago Bernabeu", city: "Madrid",
    score: "1-1", result: { RMA: "D", MCI: "D" },
    playerStats: [{ player: "Jude Bellingham", country: "GBR", stat: "1 Goal" }] },
  { id: "ucl-kpo-bay-cel-1", summary: "Bayern vs. Celtic (1st Leg)", teams: ["BAY", "CEL"],
    date: "2026-02-11T20:00:00Z", venue: "Allianz Arena", city: "Munich",
    score: "4-0", result: { BAY: "W", CEL: "L" },
    playerStats: [{ player: "Harry Kane", country: "GBR", stat: "2 Goals" }, { player: "Jamal Musiala", country: "DEU", stat: "1 Goal, 1 Assist" }] },
  { id: "ucl-kpo-bay-cel-2", summary: "Celtic vs. Bayern (2nd Leg)", teams: ["CEL", "BAY"],
    date: "2026-02-18T20:00:00Z", venue: "Celtic Park", city: "Glasgow",
    score: "2-1", result: { CEL: "W", BAY: "L" },
    playerStats: [{ player: "Kyogo Furuhashi", country: "JPN", stat: "1 Goal" }] },
  { id: "ucl-kpo-acm-fey-1", summary: "AC Milan vs. Feyenoord (1st Leg)", teams: ["ACM", "FEY"],
    date: "2026-02-12T20:00:00Z", venue: "San Siro", city: "Milan",
    score: "2-1", result: { ACM: "W", FEY: "L" },
    playerStats: [{ player: "Rafael Leao", country: "PRT", stat: "1 Goal, 1 Assist" }] },
  { id: "ucl-kpo-acm-fey-2", summary: "Feyenoord vs. AC Milan (2nd Leg)", teams: ["FEY", "ACM"],
    date: "2026-02-19T20:00:00Z", venue: "De Kuip", city: "Rotterdam",
    score: "1-0", result: { FEY: "W", ACM: "L" },
    playerStats: [{ player: "Santiago Gimenez", country: "MEX", stat: "1 Goal" }] },
  { id: "ucl-kpo-psg-asm-1", summary: "PSG vs. Monaco (1st Leg)", teams: ["PSG", "ASM"],
    date: "2026-02-12T20:00:00Z", venue: "Parc des Princes", city: "Paris",
    score: "3-1", result: { PSG: "W", ASM: "L" },
    playerStats: [{ player: "Ousmane Dembele", country: "FRA", stat: "2 Goals" }] },
  { id: "ucl-kpo-psg-asm-2", summary: "Monaco vs. PSG (2nd Leg)", teams: ["ASM", "PSG"],
    date: "2026-02-19T20:00:00Z", venue: "Stade Louis II", city: "Monaco",
    score: "2-2", result: { ASM: "D", PSG: "D" },
    playerStats: [{ player: "Breel Embolo", country: "CHE", stat: "1 Goal" }] },
];

const uclPlayoffEvents = uclPlayoffs.map((m) => ({
  id: m.id, tournamentId: "ucl-2025-26", sport: "soccer", phase: "Knockout Playoffs",
  isKnockout: true, summary: m.summary, countryCodesInvolved: m.teams,
  dateUTC: m.date, timeTBD: false, durationMinutes: 120, venue: m.venue, city: m.city,
  score: m.score, result: m.result, playerStats: m.playerStats,
}));

const uclR16 = [
  { id: "ucl-r16-liv-int-1", summary: "Liverpool vs. Inter (1st Leg)", teams: ["LIV", "INT"], date: "2026-03-04T20:00:00Z", venue: "Anfield", city: "Liverpool" },
  { id: "ucl-r16-bar-bvb-1", summary: "Barcelona vs. Dortmund (1st Leg)", teams: ["BAR", "BVB"], date: "2026-03-04T20:00:00Z", venue: "Spotify Camp Nou", city: "Barcelona" },
  { id: "ucl-r16-ars-ben-1", summary: "Arsenal vs. Benfica (1st Leg)", teams: ["ARS", "BEN"], date: "2026-03-05T20:00:00Z", venue: "Emirates Stadium", city: "London" },
  { id: "ucl-r16-atm-bay-1", summary: "Atletico vs. Bayern (1st Leg)", teams: ["ATM", "BAY"], date: "2026-03-05T20:00:00Z", venue: "Civitas Metropolitano", city: "Madrid" },
  { id: "ucl-r16-mci-psg-1", summary: "Man City vs. PSG (1st Leg)", teams: ["MCI", "PSG"], date: "2026-03-04T20:00:00Z", venue: "Etihad Stadium", city: "Manchester" },
  { id: "ucl-r16-acm-ata-1", summary: "AC Milan vs. Atalanta (1st Leg)", teams: ["ACM", "ATA"], date: "2026-03-05T20:00:00Z", venue: "San Siro", city: "Milan" },
  { id: "ucl-r16-int-liv-2", summary: "Inter vs. Liverpool (2nd Leg)", teams: ["INT", "LIV"], date: "2026-03-11T20:00:00Z", venue: "San Siro", city: "Milan" },
  { id: "ucl-r16-bvb-bar-2", summary: "Dortmund vs. Barcelona (2nd Leg)", teams: ["BVB", "BAR"], date: "2026-03-11T20:00:00Z", venue: "Signal Iduna Park", city: "Dortmund" },
  { id: "ucl-r16-ben-ars-2", summary: "Benfica vs. Arsenal (2nd Leg)", teams: ["BEN", "ARS"], date: "2026-03-12T20:00:00Z", venue: "Estadio da Luz", city: "Lisbon" },
  { id: "ucl-r16-bay-atm-2", summary: "Bayern vs. Atletico (2nd Leg)", teams: ["BAY", "ATM"], date: "2026-03-12T20:00:00Z", venue: "Allianz Arena", city: "Munich" },
  { id: "ucl-r16-psg-mci-2", summary: "PSG vs. Man City (2nd Leg)", teams: ["PSG", "MCI"], date: "2026-03-11T20:00:00Z", venue: "Parc des Princes", city: "Paris" },
  { id: "ucl-r16-ata-acm-2", summary: "Atalanta vs. AC Milan (2nd Leg)", teams: ["ATA", "ACM"], date: "2026-03-12T20:00:00Z", venue: "Gewiss Stadium", city: "Bergamo" },
];

const uclR16Events = uclR16.map((m) => ({
  id: m.id, tournamentId: "ucl-2025-26", sport: "soccer", phase: "Round of 16",
  isKnockout: true, summary: m.summary, countryCodesInvolved: m.teams,
  dateUTC: m.date, timeTBD: false, durationMinutes: 120, venue: m.venue, city: m.city,
}));

const uclLateRounds = [
  { id: "ucl-qf-1-1", summary: "Quarter-Final 1 (1st Leg)", phase: "Quarter-Final", date: "2026-04-07" },
  { id: "ucl-qf-1-2", summary: "Quarter-Final 1 (2nd Leg)", phase: "Quarter-Final", date: "2026-04-14" },
  { id: "ucl-qf-2-1", summary: "Quarter-Final 2 (1st Leg)", phase: "Quarter-Final", date: "2026-04-08" },
  { id: "ucl-qf-2-2", summary: "Quarter-Final 2 (2nd Leg)", phase: "Quarter-Final", date: "2026-04-15" },
  { id: "ucl-sf-1-1", summary: "Semi-Final 1 (1st Leg)", phase: "Semi-Final", date: "2026-04-28" },
  { id: "ucl-sf-1-2", summary: "Semi-Final 1 (2nd Leg)", phase: "Semi-Final", date: "2026-05-05" },
  { id: "ucl-sf-2-1", summary: "Semi-Final 2 (1st Leg)", phase: "Semi-Final", date: "2026-04-29" },
  { id: "ucl-sf-2-2", summary: "Semi-Final 2 (2nd Leg)", phase: "Semi-Final", date: "2026-05-06" },
  { id: "ucl-final", summary: "Champions League Final", phase: "Final", date: "2026-05-31T19:00:00Z" },
];

const uclLateEvents = uclLateRounds.map((m) => ({
  id: m.id, tournamentId: "ucl-2025-26", sport: "soccer", phase: m.phase,
  isKnockout: true, summary: m.summary, countryCodesInvolved: [],
  dateUTC: m.date, timeTBD: !m.date.includes("T"), durationMinutes: 120,
  venue: m.id === "ucl-final" ? "Puskas Arena" : "TBD",
  city: m.id === "ucl-final" ? "Budapest" : "TBD",
}));

// ========== NBA 2025-26 — ALL 30 teams ==========
// Regular season marquee games (so every team has events)
const nbaRegularSeason = [
  // Opening Night
  { id: "nba-rs-001", summary: "Knicks vs. Celtics", phase: "Regular Season", teams: ["NYK", "BOS"], date: "2026-10-21T19:30:00Z", venue: "TD Garden", city: "Boston" },
  { id: "nba-rs-002", summary: "Lakers vs. Warriors", phase: "Regular Season", teams: ["LAL", "GSW"], date: "2026-10-21T22:00:00Z", venue: "Chase Center", city: "San Francisco" },
  // Christmas Day
  { id: "nba-rs-xmas-1", summary: "Celtics vs. Lakers", phase: "Regular Season — Christmas", teams: ["BOS", "LAL"], date: "2025-12-25T17:00:00Z", venue: "Crypto.com Arena", city: "Los Angeles" },
  { id: "nba-rs-xmas-2", summary: "Knicks vs. 76ers", phase: "Regular Season — Christmas", teams: ["NYK", "PHI"], date: "2025-12-25T14:30:00Z", venue: "Wells Fargo Center", city: "Philadelphia" },
  { id: "nba-rs-xmas-3", summary: "Warriors vs. Mavericks", phase: "Regular Season — Christmas", teams: ["GSW", "DAL"], date: "2025-12-25T19:30:00Z", venue: "American Airlines Center", city: "Dallas" },
  { id: "nba-rs-xmas-4", summary: "Thunder vs. Nuggets", phase: "Regular Season — Christmas", teams: ["OKC", "DEN"], date: "2025-12-25T22:00:00Z", venue: "Ball Arena", city: "Denver" },
  { id: "nba-rs-xmas-5", summary: "Suns vs. Bucks", phase: "Regular Season — Christmas", teams: ["PHX", "MIL"], date: "2025-12-25T12:00:00Z", venue: "Fiserv Forum", city: "Milwaukee" },
  // Marquee regular season — ensures all 30 teams appear
  { id: "nba-rs-003", summary: "Raptors vs. Bulls", phase: "Regular Season", teams: ["TOR", "CHI"], date: "2025-11-05T00:00:00Z", venue: "United Center", city: "Chicago" },
  { id: "nba-rs-004", summary: "Nets vs. Cavaliers", phase: "Regular Season", teams: ["BKN", "CLE"], date: "2025-11-08T00:30:00Z", venue: "Rocket Mortgage FieldHouse", city: "Cleveland" },
  { id: "nba-rs-005", summary: "Hornets vs. Hawks", phase: "Regular Season", teams: ["CHA", "ATL"], date: "2025-11-12T00:30:00Z", venue: "State Farm Arena", city: "Atlanta" },
  { id: "nba-rs-006", summary: "Pistons vs. Pacers", phase: "Regular Season", teams: ["DET", "IND"], date: "2025-11-15T00:00:00Z", venue: "Gainbridge Fieldhouse", city: "Indianapolis" },
  { id: "nba-rs-007", summary: "Wizards vs. Magic", phase: "Regular Season", teams: ["WAS", "ORL"], date: "2025-11-19T00:00:00Z", venue: "Kia Center", city: "Orlando" },
  { id: "nba-rs-008", summary: "Blazers vs. Clippers", phase: "Regular Season", teams: ["POR", "LAC"], date: "2025-11-22T03:30:00Z", venue: "Intuit Dome", city: "Inglewood" },
  { id: "nba-rs-009", summary: "Jazz vs. Grizzlies", phase: "Regular Season", teams: ["UTA", "MEM"], date: "2025-11-26T01:00:00Z", venue: "FedExForum", city: "Memphis" },
  { id: "nba-rs-010", summary: "Spurs vs. Rockets", phase: "Regular Season", teams: ["SAS", "HOU"], date: "2025-12-03T01:00:00Z", venue: "Toyota Center", city: "Houston" },
  { id: "nba-rs-011", summary: "Pelicans vs. Heat", phase: "Regular Season", teams: ["NOP", "MIA"], date: "2025-12-10T00:30:00Z", venue: "Kaseya Center", city: "Miami" },
  { id: "nba-rs-012", summary: "T-Wolves vs. Kings", phase: "Regular Season", teams: ["MIN", "SAC"], date: "2025-12-17T03:00:00Z", venue: "Golden 1 Center", city: "Sacramento" },
  { id: "nba-rs-013", summary: "Raptors vs. Celtics", phase: "Regular Season", teams: ["TOR", "BOS"], date: "2026-01-10T00:30:00Z", venue: "TD Garden", city: "Boston" },
  { id: "nba-rs-014", summary: "Warriors vs. Thunder", phase: "Regular Season", teams: ["GSW", "OKC"], date: "2026-01-17T01:00:00Z", venue: "Paycom Center", city: "Oklahoma City" },
  { id: "nba-rs-015", summary: "Spurs vs. Mavericks", phase: "Regular Season", teams: ["SAS", "DAL"], date: "2026-01-24T01:30:00Z", venue: "American Airlines Center", city: "Dallas" },
  { id: "nba-rs-016", summary: "Hawks vs. Knicks", phase: "Regular Season", teams: ["ATL", "NYK"], date: "2026-02-07T00:30:00Z", venue: "Madison Square Garden", city: "New York" },
  // MLK Day
  { id: "nba-rs-mlk", summary: "Lakers vs. Celtics", phase: "Regular Season — MLK Day", teams: ["LAL", "BOS"], date: "2026-01-19T20:00:00Z", venue: "TD Garden", city: "Boston" },
  // All-Star Weekend
  { id: "nba-asg", summary: "NBA All-Star Game", phase: "All-Star Weekend", teams: [], date: "2026-02-15T20:00:00Z", venue: "Smoothie King Center", city: "New Orleans" },
];

const nbaRegularEvents = nbaRegularSeason.map((g) => ({
  id: g.id, tournamentId: "nba-playoffs-2026", sport: "basketball", phase: g.phase,
  isKnockout: false, summary: g.summary, countryCodesInvolved: g.teams,
  dateUTC: g.date, timeTBD: false, durationMinutes: 150,
  venue: g.venue, city: g.city,
}));

// Playoffs
const nbaSeries = [
  { id: "nba-e-r1-1", summary: "Celtics vs. Heat", phase: "First Round", teams: ["BOS", "MIA"], date: "2026-04-19T17:00:00Z", venue: "TD Garden", city: "Boston" },
  { id: "nba-e-r1-2", summary: "Knicks vs. Pacers", phase: "First Round", teams: ["NYK", "IND"], date: "2026-04-19T19:30:00Z", venue: "Madison Square Garden", city: "New York" },
  { id: "nba-e-r1-3", summary: "Bucks vs. Cavaliers", phase: "First Round", teams: ["MIL", "CLE"], date: "2026-04-20T13:00:00Z", venue: "Fiserv Forum", city: "Milwaukee" },
  { id: "nba-e-r1-4", summary: "76ers vs. Magic", phase: "First Round", teams: ["PHI", "ORL"], date: "2026-04-20T19:00:00Z", venue: "Wells Fargo Center", city: "Philadelphia" },
  { id: "nba-w-r1-1", summary: "Thunder vs. Pelicans", phase: "First Round", teams: ["OKC", "NOP"], date: "2026-04-18T20:00:00Z", venue: "Paycom Center", city: "Oklahoma City" },
  { id: "nba-w-r1-2", summary: "Nuggets vs. T-Wolves", phase: "First Round", teams: ["DEN", "MIN"], date: "2026-04-18T22:30:00Z", venue: "Ball Arena", city: "Denver" },
  { id: "nba-w-r1-3", summary: "Mavericks vs. Suns", phase: "First Round", teams: ["DAL", "PHX"], date: "2026-04-19T15:00:00Z", venue: "American Airlines Center", city: "Dallas" },
  { id: "nba-w-r1-4", summary: "Lakers vs. Kings", phase: "First Round", teams: ["LAL", "SAC"], date: "2026-04-20T15:30:00Z", venue: "Crypto.com Arena", city: "Los Angeles" },
  { id: "nba-e-r2-1", summary: "Eastern Semis — Series 1", phase: "Conference Semifinals", teams: ["BOS", "NYK"], date: "2026-05-03", venue: "TBD", city: "TBD" },
  { id: "nba-e-r2-2", summary: "Eastern Semis — Series 2", phase: "Conference Semifinals", teams: ["MIL", "PHI"], date: "2026-05-04", venue: "TBD", city: "TBD" },
  { id: "nba-w-r2-1", summary: "Western Semis — Series 1", phase: "Conference Semifinals", teams: ["OKC", "DEN"], date: "2026-05-03", venue: "TBD", city: "TBD" },
  { id: "nba-w-r2-2", summary: "Western Semis — Series 2", phase: "Conference Semifinals", teams: ["DAL", "LAL"], date: "2026-05-04", venue: "TBD", city: "TBD" },
  { id: "nba-e-cf", summary: "Eastern Conference Finals", phase: "Conference Finals", teams: ["BOS", "MIL"], date: "2026-05-19", venue: "TBD", city: "TBD" },
  { id: "nba-w-cf", summary: "Western Conference Finals", phase: "Conference Finals", teams: ["OKC", "DAL"], date: "2026-05-20", venue: "TBD", city: "TBD" },
  { id: "nba-finals", summary: "NBA Finals — Game 1", phase: "NBA Finals", teams: ["BOS", "OKC"], date: "2026-06-04T20:30:00Z", venue: "TD Garden", city: "Boston" },
];

const nbaPlayoffEvents = nbaSeries.map((s) => ({
  id: s.id, tournamentId: "nba-playoffs-2026", sport: "basketball", phase: s.phase,
  isKnockout: true, summary: s.summary, countryCodesInvolved: s.teams,
  dateUTC: s.date, timeTBD: !s.date.includes("T"), durationMinutes: 180,
  venue: s.venue, city: s.city,
}));

const nbaEvents = [...nbaRegularEvents, ...nbaPlayoffEvents];

// ========== March Madness 2026 — uses NCAA team codes ==========
const mmGames = [
  // Sweet 16
  { id: "mm-s16-1", summary: "Duke vs. Iowa State", phase: "Sweet 16", teams: ["DUKE", "ISU"], date: "2026-03-26T19:00:00Z", venue: "Chase Center", city: "San Francisco" },
  { id: "mm-s16-2", summary: "Houston vs. Marquette", phase: "Sweet 16", teams: ["HOU", "MARQ"], date: "2026-03-26T21:30:00Z", venue: "Chase Center", city: "San Francisco" },
  { id: "mm-s16-3", summary: "UConn vs. Baylor", phase: "Sweet 16", teams: ["CONN", "BAY"], date: "2026-03-27T19:00:00Z", venue: "Prudential Center", city: "Newark" },
  { id: "mm-s16-4", summary: "Auburn vs. Arizona", phase: "Sweet 16", teams: ["AUB", "AZ"], date: "2026-03-27T21:30:00Z", venue: "Prudential Center", city: "Newark" },
  { id: "mm-s16-5", summary: "Kansas vs. Florida", phase: "Sweet 16", teams: ["KU", "FLOR"], date: "2026-03-26T12:00:00Z", venue: "United Center", city: "Chicago" },
  { id: "mm-s16-6", summary: "Gonzaga vs. Kentucky", phase: "Sweet 16", teams: ["GONZ", "UK"], date: "2026-03-26T14:30:00Z", venue: "United Center", city: "Chicago" },
  { id: "mm-s16-7", summary: "Purdue vs. UNC", phase: "Sweet 16", teams: ["PUR", "UNC"], date: "2026-03-27T12:00:00Z", venue: "American Airlines Center", city: "Dallas" },
  { id: "mm-s16-8", summary: "Tennessee vs. Alabama", phase: "Sweet 16", teams: ["TENN", "ALAB"], date: "2026-03-27T14:30:00Z", venue: "American Airlines Center", city: "Dallas" },
  // Elite 8
  { id: "mm-e8-1", summary: "Elite Eight — West", phase: "Elite Eight", teams: ["DUKE", "HOU"], date: "2026-03-28T18:00:00Z", venue: "Chase Center", city: "San Francisco" },
  { id: "mm-e8-2", summary: "Elite Eight — East", phase: "Elite Eight", teams: ["CONN", "AUB"], date: "2026-03-28T20:30:00Z", venue: "Prudential Center", city: "Newark" },
  { id: "mm-e8-3", summary: "Elite Eight — Midwest", phase: "Elite Eight", teams: ["KU", "GONZ"], date: "2026-03-29T14:00:00Z", venue: "United Center", city: "Chicago" },
  { id: "mm-e8-4", summary: "Elite Eight — South", phase: "Elite Eight", teams: ["PUR", "TENN"], date: "2026-03-29T16:30:00Z", venue: "American Airlines Center", city: "Dallas" },
  // Final Four
  { id: "mm-ff-1", summary: "Final Four — Game 1", phase: "Final Four", teams: ["DUKE", "CONN"], date: "2026-04-04T18:00:00Z", venue: "Lucas Oil Stadium", city: "Indianapolis" },
  { id: "mm-ff-2", summary: "Final Four — Game 2", phase: "Final Four", teams: ["KU", "PUR"], date: "2026-04-04T20:30:00Z", venue: "Lucas Oil Stadium", city: "Indianapolis" },
  // Championship
  { id: "mm-champ", summary: "National Championship", phase: "Championship", teams: ["DUKE", "KU"], date: "2026-04-06T21:00:00Z", venue: "Lucas Oil Stadium", city: "Indianapolis" },
];

const mmEvents = mmGames.map((g) => ({
  id: g.id, tournamentId: "march-madness-2026", sport: "basketball", phase: g.phase,
  isKnockout: true, summary: g.summary, countryCodesInvolved: g.teams,
  dateUTC: g.date, timeTBD: false, durationMinutes: 150,
  venue: g.venue, city: g.city,
}));

// ========== Tennis Grand Slams 2026 — now PLAYER based ==========
// Player codes: SIN=Sinner, ALC=Alcaraz, DJO=Djokovic, ZVE=Zverev, MED=Medvedev,
//   RUU=Ruud, FRI=Fritz, DEM=de Minaur, SWI=Swiatek, SAB=Sabalenka,
//   GAU=Gauff, ZHE=Zheng, PEG=Pegula, KEY=Keys

const aoMen = [
  { id: "tennis-ao-msf-1", phase: "Australian Open — Men's Semifinal", summary: "Sinner vs. Djokovic",
    players: ["SIN", "DJO"], date: "2026-01-29T09:30:00Z", score: "6-3, 6-7, 6-4",
    result: { SIN: "W", DJO: "L" },
    playerStats: [{ player: "Jannik Sinner", country: "ITA", stat: "14 Aces, 42 Winners" }] },
  { id: "tennis-ao-msf-2", phase: "Australian Open — Men's Semifinal", summary: "Alcaraz vs. Zverev",
    players: ["ALC", "ZVE"], date: "2026-01-29T04:00:00Z", score: "7-5, 6-4",
    result: { ALC: "W", ZVE: "L" },
    playerStats: [{ player: "Carlos Alcaraz", country: "ESP", stat: "10 Aces, 38 Winners" }] },
  { id: "tennis-ao-mf", phase: "Australian Open — Men's Final", summary: "Sinner vs. Alcaraz",
    players: ["SIN", "ALC"], date: "2026-02-01T08:30:00Z", score: "7-6, 3-6, 6-4, 6-3",
    result: { SIN: "W", ALC: "L" },
    playerStats: [{ player: "Jannik Sinner", country: "ITA", stat: "18 Aces, 51 Winners" }, { player: "Carlos Alcaraz", country: "ESP", stat: "12 Aces, 45 Winners" }] },
];

const aoWomen = [
  { id: "tennis-ao-wsf-1", phase: "Australian Open — Women's Semifinal", summary: "Swiatek vs. Gauff",
    players: ["SWI", "GAU"], date: "2026-01-28T09:30:00Z", score: "6-3, 7-5",
    result: { SWI: "W", GAU: "L" },
    playerStats: [{ player: "Iga Swiatek", country: "POL", stat: "5 Aces, 22 Winners" }] },
  { id: "tennis-ao-wsf-2", phase: "Australian Open — Women's Semifinal", summary: "Zheng vs. Keys",
    players: ["ZHE", "KEY"], date: "2026-01-28T04:00:00Z", score: "3-6, 6-4, 6-3",
    result: { ZHE: "L", KEY: "W" },
    playerStats: [{ player: "Madison Keys", country: "USA", stat: "8 Aces, 30 Winners" }] },
  { id: "tennis-ao-wf", phase: "Australian Open — Women's Final", summary: "Swiatek vs. Keys",
    players: ["SWI", "KEY"], date: "2026-01-31T08:30:00Z", score: "6-4, 7-5",
    result: { SWI: "W", KEY: "L" },
    playerStats: [{ player: "Iga Swiatek", country: "POL", stat: "4 Aces, 25 Winners" }, { player: "Madison Keys", country: "USA", stat: "6 Aces, 31 Winners" }] },
];

const tennisCompleted = [...aoMen, ...aoWomen].map((m) => ({
  id: m.id, tournamentId: "tennis-slams-2026", sport: "tennis", phase: m.phase,
  isKnockout: true, summary: m.summary, countryCodesInvolved: m.players,
  dateUTC: m.date, timeTBD: false, durationMinutes: 180,
  venue: "Rod Laver Arena", city: "Melbourne",
  score: m.score, result: m.result, playerStats: m.playerStats,
}));

const futureSlamData = [
  // French Open
  { id: "tennis-rg-msf-1", phase: "French Open — Men's SF", summary: "Alcaraz vs. Djokovic", players: ["ALC", "DJO"], date: "2026-06-05T11:00:00Z", venue: "Court Philippe-Chatrier", city: "Paris" },
  { id: "tennis-rg-msf-2", phase: "French Open — Men's SF", summary: "Sinner vs. Ruud", players: ["SIN", "RUU"], date: "2026-06-05T15:00:00Z", venue: "Court Philippe-Chatrier", city: "Paris" },
  { id: "tennis-rg-mf", phase: "French Open — Men's Final", summary: "Men's Final", players: [], date: "2026-06-07T13:00:00Z", venue: "Court Philippe-Chatrier", city: "Paris" },
  { id: "tennis-rg-wsf-1", phase: "French Open — Women's SF", summary: "Swiatek vs. Gauff", players: ["SWI", "GAU"], date: "2026-06-04T11:00:00Z", venue: "Court Philippe-Chatrier", city: "Paris" },
  { id: "tennis-rg-wsf-2", phase: "French Open — Women's SF", summary: "Zheng vs. Pegula", players: ["ZHE", "PEG"], date: "2026-06-04T15:00:00Z", venue: "Court Philippe-Chatrier", city: "Paris" },
  { id: "tennis-rg-wf", phase: "French Open — Women's Final", summary: "Women's Final", players: [], date: "2026-06-06T13:00:00Z", venue: "Court Philippe-Chatrier", city: "Paris" },
  // Wimbledon
  { id: "tennis-wim-msf-1", phase: "Wimbledon — Men's SF", summary: "Men's Semifinal 1", players: [], date: "2026-07-10T12:00:00Z", venue: "Centre Court", city: "London" },
  { id: "tennis-wim-msf-2", phase: "Wimbledon — Men's SF", summary: "Men's Semifinal 2", players: [], date: "2026-07-10T16:00:00Z", venue: "Centre Court", city: "London" },
  { id: "tennis-wim-mf", phase: "Wimbledon — Men's Final", summary: "Men's Final", players: [], date: "2026-07-12T13:00:00Z", venue: "Centre Court", city: "London" },
  { id: "tennis-wim-wsf-1", phase: "Wimbledon — Women's SF", summary: "Women's Semifinal 1", players: [], date: "2026-07-09T12:00:00Z", venue: "Centre Court", city: "London" },
  { id: "tennis-wim-wsf-2", phase: "Wimbledon — Women's SF", summary: "Women's Semifinal 2", players: [], date: "2026-07-09T16:00:00Z", venue: "Centre Court", city: "London" },
  { id: "tennis-wim-wf", phase: "Wimbledon — Women's Final", summary: "Women's Final", players: [], date: "2026-07-11T13:00:00Z", venue: "Centre Court", city: "London" },
  // US Open
  { id: "tennis-uso-msf-1", phase: "US Open — Men's SF", summary: "Men's Semifinal 1", players: [], date: "2026-09-11T18:00:00Z", venue: "Arthur Ashe Stadium", city: "New York" },
  { id: "tennis-uso-msf-2", phase: "US Open — Men's SF", summary: "Men's Semifinal 2", players: [], date: "2026-09-11T22:00:00Z", venue: "Arthur Ashe Stadium", city: "New York" },
  { id: "tennis-uso-mf", phase: "US Open — Men's Final", summary: "Men's Final", players: [], date: "2026-09-13T20:00:00Z", venue: "Arthur Ashe Stadium", city: "New York" },
  { id: "tennis-uso-wsf-1", phase: "US Open — Women's SF", summary: "Women's Semifinal 1", players: [], date: "2026-09-10T19:00:00Z", venue: "Arthur Ashe Stadium", city: "New York" },
  { id: "tennis-uso-wsf-2", phase: "US Open — Women's SF", summary: "Women's Semifinal 2", players: [], date: "2026-09-10T22:00:00Z", venue: "Arthur Ashe Stadium", city: "New York" },
  { id: "tennis-uso-wf", phase: "US Open — Women's Final", summary: "Women's Final", players: [], date: "2026-09-12T20:00:00Z", venue: "Arthur Ashe Stadium", city: "New York" },
];

const futureSlams = futureSlamData.map((m) => ({
  id: m.id, tournamentId: "tennis-slams-2026", sport: "tennis", phase: m.phase,
  isKnockout: true, summary: m.summary, countryCodesInvolved: m.players,
  dateUTC: m.date, timeTBD: false, durationMinutes: 180,
  venue: m.venue, city: m.city,
}));

// ========== Combine ==========
const allNewEvents = [
  ...f1Events, ...uclPlayoffEvents, ...uclR16Events, ...uclLateEvents,
  ...nbaEvents, ...mmEvents, ...tennisCompleted, ...futureSlams,
];

const combined = [...existing, ...allNewEvents];
writeFileSync("src/data/schedule.json", JSON.stringify(combined, null, 2) + "\n");

console.log(`\nAdded ${allNewEvents.length} events (total: ${combined.length})`);
console.log(`  F1: ${f1Events.length}`);
console.log(`  UCL: ${uclPlayoffEvents.length + uclR16Events.length + uclLateEvents.length}`);
console.log(`  NBA: ${nbaEvents.length} (${nbaRegularEvents.length} regular + ${nbaPlayoffEvents.length} playoffs)`);
console.log(`  March Madness: ${mmEvents.length}`);
console.log(`  Tennis: ${tennisCompleted.length + futureSlams.length}`);
