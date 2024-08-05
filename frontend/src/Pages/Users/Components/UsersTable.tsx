import {
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
} from "@mui/material";

import PaginationFooter from "@/Components/PaginationFooter";
import { UserInfo } from "@/logic/interfaces";

import UserRow from "./UserRow";

interface UsersTableProps {
    users: UserInfo[];
    page: number;
    totalPages: number;
    totalItems: number;
    handlePageChange: (page: number) => void;
    fetchData: (pageParam?: number, searchParam?: string) => void;
    loading: boolean;
}

const UsersTable = ({
    users,
    page,
    totalPages,
    totalItems,
    handlePageChange,
    fetchData,
    loading,
}: UsersTableProps) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading && <LinearProgress sx={{ width: "100vw" }} />}
                    {users.length > 0 &&
                        users.map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                fetchData={fetchData}
                            />
                        ))}
                </TableBody>
                {totalPages > 0 && (
                    <TableFooter>
                        <PaginationFooter
                            page={page}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            handlePageChange={handlePageChange}
                        />
                    </TableFooter>
                )}
            </Table>
        </TableContainer>
    );
};

export default UsersTable;
