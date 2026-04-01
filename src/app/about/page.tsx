import { Metadata } from "next";
import Link from "next/link";
import tournaments from "@/data/tournaments.json";
import { Tournament } from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const allTournaments = tournaments as Tournament[];

export const metadata: Metadata = {
  title: "About SportsCalendar | Free Live Sports Calendar Subscriptions",
  description:
    "Learn how SportsCalendar gives you a live-updating calendar for your team. Pick a tournament, choose your team, and subscribe. Works with Apple Calendar, Google Calendar, and Outlook.",
  alternates: {
    canonical: "https://sportscalendar.xyz/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-16 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
          ]}
        />

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
            subscribe. It is that simple.
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
                desc: `Choose from ${allTournaments.length} tournaments, including NBA, F1, World Cup, UEFA Champions League, Tennis Grand Slams, March Madness, and Olympics.`,
              },
              {
                num: "2",
                title: "Choose your team",
                desc: "Select your team, driver, player, or country. You will see all their upcoming matches with dates, times, and venues.",
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
          <p className="text-center text-sm text-muted mt-6">
            Need detailed instructions? See our <Link href="/how-it-works" className="text-accent hover:underline">step-by-step guide</Link> for Google Calendar, Apple Calendar, and Outlook.
          </p>
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
                desc: "Your calendar auto-refreshes every 6 hours. When game times change, you will see the update automatically.",
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
                  : `${startMonth} - ${endMonth}`;
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

        {/* Links */}
        <section className="mb-16 text-center text-sm text-muted space-y-2">
          <p>
            <Link href="/how-it-works" className="text-accent hover:underline">How to add to your calendar</Link>
            {" · "}
            <Link href="/faq" className="text-accent hover:underline">Frequently Asked Questions</Link>
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Get started
          </Link>
          <p className="text-xs text-muted mt-3">
            Free. No account needed.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
