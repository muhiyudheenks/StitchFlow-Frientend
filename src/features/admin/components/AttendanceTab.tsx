'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { mockAttendanceRecords } from '../data/mockData';
import { FiCheckCircle, FiClock, FiAlertCircle, FiCalendar } from 'react-icons/fi';

export default function AttendanceTab() {
    return (
        <div className="space-y-8 font-sans">
            {/* Top Attendance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present Today</span>
                        <div className="text-3xl font-extrabold text-emerald-600 mt-1">324</div>
                        <span className="text-xs text-slate-500 mt-0.5 block">95.4% Rate</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <FiCheckCircle size={22} />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Late Clock-Ins</span>
                        <div className="text-3xl font-extrabold text-amber-600 mt-1">8</div>
                        <span className="text-xs text-amber-600 mt-0.5 block">After 08:15 AM</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                        <FiClock size={22} />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">On Approved Leave</span>
                        <div className="text-3xl font-extrabold text-purple-700 mt-1">5</div>
                        <span className="text-xs text-purple-600 mt-0.5 block">Sick & Annual Leave</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100">
                        <FiCalendar size={22} />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unexcused Absences</span>
                        <div className="text-3xl font-extrabold text-rose-600 mt-1">3</div>
                        <span className="text-xs text-rose-600 mt-0.5 block">Requires Follow-up</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                        <FiAlertCircle size={22} />
                    </div>
                </div>
            </div>

            {/* Weekly Attendance Bar Visualization */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Weekly Shift Attendance Coverage
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Biometric clock-in rate per day across all shifts</p>
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                        Weekly Avg: 96.8%
                    </span>
                </div>

                <div className="grid grid-cols-7 gap-3 pt-4">
                    {[
                        { day: 'Mon', rate: 98, count: '333/340' },
                        { day: 'Tue', rate: 97, count: '330/340' },
                        { day: 'Wed', rate: 99, count: '337/340' },
                        { day: 'Thu', rate: 95, count: '324/340' },
                        { day: 'Fri', rate: 96, count: '326/340' },
                        { day: 'Sat', rate: 92, count: '312/340' },
                        { day: 'Sun', rate: 88, count: '299/340' }
                    ].map((d) => (
                        <div key={d.day} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-purple-50/50 transition-colors">
                            <span className="text-xs font-bold text-slate-700">{d.day}</span>
                            <div className="w-full bg-slate-200 h-24 rounded-xl flex items-end p-1 overflow-hidden">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${d.rate}%` }}
                                    transition={{ duration: 0.8 }}
                                    className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-lg"
                                />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-purple-700">{d.rate}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Attendance Records Table */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs overflow-hidden p-6 sm:p-8"
            >
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-6">
                    Today&apos;s Biometric Clock-In Log
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                                <th className="py-4 px-6">Record ID</th>
                                <th className="py-4 px-6">Employee Name</th>
                                <th className="py-4 px-6">Department</th>
                                <th className="py-4 px-6">Check In</th>
                                <th className="py-4 px-6">Check Out</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {mockAttendanceRecords.map((rec) => (
                                <tr key={rec.id} className="hover:bg-purple-50/30 transition-colors">
                                    <td className="py-4 px-6 font-mono font-bold text-purple-700">{rec.id}</td>
                                    <td className="py-4 px-6 font-bold text-slate-900">{rec.employeeName}</td>
                                    <td className="py-4 px-6 font-semibold text-slate-700">{rec.department}</td>
                                    <td className="py-4 px-6 font-mono text-slate-900 font-bold">{rec.checkIn}</td>
                                    <td className="py-4 px-6 font-mono text-slate-500">{rec.checkOut}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${rec.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                rec.status === 'Late' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    'bg-purple-50 text-purple-600 border-purple-200'
                                            }`}>
                                            {rec.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
