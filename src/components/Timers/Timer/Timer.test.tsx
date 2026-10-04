import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TimerDisplay from "./TimerDisplay";
import { TimersContext } from "../../../context/Context";
import type { Timer } from "../../../types/types";

// Mock formatTime
vi.mock("../../../lib/timers", () => ({
  formatTime: (secs: number) => ({
    displayDays: secs >= 86400 ? `${Math.floor(secs / 86400)}d` : "",
    displayTime: new Date(Math.max(0, secs) * 1000)
      .toISOString()
      .substring(11, 19),
  }),
  calculateElapsedTime: (currentTime: number, startTime: number) =>
    Math.max(0, Math.floor((currentTime - startTime) / 1000)),
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

const renderWithContext = (timer: Timer, onEdit = vi.fn()) =>
  render(
    <TimersProviderMock>
      <TimerDisplay timer={timer} onEdit={onEdit} />
    </TimersProviderMock>,
  );

describe("Stopwatch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-08-21T10:00:00Z"));
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
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("opens editing for a stopped timer and disables editing while it is running", () => {
    const onEdit = vi.fn();
    const { unmount } = renderWithContext(baseTimer, onEdit);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(baseTimer.id);

    unmount();
    renderWithContext({ ...baseTimer, isRunning: true }, onEdit);

    expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled();
  });

  it("calculates elapsed time and renders the correct time display", async () => {
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    renderWithContext({
      ...baseTimer,
      isRunning: true,
      elapsed: 15,
      startTime: currentTime - 1000000,
    });
    expect(screen.getByText("00:16:40")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 1000,
      updatedAt: currentTime,
    });
  });

  it("starts timer and increments elapsed time", async () => {
    renderWithContext({ ...baseTimer, isRunning: false });
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    const startBtn = screen.getByRole("button", { name: "Start" });

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
    expect(screen.getByText("Running")).toBeInTheDocument();
    // Should update elapsed time
    expect(screen.getByText("00:00:15")).toBeInTheDocument();
    // updateTimer should be called for isRunning and elapsed
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      isRunning: true,
      elapsed: 0,
      updatedAt: currentTime,
      startTime: currentTime,
    });
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 15,
      updatedAt: currentTime + 15000,
    });
  });

  it("stops timer when Stop is clicked", async () => {
    renderWithContext({ ...baseTimer, isRunning: true });
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    const stopBtn = screen.getByRole("button", { name: "Stop" });

    await act(async () => {
      vi.advanceTimersByTime(2000);
      fireEvent.click(stopBtn);
    });

    // Should show "Start" button now
    expect(screen.getByText("Stopped")).toBeInTheDocument();
    // updateTimer should be called for isRunning
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      isRunning: false,
      elapsed: 0,
      updatedAt: currentTime + 2000,
    });
  });

  it("restarts a stopped timer from zero", async () => {
    renderWithContext({ ...baseTimer, isRunning: false, elapsed: 5 });
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    expect(screen.getByText("Stopped")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    });

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 0,
      isRunning: true,
      startTime: currentTime,
      updatedAt: currentTime,
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
    vi.setSystemTime(new Date("2025-08-21T10:00:00Z"));
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
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("calculates elapsed time and renders the correct time display", async () => {
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    renderWithContext({
      ...baseTimer,
      isRunning: true,
      elapsed: 5,
      startTime: currentTime - 8000,
    });
    expect(screen.getByText("00:00:22")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 8,
      updatedAt: currentTime,
    });
  });

  it("stops the timer if it hit the duration while offline", async () => {
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    renderWithContext({
      ...baseTimer,
      isRunning: true,
      elapsed: 5,
      startTime: currentTime - 100000,
    });
    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(screen.getByText("Finished")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 30,
      updatedAt: currentTime,
      isRunning: false,
    });
  });

  it("starts countdown and decrements timeRemaining", async () => {
    renderWithContext({ ...baseTimer, isRunning: false });
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    const startBtn = screen.getByRole("button", { name: "Start" });

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
    expect(screen.getByText("Running")).toBeInTheDocument();
    // Should update timeRemaining
    expect(screen.getByText("00:00:15")).toBeInTheDocument();
    // updateTimer should be called for isRunning and elapsed
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      isRunning: true,
      elapsed: 0,
      startTime: currentTime,
      updatedAt: currentTime,
    });
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 15,
      updatedAt: currentTime + 15000,
    });
  });

  it("stops countdown when Stop is clicked", async () => {
    renderWithContext({ ...baseTimer, isRunning: true });
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    const stopBtn = screen.getByRole("button", { name: "Stop" });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    await act(async () => {
      fireEvent.click(stopBtn);
    });

    // Should show red shadow now for stopped state
    expect(screen.getByText("Stopped")).toBeInTheDocument();
    expect(screen.getByText("00:00:28")).toBeInTheDocument();
    // updateTimer should be called for isRunning
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      isRunning: false,
      elapsed: 2,
      updatedAt: currentTime + 2000,
    });
  });

  it("restarts a stopped timer from zero", async () => {
    renderWithContext({ ...baseTimer, isRunning: false, elapsed: 3 });
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();
    expect(screen.getByText("Stopped")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    });

    expect(screen.getByText("00:00:30")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 0,
      isRunning: true,
      updatedAt: currentTime,
      startTime: currentTime,
    });
  });

  it("shows stops when time remaining reaches 0", async () => {
    renderWithContext({ ...baseTimer, isRunning: true, elapsed: 28 });
    const currentTime = new Date("2025-08-21T10:00:00Z").getTime();

    expect(screen.getByText("Running")).toBeInTheDocument();

    for (let i = 0; i < 2; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(mockUpdateTimer).toHaveBeenCalledWith(1, {
      elapsed: 30,
      isRunning: false,
      updatedAt: currentTime + 2000,
    });
  });

  it("cleans up interval on unmount", () => {
    const { unmount } = renderWithContext({ ...baseTimer, isRunning: true });
    unmount();
    // No direct assertion, but no errors should occur
  });
});
