import { NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/data/schedule-loader";
import { ScheduleEvent } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tournamentId = searchParams.get("tournament");
  const singleCode = searchParams.get("country")?.toUpperCase();
  const multiCodes = searchParams.get("countries")?.toUpperCase().split(",").filter(Boolean);
  const codes = multiCodes?.length ? multiCodes : singleCode ? [singleCode] : [];
  const sports = searchParams.get("sports")?.split(",").filter(Boolean);

  let events: ScheduleEvent[] = getAllEvents();

  if (tournamentId) {
    events = events.filter((e) => e.tournamentId === tournamentId);
  }

  if (codes.length > 0) {
    events = events.filter(
      (e) =>
        e.countryCodesInvolved.length === 0 ||
        codes.some((c) => e.countryCodesInvolved.includes(c))
    );
  }

  if (sports && sports.length > 0) {
    events = events.filter((e) => sports.includes(e.sport));
  }

  // Sort by date
  events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

  return NextResponse.json(events);
}
