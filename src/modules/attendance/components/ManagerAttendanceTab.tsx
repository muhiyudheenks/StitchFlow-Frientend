'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiCalendar,
    FiUserCheck,
    FiChevronDown,
    FiChevronUp
} from 'react-icons/fi';
import { ManagerAttendanceRecord, ManagerLeaveRequest } from '@/modules/manager/types';

const formatTime = (val?: string | Date | null): string => {
    if (!val || val === '-' || val === '—') return '-';
    const str = String(val).trim();
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(str)) {
        return str;
    }
    try {
        const d = new Date(str);
        if (isNaN(d.getTime())) return str;
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
        return str;
    }
};

const getTodayLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function AttendanceTab() {
    const queryClient = useQueryClient();
    const [activeSection, setActiveSection] = useState<'attendance' | 'leaves'>('attendance');
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRowExpand = (id: string) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

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

    const todayDate = getTodayLocalDate();
    const todayAttendance = attendanceLogs.filter((log) => log.date === todayDate);
    const presentToday = todayAttendance.filter((log) => log.status === 'present' || log.status === 'late').length;
    const lateToday = todayAttendance.filter((log) => log.status === 'late').length;
    const onLeaveToday = todayAttendance.filter((log) => log.status === 'on_leave').length;
    const absentToday = todayAttendance.filter((log) => log.status === 'absent').length;

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
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeSection === 'attendance'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        Attendance Logs
                    </button>
                    <button
                        onClick={() => setActiveSection('leaves')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeSection === 'leaves'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6 border-b border-slate-200/80 dark:border-slate-800">
                        <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Present Today</div>
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{presentToday}</div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Employees checked in or on time</div>
                        </div>
                        <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Late Today</div>
                            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-300">{lateToday}</div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Employees marked late for {todayDate}</div>
                        </div>
                        <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">On Leave Today</div>
                            <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-300">{onLeaveToday}</div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Approved leaves active today</div>
                        </div>
                        <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Absent Today</div>
                            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-300">{absentToday}</div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Employees marked absent for {todayDate}</div>
                        </div>
                    </div>
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
                                    <th className="py-4 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                                {isLoadingAtt ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                                            Loading attendance records...
                                        </td>
                                    </tr>
                                ) : (
                                    attendanceLogs.map((log: any) => {
                                        const isExpanded = Boolean(expandedRows[log.id]);
                                        const sessionsList: any[] = log.sessions && log.sessions.length > 0 ? log.sessions : [
                                            {
                                                checkIn: log.checkIn || formatTime(log.checkInTime),
                                                checkOut: log.checkOut || (log.checkOutTime ? formatTime(log.checkOutTime) : null),
                                            }
                                        ];

                                        const firstSession = sessionsList[0];
                                        const lastSession = sessionsList[sessionsList.length - 1];

                                        const firstCheckInStr = formatTime(firstSession?.checkIn || log.checkIn || log.checkInTime);
                                        const lastCheckOutStr = formatTime(lastSession?.checkOut || log.checkOut || log.checkOutTime);

                                        return (
                                            <React.Fragment key={log.id}>
                                                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{log.employeeName}</td>
                                                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{log.department}</td>
                                                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{log.date}</td>
                                                    <td className="py-4 px-6 font-mono text-slate-900 dark:text-white font-bold">{firstCheckInStr}</td>
                                                    <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400">{lastCheckOutStr}</td>
                                                    <td className="py-4 px-6">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize ${log.status === 'present'
                                                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                                                                    : log.status === 'late'
                                                                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
                                                                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'
                                                                }`}
                                                        >
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <button
                                                            onClick={() => toggleRowExpand(log.id)}
                                                            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                                            title={isExpanded ? 'Collapse sessions' : 'Expand session details'}
                                                        >
                                                            {isExpanded ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                                                        <td colSpan={7} className="p-4 border-b border-slate-100 dark:border-slate-800">
                                                            <div className="space-y-2.5">
                                                                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                                    Check In &amp; Check Out Sessions for {log.employeeName} ({sessionsList.length})
                                                                </div>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                                    {sessionsList.map((s: any, idx: number) => {
                                                                        const inStr = formatTime(s.checkIn || s.checkInTime);
                                                                        const outStr = s.checkOut || (s.checkOutTime ? formatTime(s.checkOutTime) : null);
                                                                        const isOpen = !outStr || outStr === '-';

                                                                        return (
                                                                            <div
                                                                                key={idx}
                                                                                className={`p-3 rounded-2xl border text-xs flex items-center justify-between font-mono ${isOpen
                                                                                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                                                                                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[10px] font-sans font-bold text-slate-400">Session #{idx + 1}</span>
                                                                                    <span className="font-bold">{inStr}</span>
                                                                                    <span className="text-slate-400">→</span>
                                                                                    <span className={isOpen ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}>{isOpen ? 'Active' : outStr}</span>
                                                                                </div>
                                                                                <span className={`text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-full ${isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                                                    }`}>
                                                                                    {isOpen ? 'ACTIVE' : 'COMPLETED'}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
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
