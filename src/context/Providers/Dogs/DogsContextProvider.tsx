import { useState, useEffect, type ReactNode } from "react";
import { DogsContext } from "../../Context";
import { addDogToLocalDb, getAllDogsFromLocalDb } from "../../../db/db-utils";
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
        console.log("error getting dogs");
        console.error(error);
      }
    };
    fetchAndSetDogs().catch((error) => {
      console.error(error);
    });
  }, []);

  const addDog = async (newDog: NewDog) => {
    const prev = dogsList;
    // setDogsList((prevDogs) => [...prevDogs, newDog]);
    try {
      await addDogToLocalDb(newDog);
    } catch (error) {
      console.error(error);
      setDogsList([...prev]);
    }
  };

  const updateDog = (updatedDog: Dog) => {
    setDogsList((prevDogs) =>
      prevDogs.map((dog) => (dog.id === updatedDog.id ? updatedDog : dog)),
    );
  };

  const deleteDog = (id: string) => {
    setDogsList((prevDogs) => prevDogs.filter((dog) => dog.id !== id));
  };

  const value = {
    dogsList,
    addDog,
    updateDog,
    deleteDog,
  };

  return <DogsContext.Provider value={value}>{children}</DogsContext.Provider>;
};
