import { Box, Button, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Loading from "@/Components/Loading";
import { getEventById, hasPermissionToManage } from "@/logic/events";
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

    if (!eventData) return <Loading />;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h4" sx={{ mb: 2, mt: 1 }}>
                    {eventData.name}
                </Typography>
                {hasPermissionToManage(eventData) && (
                    <Button
                        component={Link}
                        to={`/events/${id}/manage`}
                        variant="contained"
                        sx={{ width: "fit-content", height: "fit-content" }}
                    >
                        Manage
                    </Button>
                )}
            </Box>
            <EventTabs eventData={eventData} />
        </Box>
    );
};

export default EventPage;
