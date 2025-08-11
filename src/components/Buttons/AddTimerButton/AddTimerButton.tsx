import { useContext } from "react";
import type { NewTimer } from "../../../types/types";
import { TimersContext } from "../../../context/Context";

const AddTimerButton = () => {
  const { addTimer } = useContext(TimersContext);

  const newTimer: NewTimer = {
    type: "stopwatch",
    elapsed: 0,
    isRunning: false,
    startTime: undefined,
    endTime: undefined,
    name: "Next wee",
    duration: 300,
  };

  const handleAddTimer = async () => {
    try {
      await addTimer(newTimer);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={() => void handleAddTimer()} className="w-full max-w-md">
      +
    </button>
  );
};

export default AddTimerButton;
