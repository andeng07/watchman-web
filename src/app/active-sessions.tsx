import { useEffect, useState } from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import ActiveSessionsTable from "@/components/active-sessions-table.tsx";
import { PaginatedFilterRequest } from "@/services/interaction/interaction.ts";
import SearchFilter from "@/components/search-dropdown.tsx";
import { getLogUsers, LogUser, LogUserFilter } from "@/services/user/user.ts";
import {getReaders, Reader, ReaderFilter} from "@/services/reader/reader.ts";

export default function ActiveSessionPage() {
    const [filter, setFilter] = useState<PaginatedFilterRequest>({
        page: 1,
        pageSize: 20,
        userIds: null,
        readerIds: null,
        from: null,
        to: null
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


    // Effect to update the filter when selectedUsers changes
    useEffect(() => {
        setFilter((prev) => ({
            ...prev,
            userIds: selectedUsers.length > 0 ? selectedUsers.map(user => user.id) : null,
            readerIds: selectedReaders.length > 0 ? selectedReaders.map(reader => reader.id) : null
        }));
    }, [selectedUsers, selectedReaders]);

    return (
        <div className="py-10 px-3 flex flex-col gap-10 md:p-10 lg:p-10">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-primary font-bold text-4xl">Active Sessions</h1>
                <blockquote className="px-5 text-gray-400">
                    Showcasing a list of the people that are currently active.
                </blockquote>
            </div>

            <Card>
                <CardHeader className="border-b border-gray-400">
                    <div>
                        <SearchFilter
                            searchLabel="User Name Filter"
                            fetchFunction={userFilterFunction}
                            getKey={(user) => user.id ?? ""}
                            getLabel={(user) => user.firstName + " " + user.lastName}
                            getDescription={(_) => ""}
                            selected={selectedUsers}
                            setSelected={setSelectedUsers}
                        />
                    </div>
                    <div>
                        <SearchFilter
                            searchLabel="Reader Name Filter"
                            fetchFunction={readerFilterFunction}
                            getKey={(reader) => reader.id ?? ""}
                            getLabel={(reader) => reader.name}
                            getDescription={(_) => ""}
                            selected={selectedReaders}
                            setSelected={setSelectedReaders}
                        />
                    </div>
                </CardHeader>
                <CardContent className="">
                    <ActiveSessionsTable tableProps={{
                        id: false,
                        logReader: true,
                        logUser: true,
                        startDate: true,
                        timeElapsed: true
                    }} filter={filter} />
                </CardContent>
            </Card>
        </div>
    );
}
