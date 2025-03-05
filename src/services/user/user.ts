// Common properties for user-related data
import {Constants} from "@/services/util/constants.ts";
import {PaginatedResult} from "@/services/util/common.ts";

export interface LogUserProps {
    accessExpiry: string; // DateTime as ISO string
    cardId: string;
    schoolId: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    affiliation: number; // byte
    sex: number; // byte
    department?: string | null; // Guid as string or null
}

// User interface includes the ID and extends LogUserProps
export interface LogUser extends LogUserProps {
    id: string; // Guid as string
}

export interface LogUserFilter {
    page: number;
    pageSize: number;
    expired: boolean | null;
    nameSearchTerm: string | null;
    cardIdSearchTerm: string | null;
    schoolIdSearchTerm: string | null;
    affiliations: number[] | null;
    sexes: number[] | null;
    departments: string[] | null;
}

// Function to upload user photo
export async function addLogUserPhoto(userId: string, file: File) {
    const fileBuffer = await file.arrayBuffer(); // Convert file to raw bytes
    const uint8Array = new Uint8Array(fileBuffer);

    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/users/${userId}/photo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream", // ✅ Send as raw binary
        },
        body: uint8Array, // ✅ Send raw binary data
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${error}`);
    }

    return await response.json();
}

// POST request for adding a user
export const addLogUser = async (request: LogUserProps): Promise<LogUser> => {
    console.log(request);

    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};

// DELETE request for deleting a user
export const deleteLogUser = async (id: string): Promise<LogUser> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });
    return response.json();
};

// GET request for fetching a user by ID
export const getLogUser = async (id: string): Promise<LogUser> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });
    return response.json();
};

export const getLogUsers = async (filter: LogUserFilter): Promise<PaginatedResult<LogUser>> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/users/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(filter),
    });
    return response.json();
};

// PUT request for updating a user
export const updateLogUser = async (id: string, request: LogUserProps): Promise<LogUser> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};