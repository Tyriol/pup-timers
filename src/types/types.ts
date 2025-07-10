export interface Timer {
  type: "countdown" | "stopwatch";
  id?: string; // optional id as it will be auto-generated on creation
  name: string;
  duration: number;
  elapsed: number;
  isRunning: boolean;
  startTime?: number;
  endTime?: number;
}

export interface Dog {
  id?: string; // optional id as it will be auto-generated on creation
  name: string;
  age: number;
  breed: string;
}
