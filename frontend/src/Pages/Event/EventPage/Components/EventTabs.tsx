import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import TabPanel from "@/Components/Tabs/TabPanel";
import { isRegistrationOpen } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";
import { a11yTabsProps } from "@/logic/utils";

import BasicInformation from "./Tabs/BasicInformation";
import Register from "./Tabs/Register";

interface EventTabsProps {
    eventData: IEvent;
}

const EventTabs = ({ eventData }: EventTabsProps) => {
    const [value, setValue] = useState<string>("");

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Basic information" {...a11yTabsProps("")} />
                    <Tab
                        label="How it works?"
                        {...a11yTabsProps("how-it-works")}
                    />
                    {!eventData.useExternalRegistration && (
                        <Tab
                            label="Register"
                            {...a11yTabsProps("register")}
                            title={
                                !isRegistrationOpen(eventData)
                                    ? ""
                                    : "Registration is closed."
                            }
                            disabled={!isRegistrationOpen(eventData)}
                        />
                    )}
                    <Tab
                        label="Participants"
                        {...a11yTabsProps("participants")}
                    />
                    {eventData.enableQualifications && (
                        <Tab
                            label="Qualifications results"
                            {...a11yTabsProps(4)}
                        />
                    )}
                    {eventData.enableGroups && (
                        <Tab label="Groups" {...a11yTabsProps(5)} />
                    )}
                    {eventData.enableGroups && (
                        <Tab
                            label="Group stage results"
                            {...a11yTabsProps(6)}
                        />
                    )}
                    {eventData.enableKnockoutStage && (
                        <Tab
                            label="Knockout stage results"
                            {...a11yTabsProps(7)}
                        />
                    )}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <BasicInformation eventData={eventData} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Register eventData={eventData} />
            </TabPanel>
        </>
    );
};

export default EventTabs;
