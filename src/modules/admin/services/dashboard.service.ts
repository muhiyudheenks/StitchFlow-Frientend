import api from '@/config';
import { OverviewCardsData } from '../types';

export const getOverviewCards = async (): Promise<OverviewCardsData> => {
    const res = await api.get('/api/admin/dashboard/overview');
    return res.data?.data;
};