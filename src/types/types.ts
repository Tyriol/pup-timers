export interface Timer {
  type: "countdown" | "stopwatch";
  id: string;
  name: string;
  duration: number;
  elapsed: number;
  isRunning: boolean;
  startTime?: number;
  endTime?: number;
}

export interface Dog {
  id: string;
  name: string;
  age: number;
  breed: string;
}
