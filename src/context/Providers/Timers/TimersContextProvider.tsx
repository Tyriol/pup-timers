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

  const updateTimer = (updatedTimer: Timer) => {
    setTimersList((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === updatedTimer.id ? updatedTimer : timer,
      ),
    );
  };

  const value = {
    timersList,
    addTimer,
    updateTimer,
  };

  return (
    <TimersContext.Provider value={value}>{children}</TimersContext.Provider>
  );
};
