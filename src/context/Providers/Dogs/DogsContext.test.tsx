import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { IDBFactory } from "fake-indexeddb";
import db from "../../../db/db";
import { beforeEach, describe, it, expect } from "vitest";
import { DogsContext } from "../../Context";
import { DogsProvider } from "./DogsContextProvider";
import type { Dog, NewDog } from "../../../types/types";

describe("Dogs Context", () => {
  beforeEach(async () => {
    indexedDB = new IDBFactory();

    return async () => {
      db.dogs.clear();
    };
  });

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

  it("adds a new dog to the dogs array", async () => {
    const TestDogComponent = () => {
      const { dogsList, addDog } = useContext(DogsContext) as {
        dogsList: Dog[];
        addDog: (newDog: NewDog) => void;
      };

      const handleAddDog = () => {
        addDog(newDog);
      };

      const newDog: NewDog = {
        name: "Buddy",
        age: 3,
        breed: "Golden Retriever",
      };

      return (
        <>
          <button data-testid="add-dog-button" onClick={handleAddDog}>
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

    await waitFor(() => {
      const dogCountBefore = screen.getByTestId("dogs-count").textContent;
      expect(dogCountBefore).toBe("0");
    });

    const addDogButton = screen.getByTestId("add-dog-button");
    await userEvent.click(addDogButton);

    await waitFor(() => {
      const dogCountAfter = screen.getByTestId("dogs-count").textContent;
      expect(dogCountAfter).toBe("1");
    });
  });

  it("updates an existing dog in the dogs array", async () => {
    const TestDogComponent = () => {
      const { dogsList, addDog, updateDog } = useContext(DogsContext) as {
        dogsList: Dog[];
        addDog: (newDog: NewDog) => void;
        updateDog: (updatedDog: Dog) => void;
      };

      const newDog = {
        name: "Buddy",
        age: 3,
        breed: "Golden Retriever",
      };
      const updatedDog = {
        id: "1",
        name: "Buddy",
        age: 4,
        breed: "Golden Retriever",
      };

      const displayAge = dogsList.length === 0 ? "?" : dogsList[0].age;

      return (
        <>
          <button data-testid="add-dog-button" onClick={() => addDog(newDog)}>
            Add new Dog
          </button>
          <div data-testid="dogs-age">{displayAge}</div>
          <button
            data-testid="update-dog-button"
            onClick={() => updateDog(updatedDog)}
          >
            Update Dog
          </button>
        </>
      );
    };

    render(
      <DogsProvider>
        <TestDogComponent />
      </DogsProvider>,
    );

    const addDogButton = screen.getByTestId("add-dog-button");
    const updateDogButton = screen.getByTestId("update-dog-button");

    await userEvent.click(addDogButton);

    await waitFor(() => {
      const dogAgeBefore = screen.getByTestId("dogs-age").textContent;
      expect(dogAgeBefore).toBe("3");
    });

    await userEvent.click(updateDogButton);

    await waitFor(() => {
      const dogAgeAfter = screen.getByTestId("dogs-age").textContent;
      expect(dogAgeAfter).toBe("4");
    });
  });

  it("deletes a dog from the dog array", async () => {
    const TestDogComponent = () => {
      const { dogsList, addDog, deleteDog } = useContext(DogsContext) as {
        dogsList: Dog[];
        addDog: (newDog: NewDog) => void;
        deleteDog: (id: string) => void;
      };

      const newDog = {
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
          <button
            data-testid="delete-dog-button"
            onClick={() => deleteDog("1")}
          >
            Delete Dog
          </button>
        </>
      );
    };

    render(
      <DogsProvider>
        <TestDogComponent />
      </DogsProvider>,
    );

    const addDogButton = screen.getByTestId("add-dog-button");
    const deleteDogButton = screen.getByTestId("delete-dog-button");

    await userEvent.click(addDogButton);

    const dogCountBefore = screen.getByTestId("dogs-count").textContent;
    expect(dogCountBefore).toBe("1");

    await userEvent.click(deleteDogButton);

    const dogCountAfter = screen.getByTestId("dogs-count").textContent;
    expect(dogCountAfter).toBe("0");
  });
});
