import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab, Container, Box } from "@mui/material";
import FormView from "./FormView";
// import OtherComponent from "./OtherComponent"; // Placeholder for your second component
import { FormPageProps } from "../props/common";
import GlobalLayout from "../GlobalLayout";
import AggregatedResponseView from "./AggregatedResponseView";

const ResponsePage = (props: FormPageProps) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <GlobalLayout>
      <Container maxWidth="md" sx={{ marginTop: 4, textAlign: 'center' }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Form View" />
          <Tab label="Other View" />
        </Tabs>

        <Box>
        {activeTab === 0 ? (
          <FormView readonly={props.readonly} formId={id || ""} shouldPopulateData={props.shouldPopulateResponseData || false} />
        ) : (
          <AggregatedResponseView formId={id || ""} />
        )}
      </Box>

      </Container>
    </GlobalLayout>
  );
};

export default ResponsePage;
