import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { getTimeFromSeconds, formatTime, calculateElapsedTime } from "./timers";

describe("The timer utility functions", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-08-21T10:00:00Z"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("converts seconds to days and remaining hours, minutes and seconds correctly", () => {
    const { days, hours, minutes, seconds } = getTimeFromSeconds(93825);
    expect(days).toBe(1);
    expect(hours).toBe(2);
    expect(minutes).toBe(3);
    expect(seconds).toBe(45);
  });

  it("returns formatted time to display", () => {
    const { displayDays, displayTime } = formatTime(152410);
    expect(displayTime).toBe("18:20:10");
    expect(displayDays).toBe("1 day");
  });

  it("correctly formats 0 days", () => {
    const { displayDays, displayTime } = formatTime(66010);
    expect(displayTime).toBe("18:20:10");
    expect(displayDays).toBe("0 days");
  });

  it("correctly formats more than 1 days", () => {
    const { displayDays, displayTime } = formatTime(930010);
    expect(displayTime).toBe("18:20:10");
    expect(displayDays).toBe("10 days");
  });

  it("calculates the current time elapsed", () => {
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    const updatedAt = currentTime - 500000;
    const elapsedSecs = 57;

    const elapsed = calculateElapsedTime(currentTime, elapsedSecs, updatedAt);
    expect(elapsed).toBe(557);
  });
});
