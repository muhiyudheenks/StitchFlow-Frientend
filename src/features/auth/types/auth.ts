export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    requiresOtp: boolean;
    email: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

export interface RegisterResponse {
    message: string;
    email: string;
    smtpResponse?: unknown;
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
