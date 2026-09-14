import React, { useState, useContext, useEffect } from "react";
import { TimersContext } from "../../context/Context";
import type { Timer, NewTimer } from "../../types/types";

interface TimerFormProps {
  editingTimerId?: number;
  timers?: Timer[];
  onCancel: () => void;
}

const TimerForm = ({ editingTimerId, timers, onCancel }: TimerFormProps) => {
  const [timerType, setTimerType] = useState<Timer["type"]>("stopwatch");
  const [timerName, setTimerName] = useState("");
  const [timerDuration, setTimerDuration] = useState("");
  const [formError, setFormError] = useState("");

  const { addTimer, updateTimer } = useContext(TimersContext);

  const timerToEdit = editingTimerId
    ? timers?.find((t) => t.id === editingTimerId)
    : null;
  const isEditing = timerToEdit !== null && timerToEdit !== undefined;

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
    const duration = Number(timerDuration);
    const name = timerName.trim();

    if (!name) {
      setFormError("Enter a timer name.");
      return;
    }

    if (
      timerType === "countdown" &&
      (!Number.isInteger(duration) || duration <= 0)
    ) {
      setFormError("Enter a whole-number duration greater than zero.");
      return;
    }

    setFormError("");

    try {
      if (timerToEdit) {
        const configurationChanged =
          timerToEdit.type !== timerType ||
          (timerType === "countdown" && timerToEdit.duration !== duration);

        await updateTimer(timerToEdit.id, {
          name,
          type: timerType,
          duration: timerType === "countdown" ? duration : undefined,
          ...(configurationChanged
            ? { elapsed: 0, isRunning: false, startTime: undefined }
            : {}),
          updatedAt: Date.now(),
        });
      } else {
        const timerToAdd: NewTimer = {
          name,
          type: timerType,
          ...(timerType === "countdown" ? { duration } : {}),
        };

        await addTimer(timerToAdd);
      }
      onCancel();
    } catch (error) {
      console.error(error);
      setFormError("Unable to save the timer. Please try again.");
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
            onChange={(e) => {
              setTimerName(e.target.value);
              setFormError("");
            }}
            required
          />
        </label>
        <div className="flex gap-4">
          <label className="flex gap-2">
            Stopwatch
            <input
              onChange={() => {
                setTimerType("stopwatch");
                setFormError("");
              }}
              type="radio"
              name="timerType"
              value="stopwatch"
              checked={timerType === "stopwatch"}
            />
          </label>

          <label className="flex gap-2">
            Countdown
            <input
              onChange={() => {
                setTimerType("countdown");
                setFormError("");
              }}
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
              min="1"
              step="1"
              value={timerDuration}
              onChange={(e) => {
                setTimerDuration(e.target.value);
                setFormError("");
              }}
              required
            />
          </label>
        ) : null}
        {formError ? <p role="alert">{formError}</p> : null}
        <button className="w-full bg-yellow-700 rounded-md" type="submit">
          {isEditing ? "Update" : "Add"}
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
