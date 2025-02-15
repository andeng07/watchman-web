export interface AddLocationRequest {
    buildingName: string;
    roomName?: string;
}

export interface AddLocationResponse {
    id: string;
    buildingName: string;
    roomName?: string;
}

// READ
export interface GetLocationResponse {
    id: string;
    buildingName: string;
    roomName?: string;
}

// UPDATE
export interface UpdateLocationRequest {
    buildingName: string;
    roomName?: string;
}

export interface UpdateLocationResponse {
    id: string;
    buildingName: string;
    roomName?: string;
}

// DELETE
export interface DeleteLocationResponse {
    id: string;
    buildingName: string;
    roomName?: string;
}