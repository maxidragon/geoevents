import { Box } from "@mui/material";
import { enqueueSnackbar } from "notistack";

import { updateEvent } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";
import EventForm from "@/Pages/Event/Components/EventForm/EventForm";

interface EditEventProps {
    eventData: IEvent;
}

const EditEvent = ({ eventData }: EditEventProps) => {
    const handleSubmit = async (data: IEvent) => {
        const status = await updateEvent(data.id, data);
        if (status === 200) {
            enqueueSnackbar("Event updated succesfully", {
                variant: "success",
            });
        } else {
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <EventForm eventData={eventData} onSubmit={handleSubmit} />
        </Box>
    );
};

export default EditEvent;
