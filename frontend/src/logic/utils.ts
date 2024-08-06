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
    return value.slice(0, 1) + value.slice(1).toLowerCase().replace(/_/g, " ");
};
