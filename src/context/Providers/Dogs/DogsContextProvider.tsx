import { useState, type ReactNode } from "react";
import { DogsContext } from "../../Context";
import type { Dog } from "../../../types/types";

interface DogsProviderProps {
  children: ReactNode;
}

export const DogsProvider = ({ children }: DogsProviderProps) => {
  const [dogsList, setDogsList] = useState<Dog[]>([]);

  const addDog = (newDog: Dog) => {
    setDogsList((prevDogs) => [...prevDogs, newDog]);
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
