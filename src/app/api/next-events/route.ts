import { NextResponse } from "next/server";
import { getAllEvents } from "@/data/schedule-loader";

export async function GET() {
  const events = getAllEvents();
  const now = new Date();
  const nextByTournament: Record<string, { summary: string; dateUTC: string }> = {};

  for (const ev of events) {
    const evDate = new Date(ev.dateUTC + (ev.dateUTC.includes("T") ? "" : "T23:59:59Z"));
    if (evDate <= now) continue;
    if (
      !nextByTournament[ev.tournamentId] ||
      ev.dateUTC < nextByTournament[ev.tournamentId].dateUTC
    ) {
      nextByTournament[ev.tournamentId] = {
        summary: ev.summary,
        dateUTC: ev.dateUTC,
      };
    }
  }

  return NextResponse.json(nextByTournament);
}
