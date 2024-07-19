import LoginIcon from "@mui/icons-material/Login";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { getUserInfo, isUserLoggedIn } from "../logic/auth";
import AccountMenu from "./AccountMenu";
import { useEffect, useState } from "react";
import { UserInfo } from "../logic/interfaces";

const LoginPartial = () => {
  const [user, setUser] = useState<UserInfo>(getUserInfo());
  const [loggedIn, setLoggedIn] = useState<boolean>(isUserLoggedIn());
  
  useEffect(() => {
    const handleStorage = () => {
      setUser(getUserInfo());
      setLoggedIn(isUserLoggedIn());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [])

  return (
    <>
      {loggedIn ? <AccountMenu user={user} /> : (
        <IconButton color="inherit" component={Link} to={"/auth/login"}>
          <LoginIcon fontSize="medium" />
        </IconButton>
      )}
    </>
  );
};

export default LoginPartial;