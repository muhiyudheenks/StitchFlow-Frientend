'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiCalendar,
    FiPlus,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiX
} from 'react-icons/fi';

export default function LeaveTab() {
    const queryClient = useQueryClient();
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [leaveType, setLeaveType] = useState('casual');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const leave = dashboardData?.leave || {
        balances: { casual: 6, sick: 4, annual: 12 },
        requests: [
            { id: 'l1', leaveType: 'Casual Leave', startDate: '2026-07-28', endDate: '2026-07-29', reason: 'Personal errands', status: 'pending' },
            { id: 'l2', leaveType: 'Sick Leave', startDate: '2026-06-12', endDate: '2026-06-12', reason: 'Fever & Rest', status: 'approved' },
        ],
    };

    const applyLeaveMutation = useMutation({
        mutationFn: async (leaveData: any) => {
            const response = await axios.post(
                'http://localhost:5000/api/employee/leaves',
                leaveData,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
            setIsApplyModalOpen(false);
            setStartDate('');
            setEndDate('');
            setReason('');
        },
    });

    const handleApplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        applyLeaveMutation.mutate({
            leaveType,
            startDate,
            endDate,
            reason,
        });
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
                        <FiCalendar size={14} />
                        <span>Leave Portal</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Leave Balance &amp; Applications</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Submit new leave applications and track approval statuses from Line Manager.
                    </p>
                </div>
                <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Apply For Leave</span>
                </button>
            </div>

            {/* Leave Balances Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Casual Leave Balance</span>
                    <div className="text-3xl font-extrabold text-slate-900">{leave.balances.casual} <span className="text-xs font-normal text-slate-400">days</span></div>
                    <span className="text-xs text-purple-600 font-bold">Valid through 2026</span>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Sick Leave Balance</span>
                    <div className="text-3xl font-extrabold text-slate-900">{leave.balances.sick} <span className="text-xs font-normal text-slate-400">days</span></div>
                    <span className="text-xs text-blue-600 font-bold">Paid medical leave</span>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Annual Leave Balance</span>
                    <div className="text-3xl font-extrabold text-slate-900">{leave.balances.annual} <span className="text-xs font-normal text-slate-400">days</span></div>
                    <span className="text-xs text-emerald-600 font-bold">Earned leave credit</span>
                </div>
            </div>

            {/* Leave Requests Cards */}
            <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">My Leave Applications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {leave.requests.map((req: any) => (
                        <div key={req.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-extrabold text-slate-900">{req.leaveType}</h4>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${req.status === 'approved'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : req.status === 'pending'
                                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                            }`}
                                    >
                                        {req.status}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mb-3">
                                    <FiCalendar size={13} />
                                    <span>{req.startDate} to {req.endDate}</span>
                                </div>
                                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                                    &ldquo;{req.reason}&rdquo;
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Apply Leave Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsApplyModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900">Apply For Leave</h3>
                            <p className="text-xs text-slate-500 mt-1">Select leave category, start/end date, and state your reason.</p>
                        </div>

                        <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Leave Category</label>
                                <select
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500"
                                >
                                    <option value="casual">Casual Leave</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="annual">Annual Leave</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                                <textarea
                                    rows={3}
                                    required
                                    placeholder="Explain reason for leave application..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={applyLeaveMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 shadow-md cursor-pointer disabled:opacity-60"
                                >
                                    {applyLeaveMutation.isPending ? 'Submitting…' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
