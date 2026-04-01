import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import tournaments from "@/data/tournaments.json";
import { Tournament, TeamEntry } from "@/lib/types";

const allTournaments = tournaments as Tournament[];
const tournament = allTournaments.find((t) => t.id === "nba-playoffs-2026")!;
const teams = tournament.teams || [];

function getTeam(code: string): TeamEntry | undefined {
  return teams.find((t) => t.code === code);
}

const divisions: Record<string, { conference: string; teams: string[] }> = {
  Atlantic: { conference: "Eastern", teams: ["BOS", "BKN", "NYK", "PHI", "TOR"] },
  Central: { conference: "Eastern", teams: ["CHI", "CLE", "DET", "IND", "MIL"] },
  Southeast: { conference: "Eastern", teams: ["ATL", "CHA", "MIA", "ORL", "WAS"] },
  Northwest: { conference: "Western", teams: ["DEN", "MIN", "OKC", "POR", "UTA"] },
  Pacific: { conference: "Western", teams: ["GSW", "LAC", "LAL", "PHX", "SAC"] },
  Southwest: { conference: "Western", teams: ["DAL", "HOU", "MEM", "NOP", "SAS"] },
};

const conferences = {
  Eastern: ["Atlantic", "Central", "Southeast"],
  Western: ["Northwest", "Pacific", "Southwest"],
};

export const metadata: Metadata = {
  title: "NBA 2025-26 Schedule Calendar | SportsCalendar",
  description:
    "Subscribe to the NBA 2025-26 season calendar. All 30 teams, regular season and playoffs. Free, auto-updating calendar for Apple Calendar, Google Calendar, and Outlook.",
  openGraph: {
    title: "NBA 2025-26 Schedule Calendar",
    description:
      "Free auto-updating NBA calendar with box scores. Pick your team, subscribe, done.",
  },
};

export default function NBAPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "NBA 2025-26 Season",
    sport: "Basketball",
    url: "https://sportscalendar.xyz/nba",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <JsonLd data={jsonLd} />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "NBA" },
          ]}
        />

        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          NBA 2025-26 Schedule Calendar
        </h1>

        {/* Intro */}
        <section className="mb-10">
          <p className="text-muted leading-relaxed mb-3">
            Get every game for your NBA team on your calendar. 30 teams, full
            regular season and playoffs. Scores and box scores with the top 8
            scorers are added after each game.
          </p>
          <p className="text-muted leading-relaxed">
            Free. No signup. Works with Apple Calendar, Google Calendar, and
            Outlook. Your calendar auto-updates every 6 hours with schedule
            changes and results.
          </p>
        </section>

        {/* Subscribe CTA */}
        <div className="card-accent p-5 sm:p-6 text-center mb-12">
          <p className="font-semibold mb-3">Get your NBA team calendar</p>
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Subscribe now
          </Link>
          <p className="text-xs text-muted mt-2">Free. No account needed. Auto-updates every 6 hours.</p>
        </div>

        {/* Box score feature highlight */}
        <section className="card p-5 sm:p-6 mb-12">
          <h2
            className="font-bold text-lg mb-2"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Box Scores in Your Calendar
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            After each game, your calendar event is enriched with the final
            score and a box score showing the top 8 scorers with full stat
            lines (points, rebounds, assists). No need to open a separate app
            to check how your team did.
          </p>
        </section>

        {/* Teams by conference and division */}
        {(Object.keys(conferences) as Array<keyof typeof conferences>).map(
          (conf) => (
            <section key={conf} className="mb-10">
              <h2
                className="text-xl sm:text-2xl font-bold mb-5"
                style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
              >
                {conf} Conference
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {conferences[conf].map((div) => (
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
                              href={`/?tournament=nba-playoffs-2026&country=${code}`}
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
                desc: "Choose any of the 30 NBA teams. You get a calendar with only that team's games.",
              },
              {
                num: "2",
                title: "Subscribe",
                desc: "One tap to add to Apple Calendar, Google Calendar, or Outlook. Takes 10 seconds.",
              },
              {
                num: "3",
                title: "Stay updated",
                desc: "Schedule changes, scores, and box scores appear automatically. Your calendar refreshes every 6 hours.",
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
              { href: "/nhl", label: "NHL" },
              { href: "/mlb", label: "MLB" },
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
