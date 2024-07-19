import { AddCircle, CalendarMonth, Group } from "@mui/icons-material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { Link } from "react-router-dom";

import { isAdmin, logout } from "../logic/auth";
import { UserInfo } from "../logic/interfaces";

interface AccountMenuProps {
    user: UserInfo;
}

const AccountMenu = ({ user }: AccountMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    return (
        <>
            <Tooltip title="Account">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    <Avatar sx={{ bgcolor: deepOrange[500], color: "white" }}>
                        {user.username.slice(0, 1).toUpperCase()}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {isAdmin() && (
                    <>
                        <MenuItem
                            onClick={handleClose}
                            component={Link}
                            to="/events/new"
                        >
                            <ListItemIcon>
                                <AddCircle fontSize="small" />
                            </ListItemIcon>
                            New event
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            to="/users"
                            onClick={handleClose}
                        >
                            <ListItemIcon>
                                <Group fontSize="small" />
                            </ListItemIcon>
                            Users
                        </MenuItem>
                        <Divider />
                    </>
                )}
                <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/events/mine"
                >
                    <ListItemIcon>
                        <CalendarMonth fontSize="small" />
                    </ListItemIcon>
                    My events
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/settings">
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default AccountMenu;
