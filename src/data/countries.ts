import { Country } from "@/lib/types";

// Map of ISO 3166-1 alpha-3 codes to country data
// Flag emojis are generated from the alpha-2 code
function alpha3ToFlag(alpha2: string): string {
  return alpha2
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

const countriesRaw: { code: string; name: string; alpha2: string }[] = [
  { code: "ARG", name: "Argentina", alpha2: "AR" },
  { code: "AUS", name: "Australia", alpha2: "AU" },
  { code: "AUT", name: "Austria", alpha2: "AT" },
  { code: "BEL", name: "Belgium", alpha2: "BE" },
  { code: "BRA", name: "Brazil", alpha2: "BR" },
  { code: "CAN", name: "Canada", alpha2: "CA" },
  { code: "CHE", name: "Switzerland", alpha2: "CH" },
  { code: "CHN", name: "China", alpha2: "CN" },
  { code: "CMR", name: "Cameroon", alpha2: "CM" },
  { code: "CZE", name: "Czechia", alpha2: "CZ" },
  { code: "DEU", name: "Germany", alpha2: "DE" },
  { code: "DNK", name: "Denmark", alpha2: "DK" },
  { code: "ESP", name: "Spain", alpha2: "ES" },
  { code: "FIN", name: "Finland", alpha2: "FI" },
  { code: "FRA", name: "France", alpha2: "FR" },
  { code: "GBR", name: "Great Britain", alpha2: "GB" },
  { code: "GRC", name: "Greece", alpha2: "GR" },
  { code: "HRV", name: "Croatia", alpha2: "HR" },
  { code: "IRN", name: "Iran", alpha2: "IR" },
  { code: "ITA", name: "Italy", alpha2: "IT" },
  { code: "JPN", name: "Japan", alpha2: "JP" },
  { code: "KOR", name: "South Korea", alpha2: "KR" },
  { code: "LVA", name: "Latvia", alpha2: "LV" },
  { code: "MAR", name: "Morocco", alpha2: "MA" },
  { code: "MCO", name: "Monaco", alpha2: "MC" },
  { code: "MEX", name: "Mexico", alpha2: "MX" },
  { code: "NLD", name: "Netherlands", alpha2: "NL" },
  { code: "NOR", name: "Norway", alpha2: "NO" },
  { code: "NZL", name: "New Zealand", alpha2: "NZ" },
  { code: "POL", name: "Poland", alpha2: "PL" },
  { code: "PRT", name: "Portugal", alpha2: "PT" },
  { code: "SEN", name: "Senegal", alpha2: "SN" },
  { code: "SRB", name: "Serbia", alpha2: "RS" },
  { code: "SVK", name: "Slovakia", alpha2: "SK" },
  { code: "SVN", name: "Slovenia", alpha2: "SI" },
  { code: "SWE", name: "Sweden", alpha2: "SE" },
  { code: "THA", name: "Thailand", alpha2: "TH" },
  { code: "USA", name: "United States", alpha2: "US" },
  { code: "ZAF", name: "South Africa", alpha2: "ZA" },
  { code: "QAT", name: "Qatar", alpha2: "QA" },
  { code: "HTI", name: "Haiti", alpha2: "HT" },
  { code: "SCO", name: "Scotland", alpha2: "GB" },
  { code: "PRY", name: "Paraguay", alpha2: "PY" },
  { code: "CUW", name: "Curaçao", alpha2: "CW" },
  { code: "CIV", name: "Ivory Coast", alpha2: "CI" },
  { code: "ECU", name: "Ecuador", alpha2: "EC" },
  { code: "TUN", name: "Tunisia", alpha2: "TN" },
  { code: "EGY", name: "Egypt", alpha2: "EG" },
  { code: "CPV", name: "Cape Verde", alpha2: "CV" },
  { code: "SAA", name: "Saudi Arabia", alpha2: "SA" },
  { code: "URY", name: "Uruguay", alpha2: "UY" },
  { code: "DZA", name: "Algeria", alpha2: "DZ" },
  { code: "JOR", name: "Jordan", alpha2: "JO" },
  { code: "UZB", name: "Uzbekistan", alpha2: "UZ" },
  { code: "COL", name: "Colombia", alpha2: "CO" },
  { code: "GHA", name: "Ghana", alpha2: "GH" },
  { code: "PAN", name: "Panama", alpha2: "PA" },
];

export const countries: Country[] = countriesRaw.map((c) => ({
  code: c.code,
  name: c.name,
  flag: alpha3ToFlag(c.alpha2),
}));

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code.toUpperCase());
}
