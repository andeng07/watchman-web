import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import MonthlyInteractionChart from "@/components/interaction-chart.tsx";
import {useEffect, useState} from "react";
import {getLogUsers, LogUserFilter} from "@/services/user/user.ts";
import {getReaders, ReaderFilter} from "@/services/reader/reader.ts";
import Activities from "@/components/activities.tsx";

// name, department, affiliation, reader name, location name

export default function OverviewPage() {
    const navigate = useNavigate();

    const [totalUsers, setTotalUsers] = useState(0)
    const [totalReaders, setTotalReaders] = useState(0)

    useEffect(() => {
        const fetchUsers = async () => {
            const userFilter: LogUserFilter = {
                page: 0,
                pageSize: 0,
                expired: null,
                nameSearchTerm: null,
                cardIdSearchTerm: null,
                schoolIdSearchTerm: null,
                affiliations: null,
                sexes: null,
                departments: null,
            };

            try {
                const users = await getLogUsers(userFilter);
                setTotalUsers(users.totalRecords); // Assuming users.totalRecords holds the total count
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchReaders = async () => {
            const readerFilter: ReaderFilter = {
                page: 0,
                pageSize: 0,
                searchTerm: null,
                locations: null,
            }

            try {
                const readers = await getReaders(readerFilter);
                setTotalReaders(readers.totalRecords); // Assuming users.totalRecords holds the total count
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
        fetchReaders();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-10 gap-3 p-3">
            <Card className="col-span-full md:col-span-6 lg:col-span-8 lg:row-span-2">
                <CardHeader className="border-b">
                    <CardTitle>
                        <button className="hover:underline text-primary"
                                onClick={() => navigate("/dashboard/logs")}>Interactions Overview
                        </button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-10">
                    <MonthlyInteractionChart type={"overall"} id={null} activeBars={{
                        entryCount: false,
                        exitCount: false,
                        unauthorizedCount: false,
                        fallbackCount: false,
                        totalCount: true
                    }}></MonthlyInteractionChart>
                </CardContent>
            </Card>

            <Card
                className="col-span-1 md:col-span-3 lg:col-span-2 flex flex-col justify-center items-center text-center min-h-[200px]">
                <CardHeader>
                    <CardTitle className="text-[55px] font-bold text-primary">
                        {totalUsers}
                    </CardTitle>
                    <button className="hover:underline text-primary" onClick={() => navigate("/dashboard/users")}>Total
                        Users
                    </button>
                </CardHeader>
            </Card>

            <Card
                className="col-span-1 md:col-span-3 lg:col-span-2 flex flex-col justify-center items-center text-center min-h-[200px]">
                <CardHeader>
                    <CardTitle className="text-[55px] font-bold text-primary">
                        {totalReaders}
                    </CardTitle>
                    <button className="hover:underline text-primary"
                            onClick={() => navigate("/dashboard/readers")}>Total Readers
                    </button>
                </CardHeader>
            </Card>
            <Activities size={15} type={null} id={null} className="col-span-full"></Activities>
        </div>
    );
}