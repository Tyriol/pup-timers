import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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

  it("add a new dog to the dogs array", async () => {
    const TestDogComponent = () => {
      const { dogsList, addDog } = useContext(DogsContext) as {
        dogsList: Dog[];
        addDog: (newDog: Dog) => void;
      };

      const newDog = {
        id: "1",
        name: "Buddy",
        age: 3,
        breed: "Golden Retriever",
      };

      return (
        <>
          <button data-testid="add-dog-button" onClick={() => addDog(newDog)}>
            Add new Dog
          </button>
          <div data-testid="dogs-count">{dogsList.length}</div>
        </>
      );
    };

    render(
      <DogsProvider>
        <TestDogComponent />
      </DogsProvider>,
    );

    const dogCountBefore = screen.getByTestId("dogs-count").textContent;
    expect(dogCountBefore).toBe("0");

    const addDogButton = screen.getByTestId("add-dog-button");
    await userEvent.click(addDogButton);

    const dogCountAfter = screen.getByTestId("dogs-count").textContent;
    expect(dogCountAfter).toBe("1");
  });
});
