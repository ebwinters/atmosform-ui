import { Question } from "./Question";

export type Form = {
  id?: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt?: Date;
};