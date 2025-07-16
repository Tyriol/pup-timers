import { useContext, useState } from "react";
import { DogsContext } from "../../context/Context";
import type { Dog, NewDog } from "../../types/types";

const TestDogComponent = () => {
  const [dogId, setDogId] = useState<number>();
  const { dogsList, addDog, updateDog } = useContext(DogsContext) as {
    dogsList: Dog[];
    addDog: (newDog: NewDog) => Promise<number>;
    updateDog: (id: number | undefined, updatedDog: Partial<Dog>) => void;
  };

  const newDog = {
    name: "Dexter",
    age: 3,
    breed: "Golden Retriever",
  };

  const updatedDog = {
    age: 9,
  };

  const handleAddDog = async () => {
    const result = await addDog(newDog);
    setDogId(result);
  };

  const displayAge = dogsList.find((dog) => dog.id === dogId)?.age ?? "?";

  return (
    <>
      <button data-testid="add-dog-button" onClick={() => void handleAddDog()}>
        Add new Dog
      </button>
      <div data-testid="dogs-age">{displayAge}</div>
      <button
        data-testid="update-dog-button"
        onClick={() => updateDog(dogId, updatedDog)}
      >
        Update Dog
      </button>
    </>
  );
};

export default TestDogComponent;
