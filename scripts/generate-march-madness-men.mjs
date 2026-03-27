import { writeFileSync, readFileSync } from "fs";

// Complete 2026 NCAA Men's Tournament bracket from web research
// Today is March 27, 2026 - Sweet 16 is in progress

const TOURNAMENT_ID = "march-madness-2026";
const OUTPUT = "src/data/schedules/march-madness-2026.json";
const OUTPUT_PRO = "src/data/schedules-pro/march-madness-2026.json";

// All teams that appeared in the tournament
const TEAM_COLORS = {
  DUKE: { name: "Duke Blue Devils", short: "Duke", color: "#003087" },
  SIEN: { name: "Siena Saints", short: "Siena", color: "#006747" },
  TCU: { name: "TCU Horned Frogs", short: "TCU", color: "#4D1979" },
  OHST: { name: "Ohio State Buckeyes", short: "Ohio State", color: "#BB0000" },
  STJO: { name: "St. John's Red Storm", short: "St. John's", color: "#D12027" },
  NIOW: { name: "Northern Iowa Panthers", short: "N. Iowa", color: "#4B116F" },
  KU: { name: "Kansas Jayhawks", short: "Kansas", color: "#0051BA" },
  CALB: { name: "Cal Baptist Lancers", short: "Cal Baptist", color: "#002855" },
  LOU: { name: "Louisville Cardinals", short: "Louisville", color: "#AD0000" },
  USF: { name: "South Florida Bulls", short: "USF", color: "#006747" },
  MSU: { name: "Michigan State Spartans", short: "Michigan St", color: "#18453B" },
  NDSU: { name: "North Dakota State Bison", short: "NDSU", color: "#0A5640" },
  UCLA: { name: "UCLA Bruins", short: "UCLA", color: "#2D68C4" },
  UCF: { name: "UCF Knights", short: "UCF", color: "#BA9B37", textColor: "#0f172a" },
  CONN: { name: "UConn Huskies", short: "UConn", color: "#000E2F" },
  FUR: { name: "Furman Paladins", short: "Furman", color: "#582C83" },
  FLOR: { name: "Florida Gators", short: "Florida", color: "#0021A5" },
  PVAM: { name: "Prairie View A&M Panthers", short: "Prairie View", color: "#524727" },
  IOWA: { name: "Iowa Hawkeyes", short: "Iowa", color: "#FFCD00", textColor: "#0f172a" },
  CLEM: { name: "Clemson Tigers", short: "Clemson", color: "#F56600" },
  VAND: { name: "Vanderbilt Commodores", short: "Vanderbilt", color: "#866D4B" },
  MCNS: { name: "McNeese State Cowboys", short: "McNeese", color: "#005CA9" },
  NEB: { name: "Nebraska Cornhuskers", short: "Nebraska", color: "#E41C38" },
  TROY: { name: "Troy Trojans", short: "Troy", color: "#8B2332" },
  VCU: { name: "VCU Rams", short: "VCU", color: "#000000" },
  UNC: { name: "North Carolina Tar Heels", short: "UNC", color: "#7BAFD4" },
  ILL: { name: "Illinois Fighting Illini", short: "Illinois", color: "#E84A27" },
  PENN: { name: "Penn Quakers", short: "Penn", color: "#011F5B" },
  TAM: { name: "Texas A&M Aggies", short: "Texas A&M", color: "#500000" },
  SMC: { name: "Saint Mary's Gaels", short: "Saint Mary's", color: "#003DA5" },
  HOU: { name: "Houston Cougars", short: "Houston", color: "#C8102E" },
  IDHO: { name: "Idaho Vandals", short: "Idaho", color: "#B5985A", textColor: "#0f172a" },
  AZ: { name: "Arizona Wildcats", short: "Arizona", color: "#CC0033" },
  LIU: { name: "Long Island Sharks", short: "Long Island", color: "#003087" },
  UTST: { name: "Utah State Aggies", short: "Utah State", color: "#0F2439" },
  NOVA: { name: "Villanova Wildcats", short: "Villanova", color: "#00205B" },
  HIPO: { name: "High Point Panthers", short: "High Point", color: "#330072" },
  WISC: { name: "Wisconsin Badgers", short: "Wisconsin", color: "#C5050C" },
  ARK: { name: "Arkansas Razorbacks", short: "Arkansas", color: "#9D2235" },
  HAW: { name: "Hawaii Rainbow Warriors", short: "Hawaii", color: "#024731" },
  TEX: { name: "Texas Longhorns", short: "Texas", color: "#BF5700" },
  BYU: { name: "BYU Cougars", short: "BYU", color: "#002E5D" },
  GONZ: { name: "Gonzaga Bulldogs", short: "Gonzaga", color: "#002967" },
  KENN: { name: "Kennesaw State Owls", short: "Kennesaw St", color: "#FDBB30", textColor: "#0f172a" },
  MIFL: { name: "Miami (FL) Hurricanes", short: "Miami (FL)", color: "#F47321" },
  MIZZ: { name: "Missouri Tigers", short: "Missouri", color: "#F1B82D", textColor: "#0f172a" },
  PUR: { name: "Purdue Boilermakers", short: "Purdue", color: "#CEB888", textColor: "#0f172a" },
  QUNS: { name: "Queens Royals", short: "Queens", color: "#0C2340" },
  MICH: { name: "Michigan Wolverines", short: "Michigan", color: "#00274C" },
  HOW: { name: "Howard Bison", short: "Howard", color: "#003A63" },
  STLOU: { name: "Saint Louis Billikens", short: "Saint Louis", color: "#003DA5" },
  UGA: { name: "Georgia Bulldogs", short: "Georgia", color: "#BA0C2F" },
  TTU: { name: "Texas Tech Red Raiders", short: "Texas Tech", color: "#CC0000" },
  AKR: { name: "Akron Zips", short: "Akron", color: "#041E42" },
  ALAB: { name: "Alabama Crimson Tide", short: "Alabama", color: "#9E1B32" },
  HOFS: { name: "Hofstra Pride", short: "Hofstra", color: "#003591" },
  UVA: { name: "Virginia Cavaliers", short: "Virginia", color: "#232D4B" },
  WRST: { name: "Wright State Raiders", short: "Wright State", color: "#007A33" },
  TENN: { name: "Tennessee Volunteers", short: "Tennessee", color: "#FF8200" },
  MIOH: { name: "Miami (OH) RedHawks", short: "Miami (OH)", color: "#C3142D" },
  UK: { name: "Kentucky Wildcats", short: "Kentucky", color: "#0033A0" },
  SCLA: { name: "Santa Clara Broncos", short: "Santa Clara", color: "#862633" },
  ISU: { name: "Iowa State Cyclones", short: "Iowa State", color: "#C8102E" },
  TNST: { name: "Tennessee State Tigers", short: "Tennessee St", color: "#00539B" },
};

