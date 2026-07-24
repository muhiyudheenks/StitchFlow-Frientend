'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { EmployeeTab } from '../types';
import {
    FiClock,
    FiCheckSquare,
    FiCheckCircle,
    FiTrendingUp,
    FiAward,
    FiCpu,
    FiArrowRight,
    FiActivity,
    FiCalendar,
    FiUser
} from 'react-icons/fi';

interface OverviewTabProps {
    onNavigateTab: (tab: EmployeeTab) => void;
}

export default function OverviewTab({ onNavigateTab }: OverviewTabProps) {
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const hero = dashboardData?.hero || {
        employeeName: 'Alexander Vance',
        greeting: 'Good shift,',
        department: 'Assembly Line A',
        designation: 'Senior Line Operator',
        shift: 'Shift A (08:00 AM - 05:00 PM)',
        currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
        todayAttendanceStatus: 'Checked In (08:42 AM)',
    };

    const kpis = dashboardData?.kpis || {
        todayAttendanceStatus: 'Present (On Time)',
        pendingTasksCount: 3,
        completedTasksCount: 14,
        monthlyAttendanceRate: 96.5,
        performanceScore: 94,
        todayProduction: 380,
        targetProduction: 420,
    };

    const tasks = dashboardData?.myTasks || [];
    const production = dashboardData?.production || {
        assignedBatchNumber: 'BT-9042',
        productName: 'Men Outerwear Vintage Denim Jacket',
        assignedLine: 'Assembly Line A',
        todayTarget: 420,
        completedQty: 380,
        remainingQty: 40,
        efficiency: 92,
    };

    const activities = dashboardData?.recentActivities || [];

    return (
        <div className="space-y-8 font-sans">
            {/* 1. HERO WELCOME SECTION */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-3xl pointer-events-none" />

                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                        <span>{hero.todayAttendanceStatus}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        {hero.greeting} <span className="text-purple-300">{hero.employeeName}</span>! 👋
                    </h1>
                    <p className="text-xs md:text-sm text-slate-300 font-medium">
                        {hero.designation} • {hero.department} • {hero.shift}
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => onNavigateTab('attendance')}
                        className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                    >
                        Log Attendance
                    </button>
                    <button
                        onClick={() => onNavigateTab('tasks')}
                        className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 transition-all cursor-pointer"
                    >
                        My Tasks ({kpis.pendingTasksCount})
                    </button>
                </div>
            </div>

            {/* 2. KPI CARDS (6 Cards Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* KPI 1: Today's Attendance */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Attendance</span>
                        <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                            <FiClock size={16} />
                        </div>
                    </div>
                    <div className="text-base font-extrabold text-slate-900">{kpis.todayAttendanceStatus}</div>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Checked In 08:42 AM</span>
                </div>

                {/* KPI 2: Pending Tasks */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Pending Tasks</span>
                        <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                            <FiCheckSquare size={16} />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900">{kpis.pendingTasksCount} <span className="text-xs text-slate-400 font-normal">Active</span></div>
                    <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">1 Urgent Task</span>
                </div>

                {/* KPI 3: Completed Tasks */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Completed Tasks</span>
                        <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <FiCheckCircle size={16} />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900">{kpis.completedTasksCount} <span className="text-xs text-slate-400 font-normal">Tasks</span></div>
                    <span className="text-[10px] text-indigo-600 font-bold mt-1 inline-block">This Month</span>
                </div>

                {/* KPI 4: Monthly Attendance % */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Monthly Att %</span>
                        <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                            <FiTrendingUp size={16} />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900">{kpis.monthlyAttendanceRate}%</div>
                    <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">+1.5% vs last month</span>
                </div>

                {/* KPI 5: Performance Score */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Quality Score</span>
                        <div className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                            <FiAward size={16} />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900">{kpis.performanceScore} / 100</div>
                    <span className="text-[10px] text-purple-600 font-bold mt-1 inline-block">Top 5% Line Performer</span>
                </div>

                {/* KPI 6: Today's Production */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Today Production</span>
                        <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600">
                            <FiCpu size={16} />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900">{kpis.todayProduction} <span className="text-xs text-slate-400 font-normal">pcs</span></div>
                    <span className="text-[10px] text-rose-600 font-bold mt-1 inline-block">Target: {kpis.targetProduction} pcs</span>
                </div>
            </div>

            {/* 3. TASKS & PRODUCTION PREVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Tasks Card */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900">My Assigned Tasks</h3>
                            <p className="text-xs text-slate-500">Tasks assigned by Line Manager Robert Vance</p>
                        </div>
                        <button onClick={() => onNavigateTab('tasks')} className="text-xs font-extrabold text-purple-600 hover:underline flex items-center gap-1">
                            <span>View All Tasks</span> <FiArrowRight size={13} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {tasks.map((task: any) => (
                            <div key={task.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${task.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : task.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                                            {task.priority}
                                        </span>
                                        <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                                    </div>
                                    <p className="text-[11px] text-slate-500">{task.description}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="w-24 text-right">
                                        <div className="text-[11px] font-bold text-slate-800">{task.progress}% Done</div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${task.progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Production Progress Card */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600">Assigned Batch</span>
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono font-bold text-xs">{production.assignedBatchNumber}</span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900">{production.productName}</h3>
                        <p className="text-xs text-slate-500 mt-1">{production.assignedLine}</p>

                        <div className="my-6 p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                <span>Batch Fulfillment</span>
                                <span>{production.completedQty} / {production.todayTarget} pcs</span>
                            </div>
                            <div className="h-3 w-full bg-purple-200/60 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${production.efficiency}%` }} />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-purple-900 font-semibold pt-1">
                                <span>Remaining: {production.remainingQty} pcs</span>
                                <span>Efficiency: {production.efficiency}%</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onNavigateTab('production')}
                        className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        View Production Batch Details
                    </button>
                </div>
            </div>

            {/* 4. RECENT ACTIVITY TIMELINE */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                    <FiActivity className="text-purple-600" size={16} />
                    <span>Today Shift Activity Timeline</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activities.map((act: any) => (
                        <div key={act.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                                <FiCheckCircle size={16} />
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-slate-900">{act.title}</h5>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{act.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
