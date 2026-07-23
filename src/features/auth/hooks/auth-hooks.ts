import { login, register, verifyOtp } from "../services/auth-services";
import { ApiError } from "@/shared/types/api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useLogin = () => {
    return useMutation<LoginResponse, AxiosError<ApiError>, LoginRequest>({
        mutationFn: login,
    });
};

export const useRegister = () => {
    return useMutation<RegisterResponse, AxiosError<ApiError>, RegisterRequest>({
        mutationFn: register,
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
    });
};
