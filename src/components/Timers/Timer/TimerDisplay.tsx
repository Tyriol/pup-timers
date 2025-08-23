import { useEffect, useState, useContext } from "react";
import { formatTime, calculateElapsedTime } from "../../../lib/timers";
import type { Timer } from "../../../types/types";
import { TimersContext } from "../../../context/Context";

interface TimerProps {
  timer: Timer;
}

const TimerDisplay = ({ timer }: TimerProps) => {
  const { updateTimer } = useContext(TimersContext);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    (timer.duration ?? 0) - timer.elapsed,
  );
  const [elapsedSecs, setElapsedSecs] = useState<number>(timer.elapsed);
  const [stateDays, setStateDays] = useState<string>("");
  const [stateTime, setStateTime] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(timer.isRunning);

  const getShadowColourClass = (isRunning: boolean, elapsedSecs: number) => {
    if (isRunning) {
      return "shadow-green-500";
    } else if (!isRunning && elapsedSecs > 0) {
      return "shadow-red-500";
    } else {
      return "shadow-indigo-500";
    }
  };

  const timerCardClass = `flex flex-col items-center justify-center gap-5 p-5 shadow-md ${getShadowColourClass(isRunning, elapsedSecs)} rounded-md bg-neutral-700/50`;

  useEffect(() => {
    const calculateAndSetTimeElapsedWhileOffline = async () => {
      if (isRunning && timer.updatedAt) {
        const newElapsedSecs: number = calculateElapsedTime(
          Date.now(),
          elapsedSecs,
          timer.updatedAt,
        );
        if (timer.type === "countdown" && timer.duration) {
          const calculatedTimeRemaining = timer.duration - newElapsedSecs;
          setElapsedSecs(
            calculatedTimeRemaining < 0 ? timer.duration : newElapsedSecs,
          );
          setTimeRemaining(
            calculatedTimeRemaining < 0 ? 0 : calculatedTimeRemaining,
          );
          if (calculatedTimeRemaining <= 0) {
            setIsRunning(false);
            await updateTimer(timer.id, {
              elapsed: timer.duration,
              isRunning: false,
              updatedAt: Date.now(),
            });
            return;
          }
        } else {
          setElapsedSecs(newElapsedSecs);
        }
        await updateTimer(timer.id, {
          elapsed: newElapsedSecs,
          updatedAt: Date.now(),
        });
      }
    };
    void calculateAndSetTimeElapsedWhileOffline();
  }, [document.visibilityState]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setElapsedSecs((prev) => prev + 1);
        if (timer.type === "countdown") {
          setTimeRemaining((prev) => prev - 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, timer.type]);

  useEffect(() => {
    if (isRunning && elapsedSecs > 0 && elapsedSecs % 15 === 0) {
      const updateElapsedSecsInStorage = async () => {
        await updateTimer(timer.id, {
          elapsed: elapsedSecs,
          updatedAt: Date.now(),
        });
      };
      void updateElapsedSecsInStorage();
    }
  }, [isRunning, elapsedSecs, timer.id, updateTimer]);

  useEffect(() => {
    if (timer.type === "countdown" && isRunning && timeRemaining === 0) {
      setIsRunning(false);
      const updateTimerInStorage = async () => {
        await updateTimer(timer.id, {
          elapsed: elapsedSecs,
          isRunning: false,
          updatedAt: Date.now(),
        });
      };
      void updateTimerInStorage();
    }
  }, [timeRemaining, timer.type, isRunning, timer.id]);

  useEffect(() => {
    const timeToFormat =
      timer.type === "stopwatch" ? elapsedSecs : timeRemaining;
    const { displayDays, displayTime } = formatTime(timeToFormat);
    setStateDays(() => displayDays);
    setStateTime(() => displayTime);
  }, [elapsedSecs, timeRemaining, timer.type]);

  const toggleTimerOnOff = async () => {
    const newIsRunning = !isRunning;
    let updatedElapsedSecs = elapsedSecs;
    if (!isRunning && elapsedSecs > 0) {
      updatedElapsedSecs = 0;
      setElapsedSecs(0);
      if (timer.type === "countdown") {
        setTimeRemaining(timer.duration ?? 0);
      }
    }
    setIsRunning(newIsRunning);
    await updateTimer(timer.id, {
      isRunning: newIsRunning,
      elapsed: updatedElapsedSecs,
      updatedAt: Date.now(),
      ...(!isRunning && updatedElapsedSecs === 0
        ? { startTime: Date.now() }
        : {}),
    });
  };

  return (
    <button onClick={() => void toggleTimerOnOff()} className={timerCardClass}>
      <h2 className="flex items-center justify-center h-[2em] leading-none">
        {timer.name}
      </h2>
      <div className="text-center">
        <p className="time">{stateDays}</p>
        <p className="time">{stateTime}</p>
      </div>
    </button>
  );
};

export default TimerDisplay;
