'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FiBell, FiCheckSquare, FiClock, FiInfo, FiCheck } from 'react-icons/fi';

export default function NotificationsTab() {
    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const notifs = dashboardData?.notifications || [
        { id: 'n1', title: 'New Task Assigned', message: 'Robert Vance assigned task: Stitch Denim Jacket Collar & Cuffs', time: '1 hour ago', unread: true },
        { id: 'n2', title: 'Shift Attendance Approved', message: 'Your check-in at 08:42 AM was verified by supervisor.', time: '3 hours ago', unread: false },
        { id: 'n3', title: 'Company Announcement', message: 'Factory Safety Workshop scheduled for Friday 3:00 PM.', time: '1 day ago', unread: false },
    ];

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
                        <FiBell size={14} />
                        <span>Workstation Inbox</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Notifications &amp; Announcements</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Stay informed on task assignments, attendance approvals, and factory announcements.
                    </p>
                </div>
            </div>

            {/* Notifications Feed */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                {notifs.map((n: any) => (
                    <div
                        key={n.id}
                        className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-colors ${n.unread
                                ? 'bg-purple-50/60 border-purple-200'
                                : 'bg-slate-50 border-slate-100'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-white text-purple-600 border border-slate-200 shadow-sm shrink-0 mt-0.5">
                                <FiBell size={16} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-extrabold text-slate-900">{n.title}</h4>
                                    {n.unread && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-600 text-white">
                                            New
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                                <span className="text-[10px] text-slate-400 font-semibold mt-2 inline-block">{n.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
