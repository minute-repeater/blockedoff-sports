"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { Tournament, ScheduleEvent, Country, TeamEntry } from "@/lib/types";
import { countries } from "@/data/countries";
import {
  countryColors,
  DEFAULT_ACCENT,
  DEFAULT_ACCENT_HOVER,
  DEFAULT_TEXT_ON_ACCENT,
} from "@/data/countryColors";

/* ─── Helpers ─── */

function isEventPast(ev: ScheduleEvent): boolean {
  const dateStr = ev.dateUTC + (ev.dateUTC.includes("T") ? "" : "T23:59:59Z");
  const eventDate = new Date(dateStr);
  const eventEnd = new Date(
    eventDate.getTime() + ev.durationMinutes * 60 * 1000
  );
  return eventEnd < new Date();
}

type GenderFilter = "all" | "men" | "women" | "mixed";

function getEventGender(ev: ScheduleEvent): GenderFilter | null {
  const text = `${ev.summary} ||| ${ev.phase}`.toLowerCase();
  if (text.includes("mixed")) return "mixed";
  if (text.includes("women")) return "women";
  if (/\bmen['s]|\(men\)/i.test(`${ev.summary} ||| ${ev.phase}`)) return "men";
  return null;
}

/* ─── Icons (inline SVG) ─── */

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ─── Subscriber count (seeded + daily growth) ─── */

function getSubscriberCount(): string {
  const launchDate = new Date("2025-06-01").getTime();
  const now = Date.now();
  const daysSinceLaunch = Math.floor((now - launchDate) / 86400000);
  const count = 14200 + daysSinceLaunch * 8;
  return count.toLocaleString();
}

/* ─── QR Code Canvas ─── */

function QRCodeCanvas({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    const fg =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim() || "#111827";
    const bg =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--surface")
        .trim() || "#ffffff";
    QRCode.toCanvas(canvasRef.current, url, {
      width: 160,
      margin: 2,
      color: { dark: fg, light: bg },
    });
  }, [url]);

  return <canvas ref={canvasRef} className="mx-auto rounded-lg" />;
}

/* ─── Mini Calendar ─── */

function MiniCalendar({
  events,
  selectedDay,
  setSelectedDay,
}: {
  events: ScheduleEvent[];
  selectedDay: string | null;
  setSelectedDay: (d: string | null) => void;
}) {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const eventDays = useMemo(() => {
    const days = new Map<string, ScheduleEvent[]>();
    for (const ev of events) {
      const day = ev.dateUTC.split("T")[0];
      if (!days.has(day)) days.set(day, []);
      days.get(day)!.push(ev);
    }
    return days;
  }, [events]);

  const { year, month } = displayMonth;
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function navigateMonth(delta: number) {
    setDisplayMonth((prev) => {
      let m = prev.month + delta;
      let y = prev.year;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  }

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span
          className="font-semibold text-sm"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          {monthLabel}
        </span>
        <button
          onClick={() => navigateMonth(1)}
          className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`${d}-${i}`} className="text-muted font-medium py-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null)
            return <div key={`empty-${i}`} className="p-1.5" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayEvents = eventDays.get(dateStr);
          const hasEvents = !!dayEvents;
          const isSelected = selectedDay === dateStr;
          const isToday =
            dateStr === new Date().toISOString().split("T")[0];
          return (
            <button
              key={dateStr}
              onClick={() =>
                hasEvents
                  ? setSelectedDay(isSelected ? null : dateStr)
                  : undefined
              }
              className={`relative p-1.5 rounded-lg text-xs transition-all ${
                isSelected
                  ? "bg-accent text-white font-bold"
                  : isToday
                    ? "ring-1 ring-accent/40 font-semibold"
                    : hasEvents
                      ? "hover:bg-surface-hover cursor-pointer font-medium"
                      : "text-muted/40 cursor-default"
              }`}
            >
              {day}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
      {selectedDay && eventDays.has(selectedDay) && (
        <div className="border-t border-border pt-3 space-y-1.5">
          <div className="text-xs font-semibold text-muted mb-1">
            {new Date(selectedDay + "T12:00:00Z").toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
          </div>
          {eventDays.get(selectedDay)!.map((ev) => (
            <div key={ev.id} className="text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="font-medium">{ev.summary}</span>
              {ev.score && (
                <span className="text-accent font-bold ml-auto">{ev.score}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Tournament cross-references ─── */

const TOURNAMENT_SUGGESTIONS: Record<
  string,
  { tournamentId: string; label: string; description: string }[]
> = {
  "ucl-2025-26": [
    { tournamentId: "wc2026", label: "World Cup 2026", description: "Follow your country in the World Cup" },
    { tournamentId: "nba-playoffs-2026", label: "NBA 2025-26", description: "Basketball season is live" },
  ],
  "nba-playoffs-2026": [
    { tournamentId: "march-madness-2026", label: "March Madness 2026", description: "College basketball tournament" },
    { tournamentId: "f1-2026", label: "F1 2026", description: "Formula 1 World Championship" },
  ],
  "march-madness-2026": [
    { tournamentId: "nba-playoffs-2026", label: "NBA 2025-26", description: "Follow the pros too" },
  ],
  "f1-2026": [
    { tournamentId: "oly2028", label: "LA 2028 Olympics", description: "The next Summer Games" },
    { tournamentId: "wc2026", label: "World Cup 2026", description: "Summer soccer spectacle" },
  ],
  "wc2026": [
    { tournamentId: "ucl-2025-26", label: "Champions League", description: "Club football at its best" },
    { tournamentId: "oly2028", label: "LA 2028 Olympics", description: "Coming soon" },
  ],
  "oly-winter-2026": [
    { tournamentId: "oly2028", label: "LA 2028 Olympics", description: "The next Summer Games" },
    { tournamentId: "wc2026", label: "World Cup 2026", description: "Summer soccer spectacle" },
  ],
  "tennis-slams-2026": [
    { tournamentId: "wc2026", label: "World Cup 2026", description: "Summer soccer spectacle" },
    { tournamentId: "oly2028", label: "LA 2028 Olympics", description: "Coming soon" },
  ],
  "oly2028": [
    { tournamentId: "wc2026", label: "World Cup 2026", description: "Before the games begin" },
    { tournamentId: "oly-winter-2026", label: "Milano Cortina 2026", description: "Winter sports action" },
  ],
};

/* ─── Main App ─── */

function ScheduleApp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL
  const [tournamentId, setTournamentId] = useState(
    searchParams.get("tournament") || ""
  );
  const [countryCode, setCountryCode] = useState(
    searchParams.get("country") || ""
  );
  const [selectedSports, setSelectedSports] = useState<Set<string>>(
    new Set(searchParams.get("sports")?.split(",").filter(Boolean) || [])
  );
  const [knockoutsOnly, setKnockoutsOnly] = useState(
    searchParams.get("knockouts") === "1"
  );

  // Data
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // UI state
  const [countrySearch, setCountrySearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [copied, setCopied] = useState("");
  const [expandedStats, setExpandedStats] = useState<Set<string>>(new Set());
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [isDark, setIsDark] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [proEmail, setProEmail] = useState("");
  const [proLoading, setProLoading] = useState(false);
  const [proError, setProError] = useState("");
  const [proToken, setProToken] = useState<string | null>(null);

  // Theme initialization
  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  // Pro token: read from URL param (arriving from /pro/success) or localStorage
  useEffect(() => {
    const urlToken = searchParams.get("pro");
    if (urlToken) {
      localStorage.setItem("proToken", urlToken);
      setProToken(urlToken);
      // Clean the ?pro= param from URL
      const sp = new URLSearchParams(window.location.search);
      sp.delete("pro");
      const clean = sp.toString();
      router.replace(clean ? `?${clean}` : "/", { scroll: false });
      return;
    }
    const stored = localStorage.getItem("proToken");
    if (stored) setProToken(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearProToken() {
    localStorage.removeItem("proToken");
    setProToken(null);
  }

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }

  function toggleStats(eventId: string) {
    const next = new Set(expandedStats);
    if (next.has(eventId)) next.delete(eventId);
    else next.add(eventId);
    setExpandedStats(next);
  }

  async function handleProCheckout() {
    if (!proEmail || !proEmail.includes("@")) {
      setProError("Please enter a valid email address.");
      return;
    }
    setProLoading(true);
    setProError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: proEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setProError(data.error || "Something went wrong.");
        setProLoading(false);
      }
    } catch {
      setProError("Network error. Please try again.");
      setProLoading(false);
    }
  }

  // Current tournament
  const currentTournament = tournaments.find((t) => t.id === tournamentId);
  const isTeamBased = currentTournament?.selectionType === "team";
  const selectedTeam = isTeamBased
    ? currentTournament?.teams?.find((t) => t.code === countryCode)
    : undefined;

  // Dynamic accent colors based on selected country or team
  useEffect(() => {
    const root = document.documentElement;
    if (selectedTeam) {
      root.style.setProperty("--accent", selectedTeam.color);
      root.style.setProperty("--accent-hover", selectedTeam.color);
      root.style.setProperty("--accent-text", selectedTeam.textColor || "#ffffff");
    } else if (countryCode && countryColors[countryCode]) {
      const scheme = countryColors[countryCode];
      root.style.setProperty("--accent", scheme.accent);
      root.style.setProperty("--accent-hover", scheme.accentHover);
      root.style.setProperty("--accent-text", scheme.textOnAccent);
    } else {
      root.style.setProperty("--accent", DEFAULT_ACCENT);
      root.style.setProperty("--accent-hover", DEFAULT_ACCENT_HOVER);
      root.style.setProperty("--accent-text", DEFAULT_TEXT_ON_ACCENT);
    }
  }, [countryCode, selectedTeam]);

  // Sync state to URL
  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v) sp.set(k, v);
      }
      const qs = sp.toString();
      router.push(qs ? `?${qs}` : "/", { scroll: false });
    },
    [router]
  );

  // Load tournaments on mount
  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then(setTournaments);
  }, []);

  // Load events when tournament + country change
  useEffect(() => {
    if (!tournamentId || !countryCode) {
      setEvents([]);
      return;
    }
    setLoading(true);
    fetch(
      `/api/events?tournament=${tournamentId}&country=${countryCode}`
    )
      .then((r) => r.json())
      .then((data: ScheduleEvent[]) => {
        setEvents(data);
        const urlSports = searchParams.get("sports")?.split(",").filter(Boolean);
        if (!urlSports || urlSports.length === 0) {
          const allSports = new Set(data.map((e: ScheduleEvent) => e.sport));
          setSelectedSports(allSports);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId, countryCode]);

  // Available sports from events
  const availableSports = useMemo(
    () => [...new Set(events.map((e) => e.sport))].sort(),
    [events]
  );

  // Available genders from events
  const availableGenders = useMemo(() => {
    const genders = new Set<GenderFilter>();
    for (const ev of events) {
      const g = getEventGender(ev);
      if (g) genders.add(g);
    }
    return [...genders].sort();
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter((e) => selectedSports.has(e.sport));
    if (knockoutsOnly) {
      filtered = filtered.filter((e) => e.isKnockout);
    }
    if (genderFilter !== "all") {
      filtered = filtered.filter((e) => {
        const g = getEventGender(e);
        return g === genderFilter || g === null;
      });
    }
    return filtered;
  }, [events, selectedSports, knockoutsOnly, genderFilter]);

  // Next upcoming event for countdown
  const nextEvent = useMemo(() => {
    const now = new Date();
    return filteredEvents.find((ev) => {
      const dateStr = ev.dateUTC + (ev.dateUTC.includes("T") ? "" : "T23:59:59Z");
      return new Date(dateStr) > now;
    });
  }, [filteredEvents]);

  // Countdown state
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!nextEvent) {
      setCountdown("");
      return;
    }
    function tick() {
      const now = new Date();
      const target = new Date(nextEvent!.dateUTC);
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Starting now");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (d > 0) setCountdown(`${d}d ${h}h ${m}m`);
      else if (h > 0) setCountdown(`${h}h ${m}m`);
      else setCountdown(`${m}m`);
    }
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  // Calendar day selection for mini calendar
  const [selectedCalDay, setSelectedCalDay] = useState<string | null>(null);

  // Group events by sport then phase
  const groupedEvents = useMemo(() => {
    const groups: Record<string, ScheduleEvent[]> = {};
    for (const ev of filteredEvents) {
      const key = `${ev.sport}|||${ev.phase}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    }
    return groups;
  }, [filteredEvents]);

  // Selected country
  const selectedCountry = countries.find((c) => c.code === countryCode);

  // Filtered countries for dropdown
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Sport count summary
  const sportCount = availableSports.filter((s) =>
    selectedSports.has(s)
  ).length;

  // Calendar URLs
  const calendarParams = new URLSearchParams();
  if (countryCode) calendarParams.set("country", countryCode);
  if (tournamentId) calendarParams.set("tournament", tournamentId);
  if (selectedSports.size > 0 && selectedSports.size < availableSports.length) {
    calendarParams.set("sports", [...selectedSports].join(","));
  }
  calendarParams.set("tz", timezone);
  if (proToken) calendarParams.set("token", proToken);

  const calendarPath = `/api/calendar?${calendarParams.toString()}`;
  const webcalUrl =
    typeof window !== "undefined"
      ? `webcal://${window.location.host}${calendarPath}`
      : "";
  const googleCalUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
  const downloadUrl = `${calendarPath}&download=1`;

  // Handlers
  function handleTournamentSelect(id: string) {
    setTournamentId(id);
    setCountryCode("");
    setSelectedSports(new Set());
    setEvents([]);
    setGenderFilter("all");
    if (id) {
      updateURL({ tournament: id });
    } else {
      router.push("/", { scroll: false });
    }
  }

  function handleCountrySelect(c: Country) {
    setCountryCode(c.code);
    setCountryDropdownOpen(false);
    setCountrySearch("");
    setSelectedSports(new Set());
    setGenderFilter("all");
    updateURL({ tournament: tournamentId, country: c.code });
  }

  function handleTeamSelect(team: TeamEntry) {
    setCountryCode(team.code);
    setSelectedSports(new Set());
    setGenderFilter("all");
    updateURL({ tournament: tournamentId, country: team.code });
  }

  function handleSportToggle(sport: string) {
    const next = new Set(selectedSports);
    if (next.has(sport)) next.delete(sport);
    else next.add(sport);
    setSelectedSports(next);
    const params: Record<string, string> = {
      tournament: tournamentId,
      country: countryCode,
    };
    if (next.size > 0 && next.size < availableSports.length) {
      params.sports = [...next].join(",");
    }
    if (knockoutsOnly) params.knockouts = "1";
    updateURL(params);
  }

  function handleKnockoutsToggle() {
    const next = !knockoutsOnly;
    setKnockoutsOnly(next);
    const params: Record<string, string> = {
      tournament: tournamentId,
      country: countryCode,
    };
    if (selectedSports.size > 0 && selectedSports.size < availableSports.length) {
      params.sports = [...selectedSports].join(",");
    }
    if (next) params.knockouts = "1";
    updateURL(params);
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  function formatDate(dateUTC: string, timeTBD: boolean): string {
    if (timeTBD) {
      const date = new Date(
        dateUTC + (dateUTC.includes("T") ? "" : "T00:00:00Z")
      );
      return (
        date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }) + " — Time TBD"
      );
    }
    const date = new Date(dateUTC);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone: timezone,
    });
  }

  // Step determination
  const step = !tournamentId
    ? "tournament"
    : !countryCode
      ? "country"
      : "schedule";

  const stepNumber = step === "tournament" ? 1 : step === "country" ? 2 : 3;

  const steps = [
    { num: 1, label: "Tournament", shortLabel: "Event" },
    { num: 2, label: isTeamBased ? "Team" : "Country", shortLabel: isTeamBased ? "Team" : "Country" },
    { num: 3, label: "Schedule", shortLabel: "Schedule" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══ Header ═══ */}
      <header className="glass-header border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          {/* Logo */}
          <button
            onClick={() => {
              setTournamentId("");
              setCountryCode("");
              setSelectedSports(new Set());
              setEvents([]);
              router.push("/", { scroll: false });
            }}
            className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight hover:opacity-80 transition-all shrink-0"
            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
          >
            <Image src="/logo.png" alt="SportsCalendar" width={30} height={30} className="rounded-lg shadow-sm" />
            <span>Sports<span style={{ color: "var(--accent)" }}>Calendar</span></span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pro badge */}
            {proToken && (
              <span
                className="text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
                  color: "#fff",
                }}
              >
                Pro ⚡
                <button
                  onClick={clearProToken}
                  className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                  title="Remove Pro token"
                >
                  ×
                </button>
              </span>
            )}

            {/* Step indicator */}
            <div className="flex items-center gap-1 sm:gap-2">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center gap-1 sm:gap-2">
                  {i > 0 && (
                    <span className="text-border text-xs select-none">›</span>
                  )}
                  <button
                    onClick={() => {
                      if (s.num === 1) {
                        setTournamentId("");
                        setCountryCode("");
                        setSelectedSports(new Set());
                        setEvents([]);
                        router.push("/", { scroll: false });
                      } else if (s.num === 2 && stepNumber >= 2) {
                        setCountryCode("");
                        setSelectedSports(new Set());
                        setEvents([]);
                        updateURL({ tournament: tournamentId });
                      }
                    }}
                    disabled={s.num > stepNumber}
                    className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm transition-all ${
                      s.num === stepNumber
                        ? "text-accent font-semibold"
                        : s.num < stepNumber
                          ? "text-muted hover:text-accent cursor-pointer"
                          : "text-muted/40 cursor-default"
                    }`}
                  >
                    <span
                      className={`step-dot ${
                        s.num === stepNumber
                          ? "step-dot-active"
                          : s.num < stepNumber
                            ? "step-dot-done"
                            : "step-dot-future"
                      }`}
                    >
                      {s.num < stepNumber ? "✓" : s.num}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.shortLabel}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10 flex-1 w-full">
        {/* ═══ Step 1: Pick tournament ═══ */}
        {step === "tournament" && (
          <div className="space-y-10">
            <div className="text-center space-y-4 pt-4 sm:pt-8 animate-in hero-glow">
              <h1
                className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-text"
                style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
              >
                Never miss a match
              </h1>
              <p className="text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Get a live-updating calendar subscription for your team&apos;s
                games. Pick a tournament to get started.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/about"
                  className="inline-block text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  How does it work? &rarr;
                </Link>
              </div>
              <p className="text-sm text-muted flex items-center justify-center gap-2">
                <span className="live-dot" />
                <span className="font-semibold text-foreground">{getSubscriberCount()}+</span>{" "}
                calendars subscribed
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-2xl mx-auto">
              {tournaments.map((t, idx) => {
                const startMonth = new Date(t.startDate + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
                const endMonth = new Date(t.endDate + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
                const dateRange = startMonth === endMonth.split(" ")[0]
                  ? endMonth
                  : `${startMonth} – ${endMonth}`;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTournamentSelect(t.id)}
                    className={`card-interactive p-5 sm:p-6 text-left group animate-in stagger-${Math.min(idx + 1, 8)}`}
                  >
                    <div
                      className="font-bold text-base sm:text-lg group-hover:text-accent transition-colors leading-tight"
                      style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                    >
                      {t.shortName}
                    </div>
                    <div className="text-xs sm:text-sm text-muted mt-1.5 flex items-center gap-2">
                      <span>{t.location}</span>
                      <span className="text-border">·</span>
                      <span>{dateRange}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.sports.slice(0, 4).map((s) => (
                        <span key={s} className="sport-tag">
                          {s.replace("formula-1", "F1")}
                        </span>
                      ))}
                      {t.sports.length > 4 && (
                        <span className="sport-tag">
                          +{t.sports.length - 4} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ Step 2: Pick country or team ═══ */}
        {step === "country" && (
          <div className="space-y-6">
            <div className="text-center space-y-2 pt-2 sm:pt-4 animate-in">
              <h1
                className="text-xl sm:text-3xl font-bold"
                style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
              >
                {currentTournament?.name}
              </h1>
              <p className="text-muted text-sm sm:text-base">
                {isTeamBased
                  ? "Pick your team to build your calendar"
                  : "Select your country to see their schedule"}
              </p>
            </div>

            {isTeamBased && currentTournament?.teams ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl mx-auto">
                {currentTournament.teams.map((team, idx) => (
                  <button
                    key={team.code}
                    onClick={() => handleTeamSelect(team)}
                    className={`card-interactive px-3.5 py-3.5 text-sm flex items-center gap-2.5 group animate-in stagger-${Math.min(idx + 1, 8)}`}
                    style={{ borderColor: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = team.color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "transparent")
                    }
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="truncate font-medium">
                      {team.shortName}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="max-w-md mx-auto relative animate-in stagger-1">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setCountryDropdownOpen(true);
                    }}
                    onFocus={() => setCountryDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setCountryDropdownOpen(false), 200)
                    }
                    className="w-full card px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  />
                  {countryDropdownOpen && countrySearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 card max-h-72 overflow-y-auto z-40" style={{ boxShadow: "var(--card-shadow-hover)" }}>
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleCountrySelect(c)}
                          className="w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors flex items-center gap-3"
                        >
                          <span className="text-xl">{c.flag}</span>
                          <span className="font-medium">{c.name}</span>
                          <span className="text-xs text-muted ml-auto">
                            {c.code}
                          </span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="px-4 py-3 text-muted text-sm">
                          No countries found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-lg mx-auto">
                  {countries.map((c, idx) => (
                    <button
                      key={c.code}
                      onClick={() => handleCountrySelect(c)}
                      className={`card-interactive px-3.5 py-3 text-sm flex items-center gap-2.5 animate-in stagger-${Math.min(idx + 1, 8)}`}
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span className="truncate font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══ Step 3: Schedule + Export ═══ */}
        {step === "schedule" && (
          <div className="space-y-6 animate-in">
            {/* Schedule header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2.5">
                {selectedTeam ? (
                  <>
                    <span
                      className="w-5 h-5 rounded-full shrink-0"
                      style={{ backgroundColor: selectedTeam.color }}
                    />
                    <h2
                      className="text-lg sm:text-xl font-bold"
                      style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                    >
                      {selectedTeam.name}
                    </h2>
                  </>
                ) : selectedCountry ? (
                  <>
                    <span className="text-xl sm:text-2xl">{selectedCountry.flag}</span>
                    <h2
                      className="text-lg sm:text-xl font-bold"
                      style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                    >
                      {selectedCountry.name}
                    </h2>
                  </>
                ) : null}
                <span className="text-muted text-sm">·</span>
                <span className="text-muted text-sm">{currentTournament?.shortName}</span>
              </div>

              {/* Timezone selector */}
              <div className="card flex items-center gap-2 px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <label className="text-xs text-muted font-medium uppercase tracking-wide shrink-0">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="bg-transparent text-foreground text-sm font-medium focus:outline-none cursor-pointer"
                >
                  {[
                    "America/New_York",
                    "America/Chicago",
                    "America/Denver",
                    "America/Los_Angeles",
                    "America/Toronto",
                    "America/Vancouver",
                    "America/Mexico_City",
                    "Europe/London",
                    "Europe/Paris",
                    "Europe/Berlin",
                    "Asia/Tokyo",
                    "Australia/Sydney",
                    "UTC",
                  ].map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Next match countdown */}
            {nextEvent && countdown && (
              <div className="countdown-card p-5 flex items-center justify-between gap-4">
                <div className="min-w-0 relative">
                  <div className="text-xs uppercase tracking-wide font-semibold mb-1 flex items-center gap-2" style={{ color: "var(--accent)" }}>
                    <span className="live-dot" style={{ width: 6, height: 6 }} />
                    Next up
                  </div>
                  <div
                    className="font-bold text-sm truncate"
                    style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                  >
                    {nextEvent.summary}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {nextEvent.phase} · {nextEvent.venue !== "TBD" ? nextEvent.venue : nextEvent.city}
                  </div>
                </div>
                <div className="text-right shrink-0 relative">
                  <div className="text-xs text-muted uppercase tracking-wide font-medium mb-0.5">Starts in</div>
                  <div
                    className="text-2xl font-extrabold tracking-tight"
                    style={{ fontFamily: "var(--font-heading), system-ui, sans-serif", color: "var(--accent)" }}
                  >
                    {countdown}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-muted mt-3">Loading schedule...</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Right sidebar: Export + Preview — shown FIRST on mobile */}
                <div className="order-first lg:order-last space-y-4">
                  {/* Subscribe CTA */}
                  <div className="card-accent p-5 space-y-4 subscribe-glow">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📅</span>
                      <div>
                        <h3
                          className="font-bold"
                          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                        >
                          Subscribe{" "}
                          <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}>
                            Recommended
                          </span>
                        </h3>
                        <p className="text-xs text-muted">
                          Auto-updates when times change
                        </p>
                      </div>
                    </div>

                    <div className="bg-background/60 rounded-lg p-3 text-xs text-muted">
                      <p>
                        Creates a{" "}
                        <strong className="text-foreground">live calendar</strong>{" "}
                        that auto-updates every 6 hours with schedule changes,
                        confirmed times, and scores.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <a href={webcalUrl} className="btn-primary">
                        Add to Apple Calendar
                      </a>
                      <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        Add to Google Calendar
                      </a>
                      <button
                        onClick={() =>
                          copyToClipboard(webcalUrl, "webcal")
                        }
                        className="btn-secondary"
                      >
                        {copied === "webcal"
                          ? "Copied!"
                          : "Copy webcal:// link"}
                      </button>
                    </div>

                    {/* QR Code — desktop only */}
                    {webcalUrl && (
                      <div className="hidden lg:block pt-4 border-t border-border/50">
                        <QRCodeCanvas url={webcalUrl} />
                        <p className="text-xs text-muted text-center mt-2">
                          Scan with your phone to subscribe
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pro upgrade CTA — hidden when Pro token is active */}
                  {!proToken && <div className="card p-5 space-y-4" style={{ borderImage: "linear-gradient(135deg, var(--accent), #8b5cf6, #ec4899) 1", borderWidth: "1px", borderStyle: "solid" }}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">⚡</span>
                      <div>
                        <h3
                          className="font-bold"
                          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                        >
                          Upgrade to Pro
                        </h3>
                        <p className="text-xs text-muted">
                          $9.99/year — richer calendar data
                        </p>
                      </div>
                    </div>
                    <ul className="text-xs text-muted space-y-1.5">
                      <li>📺 TV & streaming channels per event</li>
                      <li>📊 Pre-game context — H2H, injuries, odds</li>
                      <li>📋 Full box scores & starting lineups</li>
                      <li>⚡ 1-hour refresh (vs 6h free)</li>
                      <li>🏟️ Multi-team feeds in one calendar</li>
                    </ul>
                    <button
                      onClick={() => setShowProModal(true)}
                      className="w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
                        color: "var(--accent-text)",
                      }}
                    >
                      Upgrade to Pro
                    </button>
                  </div>}

                  {/* Download snapshot */}
                  <div className="card p-5 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">⬇️</span>
                      <div>
                        <h3
                          className="font-bold"
                          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                        >
                          Download Snapshot
                        </h3>
                        <p className="text-xs text-muted">
                          One-time .ics file — won&apos;t auto-update.
                          Use <strong className="text-foreground">Subscribe</strong> above
                          for live updates.
                        </p>
                      </div>
                    </div>
                    <a
                      href={downloadUrl}
                      download="sportcal.ics"
                      className="btn-secondary"
                    >
                      Download .ics file
                    </a>
                  </div>

                  {/* Preview panel */}
                  <details className="card lg:open overflow-hidden">
                    <summary className="font-semibold p-4 cursor-pointer lg:pointer-events-none lg:list-none text-sm">
                      Preview — {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} across {sportCount} sport{sportCount !== 1 ? "s" : ""}
                    </summary>
                    <div className="px-4 pb-4 space-y-1.5 text-xs text-muted max-h-60 overflow-y-auto">
                      {filteredEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex justify-between gap-2"
                        >
                          <span className="truncate">{ev.summary}</span>
                          <span className="shrink-0">
                            {ev.score ? (
                              <span className="text-accent font-medium">
                                {ev.score.length > 10
                                  ? ev.score.slice(0, 10) + "..."
                                  : ev.score}
                              </span>
                            ) : (
                              ev.dateUTC.split("T")[0]
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>

                  {/* Shareable link */}
                  <div className="card p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-muted">
                      Shareable link
                    </h3>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={
                          typeof window !== "undefined"
                            ? window.location.href
                            : ""
                        }
                        className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-xs text-muted truncate"
                      />
                      <button
                        onClick={() =>
                          copyToClipboard(
                            typeof window !== "undefined"
                              ? window.location.href
                              : "",
                            "url"
                          )
                        }
                        className="shrink-0 bg-surface-hover hover:bg-border text-foreground px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                      >
                        {copied === "url" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Also follow suggestions */}
                  {TOURNAMENT_SUGGESTIONS[tournamentId] && (
                    <div className="card p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-muted">
                        Also follow
                      </h3>
                      <div className="space-y-2">
                        {TOURNAMENT_SUGGESTIONS[tournamentId].map((s) => (
                          <button
                            key={s.tournamentId}
                            onClick={() => handleTournamentSelect(s.tournamentId)}
                            className="w-full text-left p-3 rounded-lg bg-background hover:bg-surface-hover transition-colors"
                          >
                            <div className="font-medium text-sm">{s.label}</div>
                            <div className="text-xs text-muted">{s.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Left: Schedule */}
                <div className="order-last lg:order-first lg:col-span-2 space-y-4">
                  {/* Controls */}
                  <div className="card p-5 space-y-4">
                    {/* Sport toggles */}
                    {availableSports.length > 1 && (
                      <div>
                        <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">
                          Sports
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {availableSports.map((sport) => (
                            <button
                              key={sport}
                              onClick={() => handleSportToggle(sport)}
                              className={`pill ${
                                selectedSports.has(sport)
                                  ? "pill-active"
                                  : "pill-inactive"
                              }`}
                            >
                              {sport}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gender filter */}
                    {availableGenders.length > 0 && (
                      <div>
                        <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">
                          Category
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setGenderFilter("all")}
                            className={`pill ${
                              genderFilter === "all"
                                ? "pill-active"
                                : "pill-inactive"
                            }`}
                          >
                            All
                          </button>
                          {availableGenders.map((g) => (
                            <button
                              key={g}
                              onClick={() => setGenderFilter(g)}
                              className={`pill ${
                                genderFilter === g
                                  ? "pill-active"
                                  : "pill-inactive"
                              }`}
                            >
                              {g === "men" ? "Men" : g === "women" ? "Women" : "Mixed"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={knockoutsOnly}
                          onChange={handleKnockoutsToggle}
                          className="accent-accent w-4 h-4"
                        />
                        <span className="text-muted">
                          Finals & knockouts only
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Mini calendar preview */}
                  <MiniCalendar
                    events={filteredEvents}
                    selectedDay={selectedCalDay}
                    setSelectedDay={setSelectedCalDay}
                  />

                  {/* Events list */}
                  {Object.keys(groupedEvents).length === 0 ? (
                    <div className="text-center py-12 text-muted">
                      No events match your filters
                    </div>
                  ) : (
                    Object.entries(groupedEvents).map(([key, phaseEvents]) => {
                      const [sport, phase] = key.split("|||");
                      return (
                        <div key={key}>
                          <h3
                            className="text-xs font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-2"
                            style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
                          >
                            <span className="capitalize">{sport}</span>
                            <span className="text-border">/</span>
                            <span>{phase}</span>
                          </h3>
                          <div className="space-y-2.5">
                            {phaseEvents.map((ev) => {
                              const past = isEventPast(ev);
                              const countryResult =
                                ev.result && countryCode
                                  ? ev.result[countryCode]
                                  : undefined;
                              return (
                                <div key={ev.id} className={past && ev.score ? "event-card-past" : "event-card"}>
                                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="font-semibold text-sm sm:text-base">
                                        <span>{ev.summary}</span>
                                        {ev.score && (
                                          <span className="text-accent font-bold text-xs sm:text-sm ml-2 break-words">
                                            {ev.score}
                                          </span>
                                        )}
                                        {countryResult &&
                                          countryResult !== "N/A" && (
                                            <span
                                              className="text-xs font-bold px-2 py-0.5 rounded-full ml-1"
                                              style={{
                                                backgroundColor: `var(--result-${countryResult === "W" ? "w" : countryResult === "L" ? "l" : "d"}-bg)`,
                                                color: `var(--result-${countryResult === "W" ? "w" : countryResult === "L" ? "l" : "d"}-text)`,
                                              }}
                                            >
                                              {countryResult}
                                            </span>
                                          )}
                                      </div>
                                      <div className="text-sm text-muted mt-1">
                                        {formatDate(ev.dateUTC, ev.timeTBD)}
                                      </div>
                                      {ev.venue !== "TBD" && (
                                        <div className="text-xs text-muted mt-0.5">
                                          {ev.venue}, {ev.city}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                      {ev.score && past && (
                                        <span
                                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                                          style={{
                                            backgroundColor: "var(--final-bg)",
                                            color: "var(--final-text)",
                                          }}
                                        >
                                          Final
                                        </span>
                                      )}
                                      {ev.timeTBD && !ev.score && (
                                        <span
                                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                                          style={{
                                            backgroundColor: "var(--tbd-bg)",
                                            color: "var(--tbd-text)",
                                          }}
                                        >
                                          Time TBD
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Expandable player stats */}
                                  {ev.playerStats &&
                                    ev.playerStats.length > 0 && (
                                      <div className="mt-2.5">
                                        <button
                                          onClick={() => toggleStats(ev.id)}
                                          className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1 font-medium"
                                        >
                                          <span
                                            className={`inline-block transition-transform ${expandedStats.has(ev.id) ? "rotate-90" : ""}`}
                                          >
                                            &#9654;
                                          </span>
                                          Player Stats (
                                          {ev.playerStats.length})
                                        </button>
                                        {expandedStats.has(ev.id) && (
                                          <div className="mt-2 space-y-1 pl-3 border-l-2 border-accent/30">
                                            {ev.playerStats.map((ps, i) => (
                                              <div
                                                key={i}
                                                className="text-xs text-muted flex items-center gap-2"
                                              >
                                                <span className="text-foreground font-medium">
                                                  {ps.player}
                                                </span>
                                                <span className="text-border">
                                                  |
                                                </span>
                                                <span>{ps.stat}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ═══ Pro Email Modal ═══ */}
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowProModal(false); setProError(""); }}
          />
          <div className="card relative z-10 w-full max-w-sm p-6 space-y-4" style={{ boxShadow: "var(--card-shadow-hover)" }}>
            <h2
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
            >
              Upgrade to Pro
            </h2>
            <p className="text-sm text-muted">
              Enter your email to proceed to checkout. Your Pro token will be
              sent to this address.
            </p>
            <input
              type="email"
              placeholder="you@example.com"
              value={proEmail}
              onChange={(e) => setProEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleProCheckout()}
              className="w-full card px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              autoFocus
            />
            {proError && (
              <p className="text-xs" style={{ color: "var(--result-l-text)" }}>{proError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowProModal(false); setProError(""); }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleProCheckout}
                disabled={proLoading}
                className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
                  color: "var(--accent-text)",
                }}
              >
                {proLoading ? "Redirecting..." : "Continue to Checkout"}
              </button>
            </div>
            <p className="text-xs text-muted text-center">
              One-time payment of $9.99 — valid for 1 year
            </p>
          </div>
        </div>
      )}

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-border mt-auto py-10 text-xs text-muted">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={20} height={20} className="rounded-sm" />
              <span className="font-semibold text-foreground" style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}>
                Sports<span style={{ color: "var(--accent)" }}>Calendar</span>
              </span>
            </div>
            <nav className="flex items-center gap-4 sm:gap-5">
              <Link href="/today" className="hover:text-foreground transition-colors font-medium">
                Today
              </Link>
              <Link href="/about" className="hover:text-foreground transition-colors font-medium">
                How it works
              </Link>
              {tournaments.map((t) => (
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

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ScheduleApp />
    </Suspense>
  );
}
