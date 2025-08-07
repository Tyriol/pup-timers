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
    setIsRunning(newIsRunning);
    await updateTimer(timer.id, {
      isRunning: newIsRunning,
      elapsed: elapsedSecs,
    });
  };

  const resetElapsedTime = async () => {
    setElapsedSecs(0);
    await updateTimer(timer.id, { elapsed: 0 });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 p-5 shadow-md shadow-indigo-500 rounded-md bg-neutral-700/50">
        <p>{timer.name}</p>
        <p>{stateDays}</p>
        <p className="time">{stateTime}</p>
        <button onClick={() => void toggleTimerOnOff()}>
          {isRunning ? "Stop" : "Start"}
        </button>
        {!isRunning && elapsedSecs > 0 ? (
          <button onClick={() => void resetElapsedTime()}>Reset</button>
        ) : null}
      </div>
    </>
  );
};

export default Stopwatch;
