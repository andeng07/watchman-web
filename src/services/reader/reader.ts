import {Constants} from "@/services/util/constants.ts";
import {PaginatedResult} from "@/services/util/common.ts";

export interface ReaderProps {
    name: string;
    location: string | null; // Guid as string, location can be null
}

// Reader interface includes the ID and extends ReaderProps
export interface Reader extends ReaderProps {
    id: string; // Guid as string
}

export interface ReaderFilter {
    page: number;
    pageSize: number;
    searchTerm: string | null;
    locations: string[] | null;
}

// POST request for adding a reader
export const addReader = async (request: ReaderProps): Promise<Reader> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/readers/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

// DELETE request for deleting a reader
export const deleteReader = async (id: string): Promise<Reader> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/readers/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

// GET request for fetching a reader by ID
export const getReader = async (id: string): Promise<Reader> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/readers/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

export const getReaders = async (filter: ReaderFilter): Promise<PaginatedResult<Reader>> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/readers/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(filter),
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

// PUT request for updating a reader
export const updateReader = async (id: string, request: ReaderProps): Promise<Reader> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/readers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};
