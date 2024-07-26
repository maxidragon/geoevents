import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import { IEvent } from "@/logic/interfaces";

interface ParticipantsProps {
    eventData: IEvent;
}

const Participants = ({ eventData }: ParticipantsProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5">Registered participants</Typography>
            <TableContainer
                component={Paper}
                sx={{
                    overflowY: "auto",
                    maxHeight: "80vh",
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventData.registrations.map((row, i: number) => (
                            <TableRow key={row.id} hover>
                                <TableCell
                                    sx={{
                                        maxWidth: "50px",
                                    }}
                                >
                                    {i + 1}
                                </TableCell>
                                <TableCell>
                                    {row.user.fullName} ({row.user.username})
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                component="th"
                                colSpan={2}
                                sx={{
                                    fontSize: 14,
                                    oolor: "white",
                                }}
                            >
                                Total: {eventData.registrations.length}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Participants;
