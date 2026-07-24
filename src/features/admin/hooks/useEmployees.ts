import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../services/employees-service";

export const useEmployees = () => {
    return useQuery({
        queryKey: ["employees"],
        queryFn: getEmployees,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};