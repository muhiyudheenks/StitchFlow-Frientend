'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FiTrendingUp, FiAward, FiCheckCircle, FiStar } from 'react-icons/fi';

export default function PerformanceTab() {
    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const perf = dashboardData?.performance || {
        productivityScore: 94,
        attendanceScore: 97,
        qualityScore: 98,
        overallEfficiency: 95,
        monthlyTrend: [
            { month: 'Jan', score: 88 },
            { month: 'Feb', score: 90 },
            { month: 'Mar', score: 92 },
            { month: 'Apr', score: 91 },
            { month: 'May', score: 95 },
            { month: 'Jun', score: 94 },
        ],
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
                    <FiTrendingUp size={14} />
                    <span>Performance Analytics</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Operator Performance &amp; Quality Metrics</h2>
                <p className="text-xs text-slate-500 mt-1">
                    Monthly operator efficiency ratings, defect-free quality score, and shift punctuality index.
                </p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-extrabold uppercase">Productivity Rate</span>
                        <FiTrendingUp className="text-purple-600" size={18} />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{perf.productivityScore}%</div>
                    <span className="text-[11px] text-emerald-600 font-bold">+3.2% vs line avg</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-extrabold uppercase">Attendance Score</span>
                        <FiCheckCircle className="text-emerald-600" size={18} />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{perf.attendanceScore}%</div>
                    <span className="text-[11px] text-emerald-600 font-bold">Punctual Operator</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-extrabold uppercase">Quality Audit Score</span>
                        <FiStar className="text-amber-500" size={18} />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{perf.qualityScore}%</div>
                    <span className="text-[11px] text-amber-600 font-bold">Low Defect Rate</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-extrabold uppercase">Overall Efficiency</span>
                        <FiAward className="text-indigo-600" size={18} />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{perf.overallEfficiency}%</div>
                    <span className="text-[11px] text-indigo-600 font-bold">Grade A Operator</span>
                </div>
            </div>

            {/* Monthly Trend Chart Visualizer */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Monthly Performance Trend (2026)</h3>
                <div className="flex items-end justify-between gap-4 h-48 pt-6 px-4 border-b border-slate-100">
                    {perf.monthlyTrend.map((m: any) => (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <span className="text-xs font-bold text-slate-700">{m.score}%</span>
                            <div
                                className="w-full max-w-[40px] bg-purple-600 rounded-t-xl transition-all duration-500 hover:bg-purple-700"
                                style={{ height: `${m.score}%` }}
                            />
                            <span className="text-xs font-extrabold text-slate-400 uppercase">{m.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
