import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { searchEvents } from "@/logic/events";
import { IEvent } from "@/logic/interfaces";

const SearchBar = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<IEvent[]>([]);

    const handleSearch = (search: string) => {
        searchEvents(search).then((data) => {
            setEvents(data);
        });
    };

    return (
        <Autocomplete
            freeSolo
            options={events.map((option) => option.name)}
            onChange={(_, value) => {
                const event = events.find((e) => e.name === value);
                if (event) {
                    navigate(`/events/${event?.id}`);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Search"
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "200px",
                        },
                    }}
                />
            )}
        />
    );
};

export default SearchBar;
