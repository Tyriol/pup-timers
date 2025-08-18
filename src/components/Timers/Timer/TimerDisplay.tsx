import { useEffect, useState, useContext } from "react";
import { formatTime } from "../../../lib/timers";
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
    if (elapsedSecs > 0 && elapsedSecs % 15 === 0) {
      const updateElapsedSecsInStorage = async () => {
        await updateTimer(timer.id, { elapsed: elapsedSecs });
      };
      void updateElapsedSecsInStorage();
    }
  }, [elapsedSecs, timer.id, updateTimer]);

  useEffect(() => {
    if (timer.type === "countdown" && timeRemaining === 0) {
      setIsRunning(false);
      const updateTimerInStorage = async () => {
        await updateTimer(timer.id, { elapsed: elapsedSecs, isRunning: false });
      };
      void updateTimerInStorage();
    }
    const timeToFormat =
      timer.type === "stopwatch" ? elapsedSecs : timeRemaining;
    const { displayDays, displayTime } = formatTime(timeToFormat);
    setStateDays(() => displayDays);
    setStateTime(() => displayTime);
  }, [elapsedSecs, timeRemaining, timer.type, updateTimer, timer.id]);

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
