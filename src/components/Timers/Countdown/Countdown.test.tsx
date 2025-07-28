import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Countdown from "./Countdown";
import { TimersContext } from "../../../context/Context";
import type { Timer } from "../../../types/types";

// Mock formatTime
vi.mock("../../../lib/timers", () => ({
  formatTime: (secs: number) => ({
    displayDays: secs >= 86400 ? `${Math.floor(secs / 86400)}d` : "",
    displayTime: new Date(secs * 1000).toISOString().substring(11, 19),
  }),
}));

const mockUpdateTimer = vi.fn(() => Promise.resolve());

const TimersProviderMock: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <TimersContext.Provider
    value={{
      timersList: [],
      addTimer: vi.fn(),
      updateTimer: mockUpdateTimer,
      deleteTimer: vi.fn(),
    }}
  >
    {children}
  </TimersContext.Provider>
);

const renderWithContext = (timer: Timer) =>
  render(
    <TimersProviderMock>
      <Countdown timer={timer} />
    </TimersProviderMock>,
  );

describe("Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUpdateTimer.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const baseTimer: Timer = {
    id: 1,
    type: "countdown",
    name: "Test Countdown",
    elapsed: 0,
    isRunning: false,
    duration: 5,
  };

  it("renders timer name and initial time", () => {
    renderWithContext(baseTimer);
    expect(screen.getByText("Test Countdown")).toBeInTheDocument();
    expect(screen.getByText("00:00:05")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("starts countdown and decrements timeRemaining", async () => {
    renderWithContext({ ...baseTimer, isRunning: false });
    const startBtn = screen.getByRole("button", { name: "Start" });

    await act(async () => {
      fireEvent.click(startBtn);
    });

    // Simulate 3 seconds
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    // Should show "Stop" button now
    expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
    // Should update timeRemaining
    expect(screen.getByText("00:00:02")).toBeInTheDocument();
    // updateTimer should be called for isRunning and elapsed
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, { isRunning: true });
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, { elapsed: 1 });
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, { elapsed: 2 });
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, { elapsed: 3 });
  });

  it("stops countdown when Stop is clicked", async () => {
    renderWithContext({ ...baseTimer, isRunning: true });
    const stopBtn = screen.getByRole("button", { name: "Stop" });

    await act(async () => {
      fireEvent.click(stopBtn);
      vi.advanceTimersByTime(2000);
    });

    // Should show "Start" button now
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    // updateTimer should be called for isRunning
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, { isRunning: false });
  });

  it("shows Reset button when stopped and elapsed > 0, and resets on click", async () => {
    renderWithContext({ ...baseTimer, isRunning: false, elapsed: 3 });
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    });

    expect(screen.getByText("00:00:05")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, { elapsed: 0 });
  });

  it("shows Reset button when time remaining reaches 0", async () => {
    renderWithContext({ ...baseTimer, isRunning: true, elapsed: 3 });
    expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();

    for (let i = 0; i < 2; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("cleans up interval on unmount", () => {
    const { unmount } = renderWithContext({ ...baseTimer, isRunning: true });
    unmount();
    // No direct assertion, but no errors should occur
  });
});
