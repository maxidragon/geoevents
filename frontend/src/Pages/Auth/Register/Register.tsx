import { Avatar, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { registerUser } from "../../../logic/auth";
import { enqueueSnackbar } from "notistack";

export default function Register() {
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("email") && data.get("password") && data.get("username") && data.get("fullName") && data.get("confirmPassword")) {
      if (data.get("password") !== data.get("confirmPassword")) {
        enqueueSnackbar("Passwords do not match", { variant: "error" });
        return;
      }

      const status = await registerUser(
        data.get("email") as string,
        data.get("username") as string,
        data.get("fullName") as string,
        data.get("password") as string
      );
      if (status === 200) {
        enqueueSnackbar("Successfully registered a new account!", {
          variant: "success",
        });
        navigate("/auth/login");
      } else if (status === 403) {
        enqueueSnackbar("Email or username is already taken", {
          variant: "error",
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
      Sign up
    </Typography>
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ mt: 1, width: {
        xs: "100%",
        sm: "50%",
        md: "30%",
      }}}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="fullName"
        label="Full Name"
        name="fullName"
        autoComplete="fullName"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign up
      </Button>
      <Grid container>
        <Grid item xs>
          <Link to={"/auth/password/forgot"}>Forgot password?</Link>
        </Grid>
        <Grid item>
          <Link to={"/auth/login"}>
          Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Box>
  </Box>
  );
}
