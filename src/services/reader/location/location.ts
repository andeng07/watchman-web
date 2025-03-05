import {Constants} from "@/services/util/constants.ts";
import {PaginatedResult} from "@/services/util/common.ts";

export interface LocationProps {
    buildingName: string;
    roomName?: string | null;
}

// Location interface includes the ID and extends LocationProps
export interface Location extends LocationProps {
    id: string; // Guid as string
}

export interface LocationFilter {
    page: number;
    pageSize: number;
    searchTerm: string | null;
}

// Example POST request for adding a location
export const addLocation = async (request: LocationProps): Promise<Location> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/locations/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};

// Example DELETE request for deleting a location
export const deleteLocation = async (id: string): Promise<Location> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/locations/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });
    return response.json();
};

// Example GET request for fetching a location by ID
export const getLocation = async (id: string): Promise<Location> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/locations/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });
    return response.json();
};

export const getLocations = async (filter: LocationFilter): Promise<PaginatedResult<Location>> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/locations/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(filter),
    });
    return response.json();
};

// Example POST request for updating a location
export const updateLocation = async (id: string, request: LocationProps): Promise<Location> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/locations/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};
