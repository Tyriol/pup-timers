import { createContext } from "react";
import type { Timer } from "../types/types";

interface TimersContextValue {
  timersList: Timer[];
  addTimer: (timer: Timer) => void;
}

export const TimersContext = createContext<TimersContextValue | undefined>(
  undefined,
);
