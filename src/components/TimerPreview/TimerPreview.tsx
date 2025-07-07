import React from "react";
import type { Timer, Dog } from "../../types/types";

interface TimerPreviewProps {
  timer: Timer;
  dog: Dog;
}

const TimerPreview: React.FC<TimerPreviewProps> = ({ timer, dog }) => {
  return (
    <div>
      <h2>Timer: {timer.name}</h2>
      <p>Type: {timer.type}</p>
      <p>Duration: {timer.duration} seconds</p>
      <p>Elapsed: {timer.elapsed} seconds</p>
      <p>Status: {timer.isRunning ? "Running" : "Stopped"}</p>
      <h3>Dog: {dog.name}</h3>
      <p>Age: {dog.age} years</p>
      <p>Breed: {dog.breed}</p>
    </div>
  );
};

export default TimerPreview;
