import { useEffect, useState } from "react";
import { formatTime } from "../../lib/timers";

interface StopWatchProps {
  secs?: number;
}

const Stopwatch = ({ secs = 0 }: StopWatchProps) => {
  const [elapsedSecs, setElapsedSecs] = useState<number>(secs);
  const [stateDays, setStateDays] = useState<string>("");
  const [stateTime, setStateTime] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const incrementTime = () => {
    const { displayDays, displayTime } = formatTime(elapsedSecs);
    setStateDays(() => displayDays);
    setStateTime(() => displayTime);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setElapsedSecs((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    incrementTime();
  }, [elapsedSecs]);

  const toggleTimerOnOff = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 p-20">
        <h2
          style={{ fontFamily: "VT323", fontWeight: "600", fontSize: "1.5rem" }}
        >
          {stateDays}
        </h2>
        <h2
          style={{ fontFamily: "VT323", fontWeight: "600", fontSize: "1.5rem" }}
        >
          {stateTime}
        </h2>
        <button onClick={toggleTimerOnOff}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button>Reset</button>
      </div>
    </>
  );
};

export default Stopwatch;
