export interface RegisterUserRequest {
    username: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    password: string;
    userProfileImage: File;
}

export interface RegisterUserResponse {
    id: string;
    username: string;
    firstName: string;
    middleName?: string;
    lastName: string;
}


export interface LoginUserRequest {
    username: string;
    password: string;
}

export interface LoginUserResponse {
    token: string;
    id: string;
}