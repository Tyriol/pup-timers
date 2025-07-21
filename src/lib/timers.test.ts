import { describe, it, expect } from "vitest";
import { getTimeFromSeconds } from "./timers";

describe("The timer utility functions", () => {
  it("converts seconds to days and remaining hours, minutes and seconds correctly", () => {
    const { days, hours, minutes, seconds } = getTimeFromSeconds(93825);
    expect(days).toBe(1);
    expect(hours).toBe(2);
    expect(minutes).toBe(3);
    expect(seconds).toBe(45);
  });
});
