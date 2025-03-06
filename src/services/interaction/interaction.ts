// Enum for InteractionType
import {Constants} from "@/services/util/constants.ts";
import {PaginatedResult} from "@/services/util/common.ts";

export enum InteractionType {
    Entry = 0,
    Exit = 1,
    Unauthorized = 2,
    Fallback = 3,
}

// Common interface for filter requests (used across different endpoints)
export interface FilterRequest {
    userIds: string[] | null; // Array of Guid as strings
    readerIds: string[] | null; // Array of Guid as strings
    from: string | null; // DateTime as ISO string
    to: string | null; // DateTime as ISO string
}

export interface PaginatedFilterRequest extends FilterRequest {
    page: number;
    pageSize: number;
}

export interface InteractionLogsPaginatedFilterRequest extends PaginatedFilterRequest {
    interactionTypes: InteractionType[] | null;
}

export interface AddInteractionRequest {
    logReaderId: string,
    cardId: string,
    dateTime: string
}

export interface ActiveSession {
    id: string,
    logReaderId: string,
    logUserId: string,
    startDate: string
}

export interface InteractionLog {
    id: string,
    logReaderId: string,
    logUserId: string | null,
    cardId: string,
    dateTime: string,
    interactionType: number
}

export interface Session {
    id: string,
    logReaderId: string,
    logUserId: string,
    startDate: string,
    endDate: string
}

export const addInteractionLog = async (request: AddInteractionRequest): Promise<InteractionLog> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/logs/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    })

    return response.json();
}

export const forceLogout = async (id: string): Promise<InteractionLog> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/logs/${id}/force-logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    })

    return response.json();
}

export const exportSessions = async (request: FilterRequest): Promise<Blob | null> => {
    try {
        // Perform the export (e.g., send a request to the backend)
        const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/sessions/export', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
            },
        });

        // Get the response as a Blob
        return await response.blob();
    } catch (error) {
        console.error('Error during export:', error);
        return null;
    }
};

// POST request for filtering active sessions
export const getActiveSessions = async (request: PaginatedFilterRequest):
    Promise<PaginatedResult<ActiveSession>> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/active-sessions/filter/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};

// POST request for filtering interaction logs
export const getInteractionLogs = async (request: InteractionLogsPaginatedFilterRequest):
    Promise<PaginatedResult<InteractionLog>> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/interaction-logs/filter/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};

// POST request for filtering sessions
export const getSessions = async (request: PaginatedFilterRequest):
    Promise<PaginatedResult<Session>> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/sessions/filter/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};
