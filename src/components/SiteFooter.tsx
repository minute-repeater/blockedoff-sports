import Link from "next/link";
import Image from "next/image";

const sportLinks = [
  { href: "/world-cup-2026", label: "World Cup 2026" },
  { href: "/nba", label: "NBA" },
  { href: "/nhl", label: "NHL" },
  { href: "/mlb", label: "MLB" },
  { href: "/f1", label: "Formula 1" },
  { href: "/march-madness", label: "March Madness" },
];

const siteLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/today", label: "Today's Schedule" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-auto py-10 text-xs text-muted">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo.png" alt="" width={20} height={20} className="rounded-sm" />
              <span className="font-semibold text-foreground text-sm">SportsCalendar</span>
            </div>
            <p className="text-muted leading-relaxed">
              Free, auto-updating sports calendar subscriptions. Add NBA, NHL, MLB, F1, World Cup, and more to Google Calendar, Apple Calendar, or Outlook. No signup required.
            </p>
          </div>

          {/* Sports */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Sports</h3>
            <ul className="space-y-2">
              {sportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Resources</h3>
            <ul className="space-y-2">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold text-foreground text-sm mt-5 mb-2">Works with</h3>
            <p className="text-muted">Apple Calendar, Google Calendar, Outlook, and any ICS-compatible app</p>
          </div>
        </div>

        <div className="pt-6 border-t border-border/50 text-muted/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} SportsCalendar</span>
          <span>Live-updating sports calendars. Free forever.</span>
        </div>
      </div>
    </footer>
  );
}
