import { Box, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import { createEvent, defaultEvent } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";

import EventForm from "../Components/EventForm/EventForm";

const NewEvent = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: IEvent) => {
        const response = await createEvent(data);
        if (response.status === 201) {
            enqueueSnackbar("Event created", { variant: "success" });
            navigate(`/events/${response.data.id}`);
        } else if (response.status === 409) {
            enqueueSnackbar("Event with this ID already exists", {
                variant: "error",
            });
        } else {
            enqueueSnackbar("Failed to create event", { variant: "error" });
        }
    };
    return (
        <Box
            sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Typography variant="h4">Create new event</Typography>
            <EventForm eventData={defaultEvent} onSubmit={handleSubmit} />
        </Box>
    );
};

export default NewEvent;
