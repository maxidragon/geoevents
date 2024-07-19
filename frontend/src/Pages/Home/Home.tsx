import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { getUpcomingEvents } from "../../logic/events";
import { IEvent } from "../../logic/interfaces";
import EventList from "./Components/EventList";

const Home = () => {
    const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        getUpcomingEvents().then(setUpcomingEvents);
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
                Upcoming events
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
        </Box>
    );
};

export default Home;
