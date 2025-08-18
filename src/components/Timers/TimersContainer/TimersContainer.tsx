import { useContext } from "react";
import { TimersContext } from "../../../context/Context";
import TimerDisplay from "../Timer/TimerDisplay";

const TimersContainer = () => {
  const { timersList, loading } = useContext(TimersContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  const displayedTimers = timersList.map((timer) => (
    <TimerDisplay key={timer.id} timer={timer} />
  ));

  return timersList.length === 0 ? (
    <h2>Add a timer to see them here</h2>
  ) : (
    <div className="grid grid-cols-2 gap-4 py-8 px-1 w-80 overflow-y-auto scroll-smooth">
      {displayedTimers}
    </div>
  );
};

export default TimersContainer;
