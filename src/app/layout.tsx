import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sportscalendar.xyz"),
  title: {
    default: "SportsCalendar — Never Miss a Match",
    template: "%s | SportsCalendar",
  },
  description:
    "Subscribe to live-updating sports calendars. NBA, F1, UEFA Champions League, World Cup 2026, Grand Slam Tennis, March Madness, and Olympics. Add to Apple Calendar or Google Calendar.",
  manifest: "/manifest.json",
  openGraph: {
    title: "SportsCalendar — Never Miss a Match",
    description:
      "Live-updating calendar subscriptions for NBA, F1, UEFA CL, World Cup, Tennis, March Madness & Olympics.",
    siteName: "SportsCalendar",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "SportsCalendar logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SportsCalendar — Never Miss a Match",
    description:
      "Live-updating calendar subscriptions for NBA, F1, UEFA CL, World Cup, Tennis, March Madness & Olympics.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
