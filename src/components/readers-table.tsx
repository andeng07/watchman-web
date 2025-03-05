import {useEffect, useState} from "react";
import {PaginationComponent} from "@/components/pagination.tsx";
import {getReaders, Reader, ReaderFilter} from "@/services/reader/reader.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {ReaderPreviewDialog} from "@/components/reader-content-dialog.tsx";
import {getLocation} from "@/services/reader/location/location.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

const tableConfig = {
    columns: {
        id: {label: "ID"},
        name: {label: "Reader Name"},
        location: {label: "Location"},
        readPageNav: {label: "Read Page"},
    }
};

export default function ReadersTable({tableProps, filter}: {
    tableProps: {
        id: boolean,
        name: boolean,
        location: boolean,
        readPageNav: boolean
    },
    filter: ReaderFilter
}) {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [readers, setReaders] = useState<Reader[]>([]);
    const [locations, setLocations] = useState<{ [key: string]: string }>({}); // Store location names

    useEffect(() => {
        const fetchReaders = async () => {
            const response = await getReaders({...filter, page: currentPage});
            setTotalPages(Math.ceil(response.totalRecords / filter.pageSize));
            setReaders(response.items);

            // Fetch locations for each reader
            const locationPromises = response.items.map(async (reader) => {
                if (!reader.location) return {id: reader.id, name: "Unassigned"};

                try {
                    const location = await getLocation(reader.location);
                    return {
                        id: reader.id,
                        name: `${location.buildingName} ${location.roomName ?? ""}`.trim(),
                    };
                } catch {
                    return {id: reader.id, name: "Unknown"};
                }
            });

            const resolvedLocations = await Promise.all(locationPromises);
            const locationMap = Object.fromEntries(resolvedLocations.map(loc => [loc.id, loc.name]));
            setLocations(locationMap);
        };

        fetchReaders();
    }, [currentPage, filter, filter.pageSize]);

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Object.entries(tableConfig.columns).map(([key, {label}]) => (
                            tableProps[key as keyof typeof tableConfig.columns] && (
                                <TableHead key={key}>{label}</TableHead>
                            )
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {readers.map((reader) => (
                        <TableRow key={reader.id} >
                            {tableProps.id && <TableCell>{reader.id}</TableCell>}
                            {tableProps.name && (
                                <TableCell><ReaderPreviewDialog reader={reader} /></TableCell>
                            )}
                            {tableProps.location && (
                                <TableCell>{locations[reader.id] ?? "Loading..."}</TableCell>
                            )}
                            { tableProps.readPageNav && (
                                <TableCell><Button variant={"default"} onClick={() => navigate("/read/" + reader.id)}>Go to Read Page</Button></TableCell>
                            ) }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <PaginationComponent totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
}
