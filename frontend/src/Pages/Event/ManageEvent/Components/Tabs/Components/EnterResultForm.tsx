import {
    Autocomplete,
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

import TimeInput from "@/Components/TimeInput";
import { IEvent, QualificationResult, Registration } from "@/logic/interfaces";
import {
    defaultResult,
    enterOrUpdateResult,
} from "@/logic/qualificationResults";

interface EnterResultFormProps {
    eventData: IEvent;
}

const EnterResultForm = ({ eventData }: EnterResultFormProps) => {
    const [result, setResult] = useState<QualificationResult>(defaultResult);

    const handleSubmit = async () => {
        const status = await enterOrUpdateResult(eventData.id, result);
        if (status === 201) {
            enqueueSnackbar("Result entered", {
                variant: "success",
            });
            setResult(defaultResult);
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
                options={eventData.registrations}
                getOptionLabel={(option: Registration) =>
                    `${option.user.fullName} (${option.user.username})`
                }
                onChange={(_, value: Registration | null) => {
                    if (value) {
                        setResult({
                            ...result,
                            registration: value,
                            registrationId: value.id,
                        });
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
