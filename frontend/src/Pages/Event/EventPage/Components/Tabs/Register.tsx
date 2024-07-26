import { Box, Button, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

import {
    defaultRegistration,
    getRegistration,
    isRegisteredCheck,
    registerForEvent,
    updateRegistration,
} from "@/logic/events";
import { IEvent, Registration } from "@/logic/interfaces";

interface RegisterProps {
    eventData: IEvent;
}

const Register = ({ eventData }: RegisterProps) => {
    const [registration, setRegistration] =
        useState<Registration>(defaultRegistration);

    const handleSubmit = async () => {
        if (isRegisteredCheck(registration)) {
            const status = await updateRegistration(eventData.id, registration);
            if (status === 200) {
                enqueueSnackbar("Updated registration", { variant: "success" });
            } else {
                enqueueSnackbar("An error occurred", { variant: "error" });
            }
        } else {
            const status = await registerForEvent(
                eventData.id,
                registration.comment
            );
            if (status === 200) {
                enqueueSnackbar("Registered for the event", {
                    variant: "success",
                });
            } else {
                enqueueSnackbar("An error occurred", { variant: "error" });
            }
        }
    };

    const fetchData = useCallback(async () => {
        getRegistration(eventData.id).then((response) => {
            if (response.status === 404) {
                setRegistration(defaultRegistration);
            } else {
                setRegistration(response.data);
            }
        });
    }, [eventData.id]);

    useEffect(() => {
        fetchData();
    }, [eventData.id, fetchData]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: {
                    xs: "100%",
                    sm: "50%",
                },
            }}
        >
            <Typography variant="h5">Register for {eventData.name}</Typography>
            <Typography variant="body1">
                Registration is open from{" "}
                {new Date(eventData.registrationOpen).toLocaleString()} to{" "}
                {new Date(eventData.registrationClose).toLocaleString()}
            </Typography>
            <TextField
                label="Comment"
                multiline
                rows={4}
                value={registration.comment}
                onChange={(e) =>
                    setRegistration({
                        ...registration,
                        comment: e.target.value,
                    })
                }
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ width: "fit-content" }}
            >
                {isRegisteredCheck(registration) ? "Update" : "Register"}
            </Button>
        </Box>
    );
};

export default Register;
