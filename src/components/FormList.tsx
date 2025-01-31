import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
} from '@mui/material';
import GlobalLayout from '../GlobalLayout';
import { useFormsQuery } from '../queries/form';
import { ErrorComponent } from './Error';

const FormList: React.FC = () => {
  const { data: forms, error: formsFetchError, isLoading, refetch } = useFormsQuery();
  
  if (isLoading) {
      return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Container>
      );
    }
  
    if (formsFetchError) {
      const onClickRetry = () => {
        refetch();
      };
  
      return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
          <ErrorComponent onClickRetry={onClickRetry} />
        </Container>
      );
    }

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
        {forms?.map((form) => (
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
                  to={`/forms/${form.id}/view`}
                >
                  View Form
                </Button>
                <Button
                  size="small"
                  style={{ marginLeft: 8 }}
                  variant="outlined"
                  color="secondary"
                  component={Link}
                  to={`/forms/${form.id}/responses`}
                >
                  View Responses
                </Button>
                <Button
                  size="small"
                  style={{ marginLeft: 8, marginTop: 8 }}
                  variant="outlined"
                  color="warning"
                  component={Link}
                  to={`/forms/${form.id}`}
                >
                  Fill out form
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
