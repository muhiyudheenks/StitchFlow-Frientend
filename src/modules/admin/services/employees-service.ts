import api from "@/config";
import { employeesResponse } from "../types";

export interface GetEmployeesParams {
    search?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export const getEmployees = async (params?: GetEmployeesParams): Promise<employeesResponse> => {
    const { data } = await api.get<employeesResponse>("/api/admin/employees", {
        params,
    });
    return data;
};