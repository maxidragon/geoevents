import { Box, TextField, Typography } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { UserInfo } from "@/logic/interfaces";
import { getUsers } from "@/logic/user";

import UsersTable from "./Components/UsersTable";

const Users = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(
        async (pageParam?: number, searchParam?: string) => {
            const data = await getUsers(pageParam || 1, searchParam || search);

            setTotalItems(data.totalItems);
            setTotalPages(data.totalPages);
            setPage(pageParam || 1);
            setUsers(data.users);
            setLoading(false);
        },
        [search]
    );

    const handlePageChange = async (pageParam: number) => {
        setLoading(true);
        await fetchData(pageParam, search);
    };

    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setLoading(true);
        await fetchData(1, event.target.value);
    };

    useEffect(() => {
        setTotalPages(1);
        setPage(1);
        fetchData(1, search);
    }, [fetchData, search]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <Typography variant="h4">Manage users</Typography>
            <TextField
                label="Search"
                sx={{
                    width: {
                        xs: "100%",
                        sm: "30%",
                    },
                }}
                value={search}
                onChange={handleSearch}
            />
            {users.length > 0 || loading ? (
                <UsersTable
                    users={users}
                    page={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    handlePageChange={handlePageChange}
                    fetchData={fetchData}
                    loading={loading}
                />
            ) : (
                <Typography variant="h6">No users found</Typography>
            )}
        </Box>
    );
};

export default Users;
