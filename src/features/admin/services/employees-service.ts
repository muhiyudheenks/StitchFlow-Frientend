import api from "@/config";
import { EmployeesResponse } from "../types";

export interface GetEmployeesParams {
    search?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export const getEmployees = async (params?: GetEmployeesParams): Promise<EmployeesResponse> => {
    const { data } = await api.get<EmployeesResponse>("/api/admin/employees", {
        params,
    });
    return data;
};