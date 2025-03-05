import {useEffect, useState} from "react";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import {PaginationComponent} from "@/components/pagination.tsx";
import {
    getInteractionLogs,
    InteractionLog,
    InteractionLogsPaginatedFilterRequest,
    InteractionType
} from "@/services/interaction/interaction.ts";
import {getReader, Reader} from "@/services/reader/reader.ts";
import {getLogUser, LogUser} from "@/services/user/user.ts";
import {Badge} from "@/components/ui/badge";
import {UserPreviewDialog} from "@/components/user-content-dialog.tsx";
import {ReaderPreviewDialog} from "@/components/reader-content-dialog.tsx";
import DateBadge from "@/components/date-badge.tsx";

const tableConfig = {
    columns: {
        id: {label: "ID"},
        logReader: {label: "Reader"},
        logUser: {label: "User"},
        cardId: {label: "Card Id"},
        interactionType: {label: "Type"},
        dateTime: {label: "Date & Time"}
    }
}

export default function LogsTable({tableProps, filter}: {
    tableProps: {
        id: boolean,
        logReader: boolean,
        logUser: boolean,
        cardId: boolean,
        interactionType: boolean,
        dateTime: boolean
    },
    filter: InteractionLogsPaginatedFilterRequest
}) {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<{
        items: InteractionLog[];
        users: Record<string, LogUser | null>;
        readers: Record<string, Reader | null>;
    }>({
        items: [],
        users: {},
        readers: {}
    });

    useEffect(() => {
        const fetchLogs = async () => {
            const logs = await getInteractionLogs({ ...filter, page: currentPage });

            setTotalPages(Math.ceil(logs.totalRecords / filter.pageSize));

            // Use a local copy to prevent unnecessary re-renders
            const updatedReaders = { ...data.readers };
            const updatedUsers = { ...data.users };

            const readerPromises: Record<string, Promise<Reader>> = {};
            const userPromises: Record<string, Promise<LogUser | null>> = {};

            console.log(logs.items)

            // Collect unique missing reader and user IDs
            for (const log of logs.items) {
                if (!updatedReaders[log.logReaderId] && !readerPromises[log.logReaderId]) {
                    readerPromises[log.logReaderId] = getReader(log.logReaderId);
                }
                if (log.logUserId && !updatedUsers[log.logUserId] && !userPromises[log.logUserId]) {
                    userPromises[log.logUserId] = getLogUser(log.logUserId);
                }
            }

            // Fetch missing readers and users in parallel
            const fetchedReaders = await Promise.all(
                Object.entries(readerPromises).map(async ([id, promise]) => {
                    return [id, await promise] as [string, Reader];
                })
            );

            const fetchedUsers = await Promise.all(
                Object.entries(userPromises).map(async ([id, promise]) => {
                    return [id, await promise] as [string, LogUser | null];
                })
            );

            // Store fetched readers and users
            for (const [id, reader] of fetchedReaders) {
                updatedReaders[id] = reader;
            }

            for (const [id, user] of fetchedUsers) {
                updatedUsers[id] = user;
            }

            // Update logs with cached readers/users
            const updatedLogs = logs.items.map((log) => ({
                ...log,
                logReader: updatedReaders[log.logReaderId],
                logUser: log.logUserId ? updatedUsers[log.logUserId] : null
            }));

            // Update state once, avoiding unnecessary re-renders
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
            {/* Table */}
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
                                    {data.readers[log.logReaderId!]
                                        ? <ReaderPreviewDialog reader={data.readers[log.logReaderId!]!}></ReaderPreviewDialog>
                                        : "N/A"}
                                </TableCell>
                            )}
                            {tableProps.logUser && (
                                <TableCell>
                                    {data.users[log.logUserId ?? ""]
                                        ? <UserPreviewDialog user={data.users[log.logUserId!]!}></UserPreviewDialog>
                                        : "N/A"}
                                </TableCell>
                            )}
                            {tableProps.cardId && <TableCell>{log.cardId}</TableCell>}
                            {tableProps.interactionType && (
                                <TableCell>
                                    <Badge className="text-sm px-2 py-1" variant={(() => {
                                        switch (log.interactionType) {
                                            case InteractionType.Entry:
                                                return 'entry'; // Map to 'default' for 'Entry'
                                            case InteractionType.Exit:
                                                return 'exit'; // Map to 'outline' for 'Exit'
                                            case InteractionType.Unauthorized:
                                                return 'unauthorized'; // Badge for 'Unauthorized'
                                            case InteractionType.Fallback:
                                                return 'fallback'; // Badge for 'Fallback'
                                            default:
                                                return 'outline'
                                        }
                                    })()}
                                    >
                                        {(() => {
                                            switch (log.interactionType) {
                                                case InteractionType.Entry:
                                                    return 'Entry';
                                                case InteractionType.Exit:
                                                    return 'Exit';
                                                case InteractionType.Unauthorized:
                                                    return 'Unauthorized';
                                                case InteractionType.Fallback:
                                                    return 'Fallback';
                                                default:
                                                    return 'Unknown';
                                            }
                                        })()}
                                    </Badge>
                                </TableCell>
                            )}
                            {tableProps.dateTime && (
                                <TableCell>
                                    <DateBadge variant="outline" dateTime={log.dateTime}></DateBadge>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


            {/* Pagination Component */}
            <PaginationComponent totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
}
