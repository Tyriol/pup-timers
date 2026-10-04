import "./App.css";
import TimersContainer from "./components/Timers/TimersContainer/TimersContainer";

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Everyday care, one timer at a time</p>
        <h1>Pup Timers</h1>
      </header>
      <TimersContainer />
    </main>
  );
}

export default App;
