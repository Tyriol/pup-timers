import { createContext } from "react";
import type { Timer, Dog, NewTimer, NewDog } from "../types/types";

interface TimersContextValue {
  timersList: Timer[];
  addTimer: (timer: NewTimer) => void;
  updateTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;
}

interface DogsContextValue {
  dogsList: Dog[];
  addDog: (dog: NewDog) => Promise<number>;
  updateDog: (id: number, dog: Partial<Dog>) => void;
  deleteDog: (id: number) => void;
}

export const TimersContext = createContext<TimersContextValue | undefined>(
  undefined,
);

export const DogsContext = createContext<DogsContextValue | undefined>(
  undefined,
);
