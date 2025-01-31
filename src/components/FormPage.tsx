import { useParams } from 'react-router-dom';
import FormView from './FormView';
import { FormPageProps } from '../props/common';
import GlobalLayout from '../GlobalLayout';
import { Container } from '@mui/material';

const FormPage = (props: FormPageProps) => {
  const { id } = useParams();
  return (
    <GlobalLayout>
      <Container sx={{ marginTop: 4 }}>
        <FormView readonly={props.readonly} formId={id || ''} shouldPopulateData={props.shouldPopulateResponseData || false} />
      </Container>
    </GlobalLayout>
  )
};

export default FormPage;
