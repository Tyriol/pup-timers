interface AddTimerButtonProps {
  onClick: () => void;
}

const AddTimerButton = ({ onClick }: AddTimerButtonProps) => (
  <button type="button" onClick={onClick} className="primary-button add-timer">
    <span aria-hidden="true">＋ </span>Add timer
  </button>
);

export default AddTimerButton;
