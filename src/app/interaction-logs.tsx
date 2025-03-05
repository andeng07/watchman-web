import { useEffect, useState } from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {InteractionLogsPaginatedFilterRequest} from "@/services/interaction/interaction.ts";
import SearchFilter from "@/components/search-dropdown.tsx";
import { getLogUsers, LogUser, LogUserFilter } from "@/services/user/user.ts";
import {getReaders, Reader, ReaderFilter} from "@/services/reader/reader.ts";
import LogsTable from "@/components/logs-table.tsx";
import CustomDatePicker from "@/components/date-picker.tsx";

export default function InteractionLogsPage() {
    const [filter, setFilter] = useState<InteractionLogsPaginatedFilterRequest>({
        page: 1,
        pageSize: 20,
        userIds: null,
        readerIds: null,
        from: null,
        to: null,
        interactionTypes: null
    });

    const [selectedUsers, setSelectedUsers] = useState<LogUser[]>([]);

    const userFilterFunction = async (query: string) => {
        const userFilter: LogUserFilter = {
            page: 1,
            pageSize: 10,
            expired: null,
            nameSearchTerm: query,
            cardIdSearchTerm: null,
            schoolIdSearchTerm: null,
            affiliations: null,
            sexes: null,
            departments: null,
        };

        return (await getLogUsers(userFilter)).items;
    };

    const [selectedReaders, setSelectedReaders] = useState<Reader[]>([]);

    const readerFilterFunction = async (query: string) => {
        const userFilter: ReaderFilter = {
            page: 1,
            pageSize: 10,
            searchTerm: query,
            locations: null
        };

        return (await getReaders(userFilter)).items;
    };

    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    // Effect to update the filter when selectedUsers changes
    useEffect(() => {
        setFilter((prev) => ({
            ...prev,
            userIds: selectedUsers.length > 0 ? selectedUsers.map(user => user.id) : null,
            readerIds: selectedReaders.length > 0 ? selectedReaders.map(reader => reader.id) : null,
            from: fromDate ? new Date(fromDate.setHours(0, 0, 0, 0)).toISOString() : null,
            to: toDate ? new Date(toDate.setHours(23, 59, 59, 999)).toISOString() : null,
        }));
    }, [selectedUsers, selectedReaders, fromDate, toDate]);

    return (
        <div className="py-10 px-3 flex flex-col gap-10 md:p-10 lg:p-10">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-primary font-bold text-4xl">Interaction Logs</h1>
                <blockquote className="px-5 text-gray-400">
                    Showcasing recent logs made within the system.
                </blockquote>
            </div>

            <Card>
                <CardHeader className="border-b border-gray-400">
                    <div className="flex flex-col lg:flex-row md:flex-row justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <SearchFilter
                                searchLabel="User Name Filter"
                                fetchFunction={userFilterFunction}
                                getKey={(user) => user.id ?? ""}
                                getLabel={(user) => user.firstName + " " + user.lastName}
                                getDescription={(_) => ""}
                                selected={selectedUsers}
                                setSelected={setSelectedUsers} />
                            <SearchFilter
                                searchLabel="Reader Name Filter"
                                fetchFunction={readerFilterFunction}
                                getKey={(reader) => reader.id ?? ""}
                                getLabel={(reader) => reader.name}
                                getDescription={(_) => ""}
                                selected={selectedReaders}
                                setSelected={setSelectedReaders} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <CustomDatePicker placeholder="Date From" selectedDate={fromDate} setSelectedDate={setFromDate} />
                            <CustomDatePicker placeholder="Date To" selectedDate={toDate} setSelectedDate={setToDate} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="">
                    <LogsTable tableProps={{
                        id: false,
                        logReader: true,
                        logUser: true,
                        cardId: true,
                        interactionType: true,
                        dateTime: true
                    }} filter={filter} />
                </CardContent>
            </Card>
        </div>
    );
}
