import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReadersTable from "@/components/readers-table.tsx";
import SearchFilter2 from "@/components/SearchFilter2.tsx";
import {ReaderFilter} from "@/services/reader/reader.ts";
import {NewReaderAlertDialog} from "@/components/create-reader-dialog.tsx";

export default function LogReaderPage() {
    const [filter, setFilter] = useState<ReaderFilter>({
        page: 1,
        pageSize: 20,
        searchTerm: null,
        locations: null
    });

    const [selectedReaders, setSelectedReaders] = useState<string>("");

    useEffect(() => {
        setFilter({
            ...filter,
            searchTerm: selectedReaders
        });
    }, [selectedReaders]);

    return (
        <div className="py-10 px-3 flex flex-col items-center justify-center gap-10 md:p-10 lg:p-10">
            <div className="text-center flex flex-col gap-2">
                <h1 className="text-primary font-bold text-4xl">Log Readers</h1>
                <blockquote className="px-5 text-gray-400">Showcasing a list of registered log readers.</blockquote>
            </div>

            <NewReaderAlertDialog></NewReaderAlertDialog>

            <Card className="w-full">
                <CardHeader className="border-b border-gray-400">
                    <div className="flex flex-col lg:flex-row md:flex-row justify-between gap-4">
                        <SearchFilter2 searchLabel="Enter Reader Name" searchValue={selectedReaders} setSearchValue={setSelectedReaders} />
                    </div>
                </CardHeader>
                <CardContent>
                    <ReadersTable tableProps={{
                        id: false,
                        name: true,
                        location: true,
                        readPageNav: true
                    }} filter={filter}/>
                </CardContent>
            </Card>
        </div>
    );
}
