import "./App.css";
import Stopwatch from "./components/Timers/Stopwatch/Stopwatch";
import type { Timer } from "./types/types";

function App() {
  const timer: Timer = {
    type: "stopwatch",
    id: 1,
    elapsed: 0,
    isRunning: false,
    name: "Last Wee",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-4x1 underline">Pup Timers!</h1>
      <Stopwatch timer={timer} />
    </div>
  );
}

export default App;
