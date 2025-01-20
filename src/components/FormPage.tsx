import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from '../dto/Form';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { QuestionOption } from '../dto/Question';

const createSurveyJson = (form: Form) => {
  return {
    elements: form.questions.map((q) => {
      const question = {
        name: q.id,
        title: q.title,
        type: q.questionType === "text" ? "text" : "radiogroup", // Assuming multiple choice for other question types
        isRequired: q.required,
        choices: q.questionOptions || [], // Optional if it's a multiple choice question
      };

      return question;
    }),
  };
};

const FormPage = () => {
  const { id } = useParams(); // This will get the 'id' from the URL
  const [formData, setFormData] = useState<Form>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState<Model | null>(null);

  useEffect(() => {
    // Fetch the form data based on the id
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
        setFormData({...data, questions: parsedQuestions});
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchFormData();
    }
  }, [id]); // This will re-run the effect if the 'id' changes
  useEffect(() => {
    if (formData) {
      const surveyJson = createSurveyJson(formData);
      const surveyModel = new Model(surveyJson);
      surveyModel.mode = 'display';
      surveyModel.showCompletedPage = false;
      surveyModel.onComplete.add((sender) => {
        console.log("Survey Results:", sender.data);
      });
      setSurvey(surveyModel);
    }
  }, [formData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Form Details</h1>
      {formData && (
        <div>
          <h2>{formData.title}</h2>
          <p>{formData.description}</p>
          {survey && <Survey model={survey} />}
        </div>
      )}
    </div>
  );
};

export default FormPage;
