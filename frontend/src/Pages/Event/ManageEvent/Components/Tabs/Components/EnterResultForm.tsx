import {
    Autocomplete,
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";

import TimeInput from "@/Components/TimeInput";
import { IEvent, QualificationResult, Registration } from "@/logic/interfaces";
import {
    defaultResult,
    enterOrUpdateResult,
} from "@/logic/qualificationResults";

interface EnterResultFormProps {
    eventData: IEvent;
    result: QualificationResult;
    setResult: (result: QualificationResult) => void;
    fetchData: () => void;
}

const EnterResultForm = ({
    eventData,
    result,
    setResult,
    fetchData,
}: EnterResultFormProps) => {
    const acceptedRegistrations = eventData.registrations.filter(
        (r) => r.status === "ACCEPTED"
    );
    const handleSubmit = async () => {
        if (
            result.score === 0 ||
            result.maxScore === 0 ||
            result.totalTime === 0
        ) {
            enqueueSnackbar("Please fill in all fields", {
                variant: "error",
            });
            return;
        }
        if (result.maxScore > result.score) {
            enqueueSnackbar("Score can't be higher than max score", {
                variant: "error",
            });
            return;
        }
        const status = await enterOrUpdateResult(eventData.id, result);
        if (status === 201) {
            enqueueSnackbar("Result entered", {
                variant: "success",
            });
            setResult(defaultResult);
            fetchData();
        } else {
            enqueueSnackbar("Something went wrong", {
                variant: "error",
            });
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Enter qualification result</Typography>
            <Autocomplete
                options={acceptedRegistrations}
                getOptionLabel={(option: Registration) =>
                    `${option.user.fullName} (${option.user.username})`
                }
                onChange={(_, value: Registration | null) => {
                    if (value) {
                        const existingResult =
                            eventData.qualificationResults.find(
                                (r) => r.registrationId === value.id
                            );
                        if (existingResult) {
                            setResult(existingResult);
                        } else {
                            setResult({
                                ...result,
                                registration: value,
                                registrationId: value.id,
                            });
                        }
                    }
                }}
                value={result.registration}
                renderInput={(params) => (
                    <TextField {...params} label="Participant" />
                )}
            />
            <TextField
                label="Score"
                type="number"
                variant="outlined"
                required
                value={result.score}
                onChange={(e) =>
                    setResult({ ...result, score: parseInt(e.target.value) })
                }
            />
            <TextField
                label="Max score"
                type="number"
                variant="outlined"
                required
                value={result.maxScore}
                onChange={(e) =>
                    setResult({ ...result, maxScore: parseInt(e.target.value) })
                }
            />
            <TimeInput
                value={result.totalTime}
                onChange={(value) => setResult({ ...result, totalTime: value })}
                disabled={false}
                placeholder="Total time"
            />
            <Button variant="contained" onClick={handleSubmit}>
                Submit
            </Button>
        </Box>
    );
};

export default EnterResultForm;
