import { QuestionType } from "./Question";

export interface Answer {
  id: string;
  questionId: string;
  values: string[];
}

export interface ResponseItem {
  id: string;
  user: string;
  formId: string;
  createdAt: string;
  answers: Answer[];
}

export interface PaginatedResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  responses: ResponseItem[];
}

export type AggregatedResponseDTO = Record<
  string,
  {
    type: QuestionType;
    data: string[] | Record<string, number>;
  }
>;
