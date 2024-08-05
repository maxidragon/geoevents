import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import { Registration } from "@/logic/interfaces";

import RegistrationRow from "./RegistrationRow";

interface RegistrationsTableProps {
    registrations: Registration[];
    fetchData: () => void;
}

const RegistrationsTable = ({
    registrations,
    fetchData,
}: RegistrationsTableProps) => {
    if (registrations.length === 0) {
        return <Typography variant="h6">No registrations</Typography>;
    }
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Comment</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {registrations.map((registration) => (
                        <RegistrationRow
                            key={registration.id}
                            registration={registration}
                            fetchData={fetchData}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RegistrationsTable;
