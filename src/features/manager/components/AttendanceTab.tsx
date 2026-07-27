'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiCalendar,
    FiUserCheck
} from 'react-icons/fi';
import { ManagerAttendanceRecord, ManagerLeaveRequest } from '../types';

export default function AttendanceTab() {
    const queryClient = useQueryClient();
    const [activeSection, setActiveSection] = useState<'attendance' | 'leaves'>('attendance');

    const { data: attendanceLogs = [], isLoading: isLoadingAtt } = useQuery<ManagerAttendanceRecord[]>({
        queryKey: ['manager-attendance'],
        queryFn: async () => {
            const response = await api.get('/api/manager/attendance');
            return response.data?.data || [];
        },
    });

    const { data: leaveRequests = [], isLoading: isLoadingLeave } = useQuery<ManagerLeaveRequest[]>({
        queryKey: ['manager-leaves'],
        queryFn: async () => {
            const response = await api.get('/api/manager/leaves');
            return response.data?.data || [];
        },
    });

    const updateLeaveMutation = useMutation({
        mutationFn: async ({ leaveId, status }: { leaveId: string; status: 'approved' | 'rejected' }) => {
            const response = await api.patch(`/api/manager/leaves/${leaveId}`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-leaves'] });
            queryClient.invalidateQueries({ queryKey: ['manager-reports'] });
            queryClient.invalidateQueries({ queryKey: ['manager-overview'] });
        },
    });

    return (
        <div className="space-y-6 font-sans">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        <FiClock size={14} />
                        <span>Shift Attendance &amp; Timekeeping</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Attendance Audit &amp; Leave Approvals</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Review operator check-ins, approve timesheets, and process casual &amp; sick leave requests.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveSection('attendance')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            activeSection === 'attendance'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Attendance Logs
                    </button>
                    <button
                        onClick={() => setActiveSection('leaves')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            activeSection === 'leaves'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        Leave Requests ({leaveRequests.filter(l => l.status === 'pending').length})
                    </button>
                </div>
            </div>

            {/* Attendance Section */}
            {activeSection === 'attendance' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <th className="py-4 px-6">Employee</th>
                                    <th className="py-4 px-6">Department</th>
                                    <th className="py-4 px-6">Shift Date</th>
                                    <th className="py-4 px-6">Check In</th>
                                    <th className="py-4 px-6">Check Out</th>
                                    <th className="py-4 px-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                                {isLoadingAtt ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                            Loading attendance records...
                                        </td>
                                    </tr>
                                ) : (
                                    attendanceLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{log.employeeName}</td>
                                            <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{log.department}</td>
                                            <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{log.date}</td>
                                            <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300">{log.checkIn}</td>
                                            <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300">{log.checkOut}</td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize ${
                                                        log.status === 'present'
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                                                            : log.status === 'late'
                                                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
                                                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'
                                                    }`}
                                                >
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Leave Requests Section */}
            {activeSection === 'leaves' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {isLoadingLeave ? (
                        <div className="col-span-full p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            Loading leave requests...
                        </div>
                    ) : leaveRequests.length === 0 ? (
                        <div className="col-span-full p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            No pending leave requests.
                        </div>
                    ) : (
                        leaveRequests.map((l) => (
                            <div key={l.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{l.employeeName}</h4>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50">
                                            {l.leaveType}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 mb-3">
                                        <FiCalendar size={13} />
                                        <span>{l.startDate} to {l.endDate}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                                        &ldquo;{l.reason}&rdquo;
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-400">
                                        Status: <span className="text-slate-800 dark:text-slate-200">{l.status}</span>
                                    </span>

                                    {l.status === 'pending' ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateLeaveMutation.mutate({ leaveId: l.id, status: 'rejected' })}
                                                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-900/50 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <FiXCircle size={14} /> Reject
                                            </button>
                                            <button
                                                onClick={() => updateLeaveMutation.mutate({ leaveId: l.id, status: 'approved' })}
                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                                            >
                                                <FiCheckCircle size={14} /> Approve
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize ${l.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'}`}>
                                            {l.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
