import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimersContext } from "../../../context/Context";
import { TimersProvider } from "../../../context/Providers/Timers/TimersContextProvider";
import db from "../../../db/db";
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
    expect(
      screen.queryByRole("button", { name: "Add timer" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Edit timer" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Countdown" })).toBeChecked();
    expect(
      screen.getByRole("spinbutton", { name: "Duration (seconds):" }),
    ).toHaveValue(3600);
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("returns to the timer list when editing is cancelled", () => {
    renderTimersContainer();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("button", { name: "Save changes" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Medication")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your timers" })).toHaveFocus();
    expect(
      screen.getByRole("button", { name: "Add timer" }),
    ).toBeInTheDocument();
  });
});

it("opens creation and returns focus to the list after cancelling", () => {
  renderTimersContainer();
  fireEvent.click(screen.getByRole("button", { name: "Add timer" }));
  expect(screen.getByRole("heading", { name: "Add timer" })).toHaveFocus();
  expect(
    screen.queryByRole("button", { name: "Edit" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.getByRole("heading", { name: "Your timers" })).toHaveFocus();
});

describe("Deleting timers", () => {
  beforeEach(async () => {
    await db.timers.clear();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await db.timers.clear();
  });

  it.each([false, true])(
    "deletes only the selected timer after stopping it if needed (initially running: %s)",
    async (isRunning) => {
      await db.timers.bulkAdd([
        { ...timer, isRunning },
        { ...timer, id: 2, name: "Walk", type: "stopwatch" },
      ]);
      const user = userEvent.setup();
      const { unmount } = render(
        <TimersProvider>
          <TimersContainer />
        </TimersProvider>,
      );
      const card = await screen.findByRole("article", { name: "Medication" });
      const deleteButton = within(card).getByRole("button", { name: "Delete" });
      if (isRunning) {
        expect(deleteButton).toBeDisabled();
        await user.click(deleteButton);
        expect(card).toBeInTheDocument();
        expect(await db.timers.get(timer.id)).toEqual({ ...timer, isRunning });

        await user.click(within(card).getByRole("button", { name: "Stop" }));
      }
      expect(deleteButton).toBeEnabled();
      deleteButton.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => expect(card).not.toBeInTheDocument());
      expect(screen.getByRole("article", { name: "Walk" })).toBeInTheDocument();
      expect(screen.getByText("1 total")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Your timers" }),
      ).toHaveFocus();
      expect(await db.timers.get(timer.id)).toBeUndefined();

      unmount();
      render(
        <TimersProvider>
          <TimersContainer />
        </TimersProvider>,
      );
      const remainingCard = await screen.findByRole("article", {
        name: "Walk",
      });
      expect(
        screen.queryByRole("article", { name: "Medication" }),
      ).not.toBeInTheDocument();
      await user.click(
        within(remainingCard).getByRole("button", { name: "Delete" }),
      );
      expect(
        await screen.findByText("Your first timer starts here"),
      ).toBeInTheDocument();
      expect(screen.getByText("0 total")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Your timers" }),
      ).toHaveFocus();
    },
  );

  it("keeps the timer and allows retrying when deletion fails", async () => {
    await db.timers.add(timer);
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(db.timers, "delete").mockRejectedValueOnce(
      new Error("Storage unavailable"),
    );
    const user = userEvent.setup();
    render(
      <TimersProvider>
        <TimersContainer />
      </TimersProvider>,
    );
    await screen.findByRole("article", { name: "Medication" });
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not delete this timer. Please try again.",
    );
    expect(
      screen.getByRole("article", { name: "Medication" }),
    ).toBeInTheDocument();
    expect(await db.timers.get(timer.id)).toEqual(timer);
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      await screen.findByText("Your first timer starts here"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("disables card actions while deletion is pending", async () => {
    let finishDelete: () => void = () => {};
    const deleteTimer = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishDelete = resolve;
        }),
    );
    render(
      <TimersContext.Provider
        value={{
          timersList: [timer],
          loading: false,
          addTimer: vi.fn(),
          updateTimer: vi.fn(),
          deleteTimer,
        }}
      >
        <TimersContainer />
      </TimersContext.Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    for (const name of ["Start", "Edit", "Delete"]) {
      expect(screen.getByRole("button", { name })).toBeDisabled();
    }
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(deleteTimer).toHaveBeenCalledTimes(1);
    expect(deleteTimer).toHaveBeenCalledWith(timer.id);
    await act(async () => finishDelete());
  });
});
