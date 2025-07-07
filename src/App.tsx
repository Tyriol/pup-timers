import "./App.css";
import type { Timer, Dog } from "./types/types";
import TimerPreview from "./components/TimerPreview/TimerPreview";

const sampleTimer: Timer = {
  type: "countdown",
  id: "1",
  name: "Morning Walk",
  duration: 3600, // 1 hour in seconds
  elapsed: 500,
  isRunning: true,
  startTime: Date.now() - 500000, // started 500 seconds ago
};

const sampleDog: Dog = {
  id: "1",
  name: "Buddy",
  age: 3,
  breed: "Golden Retriever",
};

function App() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-3xl font-bold underline">Pup Timers!</h1>
      <TimerPreview timer={sampleTimer} dog={sampleDog} />
    </div>
  );
}

export default App;
