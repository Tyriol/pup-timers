import React, { useState, useContext } from "react";
import { TimersContext } from "../../context/Context";
import type { NewTimer } from "../../types/types";

interface TimerFormProps {
  setIsAddingTimer: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimerForm = ({ setIsAddingTimer }: TimerFormProps) => {
  const [timerType, setTimerType] = useState("stopwatch");
  const { addTimer } = useContext(TimersContext);

  const handleAddTimer = async (formData: FormData) => {
    try {
      const nameEntry = formData.get("timerName");
      const typeEntry = formData.get("timerType");
      const durationEntry = formData.get("duration");

      if (
        typeof nameEntry !== "string" ||
        !nameEntry ||
        (typeEntry !== "stopwatch" && typeEntry !== "countdown") ||
        (typeEntry === "countdown" && !durationEntry)
      ) {
        throw new Error("Invalid form data");
      }

      const timerToAdd: NewTimer = {
        name: nameEntry,
        type: typeEntry,
        ...(typeEntry === "countdown" && durationEntry
          ? { duration: Number(durationEntry) }
          : {}),
      };

      await addTimer(timerToAdd);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddingTimer(false);
    }
  };

  return (
    <>
      <form
        className="flex flex-col items-center gap-6 w-full"
        action={handleAddTimer}
      >
        <label className="flex flex-col w-full gap-2">
          Timer Name:
          <input
            className="bg-gray-600 rounded-sm leading-10 px-2"
            name="timerName"
            type="text"
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
            />
          </label>
        ) : null}
        <button className="w-full bg-yellow-700 rounded-md" type="submit">
          Add
        </button>
      </form>
      <button
        className="w-full bg-yellow-700 rounded-md mt-2"
        onClick={() => setIsAddingTimer(false)}
      >
        Cancel
      </button>
    </>
  );
};

export default TimerForm;
