import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
} from '@mui/material';
import GlobalLayout from '../GlobalLayout';

interface Form {
  id: string;
  title: string;
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);

  const fetchForms = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3333/api/v1/forms`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <GlobalLayout>
      <Container sx={{ marginTop: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Your Forms
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/create-form"
        >
          Create New Form
        </Button>
      </Box>
      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={4} key={form.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {form.title}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={`/forms/${form.id}`}
                >
                  View Form
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </GlobalLayout>
  );
};

export default FormList;
