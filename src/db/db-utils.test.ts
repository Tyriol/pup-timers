import db from "./db";
import { IDBFactory } from "fake-indexeddb";
import { describe, it, expect, beforeEach } from "vitest";

import {
  addDogToLocalDb,
  deleteDogFromLocalDb,
  updateDogInLocalDb,
  getAllDogsFromLocalDb,
  addTimerToLocalDb,
  deleteTimerFromLocalDb,
  updateTimerInLocalDb,
  getAllTimersFromLocalDb,
} from "./db-utils";

import type { NewDog, NewTimer } from "../types/types";

describe("Dog Dexie IndexedDb utility functions", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();

    return async () => {
      await db.dogs.clear();
    };
  });

  it("adds a new dog to the db", async () => {
    {
      const newDog: NewDog = {
        name: "Buddy",
        age: 9,
        breed: "Border Collie",
      };

      const id = await addDogToLocalDb(newDog);
      expect(id).toBe(1);
    }
  });

  it("updates a dog in the db", async () => {
    const newDog: NewDog = {
      name: "Jock",
      age: 3,
      breed: "Staffie",
    };

    const updates = {
      age: 4,
    };

    const id = await addDogToLocalDb(newDog);
    let dog = await db.dogs.get(id);
    expect(dog?.age).toBe(3);
    const result = await updateDogInLocalDb(id, updates);
    dog = await db.dogs.get(id);
    expect(result).toBe(1);
    expect(dog?.age).toBe(4);
  });

  it("deletes a dog from the db", async () => {
    const newDog: NewDog = {
      name: "Murph",
      age: 2,
      breed: "Cockapoo",
    };

    const id = await addDogToLocalDb(newDog);
    let dog = await db.dogs.get(id);
    expect(dog?.name).toBe("Murph");
    await deleteDogFromLocalDb(id);
    dog = await db.dogs.get(id);
    expect(dog).toBeFalsy();
  });

  it("fetches all dogs from the db", async () => {
    const newDog1: NewDog = {
      name: "Buddy",
      age: 9,
      breed: "Border Collie",
    };

    const newDog2: NewDog = {
      name: "Jock",
      age: 3,
      breed: "Staffie",
    };

    const newDog3: NewDog = {
      name: "Murph",
      age: 2,
      breed: "Cockapoo",
    };

    await addDogToLocalDb(newDog1);
    await addDogToLocalDb(newDog2);
    await addDogToLocalDb(newDog3);

    const allDogs = await getAllDogsFromLocalDb();
    expect(allDogs.length).toBe(3);
  });
});

describe("Timer Dexie IndexedDb utility functions", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();

    return async () => {
      await db.timers.clear();
    };
  });

  it("adds a new timer to the db", async () => {
    const newTimer: NewTimer = {
      name: "Morning Walk",
      duration: 30,
      isRunning: false,
      type: "countdown",
      elapsed: 0,
      startTime: undefined,
      endTime: undefined,
    };

    const id = await addTimerToLocalDb(newTimer);
    expect(id).toBe(1);
  });

  it("updates a timer in the db", async () => {
    const newTimer: NewTimer = {
      name: "Left Alone",
      duration: 10,
      isRunning: false,
      type: "stopwatch",
      elapsed: 0,
      startTime: undefined,
      endTime: undefined,
    };

    const updates = {
      duration: 50,
    };

    const id = await addTimerToLocalDb(newTimer);
    let timer = await db.timers.get(id);
    expect(timer?.duration).toBe(10);
    const result = await updateTimerInLocalDb(id, updates);
    timer = await db.timers.get(id);
    expect(result).toBe(1);
    expect(timer?.duration).toBe(50);
  });

  it("deletes a timer from the db", async () => {
    const newTimer: NewTimer = {
      name: "Last Toilet Break",
      duration: 30,
      isRunning: false,
      type: "stopwatch",
      elapsed: 0,
      startTime: undefined,
      endTime: undefined,
    };

    const id = await addTimerToLocalDb(newTimer);
    let timer = await db.timers.get(id);
    expect(timer?.name).toBe("Last Toilet Break");
    await deleteTimerFromLocalDb(id);
    timer = await db.timers.get(id);
    expect(timer).toBeFalsy();
  });

  it("fetches all timers from the db", async () => {
    const timer1: NewTimer = {
      name: "Left Alone",
      duration: 10,
      isRunning: false,
      type: "stopwatch",
      elapsed: 0,
      startTime: undefined,
      endTime: undefined,
    };

    const timer2: NewTimer = {
      name: "Morning Walk",
      duration: 30,
      isRunning: false,
      type: "countdown",
      elapsed: 0,
      startTime: undefined,
      endTime: undefined,
    };

    const timer3: NewTimer = {
      name: "Last Toilet Break",
      duration: 30,
      isRunning: false,
      type: "stopwatch",
      elapsed: 0,
      startTime: undefined,
      endTime: undefined,
    };

    await addTimerToLocalDb(timer1);
    await addTimerToLocalDb(timer2);
    await addTimerToLocalDb(timer3);

    const allTimers = await getAllTimersFromLocalDb();
    expect(allTimers.length).toBe(3);
  });
});
