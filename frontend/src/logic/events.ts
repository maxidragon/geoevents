import { IEvent } from "./interfaces";
import { backendRequest } from "./request";

export const defaultEvent: IEvent = {
    id: "",
    name: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    address: "",
    isPublic: false,
    useExternalRegistration: false,
    autoAcceptRegistrations: false,
    enableQualifications: true,
    enableGroups: true,
    enableKnockoutStage: true,
    mapId: "",
    map: {
        id: "",
        name: "",
        url: "",
    },
    organizers: [],
};

export const getUpcomingEvents = async () => {
    const response = await backendRequest("event/upcoming", "GET", true);
    return await response.json();
};

export const getMyEvents = async () => {
    const response = await backendRequest("event/my", "GET", true);
    return await response.json();
};

export const createEvent = async (event: IEvent) => {
    const response = await backendRequest("event", "POST", true, event);
    const { data } = await response.json();
    return {
        data: data,
        status: response.status,
    };
};
