import { describe, it, vi, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TimersContext } from "../../context/Context";
import TimerForm from "./TimerForm";
import type { Timer } from "../../types/types";

const mockAddTimer = vi.fn(() => Promise.resolve(1));
const mockUpdateTimer = vi.fn(() => Promise.resolve());

const TimersProviderMock: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <TimersContext.Provider
    value={{
      timersList: [],
      loading: true,
      addTimer: mockAddTimer,
      updateTimer: mockUpdateTimer,
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

  it("prefills a timer and updates it instead of adding a new timer", async () => {
    const onCancel = vi.fn();
    const timer: Timer = {
      id: 7,
      name: "Breakfast",
      type: "stopwatch",
      elapsed: 0,
      isRunning: false,
    };

    render(
      <TimersProviderMock>
        <TimerForm
          editingTimerId={timer.id}
          timers={[timer]}
          onCancel={onCancel}
        />
      </TimersProviderMock>,
    );

    const nameField = screen.getByRole("textbox", { name: "Timer Name:" });
    expect(nameField).toHaveValue("Breakfast");
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();

    fireEvent.change(nameField, { target: { value: "Evening walk" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Update" }));
    });

    expect(mockUpdateTimer).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        name: "Evening walk",
        type: "stopwatch",
        duration: undefined,
        updatedAt: expect.any(Number),
      }),
    );
    expect(onCancel).toHaveBeenCalled();
  });
});

describe("TimerForm error handling", () => {
  it("shows an error if no name is submitted", () => {
    const onCancel = vi.fn();
    renderWithProp(onCancel);

    const addBtn = screen.getByRole("button", { name: "Add" });

    const form = addBtn.closest("form");
    if (!form) {
      throw new Error("Timer form was not rendered");
    }
    fireEvent.submit(form);

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a timer name.");
  });

  it("shows an error if a countdown duration is not positive whole seconds", () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);

    const addBtn = screen.getByRole("button", { name: "Add" });
    const countdownRadioBtn = screen.getByRole("radio", { name: "Countdown" });

    fireEvent.click(countdownRadioBtn);
    fireEvent.change(screen.getByRole("textbox", { name: "Timer Name:" }), {
      target: { value: "Medication" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Duration:" }), {
      target: { value: "0" },
    });

    const form = addBtn.closest("form");
    if (!form) {
      throw new Error("Timer form was not rendered");
    }
    fireEvent.submit(form);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a whole-number duration greater than zero.",
    );
  });
});
