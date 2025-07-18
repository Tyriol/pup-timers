import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext, useState } from "react";
import { IDBFactory } from "fake-indexeddb";
import db from "../../../db/db";
import { TimersContext } from "../../Context";
import { TimersProvider } from "./TimersContextProvider";
import { describe, it, expect, beforeEach } from "vitest";
import type { NewTimer } from "../../../types/types";

describe("Timers Context", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();

    return async () => {
      await db.timers.clear();
    };
  });

  it("Provides an empty timers array by default", () => {
    const TestComponent = () => {
      const { timersList } = useContext(TimersContext);

      return <div data-testid="timers-count">{timersList.length}</div>;
    };

    render(
      <TimersProvider>
        <TestComponent />
      </TimersProvider>,
    );

    const timersCount = screen.getByTestId("timers-count").textContent;

    expect(timersCount).toBe("0");
  });

  it("adds a new timer to the timers array", async () => {
    const TestTimerComponent = () => {
      const [timerId, setTimerId] = useState<number>();
      const { timersList, addTimer } = useContext(TimersContext);

      const newTimer: NewTimer = {
        type: "countdown",
        elapsed: 0,
        isRunning: false,
        startTime: undefined,
        endTime: undefined,
        name: "Morning Walk",
        duration: 30,
      };

      const handleAddTimer = async () => {
        const newTimerId = await addTimer(newTimer);
        setTimerId(newTimerId);
      };

      return (
        <>
          <button data-testid="add-timer-button" onClick={handleAddTimer}>
            Add new Timer
          </button>
          <div data-testid="timers-count">{timersList.length}</div>
          {timerId ? <p>Timer Id: {timerId}</p> : null}
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

    const timerCountAfter = (await screen.findByTestId("timers-count"))
      .textContent;
    expect(timerCountAfter).toBe("1");
  });

  // it("updates an existing timer in the timers array", async () => {
  //   const TestTimerComponent = () => {
  //     const { timersList, addTimer, updateTimer } = useContext(
  //       TimersContext,
  //     ) as {
  //       timersList: Timer[];
  //       addTimer: (newTimer: Timer) => void;
  //       updateTimer: (updatedTimer: Timer) => void;
  //     };

  //     const newTimer: Timer = {
  //       type: "countdown",
  //       elapsed: 0,
  //       isRunning: false,
  //       startTime: undefined,
  //       endTime: undefined,
  //       id: "1",
  //       name: "Morning Walk",
  //       duration: 30,
  //     };

  //     const updatedTimer: Timer = {
  //       type: "countdown",
  //       elapsed: 0,
  //       isRunning: false,
  //       startTime: undefined,
  //       endTime: undefined,
  //       id: "1",
  //       name: "Morning Walk",
  //       duration: 45,
  //     };

  //     const displayDuration =
  //       timersList.length === 0 ? "?" : timersList[0].duration;

  //     return (
  //       <>
  //         <button
  //           data-testid="add-timer-button"
  //           onClick={() => addTimer(newTimer)}
  //         >
  //           Add new Timer
  //         </button>
  //         <div data-testid="timer-duration">{displayDuration}</div>
  //         <button
  //           data-testid="update-timer-button"
  //           onClick={() => updateTimer(updatedTimer)}
  //         >
  //           Update Timer
  //         </button>
  //       </>
  //     );
  //   };

  //   render(
  //     <TimersProvider>
  //       <TestTimerComponent />
  //     </TimersProvider>,
  //   );

  //   const addTimerButton = screen.getByTestId("add-timer-button");
  //   const updateTimerButton = screen.getByTestId("update-timer-button");

  //   await userEvent.click(addTimerButton);

  //   const timerDurationBefore =
  //     screen.getByTestId("timer-duration").textContent;
  //   expect(timerDurationBefore).toBe("30");

  //   await userEvent.click(updateTimerButton);

  //   const timerDurationAfter = screen.getByTestId("timer-duration").textContent;
  //   expect(timerDurationAfter).toBe("45");
  // });

  // it("removes a timer from the timer array", async () => {
  //   const TestTimerComponent = () => {
  //     const { timersList, addTimer, deleteTimer } = useContext(
  //       TimersContext,
  //     ) as {
  //       timersList: Timer[];
  //       addTimer: (newTimer: Timer) => void;
  //       deleteTimer: (id: string) => void;
  //     };

  //     const newTimer: Timer = {
  //       type: "countdown",
  //       elapsed: 0,
  //       isRunning: false,
  //       startTime: undefined,
  //       endTime: undefined,
  //       id: "1",
  //       name: "Morning Walk",
  //       duration: 30,
  //     };

  //     return (
  //       <>
  //         <button
  //           data-testid="add-timer-button"
  //           onClick={() => addTimer(newTimer)}
  //         >
  //           Add new Timer
  //         </button>
  //         <div data-testid="timer-count">{timersList.length}</div>
  //         <button
  //           data-testid="delete-timer-button"
  //           onClick={() => deleteTimer("1")}
  //         >
  //           Delete Timer
  //         </button>
  //       </>
  //     );
  //   };

  //   render(
  //     <TimersProvider>
  //       <TestTimerComponent />
  //     </TimersProvider>,
  //   );

  //   const addTimerButton = screen.getByTestId("add-timer-button");
  //   const deleteTimerButton = screen.getByTestId("delete-timer-button");

  //   await userEvent.click(addTimerButton);

  //   const timerCountBefore = screen.getByTestId("timer-count").textContent;
  //   expect(timerCountBefore).toBe("1");

  //   await userEvent.click(deleteTimerButton);

  //   const timerCountAfter = screen.getByTestId("timer-count").textContent;
  //   expect(timerCountAfter).toBe("0");
  // });
});
