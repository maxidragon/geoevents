import * as React from "react";
import { useEffect, useRef } from "react";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../../logic/auth";

function ResetPassword() {
  const { resetId } = useParams<{ resetId: string }>();
  const navigate = useNavigate();
  const newPasswordRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  const confirmNewPasswordRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();

  const handleSubmit = async () => {
    if (
      !newPasswordRef.current ||
      !confirmNewPasswordRef.current ||
      newPasswordRef.current.value === "" ||
      confirmNewPasswordRef.current.value === ""
    ) {
      enqueueSnackbar("Enter password two times!", { variant: "error" });
    } else {
      if (
        newPasswordRef.current.value !== confirmNewPasswordRef.current.value
      ) {
        enqueueSnackbar("Passwords do not match!", { variant: "error" });
      } else {
        if (resetId) {
          const status = await resetPassword(
            resetId,
            newPasswordRef.current.value,
          );
          if (status === 200) {
            enqueueSnackbar("Password has been changed", {
              variant: "success",
            });
            navigate("/auth/login");
          } else {
            enqueueSnackbar("Something went wrong!", { variant: "error" });
          }
        } else {
          navigate("/auth/login");
        }
      }
    }
  };
  useEffect(() => {
    if (resetId === "") {
      navigate("/auth/login");
    }
  }, [resetId, navigate]);
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
            Change your password
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              inputRef={newPasswordRef}
              id="newPassword"
              label="New password"
              type="password"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              inputRef={confirmNewPasswordRef}
              id="newPassword"
              label="Confirm new password"
              type="password"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Change password
            </Button>
          </Box>
        </Box>
  );
}

export default ResetPassword;
