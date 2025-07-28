import "./App.css";
import Stopwatch from "./components/Timers/Stopwatch/Stopwatch";
import Countdown from "./components/Timers/Countdown/Countdown";
import type { Timer } from "./types/types";

function App() {
  const timer: Timer = {
    type: "stopwatch",
    id: 1,
    elapsed: 0,
    isRunning: false,
    name: "Last Wee",
  };

  const cdTimer: Timer = {
    type: "countdown",
    id: 1,
    elapsed: 0,
    duration: 2592000,
    isRunning: false,
    name: "Next Tick and Flea Tab",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-4xl underline">Pup Timers!</h1>
      <Stopwatch timer={timer} />
      <Countdown timer={cdTimer} />
    </div>
  );
}

export default App;
