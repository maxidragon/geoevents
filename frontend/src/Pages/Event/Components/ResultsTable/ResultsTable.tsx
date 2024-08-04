import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import { QualificationResult } from "@/logic/interfaces";

import ResultRow from "./ResultRow";

interface ResultsTableProps {
    qualificationResults: QualificationResult[];
    editable?: boolean;
    onEdit?: (result: QualificationResult) => void;
    proceedFromQualifications: number;
    fetchData?: () => void;
}

const ResultsTable = ({
    qualificationResults,
    editable = false,
    proceedFromQualifications,
    onEdit,
    fetchData,
}: ResultsTableProps) => {
    return (
        <TableContainer component={Paper}>
            <Table
                sx={{
                    overflowY: "auto",
                    maxHeight: "80vh",
                }}
                size="small"
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: 30, textAlign: "center" }}>
                            #
                        </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Max. score</TableCell>
                        <TableCell>Total time</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                            Total score
                        </TableCell>
                        {editable && <TableCell>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {qualificationResults.map((result, pos: number) => (
                        <ResultRow
                            key={result.id}
                            result={result}
                            pos={pos + 1}
                            editable={editable}
                            proceedFromQualifications={
                                proceedFromQualifications
                            }
                            onEdit={onEdit}
                            fetchData={fetchData}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ResultsTable;
