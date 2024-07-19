export interface UserInfo {
    id: string;
    email: string;
    role: string;
    username: string;
    fullName: string;
}

export interface IEvent {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    address: string;
    autoAcceptRegistrations: boolean;
    enableQualifications: boolean;
    enableGroups: boolean;
    enableKnockoutStage: boolean;
    isPublic: boolean;
    useExternalRegistration: boolean;
    mapId: string;
    map: Map;
    organizers: EventOrganizer[];
}

export interface Map {
    id: string;
    name: string;
    image: string;
}

export interface EventOrganizer {
    id: string;
    event: Event;
    user: UserInfo;
}