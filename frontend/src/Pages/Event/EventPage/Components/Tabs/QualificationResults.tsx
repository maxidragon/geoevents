import { Box, Typography } from "@mui/material";

import { IEvent } from "@/logic/interfaces";
import ResultsTable from "@/Pages/Event/Components/ResultsTable/ResultsTable";

interface QualificationResultsProps {
    eventData: IEvent;
}

const QualificationResults = ({ eventData }: QualificationResultsProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5">Qualifications results</Typography>
            <ResultsTable
                qualificationResults={eventData.qualificationResults}
                proceedFromQualifications={eventData.proceedFromQualifications}
            />
        </Box>
    );
};

export default QualificationResults;
