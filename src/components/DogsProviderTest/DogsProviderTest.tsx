import { useContext, useState } from "react";
import { DogsContext } from "../../context/Context";

const TestDogComponent = () => {
  const [dogId, setDogId] = useState<number>();
  const { dogsList, addDog, updateDog } = useContext(DogsContext);

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

  const handleUpdateDog = () => {
    if (dogId) {
      updateDog(dogId, updatedDog);
    }
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
        onClick={() => void handleUpdateDog()}
      >
        Update Dog
      </button>
    </>
  );
};

export default TestDogComponent;
