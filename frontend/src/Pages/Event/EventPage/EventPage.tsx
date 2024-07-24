import { Box, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEventById } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";

import EventTabs from "./Components/EventTabs";

const EventPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState<IEvent | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) {
            navigate("/");
            return;
        }
        const response = await getEventById(id);
        if (response.status === 200) {
            setEventData(response.data);
        } else if (response.status === 404) {
            navigate("/");
            enqueueSnackbar("Event not found", { variant: "error" });
        } else {
            navigate("/");
            enqueueSnackbar("An error occurred", { variant: "error" });
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!eventData) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Typography variant="h4">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,

                p: 2,
            }}
        >
            <Typography variant="h4" sx={{ mb: 2, mt: 1 }}>
                {eventData.name}
            </Typography>
            <EventTabs eventData={eventData} />
        </Box>
    );
};

export default EventPage;
