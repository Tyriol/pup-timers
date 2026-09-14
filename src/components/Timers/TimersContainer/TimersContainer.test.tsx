import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TimersContext } from "../../../context/Context";
import type { Timer } from "../../../types/types";
import TimersContainer from "./TimersContainer";

const timer: Timer = {
  id: 1,
  name: "Medication",
  type: "countdown",
  duration: 3600,
  elapsed: 0,
  isRunning: false,
};

const renderTimersContainer = () =>
  render(
    <TimersContext.Provider
      value={{
        timersList: [timer],
        loading: false,
        addTimer: vi.fn(),
        updateTimer: vi.fn(),
        deleteTimer: vi.fn(),
      }}
    >
      <TimersContainer />
    </TimersContext.Provider>,
  );

describe("TimersContainer editing", () => {
  it("opens a populated edit form when Edit is clicked", () => {
    renderTimersContainer();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByRole("textbox", { name: "Timer Name:" })).toHaveValue(
      "Medication",
    );
    expect(screen.getByRole("radio", { name: "Countdown" })).toBeChecked();
    expect(screen.getByRole("spinbutton", { name: "Duration:" })).toHaveValue(
      3600,
    );
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("returns to the timer list when editing is cancelled", () => {
    renderTimersContainer();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("button", { name: "Update" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Medication")).toBeInTheDocument();
  });
});
