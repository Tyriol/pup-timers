import { useEffect, useState } from "react";
import { formatTime } from "../../../lib/timers";
import type { Timer } from "../../../types/types";
interface StopWatchProps {
  timer: Timer;
}

const Stopwatch = ({ timer }: StopWatchProps) => {
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
    const { displayDays, displayTime } = formatTime(elapsedSecs);
    setStateDays(() => displayDays);
    setStateTime(() => displayTime);
  }, [elapsedSecs]);

  const toggleTimerOnOff = () => {
    setIsRunning((prev) => !prev);
  };

  const resetElapsedTime = () => {
    setElapsedSecs(0);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 p-20">
        <p>{timer.name}</p>
        <p>{stateDays}</p>
        <p>{stateTime}</p>
        <button onClick={toggleTimerOnOff}>
          {isRunning ? "Stop" : "Start"}
        </button>
        {!isRunning && elapsedSecs > 0 ? (
          <button onClick={resetElapsedTime}>Reset</button>
        ) : null}
      </div>
    </>
  );
};

export default Stopwatch;
