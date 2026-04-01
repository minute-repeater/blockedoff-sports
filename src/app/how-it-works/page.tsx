import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "How to Add Sports Schedules to Your Calendar | SportsCalendar",
  description:
    "Step-by-step instructions for adding live sports schedules to Google Calendar, Apple Calendar, and Outlook. Free, no signup, auto-updates with scores.",
  alternates: {
    canonical: "https://sportscalendar.xyz/how-it-works",
  },
};

const sports = [
  { href: "/world-cup-2026", label: "FIFA World Cup 2026" },
  { href: "/nba", label: "NBA" },
  { href: "/nhl", label: "NHL" },
  { href: "/mlb", label: "MLB" },
  { href: "/f1", label: "Formula 1" },
  { href: "/march-madness", label: "March Madness" },
  { href: "/olympics-2028", label: "LA 2028 Olympics" },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Add Sports Schedules to Your Calendar",
  description:
    "Add live-updating sports calendars to Google Calendar, Apple Calendar, or Outlook. Free, no signup required.",
  step: [
    {
      "@type": "HowToStep",
      name: "Pick a tournament and team",
      text: "Go to sportscalendar.xyz, choose a tournament (NBA, NHL, MLB, F1, World Cup, etc.), then select your team or country.",
      url: "https://sportscalendar.xyz",
    },
    {
      "@type": "HowToStep",
      name: "Copy the calendar link",
      text: "Click 'Add to Calendar' to get your personalized webcal:// subscription URL.",
    },
    {
      "@type": "HowToStep",
      name: "Subscribe in your calendar app",
      text: "Paste the URL into Google Calendar (Other calendars > From URL), Apple Calendar (File > New Calendar Subscription), or Outlook (Add calendar > From internet).",
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <JsonLd data={howToJsonLd} />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-16 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "How It Works" },
          ]}
        />

        <h1
          className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          How to Add Sports Schedules to Your Calendar
        </h1>

        {/* Intro */}
        <section className="mb-12">
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-4">
            Sports apps send too many notifications. Calendar subscriptions are better. You get every game right in the calendar you already use, with automatic updates when times change and scores added after each game.
          </p>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            SportsCalendar is free, requires no signup, and works with every major calendar app. Pick your team, subscribe, done.
          </p>
        </section>

        {/* Google Calendar */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Google Calendar
          </h2>
          <div className="card p-5 sm:p-6 mb-4">
            <ol className="space-y-3 text-sm sm:text-base text-muted">
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>1</span>
                <span>Go to <Link href="/" className="text-accent hover:underline">sportscalendar.xyz</Link> and pick your tournament and team.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>2</span>
                <span>Click &quot;Add to Google Calendar&quot; or copy the calendar URL.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>3</span>
                <span>In Google Calendar, click the <strong>+</strong> next to &quot;Other calendars&quot; in the left sidebar.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>4</span>
                <span>Select <strong>&quot;From URL&quot;</strong>, paste the link, and click &quot;Add calendar.&quot;</span>
              </li>
            </ol>
          </div>
          <p className="text-sm text-muted mb-2">
            Google Calendar refreshes subscriptions roughly every 12 to 24 hours. Schedule changes and scores will appear automatically.
          </p>
          <Link href="/" className="text-accent hover:underline text-sm font-medium">
            Get your calendar link now &rarr;
          </Link>
        </section>

        {/* Apple Calendar */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Apple Calendar (iPhone, iPad, Mac)
          </h2>
          <div className="card p-5 sm:p-6 mb-4">
            <ol className="space-y-3 text-sm sm:text-base text-muted">
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>1</span>
                <span>Go to <Link href="/" className="text-accent hover:underline">sportscalendar.xyz</Link> on your device.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>2</span>
                <span>Pick your tournament and team, then tap &quot;Add to Apple Calendar.&quot;</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>3</span>
                <span>The webcal:// link opens Apple Calendar directly. Tap <strong>&quot;Subscribe&quot;</strong> to confirm.</span>
              </li>
            </ol>
          </div>
          <p className="text-sm text-muted mb-2">
            Apple Calendar refreshes subscriptions every few hours. On Mac, you can adjust the refresh interval in Calendar &gt; Preferences &gt; Accounts.
          </p>
          <Link href="/" className="text-accent hover:underline text-sm font-medium">
            Get your calendar link now &rarr;
          </Link>
        </section>

        {/* Outlook */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Microsoft Outlook
          </h2>
          <div className="card p-5 sm:p-6 mb-4">
            <h3 className="font-semibold text-sm mb-3">Outlook on the web (outlook.com)</h3>
            <ol className="space-y-3 text-sm sm:text-base text-muted mb-5">
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>1</span>
                <span>Copy your calendar URL from <Link href="/" className="text-accent hover:underline">sportscalendar.xyz</Link>.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>2</span>
                <span>In Outlook, click <strong>&quot;Add calendar&quot;</strong> &gt; <strong>&quot;Subscribe from web.&quot;</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>3</span>
                <span>Paste the URL and click &quot;Import.&quot;</span>
              </li>
            </ol>
            <h3 className="font-semibold text-sm mb-3">Outlook desktop app</h3>
            <ol className="space-y-3 text-sm sm:text-base text-muted">
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>1</span>
                <span>Copy your calendar URL from <Link href="/" className="text-accent hover:underline">sportscalendar.xyz</Link>.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>2</span>
                <span>Go to <strong>File &gt; Account Settings &gt; Internet Calendars &gt; New</strong>.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>3</span>
                <span>Paste the URL and click &quot;Add.&quot;</span>
              </li>
            </ol>
          </div>
          <Link href="/" className="text-accent hover:underline text-sm font-medium">
            Get your calendar link now &rarr;
          </Link>
        </section>

        {/* Which Sports */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Which Sports Are Available?
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-4">
            We cover the biggest leagues and tournaments. Every calendar auto-updates with schedule changes, scores, and key stats.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sports.map((sport) => (
              <Link
                key={sport.href}
                href={sport.href}
                className="card-interactive p-4 group"
              >
                <span
                  className="font-bold group-hover:text-accent transition-colors"
                  style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                >
                  {sport.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Common Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-1">Do I need an account?</h3>
              <p className="text-sm text-muted leading-relaxed">
                No. SportsCalendar is completely free with no signup. Just pick your team and subscribe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">How often does the calendar update?</h3>
              <p className="text-sm text-muted leading-relaxed">
                The calendar feed refreshes every 6 hours. Your calendar app may have its own refresh interval on top of that. Scores, time changes, and new events are all included automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Will it adjust to my timezone?</h3>
              <p className="text-sm text-muted leading-relaxed">
                Yes. All events include timezone data. Your calendar app converts them to your local time automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Can I subscribe to multiple teams?</h3>
              <p className="text-sm text-muted leading-relaxed">
                Absolutely. Each team gets its own calendar URL. Subscribe to as many as you want.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted mt-6">
            More questions? Check the full <Link href="/faq" className="text-accent hover:underline">FAQ</Link>.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Get your calendar
          </Link>
          <p className="text-xs text-muted mt-3">
            Free. No signup. Auto-updates with scores.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
