import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { TimersContext } from "../../Context";
import { TimersProvider } from "./TimersContextProvider";
import type { Timer } from "../../../types/types";
import { describe, it, expect } from "vitest";

describe("Timers Context", () => {
  it("Provides an empty timers array by default", () => {
    const TestComponent = () => {
      const { timersList } = useContext(TimersContext) as {
        timersList: Timer[];
      };

      return <div data-testid="timers-count">{timersList.length}</div>;
    };

    render(
      <TimersProvider>
        <TestComponent />
      </TimersProvider>,
    );

    expect(screen.getByTestId("timers-count").textContent).toBe("0");
  });
});
