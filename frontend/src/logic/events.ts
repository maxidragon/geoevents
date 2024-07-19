import { backendRequest } from "./request";

export const getUpcomingEvents = async () => {
    const response = await backendRequest("event/upcoming", "GET", true);
    return await response.json();
};