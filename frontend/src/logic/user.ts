import { UserInfo } from "./interfaces";
import { backendRequest } from "./request";

export const searchUsers = async (search: string) => {
    const response = await backendRequest(`user?search=${search}`, "GET", true);
    return await response.json();
};

export const getUsers = async (page: number, search: string) => {
    const response = await backendRequest(
        `user/admin?page=${page}&search=${search}`,
        "GET",
        true
    );
    return await response.json();
};

export const updateUser = async (id: string, data: UserInfo) => {
    const response = await backendRequest(`user/${id}`, "PUT", true, data);
    return response.status;
};

export const deleteUser = async (id: string) => {
    const response = await backendRequest(`user/${id}`, "DELETE", true);
    return response.status;
};
