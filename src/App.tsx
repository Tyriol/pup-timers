import "./App.css";
import { useState } from "react";
import TimersContainer from "./components/Timers/TimersContainer/TimersContainer";
import AddTimerButton from "./components/Buttons/AddTimerButton/AddTimerButton";
import TimerForm from "./components/forms/TimerForm";

function App() {
  const [isAddingTimer, setIsAddingTimer] = useState(false);
  return (
    <div className="grid items-center justify-center w-full max-h-screen">
      {isAddingTimer ? (
        <TimerForm setIsAddingTimer={setIsAddingTimer} />
      ) : (
        <>
          <TimersContainer />
          <AddTimerButton setIsAddingTimer={setIsAddingTimer} />
        </>
      )}
    </div>
  );
}

export default App;
