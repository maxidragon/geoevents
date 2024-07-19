import Navbar from "./Navbar";
import Copyright from "./Copyright";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const Layout = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "background.paper", color: "white" }}>
            <Navbar />
            <Outlet />
            <Box sx={{ mt: "auto", mb: 2 }}>
                <Copyright />
            </Box>
        </Box>
    );
};

export default Layout;