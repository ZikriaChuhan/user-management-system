"use client";
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Trash, Eye, PencilLine } from "lucide-react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger,
    Dropdown, DropdownMenu, DropdownItem, Chip, Tooltip, User, Pagination
} from "@heroui/react";
import Link from "next/link";

export const columns = [
    { name: "Name", uid: "name", sortable: true },
    { name: "Email", uid: "email", sortable: true },
    { name: "Role", uid: "role", sortable: true },
    { name: "Actions", uid: "actions" },
];

export const statusOptions = [
    { name: "Admin", uid: "admin" },
    { name: "Employee", uid: "employee" },
];

const statusColorMap = {
    admin: "success",
    employee: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "role", "actions"];

export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const pages = Math.ceil(users.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    useEffect(() => {
        fetchTableUsers();
    }, []);
    const fetchTableUsers = async () => {
        try {
            const response = await fetch("/api/users");
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.role),
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "full", size: "sm", src: user.image }}
                        classNames={{
                            description: "text-default-500",
                        }}
                        name={cellValue}
                    >
                        {user.name}
                    </User>
                );
            case "email":
                return cellValue;
            case "role":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[user.role]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center justify-center gap-2">
                        <Tooltip content="View">
                            <Link href={`/user/${user._id}`}>
                                <span className="text-lg text-default-400 hover:text-default-600 cursor-pointer active:opacity-50">
                                    <Eye className="size-4" />
                                </span>
                            </Link>
                        </Tooltip>
                        <Tooltip content="Edit">
                            <Link href={`/admin/edit-user/${user._id}`}>
                                <span className="text-lg text-default-400 hover:text-default-600 cursor-pointer active:opacity-50">
                                    <PencilLine className="size-4" />
                                </span>
                            </Link>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteUser(user._id)}>
                                <Trash className="size-4" />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const handleDeleteSelected = async () => {
        const updatedUsers = users.filter((user) => !selectedKeys.has(user._id));
        setUsers(updatedUsers);
        setSelectedKeys(new Set([]));
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setUsers(users.filter((user) => user._id !== userId));
                fetchTableUsers();

            } else {
                console.error("Error deleting user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<Search className="text-default-300 size-4 " />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDown className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDown className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {column.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            className="bg-foreground text-background"
                            startContent={<Trash className="size-4" />}
                            size="sm"
                            onClick={handleDeleteSelected}
                            isDisabled={selectedKeys.size === 0}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, users.length, selectedKeys]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${items.length} selected`}
                </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            isCompact
            aria-label="User table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            checkboxesProps={{
                classNames: {
                    wrapper: "after:bg-foreground after:text-background text-background",
                },
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item._id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}