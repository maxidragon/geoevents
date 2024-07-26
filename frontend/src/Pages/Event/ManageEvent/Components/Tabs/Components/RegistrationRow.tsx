import {
    AccessTime as AccessTimeIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

import {
    acceptRegistration,
    deleteRegistration,
    moveRegistrationToPending,
} from "@/logic/events";
import { Registration } from "@/logic/interfaces";
import { enumToName, registrationActionToName } from "@/logic/utils";

interface RegistrationRowProps {
    registration: Registration;
    fetchData: () => void;
}

const RegistrationRow = ({ registration, fetchData }: RegistrationRowProps) => {
    const confirm = useConfirm();
    const [open, setOpen] = useState(false);

    const handleAccept = async () => {
        confirm({
            description: "Are you sure you want to accept this registration?",
        })
            .then(async () => {
                const status = await acceptRegistration(
                    registration.eventId,
                    registration.id
                );
                if (status === 200) {
                    enqueueSnackbar("Registration accepted", {
                        variant: "success",
                    });
                    fetchData();
                } else {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error",
                    });
                }
            })
            .catch(() => {
                enqueueSnackbar("Registration not accepted", {
                    variant: "info",
                });
            });
    };

    const handleDelete = () => {
        confirm({
            description: "Are you sure you want to delete this registration?",
        })
            .then(async () => {
                const status = await deleteRegistration(
                    registration.eventId,
                    registration.id
                );
                if (status === 204) {
                    enqueueSnackbar("Registration deleted", {
                        variant: "success",
                    });
                    fetchData();
                } else {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error",
                    });
                }
            })
            .catch(() => {
                enqueueSnackbar("Registration not deleted", {
                    variant: "info",
                });
            });
    };

    const handleMoveToPending = () => {
        confirm({
            description:
                "Are you sure you want to move this registration to pending?",
        })
            .then(async () => {
                const status = await moveRegistrationToPending(
                    registration.eventId,
                    registration.id
                );
                if (status === 200) {
                    enqueueSnackbar("Registration moved to pending", {
                        variant: "success",
                    });
                    fetchData();
                } else {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error",
                    });
                }
            })
            .catch(() => {
                enqueueSnackbar("Registration not moved to pending", {
                    variant: "info",
                });
            });
    };

    return (
        <>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {registration.user.fullName} ({registration.user.username})
                </TableCell>
                <TableCell>{registration.comment}</TableCell>
                <TableCell>{enumToName(registration.status)}</TableCell>
                <TableCell>
                    {registration.status !== "PENDING" ? (
                        <Tooltip title="Move to pending">
                            <IconButton onClick={handleMoveToPending}>
                                <AccessTimeIcon />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                    {registration.status !== "ACCEPTED" ? (
                        <Tooltip title="Accept">
                            <IconButton onClick={handleAccept}>
                                <DoneIcon />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                    {registration.status !== "DELETED" ? (
                        <Tooltip title="Delete">
                            <IconButton onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Performed by</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {registration.registrationHistory.map(
                                        (historyRow) => (
                                            <TableRow key={historyRow.id}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {new Date(
                                                        historyRow.timestamp
                                                    ).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {registrationActionToName(
                                                        historyRow.action
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        historyRow.performedBy
                                                            .fullName
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default RegistrationRow;
