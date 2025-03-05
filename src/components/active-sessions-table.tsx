import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table.tsx";
import { PaginationComponent } from "@/components/pagination.tsx";
import {ActiveSession, getActiveSessions, PaginatedFilterRequest} from "@/services/interaction/interaction.ts";
import { getReader, Reader } from "@/services/reader/reader.ts";
import { getLogUser, LogUser } from "@/services/user/user.ts";
import { UserPreviewDialog } from "@/components/user-content-dialog.tsx";
import { ReaderPreviewDialog } from "@/components/reader-content-dialog.tsx";
import DateBadge from "@/components/date-badge.tsx";
import {Button} from "@/components/ui/button.tsx";

const tableConfig = {
    columns: {
        id: { label: "ID" },
        logReader: { label: "Reader" },
        logUser: { label: "User" },
        startDate: { label: "Log In" },
        timeElapsed: { label: "Session Time" },
    }
};

// Helper function to calculate time elapsed
const calculateTimeElapsed = (startDate: string, endDate: string | null) => {
    if (!endDate) return "Ongoing";

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInSeconds = Math.floor((end - start) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
};

export default function ActiveSessionsTable({ tableProps, filter }: {
    tableProps: {
        id: boolean,
        logReader: boolean,
        logUser: boolean,
        startDate: boolean,
        timeElapsed: boolean
    },
    filter: PaginatedFilterRequest
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<{
        items: (ActiveSession & { timeElapsed: string })[];
        users: Record<string, LogUser | null>;
        readers: Record<string, Reader | null>;
    }>({
        items: [],
        users: {},
        readers: {}
    });

    useEffect(() => {
        const fetchLogs = async () => {
            const logs = await getActiveSessions({ ...filter, page: currentPage });

            setTotalPages(Math.ceil(logs.totalRecords / filter.pageSize));

            const updatedReaders = { ...data.readers };
            const updatedUsers = { ...data.users };

            const readerPromises: Record<string, Promise<Reader>> = {};
            const userPromises: Record<string, Promise<LogUser | null>> = {};

            for (const log of logs.items) {
                console.log(log.startDate)

                if (!updatedReaders[log.logReaderId] && !readerPromises[log.logReaderId]) {
                    readerPromises[log.logReaderId] = getReader(log.logReaderId);
                }
                if (log.logUserId && !updatedUsers[log.logUserId] && !userPromises[log.logUserId]) {
                    userPromises[log.logUserId] = getLogUser(log.logUserId);
                }
            }

            const fetchedReaders = await Promise.all(
                Object.entries(readerPromises).map(async ([id, promise]) => [id, await promise] as [string, Reader])
            );

            const fetchedUsers = await Promise.all(
                Object.entries(userPromises).map(async ([id, promise]) => [id, await promise] as [string, LogUser | null])
            );

            for (const [id, reader] of fetchedReaders) {
                updatedReaders[id] = reader;
            }
            for (const [id, user] of fetchedUsers) {
                updatedUsers[id] = user;
            }

            const updatedLogs = logs.items.map((log) => ({
                ...log,
                logReader: updatedReaders[log.logReaderId],
                logUser: log.logUserId ? updatedUsers[log.logUserId] : null,
                timeElapsed: calculateTimeElapsed(log.startDate, new Date().toISOString()),
            }));

            setData({
                items: updatedLogs,
                users: updatedUsers,
                readers: updatedReaders
            });
        };

        fetchLogs();
    }, [currentPage, filter, filter.pageSize]);

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Object.entries(tableConfig.columns).map(([key, { label }]) => (
                            tableProps[key as keyof typeof tableConfig.columns] && (
                                <TableHead key={key}>{label}</TableHead>
                            )
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.items.map((log) => (
                        <TableRow key={log.id}>
                            {tableProps.id && <TableCell>{log.id}</TableCell>}
                            {tableProps.logReader && (
                                <TableCell>
                                    {data.readers[log.logReaderId]
                                        ? <ReaderPreviewDialog reader={data.readers[log.logReaderId]!} />
                                        : "N/A"}
                                </TableCell>
                            )}
                            {tableProps.logUser && (
                                <TableCell>
                                    {data.users[log.logUserId ?? ""]
                                        ? <UserPreviewDialog user={data.users[log.logUserId!]!} />
                                        : "N/A"}
                                </TableCell>
                            )}
                            {tableProps.startDate && <TableCell><DateBadge variant="entry" dateTime={log.startDate} /></TableCell>}
                            {tableProps.timeElapsed && <TableCell>{log.timeElapsed}</TableCell>}
                            { (<TableCell><Button variant="destructive">Force Log Out</Button></TableCell>) }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <PaginationComponent totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
}
