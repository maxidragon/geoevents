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
    startDate: Date;
    endDate: Date;
    registrationOpen: Date;
    registrationClose: Date;
    address: string;
    autoAcceptRegistrations: boolean;
    enableQualifications: boolean;
    enableGroups: boolean;
    enableKnockoutStage: boolean;
    isPublic: boolean;
    useExternalRegistration: boolean;
    mapId?: string;
    map: Map;
    organizers: UserInfo[];
    registrations: Registration[];
}

export interface Registration {
    id: string;
    eventId: string;
    userId: string;
    user: UserInfo;
    status: RegistrationStatus;
    comment?: string;
    registrationHistory: RegistrationHistory[];
}

export type RegistrationStatus = "PENDING" | "ACCEPTED" | "DELETED";

export interface RegistrationHistory {
    id: string;
    registrationId: string;
    action: RegistrationAction;
    timestamp: Date;
    performedBy: UserInfo;
}

export type RegistrationAction = "CREATED" | "DELETED" | "ACCEPTED";

export interface Map {
    id: string;
    name: string;
    url: string;
}
