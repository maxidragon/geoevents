import { Box, Typography } from "@mui/material";

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
    const pendingRegistrations = eventData.registrations.filter(
        (registration) => registration.status === "PENDING"
    );

    const acceptedRegistrations = eventData.registrations.filter(
        (registration) => registration.status === "ACCEPTED"
    );

    const deletedRegistrations = eventData.registrations.filter(
        (registration) => registration.status === "DELETED"
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
