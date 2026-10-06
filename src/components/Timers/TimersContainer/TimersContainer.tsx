import { useContext, useEffect, useRef, useState } from "react";
import { TimersContext } from "../../../context/Context";
import TimerDisplay from "../Timer/TimerDisplay";
import TimerForm from "../../forms/TimerForm";
import AddTimerButton from "../../Buttons/AddTimerButton";

const TimersContainer = () => {
  const { timersList, loading } = useContext(TimersContext);
  const [view, setView] = useState<"list" | "add" | number>("list");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasOpenedForm = useRef(false);

  useEffect(() => {
    if (view !== "list") hasOpenedForm.current = true;
    else if (hasOpenedForm.current) headingRef.current?.focus();
  }, [view]);

  if (loading)
    return (
      <p role="status" className="empty-state">
        Loading timers…
      </p>
    );

  if (view !== "list") {
    return (
      <TimerForm
        editingTimerId={typeof view === "number" ? view : undefined}
        timers={timersList}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <section aria-labelledby="timers-heading">
      <div className="list-heading">
        <h2 id="timers-heading" ref={headingRef} tabIndex={-1}>
          Your timers
        </h2>
        <span className="muted">{timersList.length} total</span>
      </div>
      <AddTimerButton onClick={() => setView("add")} />
      {timersList.length === 0 ? (
        <div className="empty-state">
          <h3>Your first timer starts here</h3>
          <p>
            Add a stopwatch to track time, or a countdown for a set duration.
          </p>
        </div>
      ) : (
        <div className="timer-list">
          {timersList.map((timer) => (
            <TimerDisplay
              onEdit={setView}
              onDeleted={() => headingRef.current?.focus()}
              key={timer.id}
              timer={timer}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TimersContainer;