// Games data from research
const games = [
  // === EAST REGION (Washington DC) ===
  // Round of 64 - March 20-21
  { id: "mm26-e-r64-1", round: "Round of 64", region: "East", date: "2026-03-20T16:30:00Z", t1: "DUKE", s1: 1, t2: "SIEN", s2: 16, score: "71-65", winner: "DUKE", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r64-2", round: "Round of 64", region: "East", date: "2026-03-20T19:00:00Z", t1: "TCU", s1: 9, t2: "OHST", s2: 8, score: "66-64", winner: "TCU", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r64-3", round: "Round of 64", region: "East", date: "2026-03-20T21:30:00Z", t1: "STJO", s1: 5, t2: "NIOW", s2: 12, score: "77-53", winner: "STJO", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r64-4", round: "Round of 64", region: "East", date: "2026-03-21T00:00:00Z", t1: "KU", s1: 4, t2: "CALB", s2: 13, score: "68-60", winner: "KU", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r64-5", round: "Round of 64", region: "East", date: "2026-03-21T16:30:00Z", t1: "LOU", s1: 6, t2: "USF", s2: 11, score: "83-79", winner: "LOU", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r64-6", round: "Round of 64", region: "East", date: "2026-03-21T19:00:00Z", t1: "MSU", s1: 3, t2: "NDSU", s2: 14, score: "92-67", winner: "MSU", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r64-7", round: "Round of 64", region: "East", date: "2026-03-21T21:30:00Z", t1: "UCLA", s1: 7, t2: "UCF", s2: 10, score: "75-71", winner: "UCLA", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r64-8", round: "Round of 64", region: "East", date: "2026-03-22T00:00:00Z", t1: "CONN", s1: 2, t2: "FUR", s2: 15, score: "82-71", winner: "CONN", venue: "Capital One Arena", city: "Washington" },
  // Round of 32 - March 22-23
  { id: "mm26-e-r32-1", round: "Round of 32", region: "East", date: "2026-03-22T17:00:00Z", t1: "DUKE", s1: 1, t2: "TCU", s2: 9, score: "81-58", winner: "DUKE", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r32-2", round: "Round of 32", region: "East", date: "2026-03-22T19:30:00Z", t1: "STJO", s1: 5, t2: "KU", s2: 4, score: "67-65", winner: "STJO", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r32-3", round: "Round of 32", region: "East", date: "2026-03-23T17:00:00Z", t1: "MSU", s1: 3, t2: "LOU", s2: 6, score: "77-69", winner: "MSU", venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-r32-4", round: "Round of 32", region: "East", date: "2026-03-23T19:30:00Z", t1: "CONN", s1: 2, t2: "UCLA", s2: 7, score: "73-57", winner: "CONN", venue: "Capital One Arena", city: "Washington" },
  // Sweet 16 - March 27 (TODAY - games tonight)
  { id: "mm26-e-s16-1", round: "Sweet 16", region: "East", date: "2026-03-27T23:10:00Z", t1: "DUKE", s1: 1, t2: "STJO", s2: 5, venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e-s16-2", round: "Sweet 16", region: "East", date: "2026-03-28T01:45:00Z", t1: "CONN", s1: 2, t2: "MSU", s2: 3, venue: "Capital One Arena", city: "Washington" },

  // === SOUTH REGION (Houston) ===
  // Round of 64
  { id: "mm26-s-r64-1", round: "Round of 64", region: "South", date: "2026-03-20T17:00:00Z", t1: "FLOR", s1: 1, t2: "PVAM", s2: 16, score: "114-55", winner: "FLOR", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r64-2", round: "Round of 64", region: "South", date: "2026-03-20T19:30:00Z", t1: "IOWA", s1: 9, t2: "CLEM", s2: 8, score: "67-61", winner: "IOWA", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r64-3", round: "Round of 64", region: "South", date: "2026-03-20T22:00:00Z", t1: "VAND", s1: 5, t2: "MCNS", s2: 12, score: "78-68", winner: "VAND", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r64-4", round: "Round of 64", region: "South", date: "2026-03-21T00:30:00Z", t1: "NEB", s1: 4, t2: "TROY", s2: 13, score: "76-47", winner: "NEB", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r64-5", round: "Round of 64", region: "South", date: "2026-03-21T17:00:00Z", t1: "VCU", s1: 11, t2: "UNC", s2: 6, score: "82-78", winner: "VCU", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r64-6", round: "Round of 64", region: "South", date: "2026-03-21T19:30:00Z", t1: "ILL", s1: 3, t2: "PENN", s2: 14, score: "105-70", winner: "ILL", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r64-7", round: "Round of 64", region: "South", date: "2026-03-21T22:00:00Z", t1: "TAM", s1: 10, t2: "SMC", s2: 7, score: "63-50", winner: "TAM", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r64-8", round: "Round of 64", region: "South", date: "2026-03-22T00:30:00Z", t1: "HOU", s1: 2, t2: "IDHO", s2: 15, score: "78-47", winner: "HOU", venue: "Toyota Center", city: "Houston" },
  // Round of 32
  { id: "mm26-s-r32-1", round: "Round of 32", region: "South", date: "2026-03-22T18:00:00Z", t1: "IOWA", s1: 9, t2: "FLOR", s2: 1, score: "73-72", winner: "IOWA", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r32-2", round: "Round of 32", region: "South", date: "2026-03-22T20:30:00Z", t1: "NEB", s1: 4, t2: "VAND", s2: 5, score: "74-72", winner: "NEB", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r32-3", round: "Round of 32", region: "South", date: "2026-03-23T18:00:00Z", t1: "ILL", s1: 3, t2: "VCU", s2: 11, score: "76-55", winner: "ILL", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-r32-4", round: "Round of 32", region: "South", date: "2026-03-23T20:30:00Z", t1: "HOU", s1: 2, t2: "TAM", s2: 10, score: "88-57", winner: "HOU", venue: "Toyota Center", city: "Houston" },
  // Sweet 16 - March 26-27 (COMPLETED)
  { id: "mm26-s-s16-1", round: "Sweet 16", region: "South", date: "2026-03-26T23:30:00Z", t1: "IOWA", s1: 9, t2: "NEB", s2: 4, score: "76-71", winner: "IOWA", venue: "Toyota Center", city: "Houston" },
  { id: "mm26-s-s16-2", round: "Sweet 16", region: "South", date: "2026-03-27T02:00:00Z", t1: "ILL", s1: 3, t2: "HOU", s2: 2, score: "65-55", winner: "ILL", venue: "Toyota Center", city: "Houston" },

  // === WEST REGION (San Jose) ===
  // Round of 64
  { id: "mm26-w-r64-1", round: "Round of 64", region: "West", date: "2026-03-20T18:00:00Z", t1: "AZ", s1: 1, t2: "LIU", s2: 16, score: "92-58", winner: "AZ", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r64-2", round: "Round of 64", region: "West", date: "2026-03-20T20:30:00Z", t1: "UTST", s1: 9, t2: "NOVA", s2: 8, score: "86-76", winner: "UTST", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r64-3", round: "Round of 64", region: "West", date: "2026-03-20T23:00:00Z", t1: "HIPO", s1: 12, t2: "WISC", s2: 5, score: "83-82", winner: "HIPO", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r64-4", round: "Round of 64", region: "West", date: "2026-03-21T01:30:00Z", t1: "ARK", s1: 4, t2: "HAW", s2: 13, score: "97-78", winner: "ARK", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r64-5", round: "Round of 64", region: "West", date: "2026-03-21T18:00:00Z", t1: "TEX", s1: 11, t2: "BYU", s2: 6, score: "79-71", winner: "TEX", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r64-6", round: "Round of 64", region: "West", date: "2026-03-21T20:30:00Z", t1: "GONZ", s1: 3, t2: "KENN", s2: 14, score: "73-64", winner: "GONZ", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r64-7", round: "Round of 64", region: "West", date: "2026-03-21T23:00:00Z", t1: "MIFL", s1: 7, t2: "MIZZ", s2: 10, score: "80-66", winner: "MIFL", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r64-8", round: "Round of 64", region: "West", date: "2026-03-22T01:30:00Z", t1: "PUR", s1: 2, t2: "QUNS", s2: 15, score: "104-69", winner: "PUR", venue: "SAP Center", city: "San Jose" },
  // Round of 32
  { id: "mm26-w-r32-1", round: "Round of 32", region: "West", date: "2026-03-22T18:30:00Z", t1: "AZ", s1: 1, t2: "UTST", s2: 9, score: "78-66", winner: "AZ", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r32-2", round: "Round of 32", region: "West", date: "2026-03-22T21:00:00Z", t1: "ARK", s1: 4, t2: "HIPO", s2: 12, score: "94-88", winner: "ARK", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r32-3", round: "Round of 32", region: "West", date: "2026-03-23T18:30:00Z", t1: "TEX", s1: 11, t2: "GONZ", s2: 3, score: "74-68", winner: "TEX", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-r32-4", round: "Round of 32", region: "West", date: "2026-03-23T21:00:00Z", t1: "PUR", s1: 2, t2: "MIFL", s2: 7, score: "79-69", winner: "PUR", venue: "SAP Center", city: "San Jose" },
  // Sweet 16 - March 27 (COMPLETED today)
  { id: "mm26-w-s16-1", round: "Sweet 16", region: "West", date: "2026-03-27T02:00:00Z", t1: "AZ", s1: 1, t2: "ARK", s2: 4, score: "109-88", winner: "AZ", venue: "SAP Center", city: "San Jose" },
  { id: "mm26-w-s16-2", round: "Sweet 16", region: "West", date: "2026-03-26T23:30:00Z", t1: "PUR", s1: 2, t2: "TEX", s2: 11, score: "79-77", winner: "PUR", venue: "SAP Center", city: "San Jose" },

  // === MIDWEST REGION (Chicago) ===
  // Round of 64
  { id: "mm26-m-r64-1", round: "Round of 64", region: "Midwest", date: "2026-03-20T17:30:00Z", t1: "MICH", s1: 1, t2: "HOW", s2: 16, score: "101-80", winner: "MICH", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r64-2", round: "Round of 64", region: "Midwest", date: "2026-03-20T20:00:00Z", t1: "STLOU", s1: 9, t2: "UGA", s2: 8, score: "102-77", winner: "STLOU", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r64-3", round: "Round of 64", region: "Midwest", date: "2026-03-20T22:30:00Z", t1: "TTU", s1: 5, t2: "AKR", s2: 12, score: "91-71", winner: "TTU", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r64-4", round: "Round of 64", region: "Midwest", date: "2026-03-21T01:00:00Z", t1: "ALAB", s1: 4, t2: "HOFS", s2: 13, score: "87-69", winner: "ALAB", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r64-5", round: "Round of 64", region: "Midwest", date: "2026-03-21T17:30:00Z", t1: "UVA", s1: 3, t2: "WRST", s2: 14, score: "82-73", winner: "UVA", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r64-6", round: "Round of 64", region: "Midwest", date: "2026-03-21T20:00:00Z", t1: "TENN", s1: 6, t2: "MIOH", s2: 11, score: "78-56", winner: "TENN", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r64-7", round: "Round of 64", region: "Midwest", date: "2026-03-21T22:30:00Z", t1: "UK", s1: 7, t2: "SCLA", s2: 10, score: "89-84", winner: "UK", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r64-8", round: "Round of 64", region: "Midwest", date: "2026-03-22T01:00:00Z", t1: "ISU", s1: 2, t2: "TNST", s2: 15, score: "108-74", winner: "ISU", venue: "United Center", city: "Chicago" },
  // Round of 32
  { id: "mm26-m-r32-1", round: "Round of 32", region: "Midwest", date: "2026-03-22T17:30:00Z", t1: "MICH", s1: 1, t2: "STLOU", s2: 9, score: "95-72", winner: "MICH", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r32-2", round: "Round of 32", region: "Midwest", date: "2026-03-22T20:00:00Z", t1: "ALAB", s1: 4, t2: "TTU", s2: 5, score: "90-65", winner: "ALAB", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r32-3", round: "Round of 32", region: "Midwest", date: "2026-03-23T17:30:00Z", t1: "TENN", s1: 6, t2: "UVA", s2: 3, score: "79-72", winner: "TENN", venue: "United Center", city: "Chicago" },
  { id: "mm26-m-r32-4", round: "Round of 32", region: "Midwest", date: "2026-03-23T20:00:00Z", t1: "ISU", s1: 2, t2: "UK", s2: 7, score: "82-63", winner: "ISU", venue: "United Center", city: "Chicago" },
  // Sweet 16 - March 27 (TONIGHT)
  { id: "mm26-m-s16-1", round: "Sweet 16", region: "Midwest", date: "2026-03-27T23:35:00Z", t1: "MICH", s1: 1, t2: "ALAB", s2: 4, venue: "United Center", city: "Chicago" },
  { id: "mm26-m-s16-2", round: "Sweet 16", region: "Midwest", date: "2026-03-28T02:10:00Z", t1: "ISU", s1: 2, t2: "TENN", s2: 6, venue: "United Center", city: "Chicago" },

  // === ELITE EIGHT (March 28-29) ===
  { id: "mm26-e8-east", round: "Elite Eight", region: "East", date: "2026-03-28T18:00:00Z", t1: null, s1: null, t2: null, s2: null, venue: "Capital One Arena", city: "Washington" },
  { id: "mm26-e8-south", round: "Elite Eight", region: "South", date: "2026-03-28T20:30:00Z", t1: "IOWA", s1: 9, t2: "ILL", s2: 3, venue: "Toyota Center", city: "Houston" },
  { id: "mm26-e8-west", round: "Elite Eight", region: "West", date: "2026-03-29T18:00:00Z", t1: "AZ", s1: 1, t2: "PUR", s2: 2, venue: "SAP Center", city: "San Jose" },
  { id: "mm26-e8-midwest", round: "Elite Eight", region: "Midwest", date: "2026-03-29T20:30:00Z", t1: null, s1: null, t2: null, s2: null, venue: "United Center", city: "Chicago" },

  // === FINAL FOUR (April 4) ===
  { id: "mm26-ff-1", round: "Final Four", region: "", date: "2026-04-04T18:00:00Z", t1: null, s1: null, t2: null, s2: null, venue: "Lucas Oil Stadium", city: "Indianapolis" },
  { id: "mm26-ff-2", round: "Final Four", region: "", date: "2026-04-04T20:30:00Z", t1: null, s1: null, t2: null, s2: null, venue: "Lucas Oil Stadium", city: "Indianapolis" },

  // === CHAMPIONSHIP (April 6) ===
  { id: "mm26-final", round: "National Championship", region: "", date: "2026-04-06T21:00:00Z", t1: null, s1: null, t2: null, s2: null, venue: "Lucas Oil Stadium", city: "Indianapolis" },
];

// Build events
const events = [];

for (const g of games) {
  const t1Info = g.t1 ? TEAM_COLORS[g.t1] : null;
  const t2Info = g.t2 ? TEAM_COLORS[g.t2] : null;

  let summary;
  if (t1Info && t2Info) {
    const seed1 = g.s1 ? `(${g.s1}) ` : "";
    const seed2 = g.s2 ? `(${g.s2}) ` : "";
    summary = `${seed1}${t1Info.short} vs. ${seed2}${t2Info.short}`;
  } else {
    summary = `${g.round}${g.region ? " — " + g.region : ""} (TBD)`;
  }

  const codesInvolved = [];
  if (g.t1) codesInvolved.push(g.t1);
  if (g.t2) codesInvolved.push(g.t2);

  const event = {
    id: g.id,
    tournamentId: TOURNAMENT_ID,
    sport: "basketball",
    phase: g.region ? `${g.round} — ${g.region}` : g.round,
    isKnockout: true,
    summary,
    countryCodesInvolved: codesInvolved,
    dateUTC: g.date,
    timeTBD: !g.date.includes("T"),
    durationMinutes: 120,
    venue: g.venue,
    city: g.city,
  };

  if (g.score) {
    event.score = g.score;
    if (g.winner && g.t1 && g.t2) {
      const loser = g.winner === g.t1 ? g.t2 : g.t1;
      event.result = { [g.winner]: "W", [loser]: "L" };
    }
  }

  events.push(event);
}

events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

writeFileSync(OUTPUT, JSON.stringify(events, null, 2));
writeFileSync(OUTPUT_PRO, JSON.stringify(events, null, 2));

console.log(`Done! ${events.length} March Madness Men's events written.`);

// Also update tournaments.json with the full team list
const tournamentsPath = "src/data/tournaments.json";
const tournaments = JSON.parse(readFileSync(tournamentsPath, "utf-8"));
const mmIndex = tournaments.findIndex(t => t.id === TOURNAMENT_ID);
if (mmIndex >= 0) {
  const allTeamCodes = [...new Set(games.flatMap(g => [g.t1, g.t2].filter(Boolean)))];
  tournaments[mmIndex].teams = allTeamCodes.map(code => {
    const info = TEAM_COLORS[code];
    const entry = { code, name: info.name, shortName: info.short, color: info.color };
    if (info.textColor) entry.textColor = info.textColor;
    return entry;
  });
  writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));
  console.log(`Updated tournaments.json with ${allTeamCodes.length} teams for ${TOURNAMENT_ID}`);
}
