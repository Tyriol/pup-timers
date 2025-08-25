import React, { useState, useContext } from "react";
import { TimersContext } from "../../context/Context";

interface TimerFormProps {
  setIsAddingTimer: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimerForm = ({ setIsAddingTimer }: TimerFormProps) => {
  const [timerType, setTimerType] = useState("stopwatch");
  const { addTimer } = useContext(TimersContext);

  const handleAddTimer = async (formData: FormData) => {
    try {
      const name = formData.get("timerName");
      const type = formData.get("timerType");

      if (
        typeof name !== "string" ||
        (type !== "stopwatch" && type !== "countdown")
      ) {
        throw new Error("Invalid form data");
      }

      await addTimer({ name, type });
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddingTimer(false);
    }
  };

  return (
    <form className="flex flex-col" action={handleAddTimer}>
      <label>
        Timer Name:
        <input name="timerName" type="text" />
      </label>
      <label>
        StopWatch
        <input
          onClick={() => setTimerType("stopwatch")}
          type="radio"
          name="timerType"
          value="stopwatch"
        />
      </label>
      <label>
        Countdown
        <input
          onClick={() => setTimerType("countdown")}
          type="radio"
          name="timerType"
          value="countdown"
        />
      </label>
      {timerType === "countdown" ? (
        <label>
          Duration:
          <input name="duration" type="number" />
        </label>
      ) : null}
      <button>Close Form</button>
    </form>
  );
};

export default TimerForm;
