import { Box, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../../logic/auth";

const Verify = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        const verify = async () => {
            const status = await verifyEmail(id);
            if (status === 200) {
                enqueueSnackbar("Email verified successfully", {
                    variant: "success"
                });
                navigate("/auth/login");
            } else {
                enqueueSnackbar("Something went wrong", {
                    variant: "error"
                });
            }
        };
        verify();
    }, [id, navigate]);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Typography variant="h3">Verifying email...</Typography>
        </Box>
    )


};

export default Verify;