import React from "react";

interface AddTimerButtonProps {
  setIsAddingTimer: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTimerButton = ({ setIsAddingTimer }: AddTimerButtonProps) => {
  return (
    <button
      onClick={() => setIsAddingTimer(true)}
      className="bg-yellow-700 w-full max-w-md"
    >
      +
    </button>
  );
};

export default AddTimerButton;
