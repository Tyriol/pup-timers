import React, { useState, useContext, useEffect } from "react";
import { TimersContext } from "../../context/Context";
import type { Timer, NewTimer } from "../../types/types";

interface TimerFormProps {
  editingTimerId?: number;
  timers?: Timer[];
  onCancel: () => void;
}

const TimerForm = ({ editingTimerId, timers, onCancel }: TimerFormProps) => {
  const [timerType, setTimerType] = useState("stopwatch");
  const [timerName, setTimerName] = useState("");
  const [timerDuration, setTimerDuration] = useState("");

  const { addTimer, updateTimer } = useContext(TimersContext);

  const timerToEdit = editingTimerId
    ? timers?.find((t) => t.id === editingTimerId)
    : null;

  useEffect(() => {
    if (timerToEdit) {
      setTimerName(timerToEdit.name);
      setTimerType(timerToEdit.type);
      setTimerDuration(timerToEdit.duration?.toString() ?? "");
    } else {
      setTimerName("");
      setTimerType("stopwatch");
      setTimerDuration("");
    }
  }, [timerToEdit]);

  const handleSubmitTimer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        typeof timerName !== "string" ||
        !timerName ||
        (timerType !== "stopwatch" && timerType !== "countdown") ||
        (timerType === "countdown" && !timerDuration)
      ) {
        throw new Error("Invalid form data");
      }

      if (timerToEdit) {
        await updateTimer(timerToEdit.id, {
          name: timerName,
          type: timerType,
          ...(timerType === "countdown" && timerDuration
            ? { duration: Number(timerDuration) }
            : {}),
          updatedAt: Date.now(),
        });
      } else {
        const timerToAdd: NewTimer = {
          name: timerName,
          type: timerType,
          ...(timerType === "countdown" && timerDuration
            ? { duration: Number(timerDuration) }
            : {}),
        };

        await addTimer(timerToAdd);
      }
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        className="flex flex-col items-center gap-6 w-full"
        onSubmit={(e) => void handleSubmitTimer(e)}
      >
        <label className="flex flex-col w-full gap-2">
          Timer Name:
          <input
            className="bg-gray-600 rounded-sm leading-10 px-2"
            name="timerName"
            type="text"
            value={timerName}
            onChange={(e) => setTimerName(e.target.value)}
          />
        </label>
        <div className="flex gap-4">
          <label className="flex gap-2">
            Stopwatch
            <input
              onChange={() => setTimerType("stopwatch")}
              type="radio"
              name="timerType"
              value="stopwatch"
              checked={timerType === "stopwatch"}
            />
          </label>

          <label className="flex gap-2">
            Countdown
            <input
              onChange={() => setTimerType("countdown")}
              type="radio"
              name="timerType"
              value="countdown"
              checked={timerType === "countdown"}
            />
          </label>
        </div>
        {timerType === "countdown" ? (
          <label className="flex flex-col w-full gap-2">
            Duration:
            <input
              className="bg-gray-600 rounded-sm leading-10 px-2"
              name="duration"
              type="number"
              value={timerDuration}
              onChange={(e) => setTimerDuration(e.target.value)}
            />
          </label>
        ) : null}
        <button className="w-full bg-yellow-700 rounded-md" type="submit">
          Add
        </button>
      </form>
      <button
        className="w-full bg-yellow-700 rounded-md mt-2"
        onClick={onCancel}
      >
        Cancel
      </button>
    </>
  );
};

export default TimerForm;
