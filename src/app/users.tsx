import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UsersTable from "@/components/users-table.tsx";
import SearchFilter2 from "@/components/SearchFilter2.tsx";
import {LogUserFilter} from "@/services/user/user.ts";
import {NewUserAlertDialog} from "@/components/create-user-dialog.tsx";

export default function LogUserPage() {
    const [filter, setFilter] = useState<LogUserFilter>({
        page: 1,
        pageSize: 20,
        nameSearchTerm: null,
        cardIdSearchTerm: null,
        schoolIdSearchTerm: null,
        affiliations: null,
        sexes: null,
        departments: null,
        expired: null, // Added this property
    });

    const [selectedUsers, setSelectedUsers] = useState<string>("");

    useEffect(() => {
        setFilter({
            ...filter,
            nameSearchTerm: selectedUsers
        })
    }, [selectedUsers]);

    return (
        <div className="py-10 px-3 flex flex-col items-center justify-center gap-10 md:p-10 lg:p-10">
            <div className="text-center flex flex-col gap-2">
                <h1 className="text-primary font-bold text-4xl">Log Users</h1>
                <blockquote className="px-5 text-gray-400">Showcasing a list of registered log users.</blockquote>
            </div>

            <NewUserAlertDialog/>

            <Card className="w-full">
                <CardHeader className="border-b border-gray-400">
                    <div className="flex flex-col lg:flex-row md:flex-row justify-between gap-4">
                        <SearchFilter2 searchLabel="Enter User Name" searchValue={selectedUsers} setSearchValue={setSelectedUsers} />
                    </div>
                </CardHeader>
                <CardContent>
                    <UsersTable tableProps={{
                        id: false,
                        cardId: true,
                        schoolId: true,
                        fullName: true,
                        affiliation: true,
                        sex: true,
                        department: true,
                        accessExpiry: true
                    }} filter={filter}/>
                </CardContent>
            </Card>
        </div>
    );
}
