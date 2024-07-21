import { backendRequest } from "./request";

export const searchUsers = async (search: string) => {
    const response = await backendRequest(`user?search=${search}`, "GET", true);
    return await response.json();
};
