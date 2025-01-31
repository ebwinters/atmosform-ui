import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, Container } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAggregatedResponses } from "../queries/response";
import { useFormQuery } from "../queries/form";
import { ErrorComponent } from "./Error";

type Props = {
  formId: string;
};

const AggregatedResponseView = ({ formId }: Props) => {
  const { data: aggregatedResponses, isLoading, isError, refetch } = useAggregatedResponses(formId);
  const { data: form, isLoading: isFormLoading, isError: isFormError, refetch: refetchForm } = useFormQuery(formId);

  const loading = isLoading || isFormLoading;
  const error = isError || isFormError;


  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    const onClickRetry = () => {
      refetch();
      refetchForm();
    };

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <ErrorComponent onClickRetry={onClickRetry} />
      </Container>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {Object.entries(aggregatedResponses || {}).map(([questionId, responseData], index) => (
        <Paper key={questionId} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {form?.questions.find((q) => q.id === questionId)?.title || "Question"}
          </Typography>
          {responseData.type === "text" && (
            <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {(responseData.data as string[]).map((response: string, i: number) => (
                <ListItem key={i} divider>
                  <ListItemText primary={response} />
                </ListItem>
              ))}
            </List>
          )}
          {responseData.type === "multiplechoice" && (
            <PieChart
              series={[
                {
                  data: Object.entries(responseData.data).map(([option, count]) => ({
                    id: option,
                    value: count,
                    label: option,
                  })),
                },
              ]}
              height={200}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'right' }, 
                  padding: { left: 0, right: 100 },
                },
              }}
            />
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default AggregatedResponseView;
