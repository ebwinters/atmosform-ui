import { Alert, Button, Container, Typography } from "@mui/material";
import GlobalLayout from "../GlobalLayout";

interface ErrorComponentProps {
  onClickRetry: () => void;
}

export const ErrorComponent = (props: ErrorComponentProps) => (
    <GlobalLayout>
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Submission Failed</Typography>
          <Typography>Please try again or contact support if the issue persists.</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={props.onClickRetry}
            sx={{ marginTop: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    </GlobalLayout>

  );