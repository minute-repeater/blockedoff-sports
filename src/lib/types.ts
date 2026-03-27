export interface TeamEntry {
  code: string; // Short code (e.g. "BOS", "RBR", "LIV")
  name: string; // Full name (e.g. "Boston Celtics")
  shortName: string; // Display name (e.g. "Celtics")
  color: string; // Hex accent color
  textColor?: string; // Hex text-on-accent color, defaults to "#ffffff"
}

export interface Tournament {
  id: string;
  name: string;
  shortName: string;
  year: number;
  startDate: string; // ISO date
  endDate: string;
  location: string;
  sports: string[];
  selectionType: "country" | "team"; // How users pick their filter
  teams?: TeamEntry[]; // Present when selectionType === "team"
}

export interface PlayerStat {
  player: string;
  country: string; // ISO 3166-1 alpha-3
  stat: string; // e.g. "2 Goals", "1 Assist", "35 Saves"
}

export interface BroadcastInfo {
  country: string; // e.g. "US", "CA", "UK"
  channel: string; // e.g. "ESPN", "TSN", "BBC One"
}

export interface PreGameContext {
  h2hRecord?: string; // e.g. "CAN leads 3-1-2"
  injuryReport?: string[]; // e.g. ["Davies (hamstring) — Doubtful"]
  bettingLine?: string; // e.g. "CAN -1.5, O/U 2.5"
  formGuide?: string; // e.g. "CAN: WWDLW | MAR: WLWWW"
}

export interface DetailedBoxScore {
  player: string;
  country: string;
  statLine: string; // e.g. "32 PTS, 8 REB, 6 AST"
}

export interface ProEventData {
  broadcasts?: BroadcastInfo[];
  preGame?: PreGameContext;
  detailedBoxScore?: DetailedBoxScore[];
  lineupNotes?: string[];
}

export interface ScheduleEvent {
  id: string;
  tournamentId: string;
  sport: string;
  phase: string; // "Group Stage", "Round of 16", "Quarter-Final", "Semi-Final", "Final", etc.
  isKnockout: boolean;
  summary: string; // e.g. "Canada vs. Morocco" or "Bahrain Grand Prix"
  countryCodesInvolved: string[]; // Country alpha-3 codes OR team codes depending on tournament
  dateUTC: string; // ISO datetime in UTC, or ISO date if TBD
  timeTBD: boolean;
  durationMinutes: number;
  venue: string;
  city: string;
  score?: string; // e.g. "4-1" or "Gold: NOR, Silver: AUT, Bronze: CHE"
  result?: Record<string, "W" | "L" | "D" | "N/A">; // keyed by country/team code
  playerStats?: PlayerStat[];
  proData?: ProEventData; // Pro tier enrichment — only in schedule-pro.json
}

export interface ProToken {
  token: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  plan: "pro-yearly";
  stripeSessionId?: string;
}

export interface Country {
  code: string; // ISO 3166-1 alpha-3
  name: string;
  flag: string; // emoji
}
