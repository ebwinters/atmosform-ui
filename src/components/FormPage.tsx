import { useParams } from 'react-router-dom';
import FormView from './FormView';

interface FormPageProps {
  readonly?: boolean;
  shouldPopulateResponseData?: boolean;
}

const FormPage = (props: FormPageProps) => {
  const { id } = useParams();
  return <FormView readonly={props.readonly} formId={id || ''} shouldPopulateData={props.shouldPopulateResponseData} /> 
};

export default FormPage;
