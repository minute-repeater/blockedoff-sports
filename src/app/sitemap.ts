import { MetadataRoute } from "next";
import tournaments from "@/data/tournaments.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sportscalendar.xyz";

  const tournamentEntries = tournaments.map((t) => ({
    url: `${base}/tournament/${t.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
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
    ...tournamentEntries,
  ];
}
