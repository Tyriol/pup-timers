import { describe, it, vi, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TimersContext } from "../../context/Context";
import TimerForm from "./TimerForm";

const mockAddTimer = vi.fn(() => Promise.resolve(1));

const TimersProviderMock: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <TimersContext.Provider
    value={{
      timersList: [],
      loading: true,
      addTimer: mockAddTimer,
      updateTimer: vi.fn(),
      deleteTimer: vi.fn(),
    }}
  >
    {children}
  </TimersContext.Provider>
);

const renderWithProp = (
  setIsAddingTimer: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  render(
    <TimersProviderMock>
      <TimerForm setIsAddingTimer={setIsAddingTimer} />;
    </TimersProviderMock>,
  );
};

describe("Timer Form Rendering", () => {
  it("Renders the form with inputs for Timer name and type, a close button and an add button", () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);

    expect(
      screen.getByRole("textbox", { name: "Timer Name:" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Stopwatch" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Countdown" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("doesn't render the duration field if Stopwatch is selected", () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);
    const stopwatchRadioBtn = screen.getByRole("radio", { name: "Stopwatch" });
    fireEvent.click(stopwatchRadioBtn);
    expect(
      screen.queryByRole("spinbutton", { name: "Duration:" }),
    ).not.toBeInTheDocument();
  });

  it("does render the duration field if Countdown is selected", () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);
    const countdownRadioBtn = screen.getByRole("radio", { name: "Countdown" });
    fireEvent.click(countdownRadioBtn);
    expect(
      screen.queryByRole("spinbutton", { name: "Duration:" }),
    ).toBeInTheDocument();
  });
});

describe("Timer form logic", () => {
  it("calls setIsAddingTimer(false) when the close button is clicked", () => {
    const setIsAddingTimer = vi.fn();

    renderWithProp(setIsAddingTimer);
    const closeBtn = screen.getByText("Cancel");

    fireEvent.click(closeBtn);

    expect(setIsAddingTimer).toHaveBeenCalledWith(false);
  });

  it("submits the form with valid data for a stopwatch", async () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);

    const nameField = screen.getByRole("textbox", { name: "Timer Name:" });
    const stopwatchRadioBtn = screen.getByRole("radio", { name: "Stopwatch" });
    const addBtn = screen.getByRole("button", { name: "Add" });

    fireEvent.change(nameField, { target: { value: "Test S Timer" } });
    fireEvent.click(stopwatchRadioBtn);
    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(mockAddTimer).toHaveBeenCalledWith({
      name: "Test S Timer",
      type: "stopwatch",
    });
  });

  it("submits the form with valid data for a countdown", async () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);

    const nameField = screen.getByRole("textbox", { name: "Timer Name:" });
    const countdownRadioBtn = screen.getByRole("radio", { name: "Countdown" });
    const addBtn = screen.getByRole("button", { name: "Add" });

    fireEvent.change(nameField, { target: { value: "Test C Timer" } });
    fireEvent.click(countdownRadioBtn);

    const durationField = screen.getByRole("spinbutton", { name: "Duration:" });

    fireEvent.change(durationField, { target: { value: 300 } });

    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(mockAddTimer).toHaveBeenCalledWith({
      name: "Test C Timer",
      type: "countdown",
      duration: 300,
    });
  });
});
