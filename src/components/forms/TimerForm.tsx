import React, { useState, useContext, useEffect, useRef } from "react";
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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const { addTimer, updateTimer } = useContext(TimersContext);

  const timerToEdit = editingTimerId
    ? timers?.find((t) => t.id === editingTimerId)
    : null;
  const isEditing = timerToEdit !== null && timerToEdit !== undefined;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

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
    if (isSaving) return;
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
    setIsSaving(true);

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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="form-panel" aria-labelledby="form-heading">
      <h2 id="form-heading" ref={headingRef} tabIndex={-1}>
        {isEditing ? "Edit timer" : "Add timer"}
      </h2>
      <p className="muted form-intro">
        Give your timer a name you’ll recognise at a glance.
      </p>
      <form
        className="timer-form"
        aria-busy={isSaving}
        onSubmit={(e) => void handleSubmitTimer(e)}
      >
        <fieldset className="form-fields" disabled={isSaving}>
          <label className="flex flex-col w-full gap-2">
            Timer Name:
            <input
              className="text-input"
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
          <fieldset className="type-options">
            <legend>Timer type</legend>
            <label className="type-option">
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

            <label className="type-option">
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
          </fieldset>
          <p className="muted">
            {timerType === "stopwatch"
              ? "Counts up from zero."
              : "Counts down from your chosen duration."}
          </p>
          {timerType === "countdown" ? (
            <label className="flex flex-col w-full gap-2">
              Duration (seconds):
              <input
                className="text-input"
                name="duration"
                type="number"
                inputMode="numeric"
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
        </fieldset>
        {formError ? <p role="alert">{formError}</p> : null}
        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create timer"}
        </button>
      </form>
      <button
        className="secondary-button cancel-button"
        type="button"
        disabled={isSaving}
        onClick={onCancel}
      >
        Cancel
      </button>
    </section>
  );
};

export default TimerForm;
