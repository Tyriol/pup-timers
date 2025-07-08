import { useState, type ReactNode } from "react";
import { DogsContext } from "../../Context";
import type { Dog } from "../../../types/types";

interface DogsProviderProps {
  children: ReactNode;
}

export const TimersProvider = ({ children }: DogsProviderProps) => {
  const [dogsList, setDogsList] = useState<Dog[]>([]);

  const addDog = (newDog: Dog) => {
    setDogsList((prevDogs) => [...prevDogs, newDog]);
  };

  const value = {
    dogsList,
    addDog,
  };

  return <DogsContext.Provider value={value}>{children}</DogsContext.Provider>;
};
