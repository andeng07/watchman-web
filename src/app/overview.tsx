import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import MonthlyInteractionChart from "@/components/interaction-chart.tsx";
import LogsTable from "@/components/logs.tsx";

// name, department, affiliation, reader name, location name

export default function OverviewPage() {
    const navigate = useNavigate();

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
                    <MonthlyInteractionChart type={"overall"} id={null}></MonthlyInteractionChart>
                </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-3 lg:col-span-2">
                <CardHeader className="border-b">
                    <CardTitle>
                        <button className="hover:underline text-primary"
                                onClick={() => navigate("/dashboard/users")}>Total Users
                        </button>
                    </CardTitle>
                </CardHeader>
            </Card>

            <Card className="col-span-1 md:col-span-3 lg:col-span-2">
                <CardHeader className="border-b">
                    <CardTitle>
                        <button className="hover:underline text-primary"
                                onClick={() => navigate("/dashboard/readers")}>Total Readers
                        </button>
                    </CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-full lg:col-span-5">
                <CardHeader className="border-b">
                    <CardTitle>
                        <button className="hover:underline text-primary"
                                onClick={() => navigate("/dashboard/sessions")}>Active Sessions
                        </button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LogsTable size={10} page={20}></LogsTable>
                </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-full lg:col-span-5">
                <CardHeader className="border-b">
                    <CardTitle>
                        <button className="hover:underline text-primary"
                                onClick={() => navigate("/dashboard/interactions")}>Recent Interactions
                        </button>
                    </CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
        </div>
    );
}


/*

            <div className="flex flex-wrap">
                <Card className="lg:col-span-2 md:col-span-4 sm:col-span-4">
                    <CardHeader className="border">
                        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                            <CardTitle><button className="hover:underline" onClick={() => navigate("/dashboard/logs")}>Recent Logs</button></CardTitle>
                            <CardDescription>
                                Showing total visitors for the last 3 months
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <LogsTable amount={5} page={1}/>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2 md:col-span-4 sm:col-span-4">
                    <CardContent>
                        <Component/>
                    </CardContent>
                </Card>
                <div className="lg:col-span-4 md:col-span-4 sm:col-span-4">
                    <Component2></Component2>
                </div>
            </div>
 */