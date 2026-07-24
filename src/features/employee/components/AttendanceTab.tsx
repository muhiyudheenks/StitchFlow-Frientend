'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiClock,
    FiCheckCircle,
    FiCalendar,
    FiPlay,
    FiSquare,
    FiTrendingUp
} from 'react-icons/fi';

export default function AttendanceTab() {
    const [isCheckedIn, setIsCheckedIn] = useState(true);
    const [checkInTime, setCheckInTime] = useState('08:42 AM');
    const [checkOutTime, setCheckOutTime] = useState('—');

    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const att = dashboardData?.attendance || {
        todayCheckIn: checkInTime,
        todayCheckOut: checkOutTime,
        workingHours: '6.5 hrs',
        attendancePercentage: 96.5,
        history: [
            { id: 'a1', date: '2026-07-23', checkIn: '08:42 AM', checkOut: '—', hours: '6.5h', status: 'present' },
            { id: 'a2', date: '2026-07-22', checkIn: '08:50 AM', checkOut: '05:10 PM', hours: '8.2h', status: 'present' },
            { id: 'a3', date: '2026-07-21', checkIn: '09:05 AM', checkOut: '05:05 PM', hours: '8.0h', status: 'late' },
            { id: 'a4', date: '2026-07-20', checkIn: '08:45 AM', checkOut: '05:15 PM', hours: '8.5h', status: 'present' },
        ],
    };

    const handleCheckInToggle = () => {
        if (!isCheckedIn) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setCheckInTime(time);
            setIsCheckedIn(true);
        } else {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setCheckOutTime(time);
            setIsCheckedIn(false);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header Box & Live Clock Action */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
                        <FiClock size={14} />
                        <span>Shift Timekeeping</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Today Shift Attendance</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Log shift check-in and check-out timestamps to calculate net working hours.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
                    <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold uppercase">Status</div>
                        <div className="text-sm font-extrabold text-slate-900">
                            {isCheckedIn ? 'Checked In' : 'Checked Out'}
                        </div>
                    </div>

                    <button
                        onClick={handleCheckInToggle}
                        className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer ${isCheckedIn
                                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            }`}
                    >
                        {isCheckedIn ? (
                            <>
                                <FiSquare size={14} /> <span>Check Out</span>
                            </>
                        ) : (
                            <>
                                <FiPlay size={14} /> <span>Check In</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Attendance Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Today Check In</span>
                    <div className="text-2xl font-extrabold text-slate-900">{checkInTime}</div>
                    <span className="text-xs text-emerald-600 font-bold">On Time Arrival</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Today Working Hours</span>
                    <div className="text-2xl font-extrabold text-slate-900">{att.workingHours}</div>
                    <span className="text-xs text-slate-500 font-semibold">Shift A (8.0 hrs target)</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Monthly Attendance Rate</span>
                    <div className="text-2xl font-extrabold text-slate-900">{att.attendancePercentage}%</div>
                    <span className="text-xs text-purple-600 font-bold flex items-center gap-1">
                        <FiTrendingUp /> Excellent Consistency
                    </span>
                </div>
            </div>

            {/* Attendance History Table */}
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">Attendance Log History</h3>
                    <span className="text-xs text-slate-500 font-medium">Recent 30 Days</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Check In</th>
                                <th className="py-4 px-6">Check Out</th>
                                <th className="py-4 px-6">Total Hours</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {att.history.map((log: any) => (
                                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-4 px-6 font-bold text-slate-900">{log.date}</td>
                                    <td className="py-4 px-6 font-mono text-slate-700">{log.checkIn}</td>
                                    <td className="py-4 px-6 font-mono text-slate-700">{log.checkOut}</td>
                                    <td className="py-4 px-6 font-bold text-slate-800">{log.hours}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize ${log.status === 'present'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : log.status === 'late'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}
                                        >
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
