import db from "./db";
import { IDBFactory } from "fake-indexeddb";
import { describe, it, expect, beforeEach } from "vitest";

import {
  addDogToLocalDb,
  deleteDogFromLocalDb,
  updateDogInLocalDb,
  getAllDogsFromLocalDb,
} from "./db-utils";

describe("Dog Dexie IndexedDb utility functions", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();

    return async () => {
      await db.dogs.clear();
    };
  });

  it("adds a new dog to the db", async () => {
    {
      const newDog = {
        name: "Buddy",
        age: 9,
        breed: "Border Collie",
      };

      const id = await addDogToLocalDb(newDog);
      expect(id).toBe(1);
    }
  });

  it("updates a dog in the db", async () => {
    const newDog = {
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
    const newDog = {
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
    const newDog1 = {
      name: "Buddy",
      age: 9,
      breed: "Border Collie",
    };

    const newDog2 = {
      name: "Jock",
      age: 3,
      breed: "Staffie",
    };

    const newDog3 = {
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
