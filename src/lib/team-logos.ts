// Maps our internal team codes to ESPN CDN logo URLs.
// ESPN uses lowercase abbreviations that sometimes differ from ours.

const MLB_CODE_MAP: Record<string, string> = {
  ARI: "ari", ATL: "atl", BAL: "bal", BOS: "bos", CHC: "chc",
  CHW: "chw", CIN: "cin", CLE: "cle", COL: "col", DET: "det",
  HOU: "hou", KCR: "kc", LAA: "laa", LAD: "lad", MIA: "mia",
  MIL: "mil", MIN: "min", NYM: "nym", NYY: "nyy", OAK: "oak",
  PHI: "phi", PIT: "pit", SDP: "sd", SEA: "sea", SFG: "sf",
  STL: "stl", TBR: "tb", TEX: "tex", TOR: "tor", WSN: "wsh",
};

const NBA_CODE_MAP: Record<string, string> = {
  ATL: "atl", BOS: "bos", BKN: "bkn", CHA: "cha", CHI: "chi",
  CLE: "cle", DAL: "dal", DEN: "den", DET: "det", GSW: "gs",
  HOU: "hou", IND: "ind", LAC: "lac", LAL: "lal", MEM: "mem",
  MIA: "mia", MIL: "mil", MIN: "min", NOP: "no", NYK: "ny",
  OKC: "okc", ORL: "orl", PHI: "phi", PHX: "phx", POR: "por",
  SAC: "sac", SAS: "sa", TOR: "tor", UTA: "utah", WAS: "wsh",
};

const NHL_CODE_MAP: Record<string, string> = {
  ANA: "ana", BOS: "bos", BUF: "buf", CGY: "cgy", CAR: "car",
  CHI: "chi", COL: "col", CBJ: "cbj", DAL: "dal", DET: "det",
  EDM: "edm", FLA: "fla", LAK: "la", MIN: "min", MTL: "mtl",
  NSH: "nsh", NJD: "nj", NYI: "nyi", NYR: "nyr", OTT: "ott",
  PHI: "phi", PIT: "pit", SJS: "sj", SEA: "sea", STL: "stl",
  TBL: "tb", TOR: "tor", UTA: "utah", VAN: "van", VGK: "vgs",
  WSH: "wsh", WPG: "wpg",
};

// F1 constructor logos from official F1 media CDN
const F1_CODE_MAP: Record<string, string> = {
  RBR: "red-bull-racing",
  FER: "ferrari",
  MCL: "mclaren",
  MER: "mercedes",
  AMR: "aston-martin",
  ALP: "alpine",
  VCA: "rb",
  WIL: "williams",
  SAU: "kick-sauber",
  HAA: "haas",
  // CAD (Cadillac) not yet available on F1 media CDN
};

export function getTeamLogoUrl(
  tournamentId: string,
  teamCode: string
): string | null {
  if (tournamentId === "mlb-2026") {
    const espnCode = MLB_CODE_MAP[teamCode];
    if (espnCode) return `https://a.espncdn.com/i/teamlogos/mlb/500/${espnCode}.png`;
  }
  if (tournamentId === "nba-playoffs-2026") {
    const espnCode = NBA_CODE_MAP[teamCode];
    if (espnCode) return `https://a.espncdn.com/i/teamlogos/nba/500/${espnCode}.png`;
  }
  if (tournamentId === "f1-2026") {
    const f1Slug = F1_CODE_MAP[teamCode];
    if (f1Slug) return `https://media.formula1.com/content/dam/fom-website/teams/2025/${f1Slug}.png`;
  }
  if (tournamentId === "nhl-2025-26") {
    const espnCode = NHL_CODE_MAP[teamCode];
    if (espnCode) return `https://a.espncdn.com/i/teamlogos/nhl/500/${espnCode}.png`;
  }
  return null;
}
