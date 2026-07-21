import { LoginRequest, RegisterRequest, VerifyOtpRequest, VerifyOtpResponse } from "@/type/auth";
import api from "./axois";

export const login = async (data: LoginRequest) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
};

export const register = async (data: RegisterRequest) => {
    const response = await api.post("/api/auth/register", data);
    return response.data
}

export const verifyOtp = async (payload: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await api.post("/api/auth/verify-otp", payload);

    return response.data;
};