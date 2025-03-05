import {useEffect, useState} from "react";
import {Card, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import LogsTable from "@/components/logs-table.tsx";
import {
    getActiveSessions,
    getInteractionLogs, getSessions,
    InteractionLogsPaginatedFilterRequest,
    PaginatedFilterRequest
} from "@/services/interaction/interaction.ts";
import SessionsTable from "@/components/sessions-table.tsx";
import ActiveSessionsTable from "@/components/active-sessions-table.tsx";

// Tab Configuration
const tabConfig = {
    logs: {label: "Logs", count: 0},
    sessions: {label: "Sessions", count: 0},
    activeSessions: {label: "Active Sessions", count: 0}
};

// Define Props
interface ActivityOverviewProps {
    tabsToShow?: {
        logs?: boolean;
        sessions?: boolean;
        activeSessions?: boolean;
    };
    className?: string;
    size: number,
    type: "users" | "readers" | null;
    id: string | null;// Added className prop
}

// TODO add type
export default function Activities({
                                       tabsToShow = {logs: true, sessions: true, activeSessions: true},
                                       size,
                                       className,
                                       type,
                                       id
                                   }: ActivityOverviewProps) {
    // Filter active tabs
    const availableTabs = Object.entries(tabsToShow)
        .filter(([_, show]) => show) // Keep only enabled tabs
        .map(([key]) => key as keyof typeof tabConfig);

    const [activeTab, setActiveTab] = useState(availableTabs[0] || "logs"); // Default to first available tab
    const [tabCounts, setTabCounts] = useState({
        logs: 0,
        sessions: 0,
        activeSessions: 0
    });
    const [logInteractionFilter, setLogInteractionFilter] = useState<InteractionLogsPaginatedFilterRequest>()

    useEffect(() => {
        const fetchTabCounts = async () => {
            const logRequest: InteractionLogsPaginatedFilterRequest = {
                page: 0,
                pageSize: 0,
                userIds: type === "users" && id ? [id] : null,
                readerIds: type === "readers" && id ? [id] : null,
                from: null,
                to: null,
                interactionTypes: null
            };

            const logs = await getInteractionLogs(logRequest);

            setLogInteractionFilter(logRequest)

            const sessionRequest: PaginatedFilterRequest = {
                page: 0,
                pageSize: 0,
                userIds: type === "users" && id ? [id] : null,
                readerIds: type === "readers" && id ? [id] : null,
                from: null,
                to: null
            }

            const sessions = await getSessions(sessionRequest);
            const activeSessions = await getActiveSessions(sessionRequest);

            setTabCounts(prevCounts => ({
                ...prevCounts,
                logs: logs.totalRecords,
                sessions: sessions.totalRecords,
                activeSessions: activeSessions.totalRecords
            }));
        };

        fetchTabCounts();
    }, [id, type]);

    return (
        <Card className={className}>  {/* Pass className to Card */}
            <div className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                {/* Title & Description */}
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="text-primary">{tabConfig[activeTab].label} Overview</CardTitle>
                    <CardDescription>Monitoring the overview of recent {tabConfig[activeTab].label}.</CardDescription>
                </div>

                {/* Tabs */}
                <div className="flex">
                    {availableTabs.map((tab) => (
                        <button
                            key={tab}
                            data-active={activeTab === tab}
                            className="text-primary text-center relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 border-l
                         data-[active=true]:bg-muted sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                            onClick={() => setActiveTab(tab)}
                        >
                            <span className="text-lg font-bold leading-none sm:text-3xl">
                                {tabCounts[tab].toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">{tabConfig[tab].label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <CardContent className="p-6">
                {activeTab === "logs" && <LogsTable tableProps={
                    {
                        id: false,
                        logReader: !(type == "readers"),
                        logUser: !(type == "users"),
                        cardId: true,
                        interactionType: true,
                        dateTime: true
                    }
                } filter={{
                    ...(logInteractionFilter ?? {
                        page: 0,
                        pageSize: 0,
                        userIds: null,
                        readerIds: null,
                        from: null,
                        to: null,
                        interactionTypes: null,
                    }),
                    page: 1,
                    pageSize: size,
                }}></LogsTable>}
                {activeTab === "sessions" && <SessionsTable tableProps={
                    {
                        id: false,
                        logReader: !(type == "readers"),
                        logUser: !(type == "users"),
                        startDate: true,
                        endDate: true,
                        timeElapsed: true
                    }
                } filter={{
                    ...(logInteractionFilter ?? {
                        page: 0,
                        pageSize: 0,
                        userIds: null,
                        readerIds: null,
                        from: null,
                        to: null
                    }),
                    page: 1,
                    pageSize: size,
                } as InteractionLogsPaginatedFilterRequest}></SessionsTable>}
                {activeTab === "activeSessions" && <ActiveSessionsTable tableProps={
                    {
                        id: false,
                        logReader: !(type == "readers"),
                        logUser: !(type == "users"),
                        startDate: true,
                        timeElapsed: true
                    }
                } filter={{
                    ...(logInteractionFilter ?? {
                        page: 0,
                        pageSize: 0,
                        userIds: null,
                        readerIds: null,
                        from: null,
                        to: null
                    }),
                    page: 1,
                    pageSize: size,
                } as InteractionLogsPaginatedFilterRequest}></ActiveSessionsTable>}
            </CardContent>
        </Card>
    );
}
