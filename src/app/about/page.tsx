import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import tournaments from "@/data/tournaments.json";
import { Tournament } from "@/lib/types";

const allTournaments = tournaments as Tournament[];

export const metadata: Metadata = {
  title: "How It Works — Live Sports Calendar Subscriptions",
  description:
    "Learn how SportsCalendar gives you a live-updating calendar for your team. Pick a tournament, choose your team, and subscribe. Works with Apple Calendar, Google Calendar, and Outlook.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-header border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight hover:opacity-80 transition-all shrink-0"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            <Image src="/logo.png" alt="SportsCalendar" width={30} height={30} className="rounded-lg" />
            <span>Sports<span className="text-accent">Calendar</span></span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4 text-sm text-muted">
            <Link
              href="/"
              className="hover:text-foreground transition-colors font-medium"
            >
              Subscribe
            </Link>
            <Link
              href="/today"
              className="hover:text-foreground transition-colors font-medium"
            >
              Today
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-16 flex-1 w-full">
        {/* Hero */}
        <div className="text-center space-y-4 mb-14">
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Never miss a match
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            SportsCalendar gives you a live-updating calendar subscription
            for your team&apos;s games. Pick a tournament, choose your team, and
            subscribe — it&apos;s that simple.
          </p>
        </div>

        {/* How it works - 3 steps */}
        <section className="mb-16">
          <h2
            className="text-xs font-bold text-muted uppercase tracking-wider text-center mb-8"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Pick a tournament",
                desc: `Choose from ${allTournaments.length} tournaments — NBA, F1, World Cup, UEFA Champions League, Tennis Grand Slams, March Madness, and Olympics.`,
              },
              {
                num: "2",
                title: "Choose your team",
                desc: "Select your team, driver, player, or country. You'll see all their upcoming matches with dates, times, and venues.",
              },
              {
                num: "3",
                title: "Subscribe",
                desc: "Add to Apple Calendar, Google Calendar, or Outlook. Your calendar auto-updates every 6 hours with schedule changes and scores.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center space-y-3">
                <div className="step-dot step-dot-active w-14 h-14 text-2xl mx-auto" style={{ width: 56, height: 56, fontSize: "1.25rem" }}>
                  {step.num}
                </div>
                <h3
                  className="font-bold"
                  style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="card p-6 sm:p-8 mb-16">
          <h2
            className="font-bold text-lg mb-5"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            What you get
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: "🔄",
                title: "Live updates",
                desc: "Your calendar auto-refreshes every 6 hours. When game times change, you'll see the update automatically.",
              },
              {
                icon: "📱",
                title: "Works everywhere",
                desc: "Apple Calendar, Google Calendar, Outlook, and any app that supports webcal:// subscriptions.",
              },
              {
                icon: "🏆",
                title: "Scores & stats",
                desc: "After matches finish, scores and key player stats are added to the calendar event description.",
              },
              {
                icon: "⏰",
                title: "Time TBD handling",
                desc: "Events with unconfirmed times show as all-day events, then update automatically once the time is set.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tournaments grid */}
        <section className="mb-16">
          <h2
            className="text-xs font-bold text-muted uppercase tracking-wider text-center mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Supported tournaments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {allTournaments.map((t) => {
              const startMonth = new Date(
                t.startDate + "T00:00:00Z"
              ).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
              const endMonth = new Date(
                t.endDate + "T00:00:00Z"
              ).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              });
              const dateRange =
                startMonth === endMonth.split(" ")[0]
                  ? endMonth
                  : `${startMonth} – ${endMonth}`;
              return (
                <Link
                  key={t.id}
                  href={`/tournament/${t.id}`}
                  className="card-interactive p-4 sm:p-5 group"
                >
                  <div
                    className="font-bold group-hover:text-accent transition-colors"
                    style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                  >
                    {t.shortName}
                  </div>
                  <div className="text-xs text-muted mt-1.5 flex items-center gap-2">
                    <span>{t.location}</span>
                    <span className="text-border">·</span>
                    <span>{dateRange}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Get started
          </Link>
          <p className="text-xs text-muted mt-3">
            Free — no account needed
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-10 text-xs text-muted">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={20} height={20} className="rounded-sm" />
              <span className="font-semibold text-foreground">SportsCalendar</span>
            </div>
            <nav className="flex items-center gap-4 sm:gap-5">
              <Link href="/" className="hover:text-foreground transition-colors font-medium">
                Subscribe
              </Link>
              <Link href="/today" className="hover:text-foreground transition-colors font-medium">
                Today
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
            © {new Date().getFullYear()} SportsCalendar · Live-updating sports calendars
          </div>
        </div>
      </footer>
    </div>
  );
}
