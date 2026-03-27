import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllEvents } from "@/data/schedule-loader";
import tournaments from "@/data/tournaments.json";
import { ScheduleEvent, Tournament } from "@/lib/types";

const allEvents = getAllEvents();
const allTournaments = tournaments as Tournament[];

export const metadata: Metadata = {
  title: "Today's Sports Schedule — What's On Today",
  description:
    "See all sports events happening today. NBA, F1, UEFA Champions League, World Cup, Tennis, March Madness, and Olympics — all in one place.",
  openGraph: {
    title: "Today's Sports Schedule | SportCalendar",
    description:
      "See all sports events happening today across NBA, F1, Champions League, World Cup, Tennis, and more.",
  },
};

function formatTime(dateUTC: string, timeTBD: boolean): string {
  if (timeTBD) return "Time TBD";
  const date = new Date(dateUTC);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: "America/New_York",
  });
}

function sportLabel(sport: string): string {
  return sport
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function TodayPage() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Also include yesterday and tomorrow for context
  const yesterday = new Date(now.getTime() - 86400000)
    .toISOString()
    .split("T")[0];
  const tomorrow = new Date(now.getTime() + 86400000)
    .toISOString()
    .split("T")[0];

  const todayEvents = allEvents.filter(
    (e) => e.dateUTC.split("T")[0] === todayStr
  );
  const tomorrowEvents = allEvents
    .filter((e) => e.dateUTC.split("T")[0] === tomorrow)
    .slice(0, 10);

  // Group today's events by sport
  const groupedBySport: Record<string, ScheduleEvent[]> = {};
  for (const ev of todayEvents) {
    if (!groupedBySport[ev.sport]) groupedBySport[ev.sport] = [];
    groupedBySport[ev.sport].push(ev);
  }

  const dateDisplay = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-header border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight hover:opacity-80 transition-all shrink-0"
            style={{
              fontFamily: "var(--font-heading), system-ui, sans-serif",
            }}
          >
            <Image
              src="/logo.png"
              alt="SportCalendar"
              width={30}
              height={30}
              className="rounded-lg"
            />
            <span>
              Sport<span className="text-accent">Calendar</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-muted hover:text-foreground transition-colors font-medium"
            >
              Subscribe
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted hover:text-foreground transition-colors font-medium"
            >
              How it works
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10 flex-1 w-full">
        {/* Hero */}
        <div className="text-center space-y-3 mb-8 animate-in">
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{
              fontFamily: "var(--font-heading), system-ui, sans-serif",
            }}
          >
            What&apos;s On <span className="text-accent">Today</span>
          </h1>
          <p className="text-muted text-base sm:text-lg">{dateDisplay}</p>
        </div>

        {todayEvents.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="card max-w-md mx-auto p-8 space-y-4">
              <p className="text-lg font-semibold">No events today</p>
              <p className="text-sm text-muted">
                Check back tomorrow or subscribe to a calendar so you never
                miss a match.
              </p>
              {tomorrowEvents.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                    Tomorrow
                  </p>
                  {tomorrowEvents.map((ev) => (
                    <div key={ev.id} className="text-sm text-muted">
                      {ev.summary} — {sportLabel(ev.sport)}
                    </div>
                  ))}
                </div>
              )}
              <Link href="/" className="btn-primary mt-4 inline-block">
                Browse tournaments
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBySport).map(([sport, events]) => {
              const tournamentIds = [
                ...new Set(events.map((e) => e.tournamentId)),
              ];
              return (
                <section key={sport} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-lg sm:text-xl font-bold"
                      style={{
                        fontFamily:
                          "var(--font-heading), system-ui, sans-serif",
                      }}
                    >
                      {sportLabel(sport)}
                    </h2>
                    <span className="text-xs text-muted bg-surface-hover px-2 py-0.5 rounded-full">
                      {events.length} event{events.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {events.map((ev) => {
                      const tournament = allTournaments.find(
                        (t) => t.id === ev.tournamentId
                      );
                      return (
                        <div key={ev.id} className="event-card">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-sm sm:text-base">
                                {ev.summary}
                                {ev.score && (
                                  <span className="text-accent font-bold text-xs sm:text-sm ml-2">
                                    {ev.score}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted mt-1">
                                {formatTime(ev.dateUTC, ev.timeTBD)}
                              </div>
                              {ev.venue !== "TBD" && (
                                <div className="text-xs text-muted mt-0.5">
                                  {ev.venue}, {ev.city}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-xs text-muted font-medium">
                                {tournament?.shortName}
                              </span>
                              <span className="text-xs text-muted">
                                {ev.phase}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Subscribe CTA for this sport's tournaments */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tournamentIds.map((tId) => {
                      const t = allTournaments.find((t) => t.id === tId);
                      if (!t) return null;
                      return (
                        <Link
                          key={tId}
                          href={`/?tournament=${tId}`}
                          className="text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                        >
                          Subscribe to {t.shortName} &rarr;
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* Tomorrow preview */}
            {tomorrowEvents.length > 0 && (
              <section className="space-y-3 pt-4 border-t border-border">
                <h2
                  className="text-sm font-bold text-muted uppercase tracking-wider"
                  style={{
                    fontFamily: "var(--font-heading), system-ui, sans-serif",
                  }}
                >
                  Coming Tomorrow
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {tomorrowEvents.map((ev) => (
                    <div key={ev.id} className="card p-3 text-sm">
                      <div className="font-medium">{ev.summary}</div>
                      <div className="text-xs text-muted mt-1">
                        {sportLabel(ev.sport)} · {ev.phase}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-10 text-xs text-muted">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={20} height={20} className="rounded-sm" />
              <span className="font-semibold text-foreground">SportCalendar</span>
            </div>
            <nav className="flex items-center gap-4 sm:gap-5">
              <Link href="/" className="hover:text-foreground transition-colors font-medium">
                Subscribe
              </Link>
              <Link href="/about" className="hover:text-foreground transition-colors font-medium">
                How it works
              </Link>
              {allTournaments.map((t) => (
                <Link
                  key={t.id}
                  href={`/tournament/${t.id}`}
                  className="hover:text-foreground transition-colors font-medium hidden sm:inline"
                >
                  {t.shortName}
                </Link>
              ))}
            </nav>
          </div>
          <div className="text-center sm:text-left mt-4 pt-4 border-t border-border/50 text-muted/60">
            © {new Date().getFullYear()} SportCalendar · Live-updating sports calendars
          </div>
        </div>
      </footer>
    </div>
  );
}
