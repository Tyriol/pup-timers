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

export type NewTimer = Omit<Timer, "id">;

export interface Dog {
  id: string;
  name: string;
  age: number;
  breed: string;
}

export type NewDog = Omit<Dog, "id">;
