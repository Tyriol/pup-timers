import App from "./App";
import { IDBFactory } from "fake-indexeddb";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { DogsProvider } from "./context/Providers/Dogs/DogsContextProvider";

describe("App", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
  });

  it("renders the title correctly", () => {
    render(
      <DogsProvider>
        <App />
      </DogsProvider>,
    );
    const headingElement = screen.getByText("Pup Timers!");
    expect(headingElement).toBeInTheDocument();
  });
});
