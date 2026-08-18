'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/config';
import { FiTrendingUp, FiAward, FiCheckCircle, FiStar, FiAlertCircle } from 'react-icons/fi';

export default function PerformanceTab() {
    const { data: perf, isLoading, isError, error } = useQuery({
        queryKey: ['employee-performance'],
        queryFn: async () => {
            const response = await api.get('/api/performance/me');
            return response.data?.data || null;
        },
    });

    if (isLoading) {
        return (
            <div className="p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                Calculating performance metrics from database records…
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <FiAlertCircle size={16} />
                <span>Failed to load performance metrics: {(error as any)?.message || 'Server error'}</span>
            </div>
        );
    }

    const hasData = perf && perf.hasData;

    const productivityRate = perf?.productivityRate ?? perf?.productivity ?? 0;
    const attendanceScore = perf?.attendanceScore ?? perf?.attendance ?? 0;
    const qualityScore = perf?.qualityScore ?? perf?.quality;
    const overallEfficiency = perf?.overallEfficiency ?? perf?.efficiency ?? 0;

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    <FiTrendingUp size={14} />
                    <span>Performance Analytics</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Operator Performance &amp; Quality Metrics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time operator efficiency ratings calculated directly from assigned tasks, completed units, and attendance logs.
                </p>
            </div>

            {!hasData ? (
                /* Empty State */
                <div className="p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">No performance data available yet.</p>
                    <p className="text-xs text-slate-400">Complete assigned tasks and log attendance to generate your real-time performance analytics.</p>
                </div>
            ) : (
                <>
                    {/* Score Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Productivity Rate */}
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <span className="text-xs font-extrabold uppercase">Productivity Rate</span>
                                <FiTrendingUp className="text-purple-600 dark:text-purple-400" size={18} />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{productivityRate}%</div>
                            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block">
                                {perf.completedTasks || 0} / {perf.assignedTasks || 0} Tasks Done
                            </span>
                        </div>

                        {/* Attendance Score */}
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <span className="text-xs font-extrabold uppercase">Attendance Score</span>
                                <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" size={18} />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{attendanceScore}%</div>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                                {perf.presentDays || 0} Days Logged
                            </span>
                        </div>

                        {/* Quality Audit Score */}
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <span className="text-xs font-extrabold uppercase">Quality Audit Score</span>
                                <FiStar className="text-amber-500" size={18} />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {qualityScore !== null && qualityScore !== undefined ? `${qualityScore}%` : 'N/A'}
                            </div>
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">
                                {qualityScore !== null ? 'Verified QC Audits' : 'No QC Audits'}
                            </span>
                        </div>

                        {/* Overall Efficiency */}
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <span className="text-xs font-extrabold uppercase">Overall Efficiency</span>
                                <FiAward className="text-indigo-600 dark:text-indigo-400" size={18} />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{overallEfficiency}%</div>
                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block">
                                Weighted Performance
                            </span>
                        </div>
                    </div>

                    {/* Monthly Trend Chart Visualizer */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Monthly Performance Trend (12-Month Dynamic)</h3>
                        <div className="flex items-end justify-between gap-2 h-48 pt-6 px-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto hide-scrollbar">
                            {(perf.monthlyPerformance || []).map((m: any, idx: number) => {
                                const scoreVal = m.overall ?? m.score ?? 0;
                                return (
                                    <div key={m.month + idx} className="flex-1 min-w-[28px] flex flex-col items-center gap-2 h-full justify-end">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{scoreVal}%</span>
                                        <div
                                            className="w-full max-w-[32px] bg-purple-600 dark:bg-purple-500 rounded-t-xl transition-all duration-500 hover:bg-purple-700 dark:hover:bg-purple-400"
                                            style={{ height: `${Math.max(4, Math.min(100, scoreVal))}%` }}
                                        />
                                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase">{m.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
