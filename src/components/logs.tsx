import {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {UserPreviewDialog} from "@/components/user-content-dialog.tsx";

// Define TypeScript interface for logs
interface Log {
    id: number;
    user: string;
    reader: string;
    time: string;
    logType: "Entry" | "Exit";
}

// Sample log data
const sampleLogs: Log[] = [
    {id: 1, user: "John Doe", reader: "Main Entrance", time: "2025-02-08 10:30 AM", logType: "Entry"},
    {id: 2, user: "Jane Smith", reader: "Library Gate", time: "2025-02-08 10:45 AM", logType: "Exit"},
    {id: 3, user: "Alice Brown", reader: "Study Hall", time: "2025-02-08 11:00 AM", logType: "Entry"},
];

export default function LogsTable({size, page}: {size: number, page: number}) {
    const [logs] = useState<Log[]>(sampleLogs);

    useEffect(() => {
        // Fetch real logs from backend here (replace with actual API call)
        // Example: fetch("/api/logs").then(res => res.json()).then(data => setLogs(data));
    }, []);

    return (

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold">User</TableHead>
                    <TableHead className="font-bold">Reader</TableHead>
                    <TableHead className="font-bold">Date & Time</TableHead>
                    <TableHead className="font-bold">Log Type</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {logs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell>
                            <UserPreviewDialog userContent={{
                                id: "12345",
                                name: "John Doe",
                                sex: "Male",
                                cardId: "ABC123",
                                department: "Computer Science",
                                affiliation: "Student"
                            }}></UserPreviewDialog>
                        </TableCell>
                        <TableCell>{log.reader}</TableCell>
                        <TableCell>{log.time}</TableCell>
                        <TableCell>
                            <Badge variant={log.logType == "Entry" ? "default" : "destructive"}>
                                {log.logType}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
