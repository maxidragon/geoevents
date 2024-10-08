import { getToken } from "./auth";

// const DEV_BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN
//     ? import.meta.env.VITE_BACKEND_ORIGIN
//     : "http://localhost:5000";

const DEV_BACKEND_URL = "http://localhost:5000";
const BACKEND_URL = import.meta.env.PROD ? "/api" : DEV_BACKEND_URL;

export const backendRequest = (
    path: string,
    method: string,
    useAuth: boolean,
    body?: unknown
) => {
    const token = getToken();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token && useAuth) {
        headers.append("Authorization", `Bearer ${token}`);
    }
    return fetch(`${BACKEND_URL}/${path}`, {
        method: method,
        headers: headers,
        redirect: "follow",
        body: JSON.stringify(body),
    });
};
