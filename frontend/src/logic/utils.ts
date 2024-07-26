export const formatDateRange = (startDate: Date, endDate: Date) => {
    if (startDate.getDate() === endDate.getDate()) {
        return startDate.toLocaleDateString();
    }
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

export const a11yTabsProps = (index: string) => {
    return {
        id: `tab-${index}`,
        "aria-controls": `tabpanel-${index}`,
    };
};
