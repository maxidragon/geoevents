import FavoriteIcon from "@mui/icons-material/Favorite";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

const Copyright = (): JSX.Element => {
    return (
        <>
            <Typography variant="body2" color="text.secondary" align="center">
                <Link component={RouterLink} to={"/"} rel="noopener noreferrer">
                    GeoEvents
                </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                Made with{" "}
                <FavoriteIcon sx={{ color: "red", verticalAlign: "middle" }} />{" "}
                by{" "}
                <Link
                    href="https://github.com/maxidragon"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Maksymilian Gala
                </Link>
            </Typography>
            <Typography align="center">
                <IconButton
                    aria-label="GitHubIcon"
                    href="https://github.com/maxidragon/geoevents"
                    target="_blank"
                >
                    <GitHubIcon sx={{ color: "#FFF" }} fontSize="large" />
                </IconButton>
            </Typography>
        </>
    );
};

export default Copyright;
