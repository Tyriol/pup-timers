export const validateTimerFormData = (
  name: FormDataEntryValue | null,
  type: FormDataEntryValue | null,
  duration: FormDataEntryValue | null,
) => {
  let validationError = "";

  if (typeof name !== "string") {
    validationError = "Incorrect name format, try letters and numbers";
  } else if (!name) {
    validationError = "Missing a name for your timer";
  } else if (type !== "stopwatch" && type !== "countdown") {
    validationError = "The timer can only be either stopwatch or countdown";
  } else if (type === "countdown" && !duration) {
    validationError = "A countdown must include a duration";
  }
  if (validationError) {
    throw new Error(validationError);
  }

  return { name, type, duration };
};
