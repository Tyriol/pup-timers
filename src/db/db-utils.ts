import db from "./db";
import type { NewDog, Dog } from "../types/types";

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

// add timer

// update timer

// delete timer

// clear table
// TODO: delete as I only want to use this while I'm working on getting the tables working
export const clearDogsTable = async () => {
  await db.dogs.clear();
};
