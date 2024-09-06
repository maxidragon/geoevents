import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";

import { style } from "@/Components/modalStyles";

interface ShowApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
}

const ShowApiKeyModal = ({ isOpen, onClose, apiKey }: ShowApiKeyModalProps) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        enqueueSnackbar("Copied to clipboard", { variant: "success" });
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    ...style,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 2,
                    textAlign: "center",
                }}
            >
                <Typography variant="h6">API key</Typography>
                <TextField
                    value={apiKey}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Button variant="contained" onClick={handleCopy}>
                    Copy
                </Button>
                <Typography variant="body2">
                    Make sure to save this key in a safe place, as you won't be
                    able to see it again. If you lose it, you'll have to
                    generate a new one.
                </Typography>
            </Box>
        </Modal>
    );
};

export default ShowApiKeyModal;
