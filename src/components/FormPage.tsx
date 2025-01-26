import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Form } from '../dto/Form';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { QuestionOption } from '../dto/Question';
import { Container, Typography, CircularProgress, Alert, Box, Button } from '@mui/material';
import GlobalLayout from '../GlobalLayout';
import { IQuestionPlainData } from 'survey-core/typings/question';

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

  useEffect(() => {
    // Fetch the form data based on the ID
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3333/api/v1/form/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Form not found');
        }
        const data = await response.json();
        const parsedQuestions = data.questions.map((question: any) => {
          if (typeof question.questionOptions === 'string') {
            // Parse questionOptions to an array of QuestionOption objects
            question.questionOptions = JSON.parse(question.questionOptions) as QuestionOption[];
          }
          return question;
        });
        setFormData({ ...data, questions: parsedQuestions });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchFormData();
    }
  }, [id]); // Re-run the effect if 'id' changes

  const resetSurveyModel = useCallback(() => {
    if (formData) {
      const surveyJson = createSurveyJson(formData);
      const surveyModel = new Model(surveyJson);
      // surveyModel.data = {'3lgjnjnghss2h': 'test'};
      surveyModel.showCompletedPage = false;
      if (props.readonly) {
        surveyModel.mode = 'display';
      }
      surveyModel.onComplete.add(async () => {
        const submitForm = async (data: IQuestionPlainData[]) => {
          try {
            const r = await fetch('http://127.0.0.1:3333/api/v1/response', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                formId: id,
                answers: data.map((d: IQuestionPlainData) => ({
                  question: d.name,
                  values: [d.value],
                })),
              }),
            })
            if (!r.ok) {
              throw new Error('Failed to submit form');
            }
            setSubmissionSuccess(true);
          } catch (err: any) {
            setSubmissionError(true);
          }
        };
        await submitForm(surveyModel.getPlainData());
      });
      setSurvey(surveyModel);
    }
  }, [formData, id, props.readonly]);

  useEffect(() => {
    resetSurveyModel();
  }, [resetSurveyModel]);

  const SuccessComponent = () => (
    <GlobalLayout>
      <Container maxWidth="sm" sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="body1" paragraph>
          Your response has been successfully submitted.
        </Typography>
        <Link to='/'>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Go to Homepage
          </Button></Link>

      </Container>
    </GlobalLayout>
  );


  const ErrorComponent = () => (
    <GlobalLayout>
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Submission Failed</Typography>
          <Typography>Please try again or contact support if the issue persists.</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSubmissionError(false);
              resetSurveyModel();
            }}
            sx={{ marginTop: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    </GlobalLayout>

  );

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (submissionError) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <ErrorComponent />
      </Container>
    );
  }

  if (submissionSuccess) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <SuccessComponent />
      </Container>
    );
  }

  return (
    <GlobalLayout>
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        {formData && (
          <Box>
            <Typography variant="h4" gutterBottom>
              {formData.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {formData.description}
            </Typography>
            {survey && <Survey model={survey} />}
          </Box>
        )}
      </Container>
    </GlobalLayout>

  );
};

export default FormPage;
