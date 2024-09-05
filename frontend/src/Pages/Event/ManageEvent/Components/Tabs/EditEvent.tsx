import { Box, Button } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

import { getApiKey, updateEvent } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";
import EventForm from "@/Pages/Event/Components/EventForm/EventForm";

import ShowApiKeyModal from "./Components/ShowApiKeyModal";

interface EditEventProps {
    eventData: IEvent;
}

const EditEvent = ({ eventData }: EditEventProps) => {
    const confirm = useConfirm();
    const [apiKey, setApiKey] = useState<string>("");
    const [isOpenApiKeyModal, setIsOpenApiKeyModal] = useState(false);

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

    const handleGetApiKey = async () => {
        confirm({
            title: "Are you sure?",
            description:
                "This will invalidate the previous API key (if exists) and generate a new one",
        })
            .then(async () => {
                const data = await getApiKey(eventData.id);
                setApiKey(data.apiKey);
                setIsOpenApiKeyModal(true);
            })
            .catch(() => {
                enqueueSnackbar("Operation cancelled", { variant: "error" });
            });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            <Button
                variant="contained"
                sx={{
                    width: "fit-content",
                }}
                onClick={handleGetApiKey}
            >
                Get API key
            </Button>
            <EventForm eventData={eventData} onSubmit={handleSubmit} />
            <ShowApiKeyModal
                apiKey={apiKey}
                isOpen={isOpenApiKeyModal}
                onClose={() => setIsOpenApiKeyModal(false)}
            />
        </Box>
    );
};

export default EditEvent;
