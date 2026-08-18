import { useQuery } from '@tanstack/react-query';
import { getManagers } from '../services/manager.service';

export const useManagers = () =>
    useQuery({
        queryKey: ['managers'],
        queryFn: getManagers,
        staleTime: 5 * 60 * 1000,
    });
