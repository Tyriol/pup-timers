import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
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

const renderWithProp = (onCancel: () => void) => {
  render(
    <TimersProviderMock>
      <TimerForm onCancel={onCancel} />
    </TimersProviderMock>,
  );
};

describe("Timer Form Rendering", () => {
  it("Renders the form with inputs for Timer name and type, a close button and an add button", () => {
    const onCancel = vi.fn();
    renderWithProp(onCancel);

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
  it("calls onCancel() when the close button is clicked", () => {
    const onCancel = vi.fn();

    renderWithProp(onCancel);
    const closeBtn = screen.getByText("Cancel");

    fireEvent.click(closeBtn);

    expect(onCancel).toHaveBeenCalled();
  });

  it("submits the form with valid data for a stopwatch", async () => {
    const onCancel = vi.fn();
    renderWithProp(onCancel);

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
    const onCancel = vi.fn();
    renderWithProp(onCancel);

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

describe("TimerForm error handling", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("consoles an error if no data is submitted", () => {
    const onCancel = vi.fn();
    renderWithProp(onCancel);

    const addBtn = screen.getByRole("button", { name: "Add" });

    fireEvent.click(addBtn);

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("consoles an error if type is countdown and no duration is submitted", () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);

    const addBtn = screen.getByRole("button", { name: "Add" });
    const countdownRadioBtn = screen.getByRole("radio", { name: "Countdown" });

    fireEvent.click(countdownRadioBtn);
    fireEvent.click(addBtn);

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
