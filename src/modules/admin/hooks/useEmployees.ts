import { useQuery } from "@tanstack/react-query";
import { getEmployees, GetEmployeesParams } from "../services/employees-service";

export const useEmployees = (params?: GetEmployeesParams) => {
    return useQuery({
        queryKey: ["admin-employees", params],
        queryFn: () => getEmployees(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};