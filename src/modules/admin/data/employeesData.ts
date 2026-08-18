import { useEmployees } from "../hooks/useEmployees";

export const EmployeesData = () => {
    const {
        data: employees,
        isLoading,
        error,
    } = useEmployees();

}