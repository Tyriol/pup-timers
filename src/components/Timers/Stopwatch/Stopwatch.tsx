import { useEffect, useState, useContext } from "react";
import { formatTime } from "../../../lib/timers";
import type { Timer } from "../../../types/types";
import { TimersContext } from "../../../context/Context";
interface StopWatchProps {
  timer: Timer;
}

const Stopwatch = ({ timer }: StopWatchProps) => {
  const { updateTimer } = useContext(TimersContext);
  const [elapsedSecs, setElapsedSecs] = useState<number>(timer.elapsed);
  const [stateDays, setStateDays] = useState<string>("");
  const [stateTime, setStateTime] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(timer.isRunning);

  const timerCardClass = `flex flex-col items-center justify-center gap-5 p-5 shadow-md ${isRunning ? "shadow-green-500" : !isRunning && elapsedSecs > 0 ? "shadow-red-500" : "shadow-indigo-500"} rounded-md bg-neutral-700/50`;

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setElapsedSecs((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (elapsedSecs > 0 && elapsedSecs % 15 === 0) {
      const updateElapsedSecsInStorage = async () => {
        await updateTimer(timer.id, { elapsed: elapsedSecs });
      };
      void updateElapsedSecsInStorage();
    }
  }, [elapsedSecs, timer.id, updateTimer]);

  useEffect(() => {
    const { displayDays, displayTime } = formatTime(elapsedSecs);
    setStateDays(() => displayDays);
    setStateTime(() => displayTime);
  }, [elapsedSecs]);

  const toggleTimerOnOff = async () => {
    const newIsRunning = !isRunning;
    let updatedElapsedSecs = elapsedSecs;
    if (!isRunning && elapsedSecs > 0) {
      updatedElapsedSecs = 0;
      setElapsedSecs(0);
    }
    setIsRunning(newIsRunning);
    await updateTimer(timer.id, {
      isRunning: newIsRunning,
      elapsed: updatedElapsedSecs,
    });
  };

  return (
    <button onClick={() => void toggleTimerOnOff()} className={timerCardClass}>
      <h2 className="inline-block h-[2em] align-middle leading-none">
        {timer.name}
      </h2>
      <div className="text-center">
        <p className="time">{stateDays}</p>
        <p className="time">{stateTime}</p>
      </div>
    </button>
  );
};

export default Stopwatch;
