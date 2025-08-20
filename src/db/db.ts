import Dexie, { type EntityTable } from "dexie";
import type { Dog, Timer } from "../types/types";

const db = new Dexie("PupTimersDatabase") as Dexie & {
  timers: EntityTable<Timer, "id">;
  dogs: EntityTable<Dog, "id">;
};

db.version(1).stores({
  timers:
    "++id, type, name, duration, elapsed, isRunning, startTime, updatedAt, endTime",
  dogs: "++id, name, breed, age",
});

export default db;
