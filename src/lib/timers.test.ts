import { describe, it, expect } from "vitest";
import { getTimeFromSeconds, formatTime } from "./timers";

describe("The timer utility functions", () => {
  it("converts seconds to days and remaining hours, minutes and seconds correctly", () => {
    const { days, hours, minutes, seconds } = getTimeFromSeconds(93825);
    expect(days).toBe(1);
    expect(hours).toBe(2);
    expect(minutes).toBe(3);
    expect(seconds).toBe(45);
  });

  it("returns formatted time to display", () => {
    const { displayDays, displayTime } = formatTime(10, 20, 18, 1);
    expect(displayTime).toBe("18h 20m 10s");
    expect(displayDays).toBe("1 day");
  });

  it("correctly formats 0 days", () => {
    const { displayDays, displayTime } = formatTime(10, 20, 18, 0);
    expect(displayTime).toBe("18h 20m 10s");
    expect(displayDays).toBe("0 days");
  });

  it("correctly formats more than 1 days", () => {
    const { displayDays, displayTime } = formatTime(10, 20, 18, 10);
    expect(displayTime).toBe("18h 20m 10s");
    expect(displayDays).toBe("10 days");
  });
});
