import { useContext, Suspense } from "react";
import { TimersContext } from "../../../context/Context";
import Stopwatch from "../Stopwatch/Stopwatch";
import Countdown from "../Countdown/Countdown";

const TimersContainer = () => {
  const { timersList } = useContext(TimersContext);

  const displayedTimers = timersList.map((timer) =>
    timer.type === "stopwatch" ? (
      <Stopwatch key={timer.id} timer={timer} />
    ) : (
      <Countdown key={timer.id} timer={timer} />
    ),
  );

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {timersList.length === 0 ? (
        <h2>Add a timer to see them here</h2>
      ) : (
        displayedTimers
      )}
    </Suspense>
  );
};

export default TimersContainer;
