import type { TimerFormData } from "../types/types";

export const validateTimerFormData = ({
  nameEntry,
  typeEntry,
  durationEntry,
}: TimerFormData) => {
  let error = "";
  if (
    typeof nameEntry !== "string" ||
    (typeEntry !== "stopwatch" && typeEntry !== "countdown") ||
    (typeEntry === "countdown" && !durationEntry)
  ) {
    error = "Invalid form data";
    throw new Error(error);
  }
};
