// READ
export interface GetClientResponse {
    id: string;
    createdAt: string;
    firstName: string;
    middleName?: string;
    lastName: string;
}

// UPDATE
export interface UpdateClientRequest {
    firstName: string;
    middleName?: string;
    lastName: string;
}

export interface UpdateClientResponse {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
}

// DELETE
export interface DeleteClientResponse {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
}