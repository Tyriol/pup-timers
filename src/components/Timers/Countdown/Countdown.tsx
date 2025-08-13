import { useEffect, useState, useContext } from "react";
import { formatTime } from "../../../lib/timers";
import type { Timer } from "../../../types/types";
import { TimersContext } from "../../../context/Context";

interface CountdownProps {
  timer: Timer;
}

const Countdown = ({ timer }: CountdownProps) => {
  const { updateTimer } = useContext(TimersContext);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    (timer.duration ?? 0) - timer.elapsed,
  );
  const [elapsedSecs, setElapsedSecs] = useState<number>(timer.elapsed);
  const [stateDays, setStateDays] = useState<string>("");
  const [stateTime, setStateTime] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(timer.isRunning);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setElapsedSecs((prev) => prev + 1);
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (elapsedSecs % 15 === 0) {
      const updateElapsedSecsInStorage = async () => {
        await updateTimer(timer.id, { elapsed: elapsedSecs });
      };
      void updateElapsedSecsInStorage();
    }
  }, [elapsedSecs, timer.id, updateTimer]);

  useEffect(() => {
    if (timeRemaining === 0) setIsRunning(false);
    const { displayDays, displayTime } = formatTime(timeRemaining);
    setStateDays(() => displayDays);
    setStateTime(() => displayTime);
  }, [timeRemaining]);

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
    setTimeRemaining(timer.duration ?? 0);
    await updateTimer(timer.id, { elapsed: 0 });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 p-20">
        <p>{timer.name}</p>
        <p>{stateDays}</p>
        <p>{stateTime}</p>
        {timeRemaining > 0 ? (
          <button onClick={() => void toggleTimerOnOff()}>
            {isRunning ? "Stop" : "Start"}
          </button>
        ) : null}
        {!isRunning && elapsedSecs > 0 ? (
          <button onClick={() => void resetElapsedTime()}>Reset</button>
        ) : null}
      </div>
    </>
  );
};

export default Countdown;
