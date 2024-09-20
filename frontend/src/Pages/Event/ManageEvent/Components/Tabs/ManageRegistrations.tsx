import { Box, Typography } from "@mui/material";

import { getSortedRegistrations } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";

import RegistrationsTable from "./Components/RegistrationsTable";

interface ManageRegistrationsProps {
    eventData: IEvent;
    fetchData: () => void;
}

const ManageRegistrations = ({
    eventData,
    fetchData,
}: ManageRegistrationsProps) => {
    const pendingRegistrations = getSortedRegistrations(
        eventData.registrations,
        "PENDING"
    );

    const acceptedRegistrations = getSortedRegistrations(
        eventData.registrations,
        "ACCEPTED"
    );

    const deletedRegistrations = getSortedRegistrations(
        eventData.registrations,
        "DELETED"
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5">
                Pending registrations ({pendingRegistrations.length})
            </Typography>
            <RegistrationsTable
                registrations={pendingRegistrations}
                fetchData={fetchData}
            />
            <Typography variant="h5">
                Accepted registrations ({acceptedRegistrations.length})
            </Typography>
            <RegistrationsTable
                registrations={acceptedRegistrations}
                fetchData={fetchData}
            />
            <Typography variant="h5">
                Deleted registrations ({deletedRegistrations.length})
            </Typography>
            <RegistrationsTable
                registrations={deletedRegistrations}
                fetchData={fetchData}
            />
        </Box>
    );
};

export default ManageRegistrations;
