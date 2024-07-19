import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from "notistack";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout/Layout";
import ForgotPassword from "./Pages/Auth/ForgotPassword/ForgotPassword";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import Verify from "./Pages/Auth/Verify/Verify";
import Home from "./Pages/Home/Home";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "auth/login",
                    element: <Login />,
                },
                {
                    path: "auth/register",
                    element: <Register />,
                },
                {
                    path: "auth/password/forgot",
                    element: <ForgotPassword />,
                },
                {
                    path: "auth/password/reset/:resetId",
                    element: <ResetPassword />,
                },
                {
                    path: "auth/verify/:id",
                    element: <Verify />,
                },
            ],
        },
    ]);

    return (
        <ThemeProvider theme={darkTheme}>
            <SnackbarProvider>
                <ConfirmProvider>
                    <RouterProvider router={router} />
                </ConfirmProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
