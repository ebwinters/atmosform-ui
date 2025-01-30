import { Button, Container, Typography } from "@mui/material";
import GlobalLayout from "../GlobalLayout";
import { Link } from "react-router-dom";

export const SuccessComponent = () => (
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