import { createContext } from "react";
import type { Timer, Dog, NewDog } from "../types/types";

interface TimersContextValue {
  timersList: Timer[];
  addTimer: (timer: Timer) => void;
  updateTimer: (timer: Timer) => void;
  deleteTimer: (id: number) => void;
}

interface DogsContextValue {
  dogsList: Dog[];
  addDog: (dog: NewDog) => Promise<number>;
  updateDog: (id: number, dog: Partial<Dog>) => void;
  deleteDog: (id: number) => void;
}

function throwProviderError(name: string): never {
  throw new Error(`${name} called outside of Provider`);
}

export const TimersContext = createContext<TimersContextValue>({
  timersList: [],
  addTimer: () => throwProviderError("addTimer"),
  updateTimer: () => throwProviderError("updateTimer"),
  deleteTimer: () => throwProviderError("deleteTimer"),
});

export const DogsContext = createContext<DogsContextValue>({
  dogsList: [],
  addDog: () => Promise.reject(new Error("addDog called outside of Provider")),
  updateDog: () => throwProviderError("updateDog"),
  deleteDog: () => throwProviderError("deleteDog"),
});
