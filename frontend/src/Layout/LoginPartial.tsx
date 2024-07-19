import LoginIcon from "@mui/icons-material/Login";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUserInfo, isUserLoggedIn } from "../logic/auth";
import { UserInfo } from "../logic/interfaces";
import AccountMenu from "./AccountMenu";

const LoginPartial = () => {
    const [user, setUser] = useState<UserInfo>(getUserInfo());
    const [loggedIn, setLoggedIn] = useState<boolean>(isUserLoggedIn());

    useEffect(() => {
        const handleStorage = () => {
            setUser(getUserInfo());
            setLoggedIn(isUserLoggedIn());
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <>
            {loggedIn ? (
                <AccountMenu user={user} />
            ) : (
                <IconButton color="inherit" component={Link} to={"/auth/login"}>
                    <LoginIcon fontSize="medium" />
                </IconButton>
            )}
        </>
    );
};

export default LoginPartial;
