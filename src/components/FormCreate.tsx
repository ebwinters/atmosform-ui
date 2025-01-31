import React, { useState } from 'react';
import FormBuilder from './Builder';
import { Question } from '../dto/Question';
import { Link, useNavigate } from 'react-router-dom';
import GlobalLayout from '../GlobalLayout';
import { Container, Typography, Button, Grid } from '@mui/material';
import { useCreateForm } from '../queries/form';
import { ErrorComponent } from './Error';

interface FormCreateProps { }

const FormCreate: React.FC<FormCreateProps> = () => {
  const { mutate: createForm, isSuccess, isError, reset, data } = useCreateForm();
  const navigate = useNavigate();

  const onClickSubmit = async (title: string, questions: Question[], description?: string) => {
    await createForm({ title, description, questions: questions.map(({ id, ...rest }) => rest) });
  };

  if (isError) {
    const onClickRetry = () => {
      reset();
    };

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <ErrorComponent onClickRetry={onClickRetry} />
      </Container>
    );
  }

  if (isSuccess) {
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
              {data && (
                <Button variant="outlined" color="primary" component={Link} to={`/forms/${data.id}/view`}>
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
