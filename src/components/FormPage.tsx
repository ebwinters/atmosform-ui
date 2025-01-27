import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Form } from '../dto/Form';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { QuestionOption } from '../dto/Question';
import { Container, Typography, CircularProgress, Alert, Box, Button } from '@mui/material';
import GlobalLayout from '../GlobalLayout';
import { IQuestionPlainData } from 'survey-core/typings/question';
import FormView from './FormView';

// Helper function to create the Survey JSON from the form
const createSurveyJson = (form: Form) => {
  return {
    elements: form.questions.map((q) => {
      const question = {
        name: q.id,
        title: q.title,
        type: q.questionType === "text" ? "text" : "radiogroup", // Assuming multiple choice for other question types
        isRequired: q.required,
        choices: q.questionOptions || [], // Optional if it's a multiple choice question,
      };

      return question;
    }),
  };
};

interface FormPageProps {
  readonly?: boolean;
}

const FormPage = (props: FormPageProps) => {
  const { id } = useParams(); // Get 'id' from the URL
  const [submissionError, setSubmissionError] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formData, setFormData] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState<Model | null>(null);

  

  return <FormView readonly={props.readonly} formId={id || ''} shouldPopulateData={true} /> 
};

export default FormPage;
