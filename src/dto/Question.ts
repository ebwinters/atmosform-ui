export type QuestionOption = {
  text: string; // Text for the option (required)
  media?: string; // Optional URL to an image
};

export enum QuestionType {
  Text = "text",
  MultipleChoice = "multiplechoice",
  SelectMany = "selectmany",
}

export type Question = {
  id: string; // `id` is optional when creating a new question
  title: string; // Question title
  description?: string; // Optional description for the question
  questionType: QuestionType;
  questionOptions?: QuestionOption[]; // Optional for questions without options
  required?: boolean; // Optional field, defaults to false
  formId?: string; // Optional to allow creating questions before associating them with a form
};