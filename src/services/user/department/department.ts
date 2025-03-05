import {Constants} from "@/services/util/constants.ts";
import {PaginatedResult} from "@/services/util/common.ts";

export interface DepartmentProps {
    name: string;
}

// Department interface includes the ID and extends DepartmentProps
export interface Department extends DepartmentProps {
    id: string; // Guid as string
}

export interface DepartmentFilter {
    page: number;
    pageSize: number;
    searchTerm: string | null;
}

// POST request for adding a department
export const addDepartment = async (request: DepartmentProps): Promise<Department> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/departments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};

// DELETE request for deleting a department
export const deleteDepartment = async (id: string): Promise<Department> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/departments/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });
    return response.json();
};

// GET request for fetching a department by ID
export const getDepartment = async (id: string): Promise<Department> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/departments/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });
    return response.json();
};

export const getDepartments = async (filter: DepartmentFilter): Promise<PaginatedResult<Department>> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/departments/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(filter),
    });
    return response.json();
};

// PUT request for updating a department
export const updateDepartment = async (id: string, request: DepartmentProps): Promise<Department> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + `/departments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
        body: JSON.stringify(request),
    });
    return response.json();
};

