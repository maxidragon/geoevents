import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import TabPanel from "@/Components/Tabs/TabPanel";
import { isRegistrationOpen } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";
import { a11yTabsProps } from "@/logic/utils";

import BasicInformation from "./Tabs/BasicInformation";
import Participants from "./Tabs/Participants";
import Register from "./Tabs/Register";

interface EventTabsProps {
    eventData: IEvent;
}

const tabs = {
    basicInformation: 0,
    howItWorks: 1,
    register: 2,
    participants: 3,
    qualificationsResults: 4,
    groups: 5,
    groupStageResults: 6,
    knockoutStageResults: 7,
};

const EventTabs = ({ eventData }: EventTabsProps) => {
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
                    scrollButtons={false}
                >
                    <Tab label="Basic information" {...a11yTabsProps(0)} />
                    <Tab label="How it works?" {...a11yTabsProps(1)} />
                    {!eventData.useExternalRegistration && (
                        <Tab
                            label="Register"
                            {...a11yTabsProps(2)}
                            title={
                                !isRegistrationOpen(eventData)
                                    ? ""
                                    : "Registration is closed."
                            }
                            disabled={!isRegistrationOpen(eventData)}
                        />
                    )}
                    <Tab label="Participants" {...a11yTabsProps(3)} />
                    {eventData.enableQualifications && (
                        <Tab
                            label="Qualifications results"
                            {...a11yTabsProps(4)}
                        />
                    )}
                    <Tab
                        label="Groups"
                        {...a11yTabsProps(5)}
                        sx={{
                            display: eventData.enableGroups ? "block" : "none",
                        }}
                    />
                    <Tab
                        label="Group stage results"
                        {...a11yTabsProps(6)}
                        sx={{
                            display: eventData.enableGroups ? "block" : "none",
                        }}
                    />
                    <Tab
                        label="Knockout stage results"
                        {...a11yTabsProps(7)}
                        sx={{
                            display: eventData.enableKnockoutStage
                                ? "block"
                                : "none",
                        }}
                    />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <BasicInformation eventData={eventData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div>How it works?</div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Register eventData={eventData} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Participants eventData={eventData} />
            </TabPanel>
            {eventData.enableQualifications && (
                <TabPanel value={value} index={4}>
                    <div>Qualifications results</div>
                </TabPanel>
            )}
            {eventData.enableGroups && (
                <>
                    <TabPanel value={value} index={5}>
                        <div>Groups</div>
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                        <div>Group stage results</div>
                    </TabPanel>
                </>
            )}
            <TabPanel value={value} index={7}>
                <div>Knockout stage results</div>
            </TabPanel>
        </>
    );
};

export default EventTabs;
