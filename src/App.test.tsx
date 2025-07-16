import App from "./App";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DogsProvider } from "./context/Providers/Dogs/DogsContextProvider";

describe("App", () => {
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
