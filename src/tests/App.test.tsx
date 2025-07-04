import App from "../App";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("App", () => {
  it("renders the title correctly", () => {
    render(<App />);
    const headingElement = screen.getByText("Pup Timers!");
    expect(headingElement).toBeInTheDocument();
  });
});
