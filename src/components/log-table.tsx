import {useState} from "react";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import {PaginationComponent} from "@/components/pagination.tsx";

// Mock Data
const mockData = Array.from({length: 100}, (_, i) => ({
    Id: crypto.randomUUID(),
    LogReaderId: crypto.randomUUID(),
    DateTime: new Date(Date.now() - Math.random() * 1e10).toLocaleString(),
    Type: i % 2 === 0 ? "Entry" : "Exit",
}));

const tableConfig = {
    columns: {
        id: {label: "ID"},
        logReader: {label: "Reader"},
        logUser: {label: "User"},
        cardId: {label: "Card Id"},
        dateTime: {label: "Log Date & Time"},
        interactionType: {label: "Interaction Type"}
    }
}

export default function LogTable({size, tableProps}: {
    size: number,
    tableProps: {
        id: boolean,
        logReader: boolean,
        logUser: boolean,
        cardId: boolean,
        dateTime: boolean,
        interactionType: boolean
    }
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(mockData.length / size);

    const columnsToShow = Object.entries(tableProps)
        .filter(([_, show]) => show)
        .map(([key]) => key as keyof typeof tableConfig.columns);

    // Slice data for pagination
    const paginatedData = mockData.slice((currentPage - 1) * size, currentPage * size);

    return (
        <div className="space-y-4">
            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            columnsToShow.map((columnKey) => <TableHead>
                                { tableConfig.columns[columnKey].label }
                            </TableHead>)
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableCell>HELLO</TableCell>
                    <TableCell>HELLO</TableCell>
                    <TableCell>HELLO</TableCell>
                </TableBody>
            </Table>

            {/* Pagination Component */}
            <PaginationComponent totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </div>
    );
}
