'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiBarChart2, FiPieChart, FiDollarSign, FiZap } from 'react-icons/fi';

export default function AnalyticsTab() {
    return (
        <div className="space-y-8 font-sans">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Output</span>
                        <FiTrendingUp className="text-purple-600" size={18} />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">58,400 pcs</div>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 block">+18.2% vs target</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pass Rate Yield</span>
                        <FiZap className="text-emerald-600" size={18} />
                    </div>
                    <div className="text-3xl font-extrabold text-emerald-600">99.58%</div>
                    <span className="text-xs text-slate-500 mt-1 block">0.42% defect rate</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Revenue</span>
                        <FiDollarSign className="text-indigo-600" size={18} />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">$284,500</div>
                    <span className="text-xs text-indigo-600 font-semibold mt-1 block">+12.4% Q3 YoY</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Tact Time</span>
                        <FiBarChart2 className="text-amber-600" size={18} />
                    </div>
                    <div className="text-3xl font-extrabold text-purple-700">42 seconds</div>
                    <span className="text-xs text-purple-600 font-semibold mt-1 block">-4s vs manual line</span>
                </div>
            </div>

            {/* Visual Analytics Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 8 Cols: Production vs Target Chart Simulation */}
                <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                Monthly Production Throughput vs Capacity Target
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">Finished units per lot (Jan - Jun)</p>
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            2026 Shift Logs
                        </span>
                    </div>

                    {/* Chart Bars */}
                    <div className="grid grid-cols-6 gap-4 items-end h-64 pt-8 border-b border-slate-100 pb-4">
                        {[
                            { month: 'Jan', output: 42, target: 45 },
                            { month: 'Feb', output: 48, target: 45 },
                            { month: 'Mar', output: 52, target: 50 },
                            { month: 'Apr', output: 58, target: 55 },
                            { month: 'May', output: 64, target: 60 },
                            { month: 'Jun', output: 72, target: 65 }
                        ].map((m) => (
                            <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end">
                                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${m.output}%` }}
                                        transition={{ duration: 0.8 }}
                                        className="w-1/2 bg-purple-600 rounded-t-xl"
                                        title={`Output: ${m.output}k`}
                                    />
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${m.target}%` }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                        className="w-1/2 bg-slate-200 rounded-t-xl"
                                        title={`Target: ${m.target}k`}
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-700">{m.month}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-8 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-md bg-purple-600 inline-block" />
                            <span>Finished Output (k pcs)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-md bg-slate-200 inline-block" />
                            <span>Planned Target (k pcs)</span>
                        </div>
                    </div>
                </div>

                {/* 4 Cols: Defect Distribution Breakdown */}
                <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1">
                            Defect Categorization
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">Root cause QMS breakdown</p>

                        <div className="space-y-4">
                            {[
                                { category: 'Seam Puckering', pct: 45, color: 'bg-purple-600' },
                                { category: 'Missing Thread Lock', pct: 30, color: 'bg-indigo-500' },
                                { category: 'Fabric Misalignment', pct: 15, color: 'bg-pink-500' },
                                { category: 'Measurement Delta', pct: 10, color: 'bg-amber-500' }
                            ].map((d) => (
                                <div key={d.category} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-slate-800">
                                        <span>{d.category}</span>
                                        <span>{d.pct}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                            ✓ 99.58% Quality Pass Compliance
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
