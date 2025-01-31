import { useMutation, useQuery } from '@tanstack/react-query';
import { IQuestionPlainData } from 'survey-core/typings/question';
import { Form } from '../dto/Form';
import { QuestionOption } from '../dto/Question';

export const submitFormResponse = async (formId: string, data: IQuestionPlainData[]) => {
  const response = await fetch('http://127.0.0.1:3333/api/v1/response', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formId,
      answers: data.map((d: IQuestionPlainData) => ({
        question: d.name,
        values: [d.value],
      })),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit form');
  }

  return response.json();
};

export const useSubmitFormResponse = () => {
  return useMutation({
    mutationFn: (payload: { formId: string; data: IQuestionPlainData[] }) =>
      submitFormResponse(payload.formId, payload.data),
  });
};

export const fetchFormData = async (formId: string): Promise<Form> => {
  const response = await fetch(`http://127.0.0.1:3333/api/v1/form/${formId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch form');

  const data = await response.json();
  const parsedQuestions = data.questions.map((question: any) => {
    if (typeof question.questionOptions === 'string') {
      question.questionOptions = JSON.parse(question.questionOptions) as QuestionOption[];
    }
    return question;
  });
  return { ...data, questions: parsedQuestions }
};

export const useFormQuery = (formId: string) => {
  return useQuery({
    queryKey: ['form', formId],
    queryFn: () => fetchFormData(formId),
    placeholderData: (prev) => prev,
  });
};

export const fetchForms = async () => {
  const response = await fetch(`http://127.0.0.1:3333/api/v1/forms`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch forms');
  const data = await response.json();
  return data as Form[];
};

export const useFormsQuery = () => {
  return useQuery({
    queryKey: ['forms'],
    queryFn: () => fetchForms(),
    placeholderData: (prev) => prev,
  });
};