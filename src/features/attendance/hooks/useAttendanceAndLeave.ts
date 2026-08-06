import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService, ApplyLeavePayload } from '../services/attendance-service';

/** Shape returned by GET /api/attendance/today */
export interface TodayAttendanceData {
    isCheckedIn: boolean;
    checkIn: string;
    checkOut: string;
    workingHours: string;
    totalHours: number;
    overtimeHours?: number;
    status: string;
    attendancePercentage: number;
}

const TODAY_KEY = ['employee-attendance-today'];
const HISTORY_KEY = ['employee-attendance-history'];
const DASHBOARD_KEY = ['employee-dashboard'];

export function useAttendance() {
    return useQuery<TodayAttendanceData>({
        queryKey: TODAY_KEY,
        queryFn: () => attendanceService.getTodayAttendance(),
        refetchOnMount: true,
        staleTime: 0,
    });
}

export function useAttendanceHistory() {
    return useQuery({
        queryKey: HISTORY_KEY,
        queryFn: () => attendanceService.getAttendanceHistory(),
    });
}

export function useLeaveData() {
    return useQuery({
        queryKey: ['employee-leave-data'],
        queryFn: () => attendanceService.getMyLeaves(),
    });
}

export function useLeaveHistory() {
    const { data } = useLeaveData();
    return {
        data: data?.requests || [],
    };
}

export function useLeaveBalance() {
    const { data } = useLeaveData();
    return {
        data: data?.balances || { casual: 12, sick: 10, annual: 15 },
    };
}

export function useCheckIn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => attendanceService.checkIn(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: TODAY_KEY });
            const previous = queryClient.getQueryData<TodayAttendanceData>(TODAY_KEY);
            if (previous) {
                queryClient.setQueryData<TodayAttendanceData>(TODAY_KEY, {
                    ...previous,
                    isCheckedIn: true,
                    checkOut: '—',
                });
            }
            return { previous };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODAY_KEY });
            queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
        },
        onError: (_err, _vars, context: any) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData(TODAY_KEY, context.previous);
            }
        },
    });
}

export function useCheckOut() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => attendanceService.checkOut(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: TODAY_KEY });
            const previous = queryClient.getQueryData<TodayAttendanceData>(TODAY_KEY);
            if (previous) {
                queryClient.setQueryData<TodayAttendanceData>(TODAY_KEY, {
                    ...previous,
                    isCheckedIn: false,
                });
            }
            return { previous };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODAY_KEY });
            queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
        },
        onError: (_err, _vars, context: any) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData(TODAY_KEY, context.previous);
            }
        },
    });
}

export function useApplyLeave() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ApplyLeavePayload) => attendanceService.applyLeave(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-leave-data'] });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
        },
    });
}
