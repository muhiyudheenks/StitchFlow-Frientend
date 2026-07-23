'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { mockKpis, mockRecentActivities, mockProductionLines } from '../data/mockData';
import {
    FiUsers,
    FiUserCheck,
    FiClock,
    FiCpu,
    FiBox,
    FiTrendingUp,
    FiPlus,
    FiArrowUpRight,
    FiCheckCircle,
    FiActivity
} from 'react-icons/fi';

interface OverviewTabProps {
    onOpenQuickAction: (actionType: string) => void;
    onNavigateTab: (tab: any) => void;
}

export default function OverviewTab({ onOpenQuickAction, onNavigateTab }: OverviewTabProps) {
    const getKpiIcon = (index: number) => {
        switch (index) {
            case 0: return FiUsers;
            case 1: return FiUserCheck;
            case 2: return FiClock;
            case 3: return FiCpu;
            case 4: return FiBox;
            case 5: return FiTrendingUp;
            default: return FiActivity;
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Top Welcome Hero Banner */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl overflow-hidden border border-white/10"
            >
                {/* Glowing Radial Background Blobs */}
                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-purple-300 mb-4">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                            Live Enterprise Operations
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Factory Floor Intelligence & Control
                        </h2>
                        <p className="text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
                            340 workers active across 3 assembly lines. Today&apos;s output is currently running at 85.6% of shift target with 99.1% QMS pass yield.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => onOpenQuickAction('Add Employee')}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-950 font-extrabold text-xs hover:bg-purple-50 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <FiPlus size={16} />
                            Add Employee
                        </button>
                        <button
                            onClick={() => onNavigateTab('production')}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs backdrop-blur-md border border-white/15 transition-all"
                        >
                            <span>Live Floor Roster</span>
                            <FiArrowUpRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Add Employee', action: 'Add Employee', icon: FiUsers, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                    { label: 'Add Manager', action: 'Add Manager', icon: FiUserCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                    { label: 'Create Production', action: 'Create Production', icon: FiCpu, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                    { label: 'Update Stock', action: 'Update Stock', icon: FiBox, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                    { label: 'Generate Report', action: 'Generate Report', icon: FiActivity, color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100' }
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.label}
                            onClick={() => onOpenQuickAction(item.action)}
                            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-purple-300 hover:scale-[1.02] transition-all text-left group cursor-pointer"
                        >
                            <div className={`p-2.5 rounded-xl border ${item.color} group-hover:scale-105 transition-transform`}>
                                <Icon size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-800 leading-snug">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockKpis.map((kpi, idx) => {
                    const Icon = getKpiIcon(idx);
                    return (
                        <motion.div
                            key={kpi.title}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            whileHover={{ y: -4 }}
                            className="relative rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                        {kpi.badge}
                                    </span>
                                </div>

                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {kpi.title}
                                </span>
                                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2 group-hover:text-purple-700 transition-colors">
                                    {kpi.value}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="font-semibold text-emerald-600">
                                    {kpi.change}
                                </span>
                                <span className="text-slate-400 text-[11px]">Updated live</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Middle Split: Live Lines Status & Recent Activity Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left (7 cols): Live Assembly Lines Progress */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                Active Assembly Lines Progress
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">Tact time & pcs output per line</p>
                        </div>
                        <button
                            onClick={() => onNavigateTab('production')}
                            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                            View All <FiArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {mockProductionLines.map((line) => (
                            <div key={line.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="font-extrabold text-sm text-slate-900">{line.name}</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200">
                                            {line.status}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-700">
                                        {line.completedPcs} / {line.targetPcs} pcs
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${(line.completedPcs / line.targetPcs) * 100}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>Leader: <strong className="text-slate-800">{line.stationLeader}</strong></span>
                                    <span>Efficiency: <strong className="text-purple-700">{line.efficiencyRate}%</strong></span>
                                    <span>Workers: <strong className="text-slate-800">{line.activeWorkers}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right (5 cols): Recent Activity Feed */}
                <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                Recent Activity Stream
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
                        </div>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                            {mockRecentActivities.map((act) => (
                                <div key={act.id} className="relative">
                                    <span className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-white ring-4 ring-white">
                                        <FiCheckCircle size={10} />
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-extrabold text-slate-900 leading-snug">
                                            {act.title}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                            {act.description}
                                        </p>
                                        <span className="text-[10px] text-slate-400 font-mono mt-1">
                                            {act.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => onNavigateTab('reports')}
                        className="mt-6 w-full py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors text-center"
                    >
                        View Full Audit Log
                    </button>
                </div>
            </div>
        </div>
    );
}
