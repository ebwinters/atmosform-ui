import React from 'react';
import FormBuilder from '../Builder';

interface FormCreateProps {}

const FormCreate: React.FC<FormCreateProps> = () => {
  const onClickSubmit = (questions: any[]) => {
    // Logic to create the form (save to backend or state)
    console.log("Form submitted", questions);
  };

  return (
    <div>
      <h1>Create New Form</h1>
      <FormBuilder onClickSubmit={onClickSubmit} />
    </div>
  );
};

export default FormCreate;
