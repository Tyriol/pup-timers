import { useState, type ReactNode } from "react";
import { TimersContext } from "../../Context";
import type { Timer } from "../../../types/types";

interface TimersProviderProps {
  children: ReactNode;
}

export const TimersProvider = ({ children }: TimersProviderProps) => {
  const [timersList, setTimersList] = useState<Timer[]>([]);

  const addTimer = (newTimer: Timer) => {
    setTimersList((prevTimers) => [...prevTimers, newTimer]);
  };

  const value = {
    timersList,
    addTimer,
  };

  return (
    <TimersContext.Provider value={value}>{children}</TimersContext.Provider>
  );
};
