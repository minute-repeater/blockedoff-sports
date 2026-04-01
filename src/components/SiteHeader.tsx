import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
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
          <Link href="/how-it-works" className="hover:text-foreground transition-colors font-medium hidden sm:inline">
            How It Works
          </Link>
          <Link href="/today" className="hover:text-foreground transition-colors font-medium hidden sm:inline">
            Today
          </Link>
          <Link href="/faq" className="hover:text-foreground transition-colors font-medium hidden sm:inline">
            FAQ
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors font-medium">
            Subscribe
          </Link>
        </nav>
      </div>
    </header>
  );
}
