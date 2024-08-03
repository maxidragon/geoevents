import { Box, Typography } from "@mui/material";

import { IEvent } from "@/logic/interfaces";

import EnterResultForm from "./Components/EnterResultForm";

interface QualificationResultsProps {
    eventData: IEvent;
}

const QualificationResults = ({ eventData }: QualificationResultsProps) => {
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
                <EnterResultForm eventData={eventData} />
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
            </Box>
        </Box>
    );
};

export default QualificationResults;
