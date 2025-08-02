import { useContext } from "react";
import { TimersContext } from "../../../context/Context";
// const Stopwatch = lazy(() => import("../Stopwatch/Stopwatch"));
// const Countdown = lazy(() => import("../Countdown/Countdown"));
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
    displayedTimers
  );
};

export default TimersContainer;
