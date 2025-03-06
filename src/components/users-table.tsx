import {useEffect, useState} from "react";
import {PaginationComponent} from "@/components/pagination.tsx";
import {deleteLogUser, getLogUsers, LogUser, LogUserFilter} from "@/services/user/user.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {UserPreviewDialog} from "@/components/user-content-dialog.tsx";
import DateBadge from "@/components/date-badge.tsx";
import {Department, getDepartment} from "@/services/user/department/department.ts";
import {Button} from "@/components/ui/button.tsx";
import {NewUserAlertDialog} from "@/components/create-user-dialog.tsx";

const tableConfig = {
    columns: {
        id: {label: "ID"},
        fullName: {label: "Full Name"},
        cardId: {label: "Card ID"},
        schoolId: {label: "School ID"},
        affiliation: {label: "Affiliation"},
        sex: {label: "Sex"},
        department: {label: "Department"},
        accessExpiry: {label: "Access Expiry"},
        actions: {label: "Actions"},
    }
};

export default function UsersTable({tableProps, filter}: {
    tableProps: {
        id: boolean,
        fullName: boolean,
        cardId: boolean,
        schoolId: boolean,
        affiliation: boolean,
        sex: boolean,
        department: boolean,
        accessExpiry: boolean,
        actions: boolean
    },
    filter: LogUserFilter
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState<{ user: LogUser, department: Department }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch users first
            const user = await getLogUsers({...filter, page: currentPage});

            // Assuming user has an ID or another property to fetch departments for
            const departments = await Promise.all(user.items.map(async (userItem) => {
                const department = await getDepartment(userItem.department ?? ""); // Pass individual user for department fetch
                return {user: userItem, department}; // Return user with department
            }));

            setTotalPages(Math.ceil(user.totalRecords / filter.pageSize));
            setData(departments); // Update state with both user and department
        };

        fetchData();
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
                    {data.map((data) => {
                        const expiryDate = new Date(data.user.accessExpiry);

                        const currentDate = new Date();

                        return (
                            <TableRow key={data.user.id}>
                                {tableProps.id && <TableCell>{data.user.id}</TableCell>}
                                {tableProps.fullName && (
                                    <TableCell>
                                        <UserPreviewDialog user={data.user}/>
                                    </TableCell>
                                )}
                                {tableProps.cardId && <TableCell>{data.user.cardId}</TableCell>}
                                {tableProps.schoolId && <TableCell>{data.user.schoolId}</TableCell>}
                                {tableProps.affiliation && (
                                    <TableCell>
                                        {data.user.affiliation === 0 ? 'Student' :
                                            data.user.affiliation === 1 ? 'Faculty' :
                                                data.user.affiliation === 2 ? 'Staff' : 'Administrator'}
                                    </TableCell>
                                )}
                                {tableProps.sex && <TableCell>{data.user.sex === 0 ? "Male" : "Female"}</TableCell>}
                                {tableProps.department && <TableCell>{data.department.name}</TableCell>}
                                {tableProps.accessExpiry && (
                                    <TableCell>
                                        <DateBadge
                                            variant={expiryDate >= currentDate ? "entry" : "exit"}
                                            dateTime={data.user.accessExpiry}
                                        />
                                    </TableCell>
                                )}
                                {tableProps.actions && <TableCell>
                                    <div className="flex gap-2 justify-center">
                                        <NewUserAlertDialog trigger={<Button variant={"outline"}>Edit</Button>}
                                                            userProps={data.user}/>
                                        <Button variant={"destructive"}
                                                onClick={() => deleteLogUser(data.user.id)}>Delete</Button>
                                    </div>
                                </TableCell>}
                            </TableRow>
                        );
                    })}
                </TableBody>

            </Table>

            <PaginationComponent totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </div>
    );
}
