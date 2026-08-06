'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/config';
import { FiCheckCircle, FiClock, FiAlertCircle, FiCalendar } from 'react-icons/fi';

export default function AttendanceTab() {
    const { data: analyticsData } = useQuery({
        queryKey: ['admin-analytics-summary'],
        queryFn: async () => {
            const response = await api.get('/api/admin/dashboard/analytics-summary');
            return response.data?.data || {};
        },
    });

    const { data: todayRecords = [], isLoading: isLoadingRecords } = useQuery({
        queryKey: ['admin-attendance-today'],
        queryFn: async () => {
            const response = await api.get('/api/admin/attendance/today');
            return response.data?.data || response.data || [];
        },
    });

    const attendanceStats = analyticsData?.attendanceStats || {};
    const presentToday = attendanceStats.todayPresent ?? 0;
    const lateToday = attendanceStats.todayLate ?? 0;
    const onLeaveCount = analyticsData?.employeeStats?.onLeave ?? 0;
    const absentToday = attendanceStats.todayAbsent ?? 0;
    const attendancePercentage = attendanceStats.attendancePercentage ?? 0;

    return (
        <div className="space-y-8 font-sans">
            {/* Top Attendance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Present Today</span>
                        <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{presentToday}</div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">{attendancePercentage}% Rate</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                        <FiCheckCircle size={22} />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Late Clock-Ins</span>
                        <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{lateToday}</div>
                        <span className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 block">After Shift Start</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                        <FiClock size={22} />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">On Approved Leave</span>
                        <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 mt-1">{onLeaveCount}</div>
                        <span className="text-xs text-purple-600 dark:text-purple-400 mt-0.5 block">Approved Roster</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/50">
                        <FiCalendar size={22} />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Unexcused Absences</span>
                        <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{absentToday}</div>
                        <span className="text-xs text-rose-600 dark:text-rose-400 mt-0.5 block">Shift Absences</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                        <FiAlertCircle size={22} />
                    </div>
                </div>
            </div>

            {/* Attendance Records Table */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xs overflow-hidden p-6 sm:p-8"
            >
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                    Today&apos;s Biometric Clock-In Log
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                                <th className="py-4 px-6">Record ID</th>
                                <th className="py-4 px-6">Employee Name</th>
                                <th className="py-4 px-6">Department</th>
                                <th className="py-4 px-6">Check In</th>
                                <th className="py-4 px-6">Check Out</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {isLoadingRecords ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">
                                        Loading today&apos;s attendance logs...
                                    </td>
                                </tr>
                            ) : todayRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">
                                        No attendance records logged for today yet.
                                    </td>
                                </tr>
                            ) : (
                                todayRecords.map((rec: any) => (
                                    <tr key={rec._id || rec.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors">
                                        <td className="py-4 px-6 font-mono font-bold text-purple-700 dark:text-purple-400">
                                            {rec._id ? `ATT-${rec._id.slice(-4).toUpperCase()}` : (rec.id || 'ATT')}
                                        </td>
                                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                                            {rec.employeeName || rec.employeeId?.fullName || rec.employeeId?.name || 'Employee'}
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                                            {rec.department || rec.employeeId?.department || 'Production'}
                                        </td>
                                        <td className="py-4 px-6 font-mono text-slate-900 dark:text-white font-bold">
                                            {rec.checkInTime || rec.checkIn || '-'}
                                        </td>
                                        <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400">
                                            {rec.checkOutTime || rec.checkOut || '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                                                rec.status === 'Present' || rec.status === 'present' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' :
                                                rec.status === 'Late' || rec.status === 'late' ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' :
                                                'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50'
                                            }`}>
                                                {rec.status ? rec.status.toUpperCase() : 'PRESENT'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
