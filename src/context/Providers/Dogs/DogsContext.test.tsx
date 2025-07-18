import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext, useState } from "react";
import { IDBFactory } from "fake-indexeddb";
import db from "../../../db/db";
import { beforeEach, describe, it, expect } from "vitest";
import { DogsContext } from "../../Context";
import { DogsProvider } from "./DogsContextProvider";
import type { NewDog } from "../../../types/types";

describe("Dogs Context", () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();

    return async () => {
      await db.dogs.clear();
    };
  });

  it("Provide an empty dogs array by default", () => {
    const TestDogComponent = () => {
      const { dogsList } = useContext(DogsContext);

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
      const { dogsList, addDog } = useContext(DogsContext);

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
      const [dogId, setDogId] = useState<number>();
      const { dogsList, addDog, updateDog } = useContext(DogsContext);

      const newDog = {
        name: "Buddy",
        age: 3,
        breed: "Golden Retriever",
      };

      const updatedDog = {
        age: 4,
      };

      const handleAddDog = async () => {
        const result = await addDog(newDog);
        setDogId(result);
      };

      const handleUpdateDog = async () => {
        if (dogId) {
          await updateDog(dogId, updatedDog);
        } else {
          console.log("No dog to update");
        }
      };

      const displayAge = dogsList.find((dog) => dog.id === dogId)?.age ?? "?";

      return (
        <>
          <button data-testid="add-dog-button" onClick={handleAddDog}>
            Add new Dog
          </button>
          <div data-testid="dogs-age">{displayAge}</div>
          <button data-testid="update-dog-button" onClick={handleUpdateDog}>
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
      const [dogId, setDogId] = useState<number>();
      const { dogsList, addDog, deleteDog } = useContext(DogsContext);

      const newDog = {
        name: "Buddy",
        age: 3,
        breed: "Golden Retriever",
      };

      const handleAddDog = async () => {
        const result = await addDog(newDog);
        setDogId(result);
      };

      const handleDeleteDog = async () => {
        if (dogId) {
          await deleteDog(dogId);
        }
      };

      return (
        <>
          <button data-testid="add-dog-button" onClick={handleAddDog}>
            Add new Dog
          </button>
          <div data-testid="dogs-count">{dogsList.length}</div>
          <button data-testid="delete-dog-button" onClick={handleDeleteDog}>
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

    const dogCountBefore = (await screen.findByTestId("dogs-count"))
      .textContent;
    expect(dogCountBefore).toBe("1");

    await userEvent.click(deleteDogButton);

    await waitFor(() => {
      const dogCountAfter = screen.getByTestId("dogs-count").textContent;
      expect(dogCountAfter).toBe("0");
    });
  });
});
