'use client';

import React, { useState } from 'react';
import { ManagerTab } from '../types';
import {
    FiSearch,
    FiBell,
    FiPlusCircle,
    FiUserCheck,
    FiCalendar,
    FiChevronDown,
    FiUser,
    FiLogOut
} from 'react-icons/fi';
import LogoutModal from '@/shared/components/LogoutModal';

interface HeaderProps {
    activeTab: ManagerTab;
    onOpenQuickAction: (actionType: string) => void;
}

const tabTitles: Record<ManagerTab, { title: string; subtitle: string }> = {
    overview: { title: 'Manager Operational Dashboard', subtitle: 'Real-time production tracking, active line monitoring & team supervision' },
    employees: { title: 'Department Team Roster', subtitle: 'View operator profiles, performance metrics, and shift assignments' },
    tasks: { title: 'Task & Workflow Dispatch', subtitle: 'Assign tasks, monitor progress, set priorities & enforce deadlines' },
    attendance: { title: 'Attendance & Leave Approvals', subtitle: 'Review daily check-ins and process team leave requests' },
    production: { title: 'Production Batches & Line Output', subtitle: 'Manage manufacturing batches, target quantities & line progress' },
    inventory: { title: 'Material & Stock Monitor (Read-Only)', subtitle: 'Real-time raw materials, trims & finished goods availability' },
    reports: { title: 'Operational Reports & Analytics', subtitle: 'Export production summary, attendance logs & defect analytics' },
};

export default function Header({ activeTab, onOpenQuickAction }: HeaderProps) {
    const currentInfo = tabTitles[activeTab] || tabTitles.overview;
    const [profileOpen, setProfileOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-4 md:px-10 font-sans">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                        <FiUserCheck size={13} />
                        <span>Manager Workstation</span>
                    </div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {currentInfo.title}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {currentInfo.subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative hidden sm:block w-64">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search manager station..."
                            className="w-full h-9 pl-9 pr-4 text-xs bg-slate-100/80 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-800 font-medium"
                        />
                    </div>

                    {/* Quick Action Button */}
                    <button
                        onClick={() => onOpenQuickAction('Create Task')}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                        <FiPlusCircle size={15} />
                        <span className="hidden sm:inline">New Task</span>
                    </button>

                    {/* Notifications */}
                    <button
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Notifications"
                    >
                        <FiBell size={16} />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    </button>

                    {/* Date Badge */}
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                        <FiCalendar size={13} className="text-slate-400" />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Manager Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-sm">
                                RV
                            </div>
                            <span className="text-xs font-bold text-slate-800 hidden lg:block">
                                Robert Vance
                            </span>
                            <FiChevronDown size={14} className="text-slate-400" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl text-xs z-50">
                                <div className="p-3 border-b border-slate-100 mb-1">
                                    <p className="font-bold text-slate-900">Robert Vance</p>
                                    <p className="text-[11px] text-slate-400">robert.vance@stitchflow.com</p>
                                </div>
                                <div className="h-px bg-slate-100 my-1" />
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        setIsLogoutModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold cursor-pointer"
                                >
                                    <FiLogOut size={14} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </>
    );
}
