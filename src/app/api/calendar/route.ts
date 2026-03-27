import { NextRequest } from "next/server";
import icalGenerator from "ical-generator";
import { getAllEvents, getAllProEvents } from "@/data/schedule-loader";
import tournaments from "@/data/tournaments.json";
import { getCountryByCode } from "@/data/countries";
import { ScheduleEvent, Tournament } from "@/lib/types";
import { validateProToken } from "@/lib/token";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tz = searchParams.get("tz") || "UTC";
  const tournamentId = searchParams.get("tournament");
  const download = searchParams.get("download") === "1";
  const sports = searchParams.get("sports")?.split(",").filter(Boolean);
  const tokenParam = searchParams.get("token");

  // Support both single `country` and multi-team `countries` (pro)
  const singleCode = searchParams.get("country")?.toUpperCase();
  const multiCodes = searchParams.get("countries")?.toUpperCase().split(",").filter(Boolean);
  const selectionCodes = multiCodes && multiCodes.length > 0 ? multiCodes : singleCode ? [singleCode] : [];

  if (selectionCodes.length === 0) {
    return new Response("Missing country/team parameter", { status: 400 });
  }

  // Validate pro token
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  let isPro = false;
  if (tokenParam) {
    try {
      const validation = await validateProToken(tokenParam, clientIp);
      isPro = validation.valid;
    } catch {
      // Token validation failed — gracefully degrade to free
    }
  }

  // Load appropriate schedule
  const rawEvents: ScheduleEvent[] = isPro
    ? getAllProEvents()
    : getAllEvents();

  // Determine display info from first selection code
  const primaryCode = selectionCodes[0];
  const tournament = (tournaments as Tournament[]).find((t) => t.id === tournamentId);
  const isTeamBased = tournament?.selectionType === "team";
  const team = isTeamBased
    ? tournament?.teams?.find((t) => t.code === primaryCode)
    : undefined;

  const country = isTeamBased ? undefined : getCountryByCode(primaryCode);
  const countryFlag = country?.flag ?? "";

  // Build display name — multi-team shows combined
  let displayName: string;
  if (selectionCodes.length === 1) {
    displayName = team?.shortName ?? country?.name ?? primaryCode;
  } else {
    const names = selectionCodes.map((code) => {
      const t = isTeamBased
        ? tournament?.teams?.find((tm) => tm.code === code)
        : undefined;
      const c = isTeamBased ? undefined : getCountryByCode(code);
      return t?.shortName ?? c?.name ?? code;
    });
    displayName = names.join(" + ");
  }

  // Filter events
  let events = rawEvents;

  if (tournamentId) {
    events = events.filter((e) => e.tournamentId === tournamentId);
  }

  events = events.filter(
    (e) =>
      e.countryCodesInvolved.length === 0 ||
      selectionCodes.some((code) => e.countryCodesInvolved.includes(code))
  );

  if (sports && sports.length > 0) {
    events = events.filter((e) => sports.includes(e.sport));
  }

  events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

  // Calendar naming
  const proSuffix = isPro ? " (Pro)" : "";
  const calName = `${countryFlag} ${displayName} Sports Schedule${proSuffix}`;
  const cal = icalGenerator({
    name: calName,
    prodId: { company: "SportCalendar", product: "SportCalendar" },
    timezone: tz,
  });

  for (const ev of events) {
    const evTournament = tournaments.find((t) => t.id === ev.tournamentId);
    const tournamentName = evTournament?.name ?? ev.tournamentId;

    // Build description lines
    const descriptionLines = [
      tournamentName,
      `Phase: ${ev.phase}`,
      `Match: ${ev.summary}`,
      ev.venue !== "TBD" ? `Venue: ${ev.venue}, ${ev.city}` : "Venue: TBD",
      `Sport: ${ev.sport.charAt(0).toUpperCase() + ev.sport.slice(1)}`,
    ];

    // Add score info for completed events
    if (ev.score) {
      descriptionLines.push("");
      descriptionLines.push(`Result: ${ev.score}`);
      for (const code of selectionCodes) {
        if (ev.result && ev.result[code]) {
          const r = ev.result[code];
          if (r !== "N/A") {
            const label = selectionCodes.length > 1 ? code : displayName;
            descriptionLines.push(
              `${label}: ${r === "W" ? "Win" : r === "L" ? "Loss" : "Draw"}`
            );
          }
        }
      }
    }

    // Free tier: basic player stats
    if (ev.playerStats && ev.playerStats.length > 0) {
      descriptionLines.push("");
      descriptionLines.push("Key Stats:");
      for (const ps of ev.playerStats) {
        descriptionLines.push(`  ${ps.player} — ${ps.stat}`);
      }
    }

    // Pro tier: enriched sections
    if (isPro && ev.proData) {
      const pd = ev.proData;

      // Broadcasts
      if (pd.broadcasts && pd.broadcasts.length > 0) {
        descriptionLines.push("");
        descriptionLines.push("📺 Watch on:");
        for (const b of pd.broadcasts) {
          descriptionLines.push(`  ${b.country}: ${b.channel}`);
        }
      }

      // Pre-game context (future events)
      if (pd.preGame) {
        const pg = pd.preGame;
        descriptionLines.push("");
        descriptionLines.push("📊 Pre-Game:");
        if (pg.h2hRecord) descriptionLines.push(`  H2H: ${pg.h2hRecord}`);
        if (pg.formGuide) descriptionLines.push(`  Form: ${pg.formGuide}`);
        if (pg.bettingLine) descriptionLines.push(`  Line: ${pg.bettingLine}`);
        if (pg.injuryReport && pg.injuryReport.length > 0) {
          descriptionLines.push("  Injuries:");
          for (const inj of pg.injuryReport) {
            descriptionLines.push(`    ${inj}`);
          }
        }
      }

      // Detailed box score (past events — replaces basic stats)
      if (pd.detailedBoxScore && pd.detailedBoxScore.length > 0) {
        descriptionLines.push("");
        descriptionLines.push("📋 Full Box Score:");
        for (const bs of pd.detailedBoxScore) {
          descriptionLines.push(`  ${bs.player} (${bs.country}) — ${bs.statLine}`);
        }
      }

      // Lineup notes
      if (pd.lineupNotes && pd.lineupNotes.length > 0) {
        descriptionLines.push("");
        descriptionLines.push("📋 Lineup:");
        for (const ln of pd.lineupNotes) {
          descriptionLines.push(`  ${ln}`);
        }
      }
    }

    // Build summary with score if available
    const summaryBase = ev.score
      ? `${countryFlag} ${ev.summary} — ${ev.score}`
      : `${countryFlag} ${ev.summary}`;

    if (ev.timeTBD && !ev.score) {
      const dateStr = ev.dateUTC.split("T")[0];
      descriptionLines.push(
        "",
        "Time to be confirmed. This event will update once the time is announced."
      );
      cal.createEvent({
        id: ev.id,
        summary: `${summaryBase} — ${ev.phase} (Time TBD)`,
        allDay: true,
        start: new Date(dateStr + "T00:00:00Z"),
        description: descriptionLines.join("\n"),
        location: ev.venue !== "TBD" ? `${ev.venue}, ${ev.city}` : undefined,
        url: undefined,
        stamp: new Date(),
      });
    } else {
      const dateStr = ev.timeTBD
        ? ev.dateUTC.split("T")[0]
        : ev.dateUTC;
      const start = ev.timeTBD
        ? new Date(dateStr + "T00:00:00Z")
        : new Date(ev.dateUTC);
      const end = new Date(start.getTime() + ev.durationMinutes * 60 * 1000);

      cal.createEvent({
        id: ev.id,
        summary: `${summaryBase} | ${ev.phase} | ${tournamentName}`,
        start,
        end,
        timezone: tz,
        description: descriptionLines.join("\n"),
        location:
          ev.venue !== "TBD" ? `${ev.venue}, ${ev.city}` : undefined,
        url: undefined,
        stamp: new Date(),
      });
    }
  }

  // Generate ICS and inject refresh interval
  let icsString = cal.toString();
  const refreshInterval = isPro ? "PT1H" : "PT6H";

  icsString = icsString.replace(
    /(PRODID:[^\r\n]+\r?\n)/,
    `$1REFRESH-INTERVAL;VALUE=DURATION:${refreshInterval}\r\nX-PUBLISHED-TTL:${refreshInterval}\r\nX-WR-CALNAME:${calName}\r\n`
  );

  const headers: Record<string, string> = {
    "Content-Type": "text/calendar; charset=utf-8",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (download) {
    const filename = `${displayName.replace(/\s+/g, "-").toLowerCase()}-sports.ics`;
    headers["Content-Disposition"] = `attachment; filename="${filename}"`;
  }

  return new Response(icsString, { headers });
}
