import "./App.css";
import TimersContainer from "./components/Timers/TimersContainer/TimersContainer";
import AddTimerButton from "./components/Buttons/AddTimerButton/AddTimerButton";

function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <TimersContainer />
      <AddTimerButton />
    </div>
  );
}

export default App;
