import api from '@/config';

export interface ManagerData {
    _id: string;
    id?: string;
    name: string;
    fullName?: string;
    email: string;
    department?: string;
    designation?: string;
}

export const getManagers = async (): Promise<ManagerData[]> => {
    const res = await api.get('/api/admin/managers');
    console.log('[manager.service] GET /api/admin/managers response:', res.data);
    const managersList = res.data?.data || [];
    console.log('[manager.service] managers array length:', managersList.length);
    return managersList;
};
