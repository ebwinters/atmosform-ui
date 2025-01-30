import { useMutation } from '@tanstack/react-query';
import { IQuestionPlainData } from 'survey-core/typings/question';

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