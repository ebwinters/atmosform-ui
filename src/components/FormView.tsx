import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '../dto/Form';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { QuestionOption } from '../dto/Question';
import { Container, Typography, CircularProgress, Box, Button, Pagination } from '@mui/material';
import GlobalLayout from '../GlobalLayout';
import { Answer } from '../dto/Response';
import { IQuestionPlainData } from 'survey-core/typings/question';
import { SuccessComponent } from './Success';
import { ErrorComponent } from './Error';
import { useResponsesQuery } from '../queries/getResponses';

// Helper function to create the Survey JSON from the form
const createSurveyJson = (form: Form) => {
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

interface FormViewProps {
  readonly?: boolean;
  formId: string;
  shouldPopulateData: boolean;
}

const FormView = (props: FormViewProps) => {
  const { readonly, formId, shouldPopulateData } = props;
  const [submissionError, setSubmissionError] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formData, setFormData] = useState<Form | null>(null);
  const [responseIndex, setResponseIndex] = useState(0);
  const [responsePage, setResponsePage] = useState<number>(1)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState<Model | null>(null);

  const { data: responseData, error: responseFetchError, isLoading } = useResponsesQuery(formId, responsePage, shouldPopulateData);

  const totalResponses = responseData?.total;
  const globalResponseIndex = (responsePage - 1) * 10 + responseIndex;
  // Handle Pagination Change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    const newBatch = Math.ceil(newPage / 10);
    if (newBatch !== responsePage) {
      setResponsePage(newBatch);
      setResponseIndex((newPage - 1) % 10); // Adjust index within batch
    } else {
      setResponseIndex((newPage - 1) % 10);
    }
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3333/api/v1/form/${formId}`, {
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

    if (formId) {
      fetchFormData();
    }
  }, [formId, shouldPopulateData]);

  const resetSurveyModel = useCallback(() => {
    if (formData) {
      const surveyJson = createSurveyJson(formData);
      const surveyModel = new Model(surveyJson);
      if (shouldPopulateData && responseData && responseData.responses.length > responseIndex) {
        const surveyModelData: any = {};
        formData.questions.forEach(q => surveyModelData[q.id] = '')
        responseData.responses[responseIndex].answers.forEach((a: Answer) => surveyModelData[a.questionId] = a.values[0])
        surveyModel.data = surveyModelData;
      }
      surveyModel.showCompletedPage = false;
      if (props.readonly) {
        surveyModel.mode = 'display';
      }
      if (!readonly && !shouldPopulateData) {
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
                  formId,
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
      }
      setSurvey(surveyModel);
    }
  }, [responseData, formData, formId, props.readonly, readonly, responseIndex, shouldPopulateData]);

  useEffect(() => {
    resetSurveyModel();
  }, [resetSurveyModel]);

  const NoFormResponseComponent = () => (
    <GlobalLayout>
      <Container maxWidth="sm" sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          No form responses at this time.
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

  if (loading || isLoading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || submissionError || responseFetchError) {
    const onClickRetry = () => {
      setSubmissionError(false);
      resetSurveyModel();
    };

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <ErrorComponent onClickRetry={onClickRetry} />
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

  if (responseData?.responses.length === 0 && shouldPopulateData) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <NoFormResponseComponent />
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
        {shouldPopulateData && responseData?.responses.length !== 0 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalResponses}
              page={globalResponseIndex + 1}
              onChange={handlePageChange}
              shape="rounded"
              size="large"
            />
          </Box>
        )}
      </Container>
    </GlobalLayout>

  );
};

export default FormView;
