import { NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/data/schedule-loader";
import { ScheduleEvent } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tournamentId = searchParams.get("tournament");
  const country = searchParams.get("country")?.toUpperCase();
  const sports = searchParams.get("sports")?.split(",").filter(Boolean);

  let events: ScheduleEvent[] = getAllEvents();

  if (tournamentId) {
    events = events.filter((e) => e.tournamentId === tournamentId);
  }

  if (country) {
    events = events.filter(
      (e) =>
        e.countryCodesInvolved.length === 0 ||
        e.countryCodesInvolved.includes(country)
    );
  }

  if (sports && sports.length > 0) {
    events = events.filter((e) => sports.includes(e.sport));
  }

  // Sort by date
  events.sort((a, b) => a.dateUTC.localeCompare(b.dateUTC));

  return NextResponse.json(events);
}
