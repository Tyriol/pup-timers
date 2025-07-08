import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useContext } from "react";
import { TimersContext } from "../../Context";
import { TimersProvider } from "./TimersContextProvider";
import type { Timer } from "../../../types/types";
import { describe, it, expect } from "vitest";

describe("Timers Context", () => {
  it("Provides an empty timers array by default", () => {
    const TestComponent = () => {
      const { timersList } = useContext(TimersContext) as {
        timersList: Timer[];
      };

      return <div data-testid="timers-count">{timersList.length}</div>;
    };

    render(
      <TimersProvider>
        <TestComponent />
      </TimersProvider>,
    );

    expect(screen.getByTestId("timers-count").textContent).toBe("0");
  });

  it("adds a new timer to the timers array", async () => {
    const TestTimerComponent = () => {
      const { timersList, addTimer } = useContext(TimersContext) as {
        timersList: Timer[];
        addTimer: (newTimer: Timer) => void;
      };

      const newTimer: Timer = {
        type: "countdown",
        elapsed: 0,
        isRunning: false,
        startTime: undefined,
        endTime: undefined,
        id: "1",
        name: "Morning Walk",
        duration: 30,
      };

      return (
        <>
          <button
            data-testid="add-timer-button"
            onClick={() => addTimer(newTimer)}
          >
            Add new Timer
          </button>
          <div data-testid="timers-count">{timersList.length}</div>
        </>
      );
    };

    render(
      <TimersProvider>
        <TestTimerComponent />
      </TimersProvider>,
    );

    const timerCountBefore = screen.getByTestId("timers-count").textContent;
    expect(timerCountBefore).toBe("0");

    const addTimerButton = screen.getByTestId("add-timer-button");
    await userEvent.click(addTimerButton);

    const timerCountAfter = screen.getByTestId("timers-count").textContent;
    expect(timerCountAfter).toBe("1");
  });

  it("updates an existing timer in the timers array", async () => {
    const TestTimerComponent = () => {
      const { timersList, addTimer, updateTimer } = useContext(
        TimersContext,
      ) as {
        timersList: Timer[];
        addTimer: (newTimer: Timer) => void;
        updateTimer: (updatedTimer: Timer) => void;
      };

      const newTimer: Timer = {
        type: "countdown",
        elapsed: 0,
        isRunning: false,
        startTime: undefined,
        endTime: undefined,
        id: "1",
        name: "Morning Walk",
        duration: 30,
      };

      const updatedTimer: Timer = {
        type: "countdown",
        elapsed: 0,
        isRunning: false,
        startTime: undefined,
        endTime: undefined,
        id: "1",
        name: "Morning Walk",
        duration: 45,
      };

      const displayDuration =
        timersList.length === 0 ? "?" : timersList[0].duration;

      return (
        <>
          <button
            data-testid="add-timer-button"
            onClick={() => addTimer(newTimer)}
          >
            Add new Timer
          </button>
          <div data-testid="timer-duration">{displayDuration}</div>
          <button
            data-testid="update-timer-button"
            onClick={() => updateTimer(updatedTimer)}
          >
            Update Timer
          </button>
        </>
      );
    };

    render(
      <TimersProvider>
        <TestTimerComponent />
      </TimersProvider>,
    );

    const addTimerButton = screen.getByTestId("add-timer-button");
    const updateTimerButton = screen.getByTestId("update-timer-button");

    await userEvent.click(addTimerButton);

    const timerDurationBefore =
      screen.getByTestId("timer-duration").textContent;
    expect(timerDurationBefore).toBe("30");

    await userEvent.click(updateTimerButton);

    const timerDurationAfter = screen.getByTestId("timer-duration").textContent;
    expect(timerDurationAfter).toBe("45");
  });
});
