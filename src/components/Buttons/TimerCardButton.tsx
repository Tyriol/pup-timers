import React from "react";

interface TimerCardButtonProps {
  setIsAddingTimer: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimerCardButton = ({ setIsAddingTimer }: TimerCardButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsAddingTimer(true);
  };

  return (
    <button onClick={handleClick} className="bg-yellow-700 w-full max-w-md">
      +
    </button>
  );
};

export default TimerCardButton;
