import { MetadataRoute } from "next";
import tournaments from "@/data/tournaments.json";
import { Tournament } from "@/lib/types";

const allTournaments = tournaments as Tournament[];

// Map tournament IDs to their sport hub URL slugs
const tournamentToHub: Record<string, string> = {
  "wc2026": "world-cup-2026",
  "nba-playoffs-2026": "nba",
  "nhl-2025-26": "nhl",
  "mlb-2026": "mlb",
  "f1-2026": "f1",
  "march-madness-2026": "march-madness",
  "march-madness-women-2026": "march-madness",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sportscalendar.xyz";

  // Tournament detail pages
  const tournamentEntries = allTournaments.map((t) => ({
    url: `${base}/tournament/${t.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Sport hub pages
  const hubSlugs = [...new Set(Object.values(tournamentToHub))];
  const hubEntries = hubSlugs.map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${base}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${base}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${base}/today`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...hubEntries,
    ...tournamentEntries,
  ];
}
