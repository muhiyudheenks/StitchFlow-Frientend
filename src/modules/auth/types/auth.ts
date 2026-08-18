export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    requiresOtp: boolean;
    email: string;
}



export interface VerifyOtpRequest {
    email: string;
    code: string;
    purpose: string;
}

export interface VerifyOtpResponse {
    message: string;
    token: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        role: "employee" | "admin" | "manager";
        companyName?: string;
        isVerified: boolean;
        isBlock: boolean;
    };
}
