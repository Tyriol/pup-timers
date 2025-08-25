import { useState, useEffect, type ReactNode } from "react";
import { TimersContext } from "../../Context";
import {
  getAllTimersFromLocalDb,
  addTimerToLocalDb,
  updateTimerInLocalDb,
  deleteTimerFromLocalDb,
} from "../../../db/db-utils";
import type { Timer, NewTimer } from "../../../types/types";

interface TimersProviderProps {
  children: ReactNode;
}

export const TimersProvider = ({ children }: TimersProviderProps) => {
  const [timersList, setTimersList] = useState<Timer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAndSetTimers = async () => {
      try {
        const allTimers = await getAllTimersFromLocalDb();
        setTimersList([...allTimers]);
        setLoading(false);
      } catch (error) {
        console.error("error getting timers:", error);
      }
    };
    fetchAndSetTimers().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, []);

  const addTimer = async (newTimer: NewTimer) => {
    // temporary id for optimistic update
    const tempTimer = {
      id: Date.now(),
      updatedAt: Date.now(),
      isRunning: false,
      elapsed: 0,
      ...newTimer,
    };
    setTimersList((prevTimers) => [...prevTimers, tempTimer]);
    try {
      const newTimerId = await addTimerToLocalDb(newTimer);
      setTimersList((prevTimers) =>
        prevTimers.map((timer) =>
          timer.id === tempTimer.id ? { ...timer, id: newTimerId } : timer,
        ),
      );
      return newTimerId;
    } catch (error) {
      setTimersList((prevTimers) =>
        prevTimers.filter((timer) => timer.id !== tempTimer.id),
      );
      console.error(error);
      throw error;
    }
  };

  const updateTimer = async (id: number, updatedTimer: Partial<Timer>) => {
    try {
      const result = await updateTimerInLocalDb(id, updatedTimer);
      if (result === 1) {
        setTimersList((prevTimers) =>
          prevTimers.map((timer) =>
            timer.id === id ? { ...timer, ...updatedTimer } : timer,
          ),
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteTimer = async (id: number) => {
    try {
      const result = await deleteTimerFromLocalDb(id);
      if (result) {
        setTimersList((prevTimers) =>
          prevTimers.filter((timer) => timer.id !== id),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    timersList,
    loading,
    addTimer,
    updateTimer,
    deleteTimer,
  };

  return (
    <TimersContext.Provider value={value}>{children}</TimersContext.Provider>
  );
};
