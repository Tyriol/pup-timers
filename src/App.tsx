import "./App.css";
import TestDogComponent from "./components/DogsProviderTest/DogsProviderTest";

function App() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-3xl font-bold underline">Pup Timers!</h1>
      <TestDogComponent />
    </div>
  );
}

export default App;
