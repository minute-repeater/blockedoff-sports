import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import tournaments from "@/data/tournaments.json";
import { Tournament, TeamEntry } from "@/lib/types";

const allTournaments = tournaments as Tournament[];
const tournament = allTournaments.find((t) => t.id === "mlb-2026")!;
const teams = tournament.teams || [];

function getTeam(code: string): TeamEntry | undefined {
  return teams.find((t) => t.code === code);
}

const divisions: Record<string, { league: string; teams: string[] }> = {
  "AL East": { league: "American League", teams: ["BAL", "BOS", "NYY", "TBR", "TOR"] },
  "AL Central": { league: "American League", teams: ["CHW", "CLE", "DET", "KCR", "MIN"] },
  "AL West": { league: "American League", teams: ["HOU", "LAA", "OAK", "SEA", "TEX"] },
  "NL East": { league: "National League", teams: ["ATL", "MIA", "NYM", "PHI", "WSN"] },
  "NL Central": { league: "National League", teams: ["CHC", "CIN", "MIL", "PIT", "STL"] },
  "NL West": { league: "National League", teams: ["ARI", "COL", "LAD", "SDP", "SFG"] },
};

const leagues = {
  "American League": ["AL East", "AL Central", "AL West"],
  "National League": ["NL East", "NL Central", "NL West"],
};

export const metadata: Metadata = {
  title: "MLB 2026 Schedule Calendar | SportsCalendar",
  description:
    "Subscribe to the MLB 2026 season calendar. All 30 teams, 2,429 games. Filter by team to get only your games. Free, auto-updating calendar for Apple Calendar, Google Calendar, and Outlook.",
  openGraph: {
    title: "MLB 2026 Schedule Calendar",
    description:
      "Free auto-updating MLB calendar. 30 teams, 2,429 games. Pick your team and subscribe.",
  },
};

export default function MLBPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "MLB 2026 Season",
    sport: "Baseball",
    url: "https://sportscalendar.xyz/mlb",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <JsonLd data={jsonLd} />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "MLB" },
          ]}
        />

        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          MLB 2026 Schedule Calendar
        </h1>

        {/* Intro */}
        <section className="mb-10">
          <p className="text-muted leading-relaxed mb-3">
            The MLB season is long. 30 teams play 2,429 total games from March
            through October. That is a lot of baseball. Subscribing to a
            filtered calendar for your team is the easiest way to keep track.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Pick your team below and you get a calendar with only their games.
            Scores are added after each game finishes.
          </p>
          <p className="text-muted leading-relaxed">
            Free. No signup. Works with Apple Calendar, Google Calendar, and
            Outlook. Auto-updates every 6 hours.
          </p>
        </section>

        {/* Subscribe CTA */}
        <div className="card-accent p-5 sm:p-6 text-center mb-12">
          <p className="font-semibold mb-3">Get your MLB team calendar</p>
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Subscribe now
          </Link>
          <p className="text-xs text-muted mt-2">Free. No account needed. Auto-updates every 6 hours.</p>
        </div>

        {/* Per-team filtering highlight */}
        <section className="card p-5 sm:p-6 mb-12">
          <h2
            className="font-bold text-lg mb-2"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Per-Team Filtering
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            With 2,429 games in a season, you do not want every single one on
            your calendar. Pick your team and you get only their 162 regular
            season games plus any postseason appearances. Clean and focused.
          </p>
        </section>

        {/* Teams by league and division */}
        {(Object.keys(leagues) as Array<keyof typeof leagues>).map(
          (league) => (
            <section key={league} className="mb-10">
              <h2
                className="text-xl sm:text-2xl font-bold mb-5"
                style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
              >
                {league}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {leagues[league].map((div) => (
                  <div key={div} className="card p-4">
                    <h3 className="font-bold text-xs text-muted uppercase tracking-wider mb-3">
                      {div}
                    </h3>
                    <ul className="space-y-2">
                      {divisions[div].teams.map((code) => {
                        const team = getTeam(code);
                        if (!team) return null;
                        return (
                          <li key={code}>
                            <Link
                              href={`/?tournament=mlb-2026&country=${code}`}
                              className="text-sm hover:text-accent transition-colors flex items-center gap-2"
                            >
                              <span
                                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: team.color }}
                              />
                              <span>{team.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )
        )}

        {/* How it works */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                title: "Pick your team",
                desc: "Choose any of the 30 MLB teams. You get a calendar with only that team's games.",
              },
              {
                num: "2",
                title: "Subscribe",
                desc: "One tap to add to Apple Calendar, Google Calendar, or Outlook. Takes 10 seconds.",
              },
              {
                num: "3",
                title: "Stay updated",
                desc: "Rainouts, schedule changes, and scores appear automatically. Refreshes every 6 hours.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center space-y-3">
                <div
                  className="step-dot step-dot-active w-12 h-12 text-lg mx-auto"
                  style={{ width: 48, height: 48 }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-bold text-sm"
                  style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other Sports */}
        <section>
          <h2
            className="text-xs font-bold text-muted uppercase tracking-wider mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Other Sports
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/world-cup-2026", label: "World Cup 2026" },
              { href: "/nba", label: "NBA" },
              { href: "/nhl", label: "NHL" },
              { href: "/f1", label: "Formula 1" },
              { href: "/march-madness", label: "March Madness" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card-interactive px-4 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
