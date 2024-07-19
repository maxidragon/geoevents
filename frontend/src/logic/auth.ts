import { backendRequest } from "./request";

const TOKEN_NAME = "geoevents-token";
const USER_INFO_NAME = "geoevents-userInfo";

export const registerUser = async (
  email: string,
  username: string,
  fullName: string,
  password: string
) => {
  try {
    const body = {
      email: email,
      username: username,
      fullName: fullName,
      password: password,
    };
    const response = await backendRequest("auth/register", "POST", false, body);
    return response.status;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email: string, password: string) => {
  const response = await backendRequest("auth/login", "POST", false, {
    email: email,
    password: password,
  });
  const data = await response.json();
  if (response.status === 200 && data.token) {
    localStorage.setItem(TOKEN_NAME, data.token);
    localStorage.setItem(USER_INFO_NAME, JSON.stringify(data.userInfo));
    window.dispatchEvent(new Event('storage'));
  }
  return response.status;
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_NAME);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem(USER_INFO_NAME);
    window.dispatchEvent(new Event('storage'))
};

export const isUserLoggedIn = () => {
    return localStorage.getItem(TOKEN_NAME) !== null;
};

export const getUserInfo = () => {
    const userInfo = localStorage.getItem(USER_INFO_NAME);
    if (userInfo === null) {
        return null;
    }
    return JSON.parse(userInfo);
};

export const isAdmin = () => {
    const userInfo = getUserInfo();
    return userInfo !== null && userInfo.role === "ADMIN";
};

export const forgotPassword = async (email: string) => {
    const response = await backendRequest("auth/password/forgot", "POST", false, {
      email: email,
    });
    return response.status;
  };

export const resetPassword = async (resetId: string, newPassword: string) => {
  const response = await backendRequest("auth/password/reset", "POST", false, {
    tempId: resetId,
    newPassword: newPassword,
  });
  return response.status;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  const response = await backendRequest("auth/password/change", "PUT", true, {
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
  return response.status;
};
  
export const verifyEmail = async (id: string) => {
  const response = await backendRequest(`auth/verify`, "POST", false, {
    token: id,
  });
  return response.status;
};
