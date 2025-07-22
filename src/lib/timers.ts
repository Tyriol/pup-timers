export const getTimeFromSeconds = (secs: number) => {
  const days = Math.floor(secs / (60 * 60 * 24));
  const hours = Math.floor((secs % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((secs % (60 * 60)) / 60);
  const seconds = Math.floor(secs % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const formatTime = (
  seconds: number,
  minutes: number,
  hours: number,
  days: number,
) => {
  const displayDays =
    days === 0 ? "0 days" : days === 1 ? "1 day" : days + " days";
  const displayHours = hours < 10 ? "0" + hours : hours;
  const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
  const displaySeconds = seconds < 10 ? "0" + seconds : seconds;

  return {
    displayDays,
    displayTime: `${displayHours}h ${displayMinutes}m ${displaySeconds}s`,
  };
};
