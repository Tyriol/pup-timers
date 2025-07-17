import { useState, useEffect, type ReactNode } from "react";
import { DogsContext } from "../../Context";
import {
  addDogToLocalDb,
  getAllDogsFromLocalDb,
  updateDogInLocalDb,
  deleteDogFromLocalDb,
} from "../../../db/db-utils";
import type { Dog, NewDog } from "../../../types/types";

interface DogsProviderProps {
  children: ReactNode;
}

export const DogsProvider = ({ children }: DogsProviderProps) => {
  const [dogsList, setDogsList] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchAndSetDogs = async () => {
      try {
        const allDogs = await getAllDogsFromLocalDb();
        setDogsList([...allDogs]);
      } catch (error) {
        console.error("error getting dogs:", error);
      }
    };
    fetchAndSetDogs().catch((error) => {
      console.error(error);
    });
  }, []);

  const addDog = async (newDog: NewDog) => {
    const prev = dogsList;
    try {
      const newDogId = await addDogToLocalDb(newDog);
      setDogsList((prevDogs) => [...prevDogs, { id: newDogId, ...newDog }]);
      return newDogId;
    } catch (error) {
      setDogsList([...prev]);
      console.error(error);
      throw error;
    }
  };

  const updateDog = async (id: number, updatedDog: Partial<Dog>) => {
    try {
      const result = await updateDogInLocalDb(id, updatedDog);
      if (result === 1) {
        setDogsList((prevDogs) =>
          prevDogs.map((dog) =>
            dog.id === id ? { ...dog, ...updatedDog } : dog,
          ),
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteDog = async (id: number) => {
    try {
      const result = await deleteDogFromLocalDb(id);
      if (result) {
        setDogsList((prevDogs) => prevDogs.filter((dog) => dog.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    dogsList,
    addDog,
    updateDog,
    deleteDog,
  };

  return <DogsContext.Provider value={value}>{children}</DogsContext.Provider>;
};
