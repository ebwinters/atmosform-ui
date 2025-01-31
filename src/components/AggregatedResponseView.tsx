import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAggregatedResponses } from "../queries/response"; // Import your hook

type Props = {
  formId: string;
};

const AggregatedResponseView = ({ formId }: Props) => {
  const { data: aggregatedResponses, isLoading, isError } = useAggregatedResponses(formId);

  if (isLoading) return <Typography>Loading responses...</Typography>;
  if (isError) return <Typography>Error loading responses.</Typography>;

  return (
    <Box sx={{ mt: 2 }}>
      {Object.entries(aggregatedResponses || {}).map(([questionId, responseData], index) => (
        <Paper key={questionId} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Question {index + 1}
          </Typography>

          {/* Render List for Text Responses */}
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
              width={300}
              height={300}
            />
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default AggregatedResponseView;
