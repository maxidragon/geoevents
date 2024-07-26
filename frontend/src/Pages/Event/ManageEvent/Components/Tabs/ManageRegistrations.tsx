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
            <Typography variant="h5">Pending registrations</Typography>
            <RegistrationsTable
                registrations={pendingRegistrations}
                fetchData={fetchData}
            />
            <Typography variant="h5">Accepted registrations</Typography>
            <RegistrationsTable
                registrations={acceptedRegistrations}
                fetchData={fetchData}
            />
            <Typography variant="h5">Deleted registrations</Typography>
            <RegistrationsTable
                registrations={deletedRegistrations}
                fetchData={fetchData}
            />
        </Box>
    );
};

export default ManageRegistrations;
