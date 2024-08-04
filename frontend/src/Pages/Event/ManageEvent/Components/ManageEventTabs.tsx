import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import TabPanel from "@/Components/Tabs/TabPanel";
import { IEvent } from "@/logic/interfaces";
import { a11yTabsProps } from "@/logic/utils";

import EditEvent from "./Tabs/EditEvent";
import ManageRegistrations from "./Tabs/ManageRegistrations";
import QualificationResults from "./Tabs/QualificationResults";

const tabs = {
    edit: 0,
    manageRegistrations: 1,
    qualificationsResults: 2,
    groups: 3,
    groupStageResults: 4,
    knockoutStageResults: 5,
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
                        {...a11yTabsProps(2)}
                        sx={{
                            display: eventData.enableQualifications
                                ? "block"
                                : "none",
                        }}
                    />
                    <Tab
                        label="Groups"
                        {...a11yTabsProps(3)}
                        sx={{
                            display: eventData.enableGroups ? "block" : "none",
                        }}
                    />
                    <Tab
                        label="Group stage results"
                        {...a11yTabsProps(4)}
                        sx={{
                            display: eventData.enableGroups ? "block" : "none",
                        }}
                    />

                    <Tab
                        label="Knockout stage results"
                        {...a11yTabsProps(5)}
                        sx={{
                            display: eventData.enableKnockoutStage
                                ? "block"
                                : "none",
                        }}
                    />
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
            <TabPanel value={value} index={2}>
                <QualificationResults
                    eventData={eventData}
                    fetchData={fetchData}
                />
            </TabPanel>
        </>
    );
};

export default ManageEventTabs;
