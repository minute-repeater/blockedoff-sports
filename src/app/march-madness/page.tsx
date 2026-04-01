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
const mensTournament = allTournaments.find((t) => t.id === "march-madness-2026")!;
const womensTournament = allTournaments.find((t) => t.id === "march-madness-women-2026")!;
const mensTeams = mensTournament.teams || [];
const womensTeams = womensTournament.teams || [];

export const metadata: Metadata = {
  title: "March Madness 2026 Calendar | SportsCalendar",
  description:
    "Subscribe to the March Madness 2026 calendar. Men's (64 teams, 63 games) and Women's (32 teams, 38 games) NCAA tournaments. Free, auto-updating calendar for Apple Calendar, Google Calendar, and Outlook.",
  openGraph: {
    title: "March Madness 2026 Calendar",
    description:
      "Free auto-updating calendar for every March Madness 2026 game. Men's and Women's tournaments.",
  },
};

export default function MarchMadnessPage() {
  const mensEvents = getAllEvents().filter(
    (e) => e.tournamentId === "march-madness-2026"
  );
  const womensEvents = getAllEvents().filter(
    (e) => e.tournamentId === "march-madness-women-2026"
  );

  // Group events by phase
  const phaseOrder = [
    "First Round",
    "Second Round",
    "Sweet Sixteen",
    "Sweet 16",
    "Elite Eight",
    "Elite 8",
    "Final Four",
    "Championship",
    "Final",
  ];

  function groupByPhase(events: typeof mensEvents) {
    const grouped: Record<string, typeof events> = {};
    for (const e of events) {
      if (!grouped[e.phase]) grouped[e.phase] = [];
      grouped[e.phase].push(e);
    }
    // Sort by known phase order, then alphabetically for unknowns
    const sorted = Object.keys(grouped).sort((a, b) => {
      const ai = phaseOrder.findIndex((p) => a.includes(p));
      const bi = phaseOrder.findIndex((p) => b.includes(p));
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return sorted.map((phase) => ({ phase, events: grouped[phase] }));
  }

  const mensPhases = groupByPhase(mensEvents);
  const womensPhases = groupByPhase(womensEvents);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "NCAA March Madness 2026",
    startDate: mensTournament.startDate,
    endDate: mensTournament.endDate,
    location: {
      "@type": "Place",
      name: "United States",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <JsonLd data={jsonLd} />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "March Madness" },
          ]}
        />

        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          March Madness 2026 Calendar
        </h1>

        {/* Intro */}
        <section className="mb-10">
          <p className="text-muted leading-relaxed mb-3">
            The NCAA tournament. Single elimination. Win or go home. The
            Men&apos;s bracket has 64 teams and 63 games. The Women&apos;s
            bracket has 32 teams and 38 games. Every upset, every buzzer
            beater, right on your calendar.
          </p>
          <p className="text-muted leading-relaxed">
            Subscribe to follow your team through the bracket. Scores update
            automatically after each game. Free, no signup, works with Apple
            Calendar, Google Calendar, and Outlook.
          </p>
        </section>

        {/* Subscribe CTA */}
        <div className="card-accent p-5 sm:p-6 text-center mb-12">
          <p className="font-semibold mb-3">Get the March Madness 2026 calendar</p>
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Subscribe now
          </Link>
          <p className="text-xs text-muted mt-2">Free. No account needed. Auto-updates every 6 hours.</p>
        </div>

        {/* Men's Tournament */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Men&apos;s Tournament
          </h2>
          <p className="text-sm text-muted mb-4">
            64 teams. 63 games. {mensTournament.startDate.split("-").slice(1).join("/")} to{" "}
            {mensTournament.endDate.split("-").slice(1).join("/")}.
          </p>

          {/* Phases */}
          {mensPhases.length > 0 && (
            <div className="space-y-4 mb-6">
              {mensPhases.map(({ phase, events }) => (
                <div key={phase} className="card p-4">
                  <h3 className="font-bold text-sm mb-1">{phase}</h3>
                  <p className="text-xs text-muted">
                    {events.length} game{events.length !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Teams grid */}
          <h3
            className="font-bold text-sm mb-3 text-muted uppercase tracking-wider"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            All 64 Teams
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {mensTeams.map((team: TeamEntry) => (
              <Link
                key={team.code}
                href={`/?tournament=march-madness-2026&country=${team.code}`}
                className="card-interactive p-2.5 flex items-center gap-2 text-xs"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: team.color }}
                />
                <span className="truncate">{team.shortName}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Women's Tournament */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Women&apos;s Tournament
          </h2>
          <p className="text-sm text-muted mb-4">
            32 teams. 38 games. {womensTournament.startDate.split("-").slice(1).join("/")} to{" "}
            {womensTournament.endDate.split("-").slice(1).join("/")}.
          </p>

          {/* Phases */}
          {womensPhases.length > 0 && (
            <div className="space-y-4 mb-6">
              {womensPhases.map(({ phase, events }) => (
                <div key={phase} className="card p-4">
                  <h3 className="font-bold text-sm mb-1">{phase}</h3>
                  <p className="text-xs text-muted">
                    {events.length} game{events.length !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Teams grid */}
          <h3
            className="font-bold text-sm mb-3 text-muted uppercase tracking-wider"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            All 32 Teams
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {womensTeams.map((team: TeamEntry) => (
              <Link
                key={team.code}
                href={`/?tournament=march-madness-women-2026&country=${team.code}`}
                className="card-interactive p-2.5 flex items-center gap-2 text-xs"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: team.color }}
                />
                <span className="truncate">{team.shortName}</span>
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
                title: "Pick your team",
                desc: "Choose from the Men's or Women's bracket. You get a calendar with all their tournament games.",
              },
              {
                num: "2",
                title: "Subscribe",
                desc: "One tap to add to Apple Calendar, Google Calendar, or Outlook. Takes 10 seconds.",
              },
              {
                num: "3",
                title: "Stay updated",
                desc: "Scores, bracket updates, and schedule changes appear automatically. Refreshes every 6 hours.",
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
              { href: "/f1", label: "Formula 1" },
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
