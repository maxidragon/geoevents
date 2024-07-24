import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
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
            <CircularProgress />
        </Box>
    );
};

export default Loading;
