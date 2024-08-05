import {
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import {
    Box,
    IconButton,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

import { UserInfo } from "@/logic/interfaces";
import { deleteUser } from "@/logic/user";
import { enumToName } from "@/logic/utils";

import EditUserModal from "./EditUserModal";

interface UserRowProps {
    user: UserInfo;
    fetchData: (pageParam?: number, searchParam?: string) => void;
}

const UserRow = ({ user, fetchData }: UserRowProps) => {
    const confirm = useConfirm();
    const [isOpenEditUserModal, setIsOpenEditUserModal] = useState(false);

    const handleDelete = async () => {
        confirm({
            title: "Delete user",
            description: `Are you sure you want to delete ${user.fullName}?`,
        })
            .then(async () => {
                const status = await deleteUser(user.id);
                if (status === 204) {
                    enqueueSnackbar("User deleted", { variant: "success" });
                    fetchData();
                } else {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error",
                    });
                }
            })
            .catch(() => {
                enqueueSnackbar("User not deleted", { variant: "info" });
            });
    };

    const handleCloseEditModal = () => {
        setIsOpenEditUserModal(false);
        fetchData();
    };

    return (
        <>
            <TableRow key={user.id}>
                <TableCell>
                    {user.fullName} ({user.username})
                </TableCell>
                <TableCell>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="body2" sx={{ mr: 1 }}>
                            {user.email}
                        </Typography>
                        {user.confirmedAt && <DoneIcon />}
                    </Box>
                </TableCell>
                <TableCell>{enumToName(user.role)}</TableCell>
                <TableCell>
                    <IconButton onClick={() => setIsOpenEditUserModal(true)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <EditUserModal
                isOpen={isOpenEditUserModal}
                onClose={handleCloseEditModal}
                user={user}
            />
        </>
    );
};

export default UserRow;
