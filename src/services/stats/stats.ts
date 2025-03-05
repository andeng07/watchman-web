// Define the types for the request and response
import { Constants } from "@/services/util/constants.ts";

export interface InteractionLogCount {
    date: string; // "dd MMM" format
    entryCount: number;
    exitCount: number;
    unauthorizedCount: number;
    fallbackCount: number;
    totalCount: number; // New field for total count
}

export interface GetInteractionLogsMonthlyStatsRequest {
    userIds: string[] | null; // GUIDs as strings
    readerIds?: string[] | null; // GUIDs as strings
}

export interface GetInteractionLogsMonthlyStatsResponse {
    dailyInteractionLogsCount: InteractionLogCount[];
}

// POST request for fetching interaction stats
export const getInteractionLogsMonthlyStats = async (
    request: GetInteractionLogsMonthlyStatsRequest
): Promise<GetInteractionLogsMonthlyStatsResponse> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + "/stats/interactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch interaction stats");
    }

    const data: GetInteractionLogsMonthlyStatsResponse = await response.json();

    // Add totalCount calculation for each interaction log entry
    data.dailyInteractionLogsCount = data.dailyInteractionLogsCount.map(log => ({
        ...log,
        totalCount: log.entryCount + log.exitCount + log.unauthorizedCount + log.fallbackCount,
    }));

    return data;
};
