import { Box, Typography } from "@mui/material";
import { useState } from "react";

import { IEvent, QualificationResult } from "@/logic/interfaces";
import { defaultResult } from "@/logic/qualificationResults";
import ResultsTable from "@/Pages/Event/Components/ResultsTable/ResultsTable";

import EnterResultForm from "./Components/EnterResultForm";

interface QualificationResultsProps {
    eventData: IEvent;
    fetchData: () => void;
}

const QualificationResults = ({
    eventData,
    fetchData,
}: QualificationResultsProps) => {
    const [editedResult, setEditedResult] =
        useState<QualificationResult>(defaultResult);

    const handleEdit = (result: QualificationResult) => {
        setEditedResult(result);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: {
                    xs: "column",
                    sm: "row",
                },
                gap: 3,
            }}
        >
            <Box
                sx={{
                    width: {
                        xs: "100%",
                        sm: "25%",
                    },
                    pr: 2,
                    borderRight: {
                        sm: 1,
                    },
                }}
            >
                <EnterResultForm
                    eventData={eventData}
                    result={editedResult}
                    setResult={setEditedResult}
                    fetchData={fetchData}
                />
            </Box>
            <Box
                sx={{
                    width: {
                        xs: "100%",
                        sm: "75%",
                    },
                }}
            >
                <Typography variant="h6">Qualifications results</Typography>
                <ResultsTable
                    qualificationResults={eventData.qualificationResults}
                    proceedFromQualifications={
                        eventData.proceedFromQualifications
                    }
                    editable
                    onEdit={handleEdit}
                    fetchData={fetchData}
                />
            </Box>
        </Box>
    );
};

export default QualificationResults;
