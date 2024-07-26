import { getUserInfo, isAdmin } from "./auth";
import { IEvent, Registration } from "./interfaces";
import { backendRequest } from "./request";

export const defaultEvent: IEvent = {
    id: "",
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    registrationOpen: new Date(),
    registrationClose: new Date(),
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

export const defaultRegistration: Registration = {
    id: "",
    eventId: "",
    userId: "",
    comment: "",
    registrationHistory: [],
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

export const getEventById = async (id: string) => {
    const response = await backendRequest(`event/${id}`, "GET", true);
    return {
        data: await response.json(),
        status: response.status,
    };
};

export const updateEvent = async (id: string, event: IEvent) => {
    const response = await backendRequest(`event/${id}`, "PUT", true, event);
    return response.status;
};

export const hasPermissionToManage = (event: IEvent) => {
    const userInfo = getUserInfo();
    if (!userInfo) return false;
    return event.organizers.some((o) => o.id === userInfo.id) || isAdmin();
};

export const isRegistrationOpen = (event: IEvent) => {
    const now = new Date();
    return (
        new Date(event.registrationOpen).getTime() < now.getTime() &&
        new Date(event.registrationClose).getTime() > now.getTime()
    );
};

export const registerForEvent = async (id: string, comment?: string) => {
    const response = await backendRequest(
        `event/${id}/register`,
        "POST",
        true,
        {
            comment,
        }
    );
    return response.status;
};

export const getRegistration = async (eventId: string) => {
    const response = await backendRequest(
        `event/${eventId}/registration`,
        "GET",
        true
    );
    return {
        data: await response.json(),
        status: response.status,
    };
};

export const updateRegistration = async (
    eventId: string,
    data: Registration
) => {
    const response = await backendRequest(
        `event/${eventId}/registration`,
        "PUT",
        true,
        data
    );
    return response.status;
};

export const isRegisteredCheck = (registration: Registration) => {
    return registration.id !== defaultRegistration.id;
};
