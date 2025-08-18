import App from "./App";
import { IDBFactory } from "fake-indexeddb";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { DogsProvider } from "./context/Providers/Dogs/DogsContextProvider";
import { TimersProvider } from "./context/Providers/Timers/TimersContextProvider";

describe("App", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
  });

  it("renders the add timer button", () => {
    render(
      <DogsProvider>
        <TimersProvider>
          <App />
        </TimersProvider>
      </DogsProvider>,
    );
    const addTimerButton = screen.getByText("+");
    expect(addTimerButton).toBeInTheDocument();
  });
});
