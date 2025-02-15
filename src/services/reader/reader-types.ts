export interface AddReaderRequest {
    name: string;
    location: string;
}

export interface AddReaderResponse {
    id: string;
    name: string;
    locationId?: string;
}

export interface GetReaderResponse {
    id: string;
    name: string;
    location?: string;
}

export interface UpdateReaderRequest {
    name: string;
    location: string;
}

export interface UpdateReaderResponse {
    id: string;
    name: string;
    locationId?: string;
}

// DELETE
export interface DeleteReaderResponse {
    id: string;
    readerName: string;
    location?: string;
}