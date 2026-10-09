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
    expect(
      screen.getByRole("button", { name: "Create timer" }),
    ).toBeInTheDocument();
  });

  it("doesn't render the duration field if Stopwatch is selected", () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);
    const stopwatchRadioBtn = screen.getByRole("radio", { name: "Stopwatch" });
    fireEvent.click(stopwatchRadioBtn);
    expect(
      screen.queryByRole("spinbutton", { name: "Amount" }),
    ).not.toBeInTheDocument();
  });

  it("does render the duration field if Countdown is selected", () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);
    const countdownRadioBtn = screen.getByRole("radio", { name: "Countdown" });
    fireEvent.click(countdownRadioBtn);
    expect(
      screen.queryByRole("spinbutton", { name: "Amount" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Unit" })).toHaveValue(
      "minutes",
    );
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
    const addBtn = screen.getByRole("button", { name: "Create timer" });

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
    const addBtn = screen.getByRole("button", { name: "Create timer" });

    fireEvent.change(nameField, { target: { value: "Test C Timer" } });
    fireEvent.click(countdownRadioBtn);

    const durationField = screen.getByRole("spinbutton", {
      name: "Amount",
    });

    fireEvent.change(durationField, { target: { value: 5 } });

    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(mockAddTimer).toHaveBeenCalledWith({
      name: "Test C Timer",
      type: "countdown",
      duration: 300,
    });
  });

  it.each([
    [1, "minutes", 60],
    [3, "weeks", 1_814_400],
    [1, "months", 2_592_000],
  ] as const)(
    "creates a countdown lasting %i %s",
    async (amount, unit, duration) => {
      const onCancel = vi.fn();
      renderWithProp(onCancel);

      fireEvent.change(screen.getByRole("textbox", { name: "Timer Name:" }), {
        target: { value: "Medication" },
      });
      fireEvent.click(screen.getByRole("radio", { name: "Countdown" }));
      fireEvent.change(screen.getByRole("spinbutton", { name: "Amount" }), {
        target: { value: amount },
      });
      fireEvent.change(screen.getByRole("combobox", { name: "Unit" }), {
        target: { value: unit },
      });

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Create timer" }));
      });

      expect(mockAddTimer).toHaveBeenCalledWith({
        name: "Medication",
        type: "countdown",
        duration,
      });
    },
  );

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
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();

    fireEvent.change(nameField, { target: { value: "Evening walk" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
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

  it("prefills a countdown using the largest exact duration unit", () => {
    const timer: Timer = {
      id: 8,
      name: "Flea treatment",
      type: "countdown",
      duration: 1_814_400,
      elapsed: 0,
      isRunning: false,
    };

    render(
      <TimersProviderMock>
        <TimerForm
          editingTimerId={timer.id}
          timers={[timer]}
          onCancel={vi.fn()}
        />
      </TimersProviderMock>,
    );

    expect(screen.getByRole("spinbutton", { name: "Amount" })).toHaveValue(3);
    expect(screen.getByRole("combobox", { name: "Unit" })).toHaveValue("weeks");
  });
});

describe("TimerForm error handling", () => {
  it("shows an error if no name is submitted", () => {
    const onCancel = vi.fn();
    renderWithProp(onCancel);

    const addBtn = screen.getByRole("button", { name: "Create timer" });

    const form = addBtn.closest("form");
    if (!form) {
      throw new Error("Timer form was not rendered");
    }
    fireEvent.submit(form);

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a timer name.");
  });

  it("shows an error if a countdown duration is not a positive whole number", () => {
    const setIsAddingTimer = vi.fn();
    renderWithProp(setIsAddingTimer);

    const addBtn = screen.getByRole("button", { name: "Create timer" });
    const countdownRadioBtn = screen.getByRole("radio", { name: "Countdown" });

    fireEvent.click(countdownRadioBtn);
    fireEvent.change(screen.getByRole("textbox", { name: "Timer Name:" }), {
      target: { value: "Medication" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Amount" }), {
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

it("prevents repeated saves and keeps the form open on failure", async () => {
  let rejectSave: (reason: Error) => void = () => {};
  mockAddTimer.mockImplementationOnce(
    () =>
      new Promise<number>((_resolve, reject) => {
        rejectSave = reject;
      }),
  );
  const onCancel = vi.fn();
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  renderWithProp(onCancel);
  fireEvent.change(screen.getByRole("textbox", { name: "Timer Name:" }), {
    target: { value: "Walk" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create timer" }));
  expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  expect(screen.getByRole("textbox")).toBeDisabled();
  await act(async () => {
    rejectSave(new Error("Storage unavailable"));
  });
  expect(screen.getByRole("alert")).toHaveTextContent("Unable to save");
  expect(screen.getByRole("button", { name: "Create timer" })).toBeEnabled();
  expect(onCancel).not.toHaveBeenCalled();
  consoleError.mockRestore();
});
