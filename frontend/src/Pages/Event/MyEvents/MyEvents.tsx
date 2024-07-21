import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { getMyEvents } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";
import EventList from "@/Pages/Home/Components/EventList";

const MyEvents = () => {
    const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
    const [pastEvents, setPastEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        getMyEvents().then((data) => {
            setUpcomingEvents(data.upcomingEvents);
            setPastEvents(data.pastEvents);
        });
    }, []);

    return (
        <Box
            p={2}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
            }}
        >
            <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
                My events
            </Typography>
            <Paper
                sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: {
                        xs: "100%",
                        sm: "50%",
                    },
                }}
            >
                <EventList events={upcomingEvents} />
            </Paper>
            <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
                Past events
            </Typography>
            <Paper
                sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: {
                        xs: "100%",
                        sm: "50%",
                    },
                }}
            >
                <EventList events={pastEvents} />
            </Paper>
        </Box>
    );
};

export default MyEvents;
