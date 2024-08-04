import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    TextField,
} from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useState } from "react";

import { isAdmin } from "@/logic/auth";
import { IEvent, UserInfo } from "@/logic/interfaces";
import { searchUsers } from "@/logic/user";

interface EventFormProps {
    eventData: IEvent;
    onSubmit: (event: IEvent) => void;
}

const EventForm = ({ eventData, onSubmit }: EventFormProps) => {
    const [editedEvent, setEditedEvent] = useState<IEvent>(eventData);
    const [users, setUsers] = useState<UserInfo[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedEvent({
            ...editedEvent,
            [event.target.name]: event.target.value,
        });
    };

    const handleDateChange = (date: Moment | null, name: string) => {
        date?.seconds(0).milliseconds(0);
        setEditedEvent({
            ...editedEvent,
            [name]: date?.toISOString() || "",
        });
    };

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEditedEvent({
            ...editedEvent,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSearchUsers = async (search: string) => {
        const data = await searchUsers(search);
        setUsers(data);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(editedEvent);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: { xs: "100%", sm: "40%" },
            }}
        >
            <TextField
                label="ID"
                value={editedEvent.id}
                name="id"
                onChange={handleChange}
            />
            <TextField
                label="Name"
                name="name"
                value={editedEvent.name}
                onChange={handleChange}
            />
            <DatePicker
                label="Start date"
                name="startDate"
                value={moment(editedEvent.startDate)}
                onChange={(date) => handleDateChange(date, "startDate")}
            />
            <DatePicker
                label="End date"
                name="endDate"
                value={moment(editedEvent.endDate)}
                onChange={(date) => handleDateChange(date, "endDate")}
            />
            <DateTimePicker
                label="Registration open"
                name="registrationOpen"
                value={moment(editedEvent.registrationOpen)}
                onChange={(date) => handleDateChange(date, "registrationOpen")}
            />
            <DateTimePicker
                label="Registration close"
                name="registrationClose"
                value={moment(editedEvent.registrationClose)}
                onChange={(date) => handleDateChange(date, "registrationClose")}
            />
            <FormControl>
                <TextField
                    label="Address"
                    name="address"
                    value={editedEvent.address}
                    onChange={handleChange}
                />
                <FormHelperText sx={{ ml: 0, mt: 1 }}>
                    If the event takes place online just type "Online"
                </FormHelperText>
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={editedEvent.useExternalRegistration}
                        name="useExternalRegistration"
                        onChange={handleCheckboxChange}
                    />
                }
                label="Use external registration system"
            />
            {!editedEvent.useExternalRegistration && (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={editedEvent.autoAcceptRegistrations}
                            name="autoAcceptRegistrations"
                            onChange={handleCheckboxChange}
                        />
                    }
                    label="Auto accept registrations"
                />
            )}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={editedEvent.enableQualifications}
                        name="enableQualifications"
                        onChange={handleCheckboxChange}
                    />
                }
                label="Enable qualification phase"
            />
            {editedEvent.enableQualifications && (
                <TextField
                    type="number"
                    label="Proceed from qualifications"
                    name="proceedFromQualifications"
                    value={editedEvent.proceedFromQualifications}
                    onChange={handleChange}
                />
            )}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={editedEvent.enableGroups}
                        name="enableGroups"
                        onChange={handleCheckboxChange}
                    />
                }
                label="Enable group stage"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={editedEvent.enableKnockoutStage}
                        name="enableKnockoutStage"
                        onChange={handleCheckboxChange}
                    />
                }
                label="Enable knockout stage"
            />
            <FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={editedEvent.isPublic}
                            name="isPublic"
                            disabled={!isAdmin()}
                            title="Only admins can manage visibility of events"
                            onChange={handleCheckboxChange}
                        />
                    }
                    label="Public event"
                />
                <FormHelperText sx={{ ml: 0, mt: 1 }} hidden={isAdmin()}>
                    Only admins can manage visibility of events
                </FormHelperText>
            </FormControl>
            <FormControl>
                <Autocomplete
                    multiple
                    options={users}
                    disabled={!isAdmin()}
                    getOptionLabel={(option) =>
                        `${option.fullName} (${option.username})`
                    }
                    onChange={(_, value) =>
                        setEditedEvent({
                            ...editedEvent,
                            organizers: value,
                        })
                    }
                    defaultValue={editedEvent.organizers}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Organizers"
                            onChange={(e) => handleSearchUsers(e.target.value)}
                        />
                    )}
                />
                {!isAdmin() && (
                    <FormHelperText sx={{ ml: 0, mt: 1 }}>
                        Only admins can manage organizers
                    </FormHelperText>
                )}
            </FormControl>
            <Button
                type="submit"
                variant="contained"
                sx={{ width: { xs: "100%", sm: "fit-content" } }}
            >
                Submit
            </Button>
        </Box>
    );
};

export default EventForm;
