import {useEffect, useState} from 'react';
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid} from "recharts";
import {GetInteractionLogsMonthlyStatsRequest, InteractionLogCount} from "@/services/stats/stats";
import {getInteractionLogsMonthlyStats} from "@/services/stats/stats";

interface MonthlyInteractionChartProps {
    type: "users" | "readers" | "overall";
    id: string | null;
    activeBars: { [key: string]: boolean }; // To control visibility of each bar
}

export default function MonthlyInteractionChart({type, id, activeBars}: MonthlyInteractionChartProps) {
    const [data, setData] = useState<InteractionLogCount[]>([]); // Default empty data for initialization

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request: GetInteractionLogsMonthlyStatsRequest = {
                    userIds: type === "users" && id ? [id] : null,
                    readerIds: type === "readers" && id ? [id] : null,
                };

                const response = await getInteractionLogsMonthlyStats(request);

                // Update chart data based on the response logs
                const updatedData = response.dailyInteractionLogsCount;

                setData(updatedData); // Update chart data state
            } catch (error) {
                console.error(error);
                setData([]); // Reset to default data in case of error
            }
        };

        fetchData();
    }, [type, id]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid vertical={false}/>
                <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis
                    dataKey=""
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <Tooltip/>


                {activeBars.entryCount && (
                    <Bar dataKey="entryCount" stackId="a" fill="hsl(139, 65%, 40%, 0.9)" name="Entry"/>
                )}
                {activeBars.exitCount && (
                    <Bar dataKey="exitCount" stackId="a" fill="hsl(140, 74%, 60%, 0.8)" name="Exit"/>
                )}
                {activeBars.unauthorizedCount && (
                    <Bar dataKey="unauthorizedCount" stackId="b" fill="hsl(0, 0%, 40%, 0.8)" name="Unauthorized"/>
                )}
                {activeBars.fallbackCount && (
                    <Bar dataKey="fallbackCount" stackId="b" fill="hsl(0, 0%, 50%, 0.8)" name="Fallback"/>
                )}

                {activeBars.totalCount && (
                    <Bar dataKey="totalCount" fill="hsl(139, 65%, 40%, 0.9)" name="Interaction" radius={[5,5,5,5]}/>
                )}


            </BarChart>
        </ResponsiveContainer>
    );
}
