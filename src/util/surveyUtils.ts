import { Form } from "../dto/Form";

export const createSurveyJson = (form: Form) => {
  return {
    elements: form.questions.map((q) => {
      const question = {
        name: q.id,
        title: q.title,
        type: q.questionType === "text" ? "text" : "radiogroup",
        isRequired: q.required,
        choices: q.questionOptions || [],
      };

      return question;
    }),
  };
};