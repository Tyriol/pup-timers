import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { describe, it, expect } from "vitest";
import { DogsContext } from "../../Context";
import { DogsProvider } from "./DogsContextProvider";
import type { Dog } from "../../../types/types";

describe("Dogs Context", () => {
  it("Provide an empty dogs array by default", () => {
    const TestDogComponent = () => {
      const { dogsList } = useContext(DogsContext) as { dogsList: Dog[] };

      return <div data-testid="dogs-count">{dogsList.length}</div>;
    };

    render(
      <DogsProvider>
        <TestDogComponent />
      </DogsProvider>,
    );

    const dogCount = screen.getByTestId("dogs-count").textContent;

    expect(dogCount).toBe("0");
  });
});
