// Request interface for POST /auth/login
import {Constants} from "@/services/util/constants.ts";

export interface LoginUserRequest {
    username: string;
    password: string;
}

// Response interface for POST /auth/login
export interface LoginUserResponse {
    token: string;
    id: string; // Guid as string
}

// Request interface for POST /auth/register
export interface RegisterUserRequest {
    username: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    password: string;
    userProfileImage: File; // Handling file upload, `File` type in TypeScript for file inputs
}

// Response interface for POST /auth/register
export interface RegisterUserResponse {
    id: string; // Guid as string
    username: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
}

// POST request for logging in a user
export const loginUser = async (request: LoginUserRequest): Promise<LoginUserResponse> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
};


// POST request for registering a new user
export const registerUser = async (request: RegisterUserRequest): Promise<RegisterUserResponse> => {
    const response = await fetch(Constants.GRINGOTTS_BASE_URL + '/auth/register', {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            Authorization: `${localStorage.getItem('token')}`, // Add token to Authorization header
        },
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

