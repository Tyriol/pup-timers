import React from "react";

interface TimerCardButtonProps {
  type: "playPause" | "reset" | "edit";
  onClick: () => void;
  disabled?: boolean;
}

const TimerCardButton = ({
  type,
  onClick,
  disabled = false,
}: TimerCardButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick();
  };

  const btnIcon =
    type === "playPause" ? "▶️/⏸️" : type === "reset" ? "🔄" : "✏️";
  const btnAltText =
    type === "playPause" ? "Play/Pause" : type === "reset" ? "Reset" : "Edit";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={btnAltText}
      disabled={disabled}
      title={
        disabled && type === "edit"
          ? "Stop the timer before editing"
          : undefined
      }
      className="bg-yellow-700 w-full max-w-md"
    >
      {btnIcon}
    </button>
  );
};

export default TimerCardButton;
