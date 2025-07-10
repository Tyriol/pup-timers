import db from "./db";
import type { Dog } from "../types/types";

// get all dogs
export const getAllDogsFromLocalDb = async () => {
  const allDogs = await db.dogs.toArray();
  return allDogs;
};

// add dog
export const addDogToLocalDb = async (newDog: Dog) => {
  const id = await db.dogs.add(newDog);
  return `New dog added, ${id}`;
};
// update dog

// delete dog

// add timer

// update timer

// delete timer

// clear table
// TODO: delete as I only want to use this while I'm working on getting the tables working
export const clearDogsTable = async () => {
  await db.dogs.clear();
};
