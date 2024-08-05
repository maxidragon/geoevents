import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface PaginationFooterProps {
    page: number;
    totalPages: number;
    totalItems: number;
    handlePageChange: (page: number) => void;
}

const PaginationFooter = ({
    page,
    totalPages,
    totalItems,
    handlePageChange,
}: PaginationFooterProps) => {
    const [isPreviousPageDisabled, setIsPreviousPageDisabled] =
        useState<boolean>(false);
    const [isNextPageDisabled, setIsNextPageDisabled] =
        useState<boolean>(false);

    useEffect(() => {
        setIsPreviousPageDisabled(page === 1);
        setIsNextPageDisabled(page === totalPages);
    }, [page, totalPages]);

    const nextPage = (): void => {
        if (page < totalPages) {
            handlePageChange(page + 1);
        }
    };
    const previousPage = (): void => {
        if (page > 1) {
            handlePageChange(page - 1);
        }
    };

    return (
        <TableRow>
            <TableCell
                colSpan={3}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    borderBottom: "none",
                }}
            >
                <IconButton
                    onClick={previousPage}
                    disabled={isPreviousPageDisabled}
                    role="button"
                    aria-label="previousPageButton"
                >
                    <NavigateBeforeIcon />
                </IconButton>
                <Typography>
                    Page {page} of {totalPages}
                </Typography>
                <IconButton
                    onClick={nextPage}
                    disabled={isNextPageDisabled}
                    role="button"
                    aria-label="nextPageButton"
                >
                    <NavigateNextIcon />
                </IconButton>
                <Typography>Total items: {totalItems}</Typography>
            </TableCell>
        </TableRow>
    );
};

export default PaginationFooter;
