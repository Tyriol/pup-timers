import "./App.css";
import TimersContainer from "./components/Timers/TimersContainer/TimersContainer";
import AddTimerButton from "./components/Buttons/AddTimerButton/AddTimerButton";

function App() {
  return (
    <div className="grid items-center justify-center w-full max-h-screen">
      <TimersContainer />
      <AddTimerButton />
    </div>
  );
}

export default App;
