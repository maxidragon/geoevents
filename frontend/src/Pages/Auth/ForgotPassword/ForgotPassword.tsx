import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from "notistack";
import { useRef } from "react";

import { forgotPassword } from "../../../logic/auth";

const ForgotPassword = () => {
    const emailRef: React.MutableRefObject<
        HTMLInputElement | null | undefined
    > = useRef();
    const handleSubmit = async () => {
        if (!emailRef.current || emailRef.current.value === "") {
            return;
        } else {
            const status = await forgotPassword(emailRef.current.value);
            if (status === 200) {
                enqueueSnackbar("Success, check your email", {
                    variant: "success",
                });
            } else {
                enqueueSnackbar("Something went wrong", { variant: "error" });
            }
        }
    };

    return (
        <Box
            sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Forgot password?
            </Typography>
            <Box sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    inputRef={emailRef}
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit}
                >
                    Send reset link
                </Button>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
