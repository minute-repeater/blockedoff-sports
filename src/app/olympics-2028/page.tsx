import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "LA 2028 Olympics Calendar | SportsCalendar",
  description:
    "Get the LA 2028 Olympics schedule in your calendar. Free, auto-updating calendar subscription for Google Calendar, Apple Calendar, and Outlook. Filter by country.",
  alternates: {
    canonical: "https://sportscalendar.xyz/olympics-2028",
  },
};

const venues = [
  { name: "SoFi Stadium", sports: "Ceremonies, Soccer, Archery" },
  { name: "Los Angeles Memorial Coliseum", sports: "Track & Field" },
  { name: "Crypto.com Arena", sports: "Basketball, Gymnastics" },
  { name: "Dignity Health Sports Park", sports: "Tennis, Rugby, Cycling (BMX)" },
  { name: "Long Beach", sports: "Rowing, Water Polo, Triathlon" },
  { name: "Santa Monica Beach", sports: "Beach Volleyball, Surfing" },
  { name: "Rose Bowl", sports: "Soccer" },
  { name: "Intuit Dome", sports: "Basketball" },
];

const popularSports = [
  "Track & Field",
  "Swimming",
  "Gymnastics",
  "Basketball",
  "Soccer",
  "Tennis",
  "Volleyball",
  "Cycling",
  "Diving",
  "Boxing",
  "Wrestling",
  "Rowing",
  "Surfing",
  "Skateboarding",
  "Sport Climbing",
];

const olympicsJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "2028 Summer Olympics",
  description:
    "The LA 2028 Summer Olympics, held in Los Angeles from July 14 to July 30, 2028.",
  startDate: "2028-07-14",
  endDate: "2028-07-30",
  location: {
    "@type": "Place",
    name: "Los Angeles",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "International Olympic Committee",
  },
};

export default function Olympics2028Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <JsonLd data={olympicsJsonLd} />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-16 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "LA 2028 Olympics" },
          ]}
        />

        <h1
          className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          LA 2028 Olympics Calendar
        </h1>

        <p className="text-muted text-base sm:text-lg leading-relaxed mb-4">
          The 2028 Summer Olympics come to Los Angeles from July 14 to July 30, 2028. Subscribe to get every event for your country right in your calendar. Free, auto-updating, with results and medal counts added after each event.
        </p>

        <div className="card p-4 sm:p-5 mb-10 border-accent/30">
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-foreground">Schedule coming soon.</strong> The full event-by-event schedule will be released by the IOC closer to the Games. We will add events as they are announced. Subscribe now and your calendar will update automatically as the schedule is published.
          </p>
        </div>

        {/* Key Details */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Key Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Dates", value: "July 14 - July 30, 2028" },
              { label: "Host City", value: "Los Angeles, California, USA" },
              { label: "Sports", value: "30+ sports, 300+ events" },
              { label: "Countries", value: "200+ nations" },
            ].map((item) => (
              <div key={item.label} className="card p-4">
                <div className="text-xs text-muted uppercase tracking-wider mb-1">{item.label}</div>
                <div className="font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What You Get */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            What You Get
          </h2>
          <div className="card p-5 sm:p-6">
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  icon: "🇺🇸",
                  title: "Filter by country",
                  desc: "Pick your country and only see events where your athletes compete. No noise from sports you do not follow.",
                },
                {
                  icon: "🔄",
                  title: "Auto-updating schedule",
                  desc: "Times and venues update automatically. No need to check back manually.",
                },
                {
                  icon: "🥇",
                  title: "Results and medals",
                  desc: "After each event, results and medal winners are added to the calendar event description.",
                },
                {
                  icon: "📱",
                  title: "Works everywhere",
                  desc: "Google Calendar, Apple Calendar, Outlook. Any app that supports calendar subscriptions.",
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
          </div>
        </section>

        {/* Venues */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Venues
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            LA 2028 uses a mix of world-class existing venues across the greater Los Angeles area. No new permanent venues are being built.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {venues.map((venue) => (
              <div key={venue.name} className="card p-4">
                <div className="font-semibold text-sm">{venue.name}</div>
                <div className="text-xs text-muted mt-1">{venue.sports}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sports */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Sports
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Over 30 sports across two and a half weeks. Here are some of the highlights:
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSports.map((sport) => (
              <span
                key={sport}
                className="card px-3 py-1.5 text-xs font-medium"
              >
                {sport}
              </span>
            ))}
          </div>
        </section>

        {/* How to Subscribe */}
        <section className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            How to Subscribe
          </h2>
          <div className="card p-5 sm:p-6">
            <ol className="space-y-3 text-sm sm:text-base text-muted">
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>1</span>
                <span>Go to <Link href="/" className="text-accent hover:underline">sportscalendar.xyz</Link> and select the Olympics.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>2</span>
                <span>Choose your country to filter events.</span>
              </li>
              <li className="flex gap-3">
                <span className="step-dot step-dot-active shrink-0 w-7 h-7 text-xs" style={{ width: 28, height: 28 }}>3</span>
                <span>Click &quot;Add to Calendar&quot; for Google, Apple, or Outlook.</span>
              </li>
            </ol>
          </div>
          <p className="text-sm text-muted mt-3">
            Need help? See our <Link href="/how-it-works" className="text-accent hover:underline">step-by-step setup guide</Link>.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="btn-primary inline-block w-auto px-10">
            Subscribe to Olympics 2028
          </Link>
          <p className="text-xs text-muted mt-3">
            Free. No signup. Calendar updates automatically as the schedule is released.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
