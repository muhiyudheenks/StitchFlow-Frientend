import api from '@/config';

export interface ApplyLeavePayload {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
}

export const attendanceService = {
    getTodayAttendance: async () => {
        const response = await api.get('/api/attendance/today');
        return response.data?.data ?? response.data;
    },

    checkIn: async () => {
        const response = await api.post('/api/attendance/check-in', {});
        return response.data?.data ?? response.data;
    },

    checkOut: async () => {
        const response = await api.post('/api/attendance/check-out', {});
        return response.data?.data ?? response.data;
    },

    getAttendanceHistory: async () => {
        const response = await api.get('/api/attendance/history');
        return response.data?.data ?? response.data ?? [];
    },

    getMyLeaves: async () => {
        const response = await api.get('/api/leave/my');
        return response.data?.data ?? response.data ?? { balances: { casual: 12, sick: 10, annual: 15 }, requests: [] };
    },

    applyLeave: async (data: ApplyLeavePayload) => {
        const response = await api.post('/api/leave', data);
        return response.data?.data ?? response.data;
    },
};
