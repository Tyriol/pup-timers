/**
 * Represents a timer object
 * @typedef {Object} Timer
 * @property {string} type - The type of timer, either "countdown" or "stopwatch"
 * @property {string} id - Unique identifier for the timer
 * @property {string} name - Name of the timer
 * @property {number} duration - Duration in seconds for countdown timers, ignored for stopwatch
 * @property {number} elapsed - Elapsed time in seconds
 * @property {boolean} isRunning - Whether the timer is currently running
 * @property {number} startTime - Timestamp when the timer started
 * @property {number} endTime - Timestamp when the timer ended (for countdown)
 */

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

/**
 * Represents a dog object
 * @typedef {Object} Dog
 * @property {string} id - Unique identifier for the dog
 * @property {string} name - Name of the dog
 * @property {number} age - Age of the dog in years
 * @property {string} breed - Breed of the dog
 */

export interface Dog {
  id: string;
  name: string;
  age: number;
  breed: string;
}
