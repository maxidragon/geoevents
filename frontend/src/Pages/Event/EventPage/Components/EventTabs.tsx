import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import TabPanel from "@/Components/Tabs/TabPanel";
import { IEvent } from "@/logic/interfaces";
import { a11yTabsProps } from "@/logic/utils";

import BasicInformation from "./PublicTabs/BasicInformation";

interface EventTabsProps {
    eventData: IEvent;
}

const EventTabs = ({ eventData }: EventTabsProps) => {
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Basic information" {...a11yTabsProps(0)} />
                    <Tab label="How it works?" {...a11yTabsProps(1)} />
                    {!eventData.useExternalRegistration && (
                        <Tab label="Register" {...a11yTabsProps(2)} />
                    )}
                    {eventData.enableQualifications && (
                        <Tab
                            label="Qualifications results"
                            {...a11yTabsProps(3)}
                        />
                    )}
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
                <BasicInformation eventData={eventData} />
            </TabPanel>
        </>
    );
};

export default EventTabs;
