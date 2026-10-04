interface TimerCardButtonProps {
  label: "Start" | "Stop" | "Restart" | "Edit";
  onClick: () => void;
  disabled?: boolean;
}

const TimerCardButton = ({
  label,
  onClick,
  disabled = false,
}: TimerCardButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={label === "Edit" ? "secondary-button" : "primary-button"}
  >
    {label}
  </button>
);

export default TimerCardButton;
