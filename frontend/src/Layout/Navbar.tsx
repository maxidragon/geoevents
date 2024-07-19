import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LoginPartial from "./LoginPartial";

const Navbar = (props: { title?: string }) => {
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
          {props.title ? props.title : "GeoEvents"}
        </Typography>
        <LoginPartial />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;