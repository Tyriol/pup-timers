// store the time elapsed
// display the time elapsed or time remaining
// be able to know if a timer is running
// and start it if not
// or stop it if it is
// Be able to reset the time back to zero

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
