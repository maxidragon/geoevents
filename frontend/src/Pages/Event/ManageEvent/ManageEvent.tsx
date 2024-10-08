import { Box, Button, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Loading from "@/Components/Loading";
import { getEventById, hasPermissionToManage } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";

import ManageEventTabs from "./Components/ManageEventTabs";

const ManageEvent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState<IEvent | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) {
            navigate("/");
            return;
        }
        const response = await getEventById(id, false);
        if (response.status === 200) {
            if (hasPermissionToManage(response.data)) {
                setEventData(response.data);
            } else {
                navigate(`/events/${id}`);
                enqueueSnackbar(
                    "You don't have permission to manage this event",
                    { variant: "error" }
                );
            }
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
                <Button
                    component={Link}
                    to={`/events/${id}`}
                    variant="contained"
                    sx={{ width: "fit-content", height: "fit-content" }}
                >
                    Public view
                </Button>
            </Box>
            <ManageEventTabs eventData={eventData} fetchData={fetchData} />
        </Box>
    );
};

export default ManageEvent;
