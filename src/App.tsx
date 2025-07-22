import "./App.css";
import Stopwatch from "./components/Stopwatch/Stopwatch";

function App() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-4x1 underline">Pup Timers!</h1>
      <Stopwatch secs={930010} />
    </div>
  );
}

export default App;
