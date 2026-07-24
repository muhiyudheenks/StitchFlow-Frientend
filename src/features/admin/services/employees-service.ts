import api from "@/config";

export const getEmployees = async () => {
    const { data } = await api.get("/admin/employees");
    return data;
};