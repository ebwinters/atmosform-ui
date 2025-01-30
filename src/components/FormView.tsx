import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '../dto/Form';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { QuestionOption } from '../dto/Question';
import { Container, Typography, CircularProgress, Alert, Box, Button, Pagination } from '@mui/material';
import GlobalLayout from '../GlobalLayout';
import { ResponseItem, Answer, PaginatedResponse } from '../dto/Response';
import { IQuestionPlainData } from 'survey-core/typings/question';
import { useQuery } from '@tanstack/react-query';

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

interface FormViewProps {
  readonly?: boolean;
  formId: string;
  shouldPopulateData?: boolean;
}

const FormView = (props: FormViewProps) => {
  const { readonly, formId, shouldPopulateData } = props;
  const [submissionError, setSubmissionError] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formData, setFormData] = useState<Form | null>(null);
  // const [responseData, setresponseData] = useState<ResponseItem[]>([]);
  const [responseIndex, setResponseIndex] = useState(0); // Current response in the batch
  const [responsePage, setResponsePage] = useState<number>(1)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState<Model | null>(null);

  const fetchResponses = async (formId: string, page: number, pageSize: number) => {
    const response = await fetch(
      `http://127.0.0.1:3333/api/v1/form/${formId}/responses?page=${page}&pageSize=${pageSize}`, 
      { credentials: 'include' }
    );
    
    if (!response.ok) throw new Error('Failed to fetch responses');
  
    const data = await response.json();
    return data as PaginatedResponse;
  };

  const { data, error: responseFetchError, isLoading } = useQuery({
    queryKey: ['responses', formId, responsePage],
    queryFn: () => fetchResponses(formId, responsePage, 10),
    enabled: shouldPopulateData,
    placeholderData: (prev) => prev,
  });

  

  const totalResponses = data?.total;
  const totalFetched = (responsePage - 1) * 10 + (data?.responses.length || 0);
  const currentResponse = data?.responses[responseIndex];
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
    // Fetch the form data based on the ID
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

    // const fetchResponseData = async () => {
    //   try {
    //     const response = await fetch(`http://127.0.0.1:3333/api/v1/form/${formId}/responses`, {
    //       method: 'GET',
    //       credentials: 'include',
    //     });
    //     if (!response.ok) {
    //       throw new Error('Responses not found');
    //     }
    //     const data = await response.json();
    //     setresponseData(data.responses);
    //   } catch (err: any) {
    //     setError(err.message);
    //     setLoading(false);
    //   }
    // };

    if (formId) {
      fetchFormData();
    }
    // if (shouldPopulateData) {
    //   fetchResponseData();
    // }
  }, [formId, shouldPopulateData]); // Re-run the effect if 'id' changes

  const resetSurveyModel = useCallback(() => {
    if (formData) {
      const surveyJson = createSurveyJson(formData);
      const surveyModel = new Model(surveyJson);
      if (shouldPopulateData && data && data.responses.length > responseIndex) {
        const surveyModelData: any = {};
        formData.questions.forEach(q => surveyModelData[q.id] = '')
        data.responses[responseIndex].answers.forEach((a: Answer) => surveyModelData[a.questionId] = a.values[0])
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
  }, [data, formData, formId, props.readonly, readonly, responseIndex, shouldPopulateData]);

  useEffect(() => {
    resetSurveyModel();
  }, [resetSurveyModel]);

  // useEffect(() => {
  //   if (data) {
  //     resetSurveyModel();
  //   }
  // }, [data, resetSurveyModel]);

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

  if (loading || isLoading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (submissionError || responseFetchError) {
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

  if (data?.responses.length === 0 && shouldPopulateData) {
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
        {shouldPopulateData && data?.responses.length !== 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
          count={totalResponses} // Total responses = total pages
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
