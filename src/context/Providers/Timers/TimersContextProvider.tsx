import { useState, useEffect, type ReactNode } from "react";
import { TimersContext } from "../../Context";
import { getAllTimersFromLocalDb } from "../../../db/db-utils";
import type { Timer } from "../../../types/types";

interface TimersProviderProps {
  children: ReactNode;
}

export const TimersProvider = ({ children }: TimersProviderProps) => {
  const [timersList, setTimersList] = useState<Timer[]>([]);

  useEffect(() => {
    const fetchAndSetTimers = async () => {
      try {
        const allTimers = await getAllTimersFromLocalDb();
        setTimersList([...allTimers]);
      } catch (error) {
        console.error("error getting timers:", error);
      }
    };
    fetchAndSetTimers().catch((error) => {
      console.error(error);
    });
  }, []);

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

  const deleteTimer = (id: number) => {
    setTimersList((prevTimers) =>
      prevTimers.filter((timer) => timer.id !== id),
    );
  };

  const value = {
    timersList,
    addTimer,
    updateTimer,
    deleteTimer,
  };

  return (
    <TimersContext.Provider value={value}>{children}</TimersContext.Provider>
  );
};
