import React from "react";

interface TimerFormProps {
  setIsAddingTimer: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimerForm = ({ setIsAddingTimer }: TimerFormProps) => {
  return (
    <form>
      <label>
        <input type="text" />
      </label>
      <button onClick={() => setIsAddingTimer(false)}>Close Form</button>
    </form>
  );
};

export default TimerForm;
