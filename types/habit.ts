export type Priority = "low" | "mid" | "high";

export type Habit = {
  id: string;
  title: string;
  priority: Priority;
  createdAt: string; // ISO date string
  lastDoneAt: string | null; // ISO date string or null
  streak: number;
};
