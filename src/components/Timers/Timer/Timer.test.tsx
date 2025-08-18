import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TimerDisplay from "./TimerDisplay";
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
      loading: true,
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
      <TimerDisplay timer={timer} />
    </TimersProviderMock>,
  );

describe("Stopwatch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUpdateTimer.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const baseTimer: Timer = {
    id: 1,
    type: "stopwatch",
    name: "Test Stopwatch",
    elapsed: 0,
    isRunning: false,
  };

  it("renders timer name and initial time", () => {
    renderWithContext(baseTimer);
    expect(screen.getByText("Test Stopwatch")).toBeInTheDocument();
    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Test Stopwatch 00:00:00" }),
    ).toHaveClass("shadow-indigo-500");
  });

  it("starts timer and increments elapsed time", async () => {
    renderWithContext({ ...baseTimer, isRunning: false });
    const startBtn = screen.getByRole("button", {
      name: "Test Stopwatch 00:00:00",
    });

    await act(async () => {
      fireEvent.click(startBtn);
    });

    // Simulate 15 seconds
    for (let i = 0; i < 15; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    // Should show "Stop" button now
    expect(
      screen.getByRole("button", { name: "Test Stopwatch 00:00:15" }),
    ).toHaveClass("shadow-green-500");
    // Should update elapsed time
    expect(screen.getByText("00:00:15")).toBeInTheDocument();
    // updateTimer should be called for isRunning and elapsed
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      isRunning: true,
      elapsed: 0,
    });
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, { elapsed: 15 });
  });

  it("stops timer when Stop is clicked", async () => {
    renderWithContext({ ...baseTimer, isRunning: true });
    const stopBtn = screen.getByRole("button", {
      name: "Test Stopwatch 00:00:00",
    });

    await act(async () => {
      fireEvent.click(stopBtn);
      vi.advanceTimersByTime(2000);
    });

    // Should show "Start" button now
    expect(
      screen.getByRole("button", { name: "Test Stopwatch 00:00:02" }),
    ).toHaveClass("shadow-red-500");
    // updateTimer should be called for isRunning
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      isRunning: false,
      elapsed: 0,
    });
  });

  it("shows Reset button when stopped and elapsed > 0, and resets on click", async () => {
    renderWithContext({ ...baseTimer, isRunning: false, elapsed: 5 });
    expect(
      screen.getByRole("button", { name: "Test Stopwatch 00:00:05" }),
    ).toHaveClass("shadow-red-500");

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Test Stopwatch 00:00:05" }),
      );
    });

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 0,
      isRunning: true,
    });
  });

  it("cleans up interval on unmount", () => {
    const { unmount } = renderWithContext({ ...baseTimer, isRunning: true });
    unmount();
    // No direct assertion, but no errors should occur
  });
});

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
    duration: 30,
  };

  it("renders timer name and initial time", () => {
    renderWithContext(baseTimer);
    expect(screen.getByText("Test Countdown")).toBeInTheDocument();
    expect(screen.getByText("00:00:30")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Test Countdown 00:00:30" }),
    ).toHaveClass("shadow-indigo-500");
  });

  it("starts countdown and decrements timeRemaining", async () => {
    renderWithContext({ ...baseTimer, isRunning: false });
    const startBtn = screen.getByRole("button", {
      name: "Test Countdown 00:00:30",
    });

    await act(async () => {
      fireEvent.click(startBtn);
    });

    // Simulate 3 seconds
    for (let i = 0; i < 15; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    // Should show the running colour of green
    expect(
      screen.getByRole("button", { name: "Test Countdown 00:00:15" }),
    ).toHaveClass("shadow-green-500");
    // Should update timeRemaining
    expect(screen.getByText("00:00:15")).toBeInTheDocument();
    // updateTimer should be called for isRunning and elapsed
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      isRunning: true,
      elapsed: 0,
    });
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, { elapsed: 15 });
  });

  it("stops countdown when Stop is clicked", async () => {
    renderWithContext({ ...baseTimer, isRunning: true });
    const stopBtn = screen.getByRole("button", {
      name: "Test Countdown 00:00:30",
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    await act(async () => {
      fireEvent.click(stopBtn);
    });

    // Should show red shadow now for stopped state
    expect(
      screen.getByRole("button", { name: "Test Countdown 00:00:28" }),
    ).toHaveClass("shadow-red-500");
    expect(screen.getByText("00:00:28")).toBeInTheDocument();
    // updateTimer should be called for isRunning
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      isRunning: false,
      elapsed: 2,
    });
  });

  it("shows Reset button when stopped and elapsed > 0, and resets on click", async () => {
    renderWithContext({ ...baseTimer, isRunning: false, elapsed: 3 });
    expect(
      screen.getByRole("button", { name: "Test Countdown 00:00:27" }),
    ).toHaveClass("shadow-red-500");

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Test Countdown 00:00:27" }),
      );
    });

    expect(screen.getByText("00:00:30")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 0,
      isRunning: true,
    });
  });

  it("shows stops when time remaining reaches 0", async () => {
    renderWithContext({ ...baseTimer, isRunning: true, elapsed: 28 });
    expect(
      screen.getByRole("button", { name: "Test Countdown 00:00:02" }),
    ).toHaveClass("shadow-green-500");

    for (let i = 0; i < 2; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(
      screen.getByRole("button", { name: "Test Countdown 00:00:00" }),
    ).toBeInTheDocument();
  });

  it("cleans up interval on unmount", () => {
    const { unmount } = renderWithContext({ ...baseTimer, isRunning: true });
    unmount();
    // No direct assertion, but no errors should occur
  });
});
