'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ManagerTab } from '../types';
import {
    FiCpu,
    FiTarget,
    FiUsers,
    FiCheckSquare,
    FiAlertTriangle,
    FiArrowUpRight,
    FiActivity,
    FiClock,
    FiCheckCircle
} from 'react-icons/fi';

interface OverviewTabProps {
    onNavigateTab: (tab: ManagerTab) => void;
    onOpenQuickAction: (actionType: string) => void;
}

export default function OverviewTab({ onNavigateTab, onOpenQuickAction }: OverviewTabProps) {
    const { data: overviewData, isLoading } = useQuery({
        queryKey: ['manager-overview'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/manager/overview', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const metrics = overviewData?.metrics || {
        todayProduction: 3840,
        targetProduction: 4500,
        efficiencyRate: 85,
        activeEmployees: 42,
        totalEmployees: 48,
        pendingApprovals: 6,
        inventoryAlerts: 3,
    };

    const lines = overviewData?.productionLines || [
        { id: '1', name: 'Assembly Line A', completedPcs: 1420, targetPcs: 1800, efficiency: 84, leader: 'David Miller' },
        { id: '2', name: 'Cutting & Laying', completedPcs: 1200, targetPcs: 1400, efficiency: 91, leader: 'Sarah Jenkins' },
        { id: '3', name: 'Denim Outerwear Line', completedPcs: 850, targetPcs: 1000, efficiency: 85, leader: 'Robert Vance' },
        { id: '4', name: 'Quality Control Line', completedPcs: 370, targetPcs: 800, efficiency: 78, leader: 'Elena Rostova' },
    ];

    const activities = overviewData?.recentActivity || [
        { id: '1', title: 'Batch #BT-9042 Completed', description: 'Assembly Line A finished 1,200 Denim Jacket units.', time: '20 mins ago' },
        { id: '2', title: 'Leave Request Received', description: 'Michael Scott submitted a 2-day casual leave request.', time: '1 hour ago' },
        { id: '3', title: 'Low Stock Warning', description: 'Heavyweight Indigo Fabric stock dropped below reorder level.', time: '3 hours ago' },
    ];

    return (
        <div className="space-y-8">
            {/* Top Banner */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                        Shift Status: Active • Line A &amp; B Operational
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                        Garment Production Supervision
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
                        Track shift output, dispatch team tasks, approve attendance logs, and monitor raw material stock levels.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onOpenQuickAction('Create Task')}
                        className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                    >
                        + Assign Task
                    </button>
                    <button
                        onClick={() => onNavigateTab('production')}
                        className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 transition-all cursor-pointer"
                    >
                        New Batch
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Metric 1 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Today Output</span>
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                            <FiCpu size={18} />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                        {isLoading ? '...' : metrics.todayProduction.toLocaleString()} <span className="text-xs font-semibold text-slate-400">pcs</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Target: {metrics.targetProduction.toLocaleString()} pcs</span>
                        <span className="text-emerald-600 flex items-center gap-0.5">
                            <FiArrowUpRight /> {metrics.efficiencyRate}%
                        </span>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Active Workers</span>
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <FiUsers size={18} />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                        {isLoading ? '...' : `${metrics.activeEmployees} / ${metrics.totalEmployees}`}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>On Shift Right Now</span>
                        <button onClick={() => onNavigateTab('employees')} className="text-indigo-600 hover:underline">
                            View Roster &rarr;
                        </button>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Pending Approvals</span>
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                            <FiCheckSquare size={18} />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                        {isLoading ? '...' : metrics.pendingApprovals}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Leaves &amp; Tasks Pending</span>
                        <button onClick={() => onNavigateTab('attendance')} className="text-amber-600 hover:underline">
                            Review &rarr;
                        </button>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider">Stock Warnings</span>
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                            <FiAlertTriangle size={18} />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                        {isLoading ? '...' : metrics.inventoryAlerts} <span className="text-xs font-semibold text-rose-500">Alerts</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Low Fabric &amp; Trims</span>
                        <button onClick={() => onNavigateTab('inventory')} className="text-rose-600 hover:underline">
                            Inspect &rarr;
                        </button>
                    </div>
                </div>
            </div>

            {/* Production Lines Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900">Active Production Lines</h3>
                            <p className="text-xs text-slate-500">Real-time target vs completed garment output per line</p>
                        </div>
                        <button onClick={() => onNavigateTab('production')} className="text-xs font-extrabold text-indigo-600 hover:underline">
                            Manage All Batches &rarr;
                        </button>
                    </div>

                    <div className="space-y-4">
                        {lines.map((line: any) => {
                            const pct = Math.round((line.completedPcs / line.targetPcs) * 100);
                            return (
                                <div key={line.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>{line.name}</span>
                                            <span className="text-[11px] font-normal text-slate-400">({line.leader})</span>
                                        </div>
                                        <span>{line.completedPcs.toLocaleString()} / {line.targetPcs.toLocaleString()} pcs ({pct}%)</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(pct, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity Panel */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 mb-4">
                            <FiActivity className="text-indigo-600" />
                            <span>Recent Shift Activity</span>
                        </div>
                        <div className="space-y-4">
                            {activities.map((act: any) => (
                                <div key={act.id} className="flex items-start gap-3 text-xs">
                                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                                        <FiClock size={14} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{act.title}</div>
                                        <div className="text-slate-500 text-[11px] mt-0.5 leading-snug">{act.description}</div>
                                        <div className="text-[10px] text-slate-400 mt-1 font-semibold">{act.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button
                            onClick={() => onOpenQuickAction('Create Task')}
                            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            + Dispatch New Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
