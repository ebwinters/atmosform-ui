import React, { useState } from 'react';
import FormBuilder from './Builder';
import { Question } from '../dto/Question';
import { Link, useNavigate } from 'react-router-dom';
import GlobalLayout from '../GlobalLayout';
import { Container, Typography, Button, Grid } from '@mui/material';

interface FormCreateProps { }

const FormCreate: React.FC<FormCreateProps> = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const navigate = useNavigate(); 

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
      <GlobalLayout>
        <Container component="main" maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Form Submitted Successfully!
          </Typography>
          <Typography variant="body1" paragraph>
            Your form has been successfully submitted. You can view it by clicking the link below.
          </Typography>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                Go back to Home
              </Button>
            </Grid>
            <Grid item>
              {formId && (
                <Button variant="outlined" color="primary" component={Link} to={`/forms/${formId}/view`}>
                  View Submitted Form
                </Button>
              )}
            </Grid>
          </Grid>
        </Container>
      </GlobalLayout>

    );
  }

  return (
    <GlobalLayout>
      <Container component="main" maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Create Your Form
        </Typography>
        <FormBuilder onClickSubmit={onClickSubmit} />
      </Container>
    </GlobalLayout>
  );
};

export default FormCreate;
