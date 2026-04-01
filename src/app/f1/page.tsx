import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import tournaments from "@/data/tournaments.json";
import { Tournament, TeamEntry } from "@/lib/types";
import { getAllEvents } from "@/data/schedule-loader";

const allTournaments = tournaments as Tournament[];
const tournament = allTournaments.find((t) => t.id === "f1-2026")!;
const teams = tournament.teams || [];

export const metadata: Metadata = {
  title: "Formula 1 2026 Race Calendar | SportsCalendar",
  description:
    "Subscribe to the F1 2026 race calendar. 22 races, 11 constructors, every session. Free, auto-updating calendar for Apple Calendar, Google Calendar, and Outlook.",
  openGraph: {
    title: "Formula 1 2026 Race Calendar",
    description:
      "Free auto-updating F1 calendar with podium results and top-10 finishers. Pick your constructor, subscribe, done.",
  },
};

export default function F1Page() {
  const events = getAllEvents().filter((e) => e.tournamentId === "f1-2026");

  // Get race events (not practice/quali, just the main races or all unique race weekends)
  const races = events
    .filter((e) => e.phase === "Race" || e.phase === "Grand Prix")
    .sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

  // If no "Race" phase events, just show all events grouped by summary
  const raceEvents = races.length > 0 ? races : events
    .sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

  // Build JSON-LD for first 3 races
  const first3 = raceEvents.slice(0, 3);
  const jsonLdEvents = first3.map((e) => ({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: e.summary,
    startDate: e.dateUTC,
    location: {
      "@type": "Place",
      name: e.venue,
      address: e.city,
    },
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {jsonLdEvents.map((ld, i) => (
        <JsonLd key={i} data={ld} />
      ))}

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "F1" },
          ]}
        />

        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          Formula 1 2026 Race Calendar
        </h1>

        {/* Intro */}
        <section className="mb-10">
          <p className="text-muted leading-relaxed mb-3">
            The 2026 F1 season features 22 races and 11 constructors. New
            regulations bring major changes to power units and aerodynamics.
            Subscribe to get every session on your calendar.
          </p>
          <p className="text-muted leading-relaxed">
            Free. No signup. Works with Apple Calendar, Google Calendar, and
            Outlook. Auto-updates every 6 hours with results and standings.
          </p>
        </section>

        {/* Subscribe CTA */}
        <div className="card-accent p-5 sm:p-6 text-center mb-12">
          <p className="font-semibold mb-3">Get the F1 2026 race calendar</p>
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
            Podium Results and Top 10
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            After each race, your calendar event is enriched with the podium
            finishers and full top-10 results. See who won, who retired, and
            how your constructor performed without opening a separate app.
          </p>
        </section>

        {/* Race Calendar */}
        {raceEvents.length > 0 && (
          <section className="mb-12">
            <h2
              className="text-xl sm:text-2xl font-bold mb-6"
              style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
            >
              2026 Race Calendar
            </h2>
            <div className="space-y-2">
              {raceEvents.map((race, i) => {
                const date = new Date(race.dateUTC);
                const dateStr = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                });
                return (
                  <div
                    key={race.id}
                    className="card p-3 sm:p-4 flex items-center gap-4"
                  >
                    <span className="text-xs text-muted font-mono w-6 text-right shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs text-muted w-16 shrink-0">
                      {dateStr}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {race.summary}
                      </div>
                      <div className="text-xs text-muted">
                        {race.venue} · {race.city}
                      </div>
                    </div>
                    {race.score && (
                      <span className="text-xs text-muted shrink-0">
                        {race.score}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Constructors */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Constructors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teams.map((team: TeamEntry) => (
              <Link
                key={team.code}
                href={`/?tournament=f1-2026&country=${team.code}`}
                className="card-interactive p-4 flex items-center gap-3"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: team.color }}
                />
                <div>
                  <div className="text-sm font-semibold">{team.name}</div>
                  <div className="text-xs text-muted">{team.shortName}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

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
                title: "Pick your constructor",
                desc: "Choose from all 11 F1 constructors. You get a calendar filtered to their sessions and results.",
              },
              {
                num: "2",
                title: "Subscribe",
                desc: "One tap to add to Apple Calendar, Google Calendar, or Outlook. Takes 10 seconds.",
              },
              {
                num: "3",
                title: "Stay updated",
                desc: "Session times, results, and standings appear automatically. Refreshes every 6 hours.",
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
              { href: "/mlb", label: "MLB" },
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
