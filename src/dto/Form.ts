import { Question } from "./Question";

export type Form = {
  id?: string; // `id` is optional when creating a new form
  title: string; // Form title
  description?: string; // Optional description
  questions: Question[]; // List of associated questions
  createdAt?: Date; // Optional: Automatically managed by the database
};