import App from "./App";
import { IDBFactory } from "fake-indexeddb";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { DogsProvider } from "./context/Providers/Dogs/DogsContextProvider";
import { TimersProvider } from "./context/Providers/Timers/TimersContextProvider";

describe("App", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
    render(
      <DogsProvider>
        <TimersProvider>
          <App />
        </TimersProvider>
      </DogsProvider>,
    );
  });

  it("renders the add timer button", () => {
    const addTimerButton = screen.getByText("+");
    expect(addTimerButton).toBeInTheDocument();
  });

  it("renders the add timer form when the + button is clicked", () => {
    const addTimerButton = screen.getByText("+");
    fireEvent.click(addTimerButton);
    const timerNameInput = screen.getByRole("textbox", { name: "Timer Name:" });
    expect(timerNameInput).toBeInTheDocument();
  });
});
