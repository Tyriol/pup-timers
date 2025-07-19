import db from "./db";
import type { NewDog, Dog, NewTimer, Timer } from "../types/types";

export const getAllDogsFromLocalDb = async () => {
  const allDogs = await db.dogs.toArray();
  return allDogs;
};

export const addDogToLocalDb = async (newDog: NewDog) => {
  const id = await db.dogs.add(newDog);
  return id;
};

export const updateDogInLocalDb = async (id: number, changes: Partial<Dog>) => {
  const result = await db.dogs.update(id, changes);
  return result;
};

export const deleteDogFromLocalDb = async (id: number) => {
  await db.dogs.delete(id);
  const result = await db.dogs.get(id);
  if (result === undefined) {
    return true;
  } else {
    throw new Error("Error deleting dog from the database");
  }
};

export const getAllTimersFromLocalDb = async () => {
  const allTimers = await db.timers.toArray();
  return allTimers;
};

export const addTimerToLocalDb = async (newTimer: NewTimer) => {
  const id = await db.timers.add(newTimer);
  return id;
};

export const updateTimerInLocalDb = async (
  id: number,
  changes: Partial<Timer>,
) => {
  const result = await db.timers.update(id, changes);
  return result;
};

export const deleteTimerFromLocalDb = async (id: number) => {
  await db.timers.delete(id);
  const result = await db.timers.get(id);
  if (result === undefined) {
    return true;
  } else {
    throw new Error("Error deleting timer from the database");
  }
};

// clear table
// TODO: delete as I only want to use this while I'm working on getting the tables working
export const clearDogsTable = async () => {
  await db.dogs.clear();
};
