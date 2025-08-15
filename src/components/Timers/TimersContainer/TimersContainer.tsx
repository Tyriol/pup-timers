import { useContext } from "react";
import { TimersContext } from "../../../context/Context";
import Stopwatch from "../Stopwatch/Stopwatch";
import Countdown from "../Countdown/Countdown";

const TimersContainer = () => {
  const { timersList, loading } = useContext(TimersContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  const displayedTimers = timersList.map((timer) =>
    timer.type === "stopwatch" ? (
      <Stopwatch key={timer.id} timer={timer} />
    ) : (
      <Countdown key={timer.id} timer={timer} />
    ),
  );

  return timersList.length === 0 ? (
    <h2>Add a timer to see them here</h2>
  ) : (
    <div className="grid grid-cols-2 gap-4 py-8 px-1 w-80 overflow-y-auto scroll-smooth">
      {displayedTimers}
    </div>
  );
};

export default TimersContainer;
