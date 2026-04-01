import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import tournaments from "@/data/tournaments.json";
import { getAllEvents } from "@/data/schedule-loader";
import { countries } from "@/data/countries";
import { Tournament, ScheduleEvent } from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";

const allTournaments = tournaments as Tournament[];
const allEvents = getAllEvents();

export function generateStaticParams() {
  return allTournaments.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = allTournaments.find((t) => t.id === slug);
  if (!t) return {};

  const title = `${t.shortName} Calendar — Subscribe to Live Schedule`;
  const description = `Subscribe to a live-updating ${t.name} calendar. Add ${t.shortName} schedule to Apple Calendar or Google Calendar. Auto-updates with times, scores, and stats.`;

  return {
    title,
    description,
    openGraph: {
      title: `${t.shortName} Calendar | SportsCalendar`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.shortName} Calendar | SportsCalendar`,
      description,
    },
  };
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const sMonth = s.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const eMonth = e.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${sMonth} — ${eMonth}`;
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = allTournaments.find((t) => t.id === slug);
  if (!tournament) notFound();

  const events = allEvents.filter((e) => e.tournamentId === slug);
  const isTeamBased = tournament.selectionType === "team";

  const countryCodesInEvents = isTeamBased
    ? []
    : [
        ...new Set(
          events.flatMap((e) => e.countryCodesInvolved).filter(Boolean)
        ),
      ].sort();
  const countriesForTournament = countryCodesInEvents
    .map((code) => countries.find((c) => c.code === code))
    .filter(Boolean);

  const dateRange = formatDateRange(
    tournament.startDate,
    tournament.endDate
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: tournament.name,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    location: {
      "@type": "Place",
      name: tournament.location,
    },
    description: `Live-updating calendar subscription for ${tournament.name}. ${events.length} events.`,
    url: `https://sportscalendar.xyz/tournament/${slug}`,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 flex-1 w-full">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: tournament.shortName },
        ]} />

        {/* Tournament hero */}
        <div className="text-center space-y-4 mb-10">
          <h1
            className="text-2xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            {tournament.name}
          </h1>
          <p className="text-muted text-base sm:text-lg">{dateRange}</p>
          <p className="text-muted text-sm">{tournament.location}</p>

          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {tournament.sports.map((s) => (
              <span key={s} className="sport-tag text-xs">
                {s.replace("formula-1", "F1")}
              </span>
            ))}
          </div>

          <p className="text-accent font-semibold text-sm mt-4">
            {events.length} event{events.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Pick your team/country */}
        <section className="mb-12">
          <h2
            className="text-lg sm:text-xl font-bold text-center mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            {isTeamBased
              ? "Pick your team to get started"
              : "Pick your country to get started"}
          </h2>

          {isTeamBased && tournament.teams ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl mx-auto">
              {tournament.teams.map((team) => (
                <Link
                  key={team.code}
                  href={`/?tournament=${slug}&country=${team.code}`}
                  className="card-interactive px-3.5 py-3.5 text-sm flex items-center gap-2.5 group"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="truncate font-medium group-hover:text-accent transition-colors">
                    {team.shortName}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-lg mx-auto">
              {countriesForTournament.map(
                (c) =>
                  c && (
                    <Link
                      key={c.code}
                      href={`/?tournament=${slug}&country=${c.code}`}
                      className="card-interactive px-3.5 py-3 text-sm flex items-center gap-2.5 group"
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span className="truncate font-medium group-hover:text-accent transition-colors">
                        {c.name}
                      </span>
                    </Link>
                  )
              )}
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="card p-6 sm:p-8 max-w-2xl mx-auto">
          <h2
            className="text-lg font-bold text-center mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              {
                num: "1",
                title: `Pick your ${isTeamBased ? "team" : "country"}`,
                desc: `Choose from the ${isTeamBased ? `${tournament.teams?.length} teams` : `${countriesForTournament.length} countries`} above`,
              },
              {
                num: "2",
                title: "Preview your schedule",
                desc: "See all matches with dates, times, and venues",
              },
              {
                num: "3",
                title: "Subscribe",
                desc: "Add to Apple Calendar or Google Calendar — auto-updates with times and scores",
              },
            ].map((step) => (
              <div key={step.num} className="space-y-2">
                <div className="step-dot step-dot-active mx-auto" style={{ width: 40, height: 40 }}>
                  {step.num}
                </div>
                <h3
                  className="font-bold text-sm"
                  style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Other tournaments */}
        <section className="mt-12 text-center">
          <h2
            className="text-xs font-bold text-muted uppercase tracking-wider mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Other tournaments
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {allTournaments
              .filter((t) => t.id !== slug)
              .map((t) => (
                <Link
                  key={t.id}
                  href={`/tournament/${t.id}`}
                  className="card-interactive px-4 py-2.5 text-sm font-medium"
                >
                  {t.shortName}
                </Link>
              ))}
          </div>
        </section>
      </main>

      <SiteFooter />
      <JsonLd data={jsonLd} />
    </div>
  );
}
