import { login, register, verifyOtp } from "@/services/auth-services";
import { ApiError } from "@/type/api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/type/auth";
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

// export const useRegister = () => {
//     return useMutation({
//         mutationFn: async (data: RegisterRequest) => {
//             console.log("INSIDE MUTATION");
//             return register(data);
//         },
//     });
// };

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
    });
};