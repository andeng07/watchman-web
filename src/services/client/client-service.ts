// Response interface for DELETE clients/{id:guid}
import {Constants} from "@/services/util/constants.ts";
import {PaginatedResult} from "@/services/util/common.ts";

export interface ClientProps {
    firstName: string;
    middleName?: string | null;
    lastName: string;
}

export interface Client extends ClientProps {
    id: string; // Guid as string
}

export interface ClientFilter {
    page: number;
    pageSize: number;
    searchTerm: string | null;
}

// DELETE request
export const deleteClient = async (id: string): Promise<Client> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/clients/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });
    return response.json();
};

// GET request for a specific client
export const getClient = async (id: string): Promise<Client> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/clients/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });
    return response.json();
};

// GET request for paginated clients
export const getClients = async (filter: ClientFilter): Promise<PaginatedResult<Client>> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/clients/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(filter),
    });
    return response.json();
};

// PUT request to update client
export const updateClient = async (id: string, request: ClientProps): Promise<Client> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/clients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};
