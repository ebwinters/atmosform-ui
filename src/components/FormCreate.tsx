import React from 'react';
import FormBuilder from './Builder';
import { Question } from '../dto/Question';

interface FormCreateProps {}

const FormCreate: React.FC<FormCreateProps> = () => {
  const onClickSubmit = async (title: string, questions: Question[], description?: string) => {
    await fetch(`http://127.0.0.1:3333/api/v1/form`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, questions: questions.map(({ id, ...rest }) => rest) }),
    });
    console.log("Form submitted");
  };

  return (
    <div>
      <h1>Create New Form</h1>
      <FormBuilder onClickSubmit={onClickSubmit} />
    </div>
  );
};

export default FormCreate;
