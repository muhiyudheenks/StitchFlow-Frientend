import { login, verifyOtp } from "../services/auth-services";
import { ApiError } from "@/shared/types/api";
import { LoginRequest, LoginResponse } from "../types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useLogin = () => {
    return useMutation<LoginResponse, AxiosError<ApiError>, LoginRequest>({
        mutationFn: login,
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
    });
};
