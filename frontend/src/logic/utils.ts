import { RegistrationAction } from "./interfaces";

export const formatDateRange = (startDate: Date, endDate: Date) => {
    if (startDate.getDate() === endDate.getDate()) {
        return startDate.toLocaleDateString();
    }
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

export const a11yTabsProps = (index: number) => {
    return {
        id: `tab-${index}`,
        "aria-controls": `tabpanel-${index}`,
    };
};

export const enumToName = (value: string) => {
    return value.slice(0, 1) + value.slice(1).toLowerCase();
};

export const registrationActionToName = (value: RegistrationAction) => {
    if (value === "CREATED") {
        return "Created/Moved to pending";
    }
    return enumToName(value);
};
