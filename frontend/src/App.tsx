import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from "notistack";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout/Layout";
import ForgotPassword from "./Pages/Auth/ForgotPassword/ForgotPassword";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import Verify from "./Pages/Auth/Verify/Verify";
import EventPage from "./Pages/Event/EventPage/EventPage";
import ManageEvent from "./Pages/Event/ManageEvent/ManageEvent";
import MyEvents from "./Pages/Event/MyEvents/MyEvents";
import NewEvent from "./Pages/Event/NewEvent/NewEvent";
import Home from "./Pages/Home/Home";
import Users from "./Pages/Users/Users";

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
                {
                    path: "events/new",
                    element: <NewEvent />,
                },
                {
                    path: "events/mine",
                    element: <MyEvents />,
                },
                {
                    path: "events/:id",
                    element: <EventPage />,
                },
                {
                    path: "events/:id/manage",
                    element: <ManageEvent />,
                },
                {
                    path: "users",
                    element: <Users />,
                },
            ],
        },
    ]);

    return (
        <ThemeProvider theme={darkTheme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <SnackbarProvider>
                    <ConfirmProvider>
                        <RouterProvider router={router} />
                    </ConfirmProvider>
                </SnackbarProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default App;
