import { Edit as EditIcon } from "@mui/icons-material";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

import ActionsButtons from "@/Components/ActionsButtons";
import { style } from "@/Components/modalStyles";
import { UserInfo } from "@/logic/interfaces";
import { updateUser } from "@/logic/user";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserInfo;
}

const EditUserModal = ({ isOpen, onClose, user }: EditUserModalProps) => {
    const [editedUser, setEditedUser] = useState<UserInfo>(user);

    const handleEdit = async () => {
        const status = await updateUser(user.id, editedUser);
        if (status === 200) {
            enqueueSnackbar("User updated", { variant: "success" });
            onClose();
        } else {
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6">Edit user</Typography>
                <TextField
                    label={"Username"}
                    fullWidth
                    value={editedUser.username}
                    onChange={(event) =>
                        setEditedUser({
                            ...editedUser,
                            username: event.target.value,
                        })
                    }
                />
                <TextField
                    label="Full name"
                    fullWidth
                    value={editedUser.fullName}
                    onChange={(event) =>
                        setEditedUser({
                            ...editedUser,
                            fullName: event.target.value,
                        })
                    }
                />
                <TextField
                    label={"Email"}
                    fullWidth
                    type="email"
                    value={editedUser.email}
                    onChange={(event) =>
                        setEditedUser({
                            ...editedUser,
                            email: event.target.value,
                        })
                    }
                />
                <FormControl fullWidth>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        value={editedUser.role}
                        label="Role"
                        onChange={(event) =>
                            setEditedUser({
                                ...editedUser,
                                role: event.target.value as string,
                            })
                        }
                    >
                        <MenuItem value="USER">User</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                </FormControl>
                <ActionsButtons
                    onCancel={onClose}
                    onSubmit={handleEdit}
                    submitText={"Edit"}
                    submitIcon={<EditIcon />}
                />
            </Box>
        </Modal>
    );
};

export default EditUserModal;
