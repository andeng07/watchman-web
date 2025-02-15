import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Function to generate days of the current month
const generateMonthlyData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get last day of month

    return Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`, // Day of the month
        value: Math.floor(Math.random() * 1000), // Replace with actual data
    }));
};

const data = generateMonthlyData();

export default function MonthlyInteractionChart({type, id} : { type: "users" | "readers" | "locations" | "departments" | "overall", id: string | null }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid  vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground)"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    dataKey="value"
                    stroke="hsl(var(--muted-foreground)"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="value" fill={"hsl(var(--primary)"} radius={[3, 3, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
