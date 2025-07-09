import { createContext } from "react";
import type { Timer, Dog } from "../types/types";

interface TimersContextValue {
  timersList: Timer[];
  addTimer: (timer: Timer) => void;
  updateTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;
}

interface DogsContextValue {
  dogsList: Dog[];
  addDog: (dog: Dog) => void;
  updateDog: (dog: Dog) => void;
  deleteDog: (id: string) => void;
}

export const TimersContext = createContext<TimersContextValue | undefined>(
  undefined,
);

export const DogsContext = createContext<DogsContextValue | undefined>(
  undefined,
);
