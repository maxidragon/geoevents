import { Link, Typography } from "@mui/material";

import { IEvent } from "@/logic/interfaces";
import { formatDateRange } from "@/logic/utils";

interface BasicInformationProps {
    eventData: IEvent;
}

const BasicInformation = ({ eventData }: BasicInformationProps) => {
    return (
        <>
            <Typography variant="body1">
                Date:{" "}
                {formatDateRange(
                    new Date(eventData.startDate),
                    new Date(eventData.endDate)
                )}
            </Typography>
            <Typography variant="body1">
                Location: {eventData.address}
            </Typography>
            <Typography variant="body1">
                Organizers:{" "}
                {eventData.organizers.map((o) => o.username).join(", ")}
            </Typography>
            {eventData.map && (
                <Typography variant="body1">
                    Map:{" "}
                    <Link href={eventData.map.url} target="_blank">
                        {eventData.map.name}
                    </Link>
                </Typography>
            )}
        </>
    );
};

export default BasicInformation;
