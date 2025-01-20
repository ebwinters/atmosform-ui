import React, { useState } from 'react';
import FormBuilder from './Builder';
import { Question } from '../dto/Question';
import { useNavigate } from 'react-router-dom';

interface FormCreateProps {}

const FormCreate: React.FC<FormCreateProps> = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);  // Store the form ID
  const navigate = useNavigate(); // For navigating programmatically
  
  const onClickSubmit = async (title: string, questions: Question[], description?: string) => {
    const response = await fetch(`http://127.0.0.1:3333/api/v1/form`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, questions: questions.map(({ id, ...rest }) => rest) }),
    });
    if (response.ok) {
      const data = await response.json();
      setFormId(data.id);
      setIsSubmitted(true);
    } else {
      console.error('Failed to submit form');
    }
  };

  if (isSubmitted) {
    return (
      <div>
        <h1>Form Submitted</h1>
        <p>Your form has been successfully submitted!</p>
        <div>
          <a href="/">Go back to Home</a>
        </div>
        {formId && (
          <div>
            <a href={`/forms/${formId}`}>View the submitted form</a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Create New Form</h1>
      <FormBuilder onClickSubmit={onClickSubmit} />
    </div>
  );
};

export default FormCreate;
