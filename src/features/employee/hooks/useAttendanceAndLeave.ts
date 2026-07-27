import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService, ApplyLeavePayload } from '../services/attendance-service';

export function useAttendance() {
    return useQuery({
        queryKey: ['employee-attendance-today'],
        queryFn: () => attendanceService.getTodayAttendance(),
    });
}

export function useAttendanceHistory() {
    return useQuery({
        queryKey: ['employee-attendance-history'],
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-attendance-today'] });
            queryClient.invalidateQueries({ queryKey: ['employee-attendance-history'] });
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
        },
    });
}

export function useCheckOut() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => attendanceService.checkOut(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-attendance-today'] });
            queryClient.invalidateQueries({ queryKey: ['employee-attendance-history'] });
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
        },
    });
}

export function useApplyLeave() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ApplyLeavePayload) => attendanceService.applyLeave(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-leave-data'] });
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
        },
    });
}
