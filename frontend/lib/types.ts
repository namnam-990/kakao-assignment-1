export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string; // "YYYY-MM-DD"
}

export type Filter = "all" | "active" | "completed";
