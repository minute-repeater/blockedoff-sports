import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | SportsCalendar",
  description:
    "Answers to common questions about SportsCalendar. Free sports calendar subscriptions for Google Calendar, Apple Calendar, and Outlook. No signup required.",
  alternates: {
    canonical: "https://sportscalendar.xyz/faq",
  },
};

const faqs = [
  {
    question: "Is SportsCalendar free?",
    answer:
      "Yes, completely free. No signup, no account, no credit card. Pick your team and subscribe. That is it.",
  },
  {
    question: "How often does the calendar update?",
    answer:
      "The calendar feed refreshes every 6 hours. When game times change, new games are added, or scores come in, the updates appear automatically in your calendar. Your calendar app may have its own refresh interval (Google Calendar checks roughly every 12 to 24 hours, Apple Calendar every few hours).",
  },
  {
    question: "Which calendar apps does it work with?",
    answer:
      "Any app that supports ICS calendar subscriptions. That includes Google Calendar, Apple Calendar (iPhone, iPad, Mac), Microsoft Outlook (desktop and web), Fastmail, Thunderbird, and more. If your app can subscribe to a URL, it works.",
  },
  {
    question: "Can I subscribe to multiple teams or tournaments?",
    answer:
      "Yes. Each team has its own calendar URL. Subscribe to as many as you want. Follow the NBA and F1 at the same time, or track multiple countries in the World Cup.",
  },
  {
    question: "Does it show scores?",
    answer:
      "Yes. After a game finishes, the calendar event description is updated with the final score and key player stats. You can see results right in your calendar without opening another app.",
  },
  {
    question: "How do I unsubscribe?",
    answer:
      "Just remove the calendar subscription from your calendar app. In Google Calendar, right-click the calendar and select \"Unsubscribe.\" In Apple Calendar, right-click and choose \"Delete.\" In Outlook, right-click and select \"Remove.\" No data is stored on our end.",
  },
  {
    question: "What sports and tournaments are available?",
    answer: "SPORTS_LIST",
  },
  {
    question: "Will game times adjust to my timezone?",
    answer:
      "Yes. Every event includes full timezone information. Your calendar app automatically converts game times to your local timezone. No manual adjustment needed.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        faq.answer === "SPORTS_LIST"
          ? "We currently cover the NBA, NHL, MLB, Formula 1, FIFA World Cup 2026, March Madness, and the LA 2028 Olympics. More sports are added regularly."
          : faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <JsonLd data={faqJsonLd} />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-16 flex-1 w-full">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "FAQ" },
          ]}
        />

        <h1
          className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          Frequently Asked Questions
        </h1>
        <p className="text-muted text-base sm:text-lg leading-relaxed mb-10">
          Everything you need to know about SportsCalendar. If your question is not answered here, it probably should be. Let us know.
        </p>

        <div className="space-y-8 mb-12">
          {faqs.map((faq) => (
            <section key={faq.question} className="card p-5 sm:p-6">
              <h2 className="font-bold text-base sm:text-lg mb-2">{faq.question}</h2>
              {faq.answer === "SPORTS_LIST" ? (
                <div className="text-sm text-muted leading-relaxed">
                  <p className="mb-3">
                    We currently cover these sports and tournaments:
                  </p>
                  <ul className="space-y-1.5 mb-3">
                    <li>
                      <Link href="/world-cup-2026" className="text-accent hover:underline">
                        FIFA World Cup 2026
                      </Link>
                    </li>
                    <li>
                      <Link href="/nba" className="text-accent hover:underline">
                        NBA
                      </Link>
                    </li>
                    <li>
                      <Link href="/nhl" className="text-accent hover:underline">
                        NHL
                      </Link>
                    </li>
                    <li>
                      <Link href="/mlb" className="text-accent hover:underline">
                        MLB
                      </Link>
                    </li>
                    <li>
                      <Link href="/f1" className="text-accent hover:underline">
                        Formula 1
                      </Link>
                    </li>
                    <li>
                      <Link href="/march-madness" className="text-accent hover:underline">
                        March Madness
                      </Link>
                    </li>
                    <li>
                      <Link href="/olympics-2028" className="text-accent hover:underline">
                        LA 2028 Olympics
                      </Link>
                    </li>
                  </ul>
                  <p>More sports are added regularly.</p>
                </div>
              ) : (
                <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
              )}
            </section>
          ))}
        </div>

        {/* Related links */}
        <section className="mb-12">
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            Still have questions?
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Check out <Link href="/how-it-works" className="text-accent hover:underline">How It Works</Link> for step-by-step setup instructions for Google Calendar, Apple Calendar, and Outlook.
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
