import { useEffect, useState, useContext } from "react";
import { formatTime, calculateElapsedTime } from "../../../lib/timers";
import type { Timer } from "../../../types/types";
import { TimersContext } from "../../../context/Context";
import TimerCardButton from "../../Buttons/TimerCardButton";

interface TimerProps {
  timer: Timer;
  onEdit: (timerId: number) => void;
}

const TimerDisplay = ({ timer, onEdit }: TimerProps) => {
  const { updateTimer } = useContext(TimersContext);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    (timer.duration ?? 0) - timer.elapsed,
  );
  const [elapsedSecs, setElapsedSecs] = useState<number>(timer.elapsed);
  const [stateDays, setStateDays] = useState<string>("");
  const [stateTime, setStateTime] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(timer.isRunning);

  const status = isRunning
    ? "Running"
    : timer.type === "countdown" && timeRemaining <= 0
      ? "Finished"
      : elapsedSecs > 0
        ? "Stopped"
        : "Ready";

  useEffect(() => {
    if (document.visibilityState === "visible") {
      const calculateAndSetTimeElapsedWhileOffline = async () => {
        if (isRunning && timer.startTime) {
          const newElapsedSecs: number = calculateElapsedTime(
            Date.now(),
            timer.startTime,
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
    }
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
    <article className="timer-card" aria-labelledby={`timer-${timer.id}`}>
      <div className="card-heading">
        <div className="timer-name">
          <p className="eyebrow">
            {timer.type === "countdown" ? "Countdown" : "Stopwatch"}
          </p>
          <h3 id={`timer-${timer.id}`}>{timer.name}</h3>
        </div>
        <span className={`timer-status status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>
      <div className="timer-reading">
        {stateDays && stateDays !== "0 days" && (
          <p className="muted">{stateDays}</p>
        )}
        <p className="time">{stateTime}</p>
        <p className="muted">
          {timer.type === "countdown" ? "Time remaining" : "Time elapsed"}
        </p>
      </div>
      <div className="timer-actions">
        <TimerCardButton
          label={isRunning ? "Stop" : elapsedSecs > 0 ? "Restart" : "Start"}
          onClick={() => void toggleTimerOnOff()}
        />
        <TimerCardButton
          label="Edit"
          onClick={() => onEdit(timer.id)}
          disabled={isRunning}
        />
      </div>
      {isRunning ? (
        <p className="card-hint">Stop the timer to edit it.</p>
      ) : (
        elapsedSecs > 0 && (
          <p className="card-hint">Restart begins a new timing session.</p>
        )
      )}
    </article>
  );
};

export default TimerDisplay;
