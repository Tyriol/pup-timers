import { createContext } from "react";
import type { Timer, Dog, NewDog, NewTimer } from "../types/types";

interface TimersContextValue {
  timersList: Timer[];
  loading: boolean;
  addTimer: (timer: NewTimer) => Promise<number>;
  updateTimer: (id: number, timer: Partial<Timer>) => Promise<void>;
  deleteTimer: (id: number) => Promise<void>;
}

interface DogsContextValue {
  dogsList: Dog[];
  addDog: (dog: NewDog) => Promise<number>;
  updateDog: (id: number, dog: Partial<Dog>) => Promise<void>;
  deleteDog: (id: number) => Promise<void>;
}

function throwProviderError(name: string): never {
  throw new Error(`${name} called outside of Provider`);
}

export const TimersContext = createContext<TimersContextValue>({
  timersList: [],
  loading: true,
  addTimer: () =>
    Promise.reject(new Error("addTimer called outside of Provider")),
  updateTimer: () => throwProviderError("updateTimer"),
  deleteTimer: () => throwProviderError("deleteTimer"),
});

export const DogsContext = createContext<DogsContextValue>({
  dogsList: [],
  addDog: () => Promise.reject(new Error("addDog called outside of Provider")),
  updateDog: () => throwProviderError("updateDog"),
  deleteDog: () => throwProviderError("deleteDog"),
});
