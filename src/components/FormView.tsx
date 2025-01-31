import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { Container, Typography, CircularProgress, Box, Button, Pagination } from '@mui/material';
import GlobalLayout from '../GlobalLayout';
import { Answer } from '../dto/Response';
import { SuccessComponent } from './Success';
import { ErrorComponent } from './Error';
import { responsePageSize, useResponsesQuery } from '../queries/response';
import { useFormQuery, useSubmitFormResponse } from '../queries/form';
import { createSurveyJson } from '../util/surveyUtils';

interface FormViewProps {
  readonly?: boolean;
  formId: string;
  shouldPopulateData: boolean;
}

const FormView = (props: FormViewProps) => {
  const { readonly, formId, shouldPopulateData } = props;
  const [responseIndex, setResponseIndex] = useState(0);
  const [responsePage, setResponsePage] = useState<number>(1);
  const [survey, setSurvey] = useState<Model | null>(null);

  const { mutate: submitForm, isSuccess: submissionSuccess, isError: submissionError, reset: resetSubmissionMutation } = useSubmitFormResponse();
  const { data: responseData, error: responseFetchError, isLoading: isResponseLoading } = useResponsesQuery(formId, responsePage, shouldPopulateData);
  const { data: formData, error: formFetchError, isLoading: isFormLoading } = useFormQuery(formId);

  const totalResponses = responseData?.total;
  const globalResponseIndex = (responsePage - 1) * responsePageSize + responseIndex;
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    const newBatch = Math.ceil(newPage / responsePageSize);
    if (newBatch !== responsePage) {
      setResponsePage(newBatch);
      setResponseIndex((newPage - 1) % responsePageSize);
    } else {
      setResponseIndex((newPage - 1) % responsePageSize);
    }
  };

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
        const handleFormComplete = async () => {
          const data = surveyModel.getPlainData();
          await submitForm({ formId, data });
        };

        surveyModel.onComplete.add(handleFormComplete);
      }
      setSurvey(surveyModel);
    }
  }, [formData, shouldPopulateData, responseData, responseIndex, props.readonly, readonly, submitForm, formId]);

  useEffect(() => {
    resetSurveyModel();
  }, [resetSurveyModel]);

  const NoFormResponseComponent = () => (
    <Container>
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
  );

  if (isFormLoading || isResponseLoading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (formFetchError || submissionError || responseFetchError) {
    const onClickRetry = () => {
      resetSubmissionMutation();
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
    <div>
      {formData && (
        <Box>
          <Typography variant="h4" gutterBottom>
            {!shouldPopulateData && formData.title}
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
    </div>
  );
};

export default FormView;
