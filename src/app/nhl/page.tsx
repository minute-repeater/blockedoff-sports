import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import tournaments from "@/data/tournaments.json";
import { Tournament, TeamEntry } from "@/lib/types";

const allTournaments = tournaments as Tournament[];
const tournament = allTournaments.find((t) => t.id === "nhl-2025-26")!;
const teams = tournament.teams || [];

function getTeam(code: string): TeamEntry | undefined {
  return teams.find((t) => t.code === code);
}

const divisions: Record<string, { conference: string; teams: string[] }> = {
  Atlantic: { conference: "Eastern", teams: ["BOS", "BUF", "DET", "FLA", "MTL", "OTT", "TBL", "TOR"] },
  Metropolitan: { conference: "Eastern", teams: ["CAR", "CBJ", "NJD", "NYI", "NYR", "PHI", "PIT", "WSH"] },
  Central: { conference: "Western", teams: ["UTA", "CHI", "COL", "DAL", "MIN", "NSH", "STL", "WPG"] },
  Pacific: { conference: "Western", teams: ["ANA", "CGY", "EDM", "LAK", "SEA", "SJS", "VAN", "VGK"] },
};

const conferences = {
  Eastern: ["Atlantic", "Metropolitan"],
  Western: ["Central", "Pacific"],
};

export const metadata: Metadata = {
  title: "NHL 2025-26 Schedule Calendar | SportsCalendar",
  description:
    "Subscribe to the NHL 2025-26 season calendar. All 32 teams, regular season and Stanley Cup Playoffs. Free, auto-updating calendar for Apple Calendar, Google Calendar, and Outlook.",
  openGraph: {
    title: "NHL 2025-26 Schedule Calendar",
    description:
      "Free auto-updating NHL calendar with goalie and skater stats. Pick your team, subscribe, done.",
  },
};

export default function NHLPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "NHL 2025-26 Season",
    sport: "Ice Hockey",
    url: "https://sportscalendar.xyz/nhl",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <JsonLd data={jsonLd} />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "NHL" },
          ]}
        />

        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          NHL 2025-26 Schedule Calendar
        </h1>

        {/* Intro */}
        <section className="mb-10">
          <p className="text-muted leading-relaxed mb-3">
            Every game for your NHL team, right on your calendar. 32 teams
            across 4 divisions. Full regular season through the Stanley Cup
            Playoffs.
          </p>
          <p className="text-muted leading-relaxed">
            Free. No signup. Works with Apple Calendar, Google Calendar, and
            Outlook. Auto-updates every 6 hours with schedule changes and
            results.
          </p>
        </section>

        {/* Subscribe CTA */}
        <div className="card-accent p-5 sm:p-6 text-center mb-12">
          <p className="font-semibold mb-3">Get your NHL team calendar</p>
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Subscribe now
          </Link>
          <p className="text-xs text-muted mt-2">Free. No account needed. Auto-updates every 6 hours.</p>
        </div>

        {/* Feature highlight */}
        <section className="card p-5 sm:p-6 mb-12">
          <h2
            className="font-bold text-lg mb-2"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Goalie and Skater Stats
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            After each game, your calendar event includes the final score plus
            key stats for goalies (saves, save percentage) and top skaters
            (goals, assists, points). Check how your team did without leaving
            your calendar.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                              href={`/?tournament=nhl-2025-26&country=${code}`}
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
                desc: "Choose any of the 32 NHL teams. You get a calendar with only that team's games.",
              },
              {
                num: "2",
                title: "Subscribe",
                desc: "One tap to add to Apple Calendar, Google Calendar, or Outlook. Takes 10 seconds.",
              },
              {
                num: "3",
                title: "Stay updated",
                desc: "Schedule changes, scores, and player stats appear automatically. Refreshes every 6 hours.",
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
