import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import TabPanel from "@/Components/Tabs/TabPanel";
import { IEvent } from "@/logic/interfaces";
import { a11yTabsProps } from "@/logic/utils";

import EditEvent from "./Tabs/EditEvent";
import ManageRegistrations from "./Tabs/ManageRegistrations";

const tabs = {
    edit: 0,
    manageRegistrations: 1,
    qualificationsResults: 3,
    groups: 4,
    groupStageResults: 5,
    knockoutStageResults: 6,
};

interface ManagaEventTabsProps {
    eventData: IEvent;
    fetchData: () => void;
}

const ManageEventTabs = ({ eventData, fetchData }: ManagaEventTabsProps) => {
    const [value, setValue] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        const name = Object.keys(tabs).find(
            (key) => tabs[key as keyof typeof tabs] === newValue
        );
        setSearchParams({ tab: name || "" });
    };

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setValue(tabs[tab as keyof typeof tabs]);
        }
    }, [searchParams]);

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Edit" {...a11yTabsProps(0)} />
                    <Tab label="Manage registrations" {...a11yTabsProps(1)} />
                    <Tab
                        label="Qualifications results"
                        {...a11yTabsProps(3)}
                        sx={{}}
                    />
                    {eventData.enableGroups && (
                        <Tab label="Groups" {...a11yTabsProps(4)} />
                    )}
                    {eventData.enableGroups && (
                        <Tab
                            label="Group stage results"
                            {...a11yTabsProps(5)}
                        />
                    )}
                    {eventData.enableKnockoutStage && (
                        <Tab
                            label="Knockout stage results"
                            {...a11yTabsProps(6)}
                        />
                    )}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <EditEvent eventData={eventData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ManageRegistrations
                    eventData={eventData}
                    fetchData={fetchData}
                />
            </TabPanel>
        </>
    );
};

export default ManageEventTabs;
