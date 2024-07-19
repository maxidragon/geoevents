import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LoginPartial from "./LoginPartial";

interface NavbarProps {
  title?: string;
}

const Navbar = ({title }: NavbarProps) => {
  return (
    <AppBar position="static" color="primary" sx={{ width: "100%" }}>
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
        <LoginPartial />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;