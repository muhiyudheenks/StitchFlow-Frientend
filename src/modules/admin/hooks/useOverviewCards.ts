import { useQuery } from '@tanstack/react-query';
import { getOverviewCards } from '../services/dashboard.service';
import { OverviewCardsData } from '../types';

export const useOverviewCards = () => {
    return useQuery<OverviewCardsData>({
        queryKey: ['admin-overview-cards'],
        queryFn: getOverviewCards,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};