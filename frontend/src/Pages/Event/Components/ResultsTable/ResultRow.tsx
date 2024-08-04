import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";

import { QualificationResult } from "@/logic/interfaces";
import { deleteResult } from "@/logic/qualificationResults";
import { timeToString } from "@/logic/timeFormatters";

interface ResultRowProps {
    result: QualificationResult;
    pos: number;
    editable: boolean;
    proceedFromQualifications: number;
    onEdit?: (result: QualificationResult) => void;
    fetchData?: () => void;
}

const ResultRow = ({
    result,
    pos,
    editable,
    proceedFromQualifications,
    onEdit,
    fetchData = () => {},
}: ResultRowProps) => {
    const confirm = useConfirm();
    const proceeded = pos <= proceedFromQualifications;
    const proceededStyling = proceeded
        ? {
              backgroundColor: "#00E676",
              color: "black",
          }
        : {};

    const handleDelete = () => {
        confirm({
            description: `Are you sure you want to delete ${result.registration?.user.fullName}'s result?`,
        })
            .then(async () => {
                const status = await deleteResult(result.id);
                if (status === 204) {
                    enqueueSnackbar("Result deleted", {
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
                enqueueSnackbar("Result not deleted", {
                    variant: "info",
                });
            });
    };

    return (
        <TableRow
            key={result.id}
            sx={{
                "&:last-child td, &:last-child th": {
                    border: 0,
                },
            }}
            hover
        >
            <TableCell
                sx={{
                    textAlign: "center",
                    ...proceededStyling,
                }}
            >
                {pos}
            </TableCell>
            <TableCell>{result.registration?.user.fullName}</TableCell>
            <TableCell>{result.maxScore}</TableCell>
            <TableCell>{timeToString(result.totalTime)}</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>{result.score}</TableCell>
            {editable && (
                <TableCell>
                    <IconButton onClick={() => onEdit?.(result)}>
                        <EditIcon width={8} />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon width={8} />
                    </IconButton>
                </TableCell>
            )}
        </TableRow>
    );
};

export default ResultRow;
