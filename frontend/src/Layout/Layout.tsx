import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Copyright from "./Copyright";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "background.paper",
                color: "white",
            }}
        >
            <Navbar />
            <Outlet />
            <Box sx={{ mt: "auto", mb: 2 }}>
                <Copyright />
            </Box>
        </Box>
    );
};

export default Layout;
