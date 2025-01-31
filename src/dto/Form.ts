import { Question, QuestionCreate } from "./Question";

export type Form = {
  id?: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt?: Date;
};

export type FormCreate = {
  id?: string;
  title: string;
  description?: string;
  questions: QuestionCreate[];
  createdAt?: Date;
};