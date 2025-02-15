import { useState } from "react";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import LogTable from "@/components/log-table.tsx";

const tabConfig = {
    logs: { label: "Logs", count: 1200 },
    sessions: { label: "Sessions", count: 450 },
    activeSessions: { label: "Active Sessions", count: 30 }
};

// Define Props
interface ActivityOverviewProps {
    tabsToShow?: {
        logs?: boolean;
        sessions?: boolean;
        activeSessions?: boolean;
    };
}

export default function ActivityOverview({ tabsToShow = { logs: true, sessions: true, activeSessions: true } }: ActivityOverviewProps) {
    // Filter active tabs
    const availableTabs = Object.entries(tabsToShow)
        .filter(([_, show]) => show) // Keep only enabled tabs
        .map(([key]) => key as keyof typeof tabConfig);

    const [activeTab, setActiveTab] = useState(availableTabs[0] || "logs"); // Default to first available tab

    return (
        <Card>
            <div className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                {/* Title & Description */}
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="text-primary">Activity Overview</CardTitle>
                    <CardDescription>Monitoring user interactions and activity.</CardDescription>
                </div>

                {/* Tabs */}
                <div className="flex">
                    {availableTabs.map((tab) => (
                        <button
                            key={tab}
                            data-active={activeTab === tab}
                            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left border-l
                         data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                            onClick={() => setActiveTab(tab)}
                        >
                            <span className="text-xs text-muted-foreground">{tabConfig[tab].label}</span>
                            <span className="text-lg font-bold leading-none sm:text-3xl">
                {tabConfig[tab].count.toLocaleString()}
              </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <CardContent className="p-6">
                {activeTab === "logs" && <LogTable size={15} tableProps={
                    {
                        id: true,
                        logReader: true,
                        logUser: true,
                        cardId: true,
                        dateTime: true,
                        interactionType: true
                    }
                }></LogTable>}
                {activeTab === "sessions" && <p>Sessions Content Goes Here</p>}
                {activeTab === "activeSessions" && <p>Active Sessions Content Goes Here</p>}
            </CardContent>
        </Card>
    );
}
