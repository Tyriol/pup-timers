export const durationUnitSeconds = {
  seconds: 1,
  minutes: 60,
  hours: 60 * 60,
  days: 60 * 60 * 24,
  weeks: 60 * 60 * 24 * 7,
  months: 60 * 60 * 24 * 30,
} as const;

export type DurationUnit = keyof typeof durationUnitSeconds;

export const isDurationUnit = (unit: string): unit is DurationUnit =>
  Object.hasOwn(durationUnitSeconds, unit);

export const convertDurationToSeconds = (
  duration: number,
  unit: DurationUnit,
) => duration * durationUnitSeconds[unit];

export const getDurationInputFromSeconds = (seconds: number) => {
  const units: DurationUnit[] = [
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
  ];
  const unit =
    units.find((candidate) => seconds % durationUnitSeconds[candidate] === 0) ??
    "seconds";

  return {
    duration: seconds / durationUnitSeconds[unit],
    unit,
  };
};

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

export const formatTime = (secs: number) => {
  const { seconds, minutes, hours, days } = getTimeFromSeconds(secs);
  const displayDays =
    days === 0 ? "0 days" : days === 1 ? "1 day" : days + " days";
  const displayHours = hours < 10 ? "0" + hours : hours;
  const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
  const displaySeconds = seconds < 10 ? "0" + seconds : seconds;

  return {
    displayDays,
    displayTime: `${displayHours}:${displayMinutes}:${displaySeconds}`,
  };
};

export const calculateElapsedTime = (
  currentTime: number,
  startTime: number,
) => {
  return Math.max(0, Math.floor((currentTime - startTime) / 1000));
};
