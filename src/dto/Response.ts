import { Answer } from "./Answer";

export type Response = {
  id: string; // `id` is optional when creating a new form
  user: string; // Form title
  answers: Answer[];
};