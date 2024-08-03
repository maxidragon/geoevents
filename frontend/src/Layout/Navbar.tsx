import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import LoginPartial from "./LoginPartial";
import SearchBar from "./SearchBar";

interface NavbarProps {
    title?: string;
}

const Navbar = ({ title }: NavbarProps) => {
    return (
        <AppBar
            position="static"
            color="primary"
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    color="inherit"
                    style={{ flexGrow: 1 }}
                    component={Link}
                    to={`/`}
                    sx={{ textDecoration: "none" }}
                >
                    {title ? title : "GeoEvents"}
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <SearchBar />
                    <LoginPartial />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
