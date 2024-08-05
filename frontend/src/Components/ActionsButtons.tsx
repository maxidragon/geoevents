import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button } from "@mui/material";
import { ReactElement } from "react";

import { actionsButtons, buttonStyle } from "./modalStyles";

interface ActionsButtonsProps {
    onCancel: () => void;
    onSubmit: () => void;
    submitText: string;
    submitIcon: ReactElement;
}

const ActionsButtons = ({
    onCancel,
    onSubmit,
    submitText,
    submitIcon,
}: ActionsButtonsProps) => {
    return (
        <Box sx={actionsButtons}>
            <Button
                variant="contained"
                sx={buttonStyle}
                endIcon={<CancelIcon />}
                onClick={onCancel}
            >
                Cancel
            </Button>
            <Button
                variant="contained"
                color="success"
                endIcon={submitIcon}
                onClick={onSubmit}
            >
                {submitText}
            </Button>
        </Box>
    );
};

export default ActionsButtons;
