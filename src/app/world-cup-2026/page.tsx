import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import tournaments from "@/data/tournaments.json";
import { Tournament } from "@/lib/types";
import { getAllEvents } from "@/data/schedule-loader";
import { countries } from "@/data/countries";

const allTournaments = tournaments as Tournament[];
const tournament = allTournaments.find((t) => t.id === "wc2026")!;

export const metadata: Metadata = {
  title: "World Cup 2026 Calendar | SportsCalendar",
  description:
    "Subscribe to the FIFA World Cup 2026 calendar. 48 teams, 104 matches, 16 stadiums across the USA, Canada, and Mexico. Free, auto-updating calendar for Apple Calendar, Google Calendar, and Outlook.",
  openGraph: {
    title: "World Cup 2026 Calendar",
    description:
      "Free auto-updating calendar for every World Cup 2026 match. 48 teams, 104 matches, Jun 11 to Jul 19.",
  },
};

export default function WorldCup2026Page() {
  const events = getAllEvents().filter((e) => e.tournamentId === "wc2026");

  // Group events by phase for group stage
  const groupPhases = events
    .filter((e) => e.phase.startsWith("Group "))
    .reduce<Record<string, typeof events>>((acc, e) => {
      if (!acc[e.phase]) acc[e.phase] = [];
      acc[e.phase].push(e);
      return acc;
    }, {});

  const sortedGroups = Object.keys(groupPhases).sort();

  // Get unique teams per group from countryCodesInvolved
  const groupTeams = (phase: string): string[] => {
    const codes = new Set<string>();
    groupPhases[phase]?.forEach((e) =>
      e.countryCodesInvolved.forEach((c) => codes.add(c))
    );
    return Array.from(codes);
  };

  // Build JSON-LD for first 3 matches
  const first3 = events
    .sort((a, b) => a.dateUTC.localeCompare(b.dateUTC))
    .slice(0, 3);

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
    homeTeam: e.countryCodesInvolved[0],
    awayTeam: e.countryCodesInvolved[1],
  }));

  const getFlag = (code: string) => {
    const c = countries.find((co) => co.code === code);
    return c ? c.flag : "";
  };

  const getCountryName = (code: string) => {
    const c = countries.find((co) => co.code === code);
    return c ? c.name : code;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "World Cup 2026" },
          ]}
        />

        {jsonLdEvents.map((ld, i) => (
          <JsonLd key={i} data={ld} />
        ))}

        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          World Cup 2026 Calendar
        </h1>

        {/* Intro */}
        <section className="mb-10">
          <p className="text-muted leading-relaxed mb-3">
            The 2026 FIFA World Cup is the biggest yet. 48 teams. 104 matches.
            16 stadiums across the United States, Canada, and Mexico. The
            tournament runs from June 11 to July 19, 2026.
          </p>
          <p className="text-muted leading-relaxed mb-3">
            Subscribe to get every match on your calendar. Scores and stats are
            added automatically after each game. Free, no signup, works with
            Apple Calendar, Google Calendar, and Outlook.
          </p>
          <p className="text-muted leading-relaxed">
            Pick your country below and get a filtered calendar with only your
            team&apos;s matches.
          </p>
        </section>

        {/* Subscribe CTA */}
        <div className="card-accent p-5 sm:p-6 text-center mb-12">
          <p className="font-semibold mb-3">Get the World Cup 2026 calendar</p>
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Subscribe now
          </Link>
          <p className="text-xs text-muted mt-2">Free. No account needed. Auto-updates every 6 hours.</p>
        </div>

        {/* Group Stage Overview */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Group Stage Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedGroups.map((group) => {
              const teams = groupTeams(group);
              return (
                <div key={group} className="card p-4">
                  <h3 className="font-bold text-sm mb-3">{group}</h3>
                  <ul className="space-y-1.5">
                    {teams.map((code) => (
                      <li key={code}>
                        <Link
                          href={`/?tournament=wc2026&country=${code}`}
                          className="text-sm hover:text-accent transition-colors flex items-center gap-2"
                        >
                          <span>{getFlag(code)}</span>
                          <span>{getCountryName(code)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
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
                title: "Pick your country",
                desc: "Choose from all 48 qualified nations. You get a calendar filtered to just your team's matches.",
              },
              {
                num: "2",
                title: "Subscribe",
                desc: "One tap to add to Apple Calendar, Google Calendar, or Outlook. Takes 10 seconds.",
              },
              {
                num: "3",
                title: "Stay updated",
                desc: "Your calendar auto-refreshes every 6 hours. Schedule changes, scores, and stats appear automatically.",
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

        {/* FAQ */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            FAQ
          </h2>
          <div className="space-y-5">
            {[
              {
                q: "Is this really free?",
                a: "Yes. Completely free. No signup, no email, no account. Just pick your country and subscribe.",
              },
              {
                q: "How do I add it to Google Calendar?",
                a: "Click the Google Calendar button on the subscribe page. It opens Google Calendar with the subscription pre-filled. One click to confirm.",
              },
              {
                q: "Will I see scores after matches?",
                a: "Yes. Scores and key player stats are added to each calendar event after the match finishes. Your calendar picks them up on the next refresh.",
              },
              {
                q: "What if match times change?",
                a: "The calendar auto-updates every 6 hours. When FIFA changes a kickoff time, your calendar reflects it automatically.",
              },
              {
                q: "Can I subscribe to all matches, not just one country?",
                a: "Yes. On the subscribe page, you can choose to include all matches or filter by country.",
              },
            ].map((item) => (
              <div key={item.q} className="card p-4 sm:p-5">
                <h3 className="font-semibold text-sm mb-1.5">{item.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.a}</p>
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
              { href: "/nba", label: "NBA" },
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
