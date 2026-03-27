import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { ScheduleEvent } from "@/lib/types";

function loadScheduleDir(dirName: string): ScheduleEvent[] {
  const dir = join(process.cwd(), "src", "data", dirName);
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  const all: ScheduleEvent[] = [];
  for (const file of files) {
    const raw = readFileSync(join(dir, file), "utf-8");
    const events: ScheduleEvent[] = JSON.parse(raw);
    all.push(...events);
  }
  return all;
}

let _free: ScheduleEvent[] | null = null;
let _pro: ScheduleEvent[] | null = null;

export function getAllEvents(): ScheduleEvent[] {
  if (!_free) {
    _free = loadScheduleDir("schedules");
  }
  return _free;
}

export function getAllProEvents(): ScheduleEvent[] {
  if (!_pro) {
    _pro = loadScheduleDir("schedules-pro");
  }
  return _pro;
}
