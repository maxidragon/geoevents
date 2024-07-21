import { List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { IEvent } from "../../../logic/interfaces";
import { formatDateRange } from "../../../logic/utils";

interface EventListProps {
    events: IEvent[];
}

const EventList = ({ events }: EventListProps) => {
    if (events.length === 0) {
        return <Typography sx={{ textAlign: "center" }}>No events</Typography>;
    }

    return (
        <List dense={true} disablePadding>
            {events.map((event) => (
                <ListItemButton
                    key={event.id}
                    component={Link}
                    to={`/events/${event.id}`}
                >
                    <ListItemText
                        primary={event.name}
                        secondary={formatDateRange(
                            new Date(event.startDate),
                            new Date(event.endDate)
                        )}
                    />
                </ListItemButton>
            ))}
        </List>
    );
};

export default EventList;
