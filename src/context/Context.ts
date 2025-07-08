import { createContext } from "react";
import type { Timer, Dog } from "../types/types";

interface TimersContextValue {
  timersList: Timer[];
  addTimer: (timer: Timer) => void;
}

interface DogsContextValue {
  dogsList: Dog[];
  addDog: (dog: Dog) => void;
}

export const TimersContext = createContext<TimersContextValue | undefined>(
  undefined,
);

export const DogsContext = createContext<DogsContextValue | undefined>(
  undefined,
);
