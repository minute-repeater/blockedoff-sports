import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Stripe from "stripe";
import { kv } from "@vercel/kv";

export const metadata: Metadata = {
  title: "Welcome to Pro",
  robots: { index: false, follow: false },
};

export default async function ProSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let token: string | null = null;
  let email: string | null = null;
  let error: string | null = null;

  if (!session_id) {
    error = "Missing session ID. Please check your email for your Pro link.";
  } else {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email =
        session.customer_email ||
        session.customer_details?.email ||
        null;

      if (email) {
        token = (await kv.get(`email:${email}`)) as string | null;
      }

      if (!token) {
        error =
          "Your token is being generated. Please refresh this page in a moment.";
      }
    } catch {
      error = "Could not retrieve your session. Please contact support.";
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sportscalendar.xyz";

  return (
    <div className="min-h-screen flex flex-col">
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
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-10 sm:py-16 flex-1 w-full">
        {error ? (
          <div className="text-center space-y-4">
            <div className="text-4xl">⏳</div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
            >
              Almost there...
            </h1>
            <p className="text-muted">{error}</p>
            <Link href="/" className="btn-primary inline-block w-auto px-8">
              Back to home
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
              >
                Welcome to Pro!
              </h1>
              <p className="text-muted">
                Your Pro calendar is ready. Save this page — your token is shown below.
              </p>
            </div>

            {/* Token display */}
            <div className="card p-5 space-y-3">
              <h2
                className="font-bold text-sm"
                style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
              >
                Your Pro Token
              </h2>
              <div className="bg-background border border-border rounded-lg px-4 py-3 font-mono text-xs break-all select-all">
                {token}
              </div>
              <p className="text-xs text-muted">
                This token is linked to <strong className="text-foreground">{email}</strong> and expires in 1 year.
              </p>
            </div>

            {/* What's included */}
            <div className="card p-5 space-y-3">
              <h2
                className="font-bold text-sm"
                style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
              >
                What you get with Pro
              </h2>
              <ul className="text-sm text-muted space-y-1.5">
                <li>📺 TV & streaming channels in every event</li>
                <li>📊 Pre-game context — H2H records, injuries, odds</li>
                <li>📋 Full box scores & starting lineups</li>
                <li>⚡ 1-hour refresh (vs 6h free)</li>
                <li>🏟️ Multi-team feeds — combine teams in one calendar</li>
              </ul>
            </div>

            {/* How to use */}
            <div className="card p-5 space-y-3">
              <h2
                className="font-bold text-sm"
                style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
              >
                How to use
              </h2>
              <p className="text-sm text-muted">
                Go to <Link href="/" className="text-accent font-medium">sportscalendar.xyz</Link>, pick your tournament and team, then subscribe. Your Pro token will be
                automatically included in the calendar URL.
              </p>
              <p className="text-sm text-muted">
                Or append <code className="bg-background px-1.5 py-0.5 rounded text-xs font-mono">&token={token?.slice(0, 8)}...</code> to any calendar URL.
              </p>
            </div>

            {/* Quick links */}
            <div className="text-center space-y-3">
              <Link
                href={`/?pro=${token}`}
                className="btn-primary inline-block w-auto px-8"
              >
                Start building your Pro calendar
              </Link>
              <p className="text-xs text-muted">
                Bookmark this page to find your token later.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-auto py-8 text-center text-xs text-muted">
        <div className="flex items-center justify-center gap-3">
          <Image src="/logo.png" alt="" width={18} height={18} className="rounded-sm" />
          <span className="font-medium">SportsCalendar</span>
        </div>
      </footer>
    </div>
  );
}
