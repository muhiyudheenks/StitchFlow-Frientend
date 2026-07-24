'use client';

import React, { useState } from 'react';
import { EmployeeTab } from '../types';
import {
    FiSearch,
    FiBell,
    FiUserCheck,
    FiCalendar,
    FiClock,
    FiChevronDown,
    FiUser,
    FiLogOut
} from 'react-icons/fi';
import LogoutModal from '@/shared/components/LogoutModal';

interface HeaderProps {
    activeTab: EmployeeTab;
    onNavigateTab: (tab: EmployeeTab) => void;
}

const tabTitles: Record<EmployeeTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Employee Workstation Dashboard', subtitle: 'Overview of shift progress, assigned tasks, and production target' },
    profile: { title: 'Employee Profile & Account', subtitle: 'Personal credentials, department role, and editable emergency contacts' },
    tasks: { title: 'My Assigned Work Tasks', subtitle: 'View task details, update task progress %, and mark completed' },
    attendance: { title: 'Timekeeping & Attendance Logs', subtitle: 'Log shift check-in/out, view working hours counter & calendar history' },
    leave: { title: 'Leave Application & Balances', subtitle: 'Submit new leave requests and check approved/pending status' },
    production: { title: 'My Line Production Batch', subtitle: 'Track target vs completed garment pieces for Assembly Line A' },
    performance: { title: 'My Performance & Quality Score', subtitle: 'Review operator productivity rate, attendance score & quality metrics' },
    salary: { title: 'Salary Summary & Payslips', subtitle: 'View monthly earnings, overtime, incentives, and download PDF payslips' },
    notifications: { title: 'Notifications & Shift Announcements', subtitle: 'Task dispatches, leave updates, and company news' },
    support: { title: 'Help Desk & Manager Contact', subtitle: 'Direct HR / Manager contact links, issue report form & FAQs' },
};

export default function Header({ activeTab, onNavigateTab }: HeaderProps) {
    const currentInfo = tabTitles[activeTab] || tabTitles.dashboard;
    const [profileOpen, setProfileOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-4 md:px-10 font-sans">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-purple-600">
                        <FiUserCheck size={13} />
                        <span>Operator Workstation</span>
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
                    <div className="relative hidden sm:block w-60">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search employee workstation..."
                            className="w-full h-9 pl-9 pr-4 text-xs bg-slate-100/80 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 transition-all text-slate-800 font-medium"
                        />
                    </div>

                    {/* Shift Badge */}
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                        <FiClock size={13} className="text-purple-500" />
                        <span>Shift A (Morning)</span>
                    </div>

                    {/* Notifications Icon Button */}
                    <button
                        onClick={() => onNavigateTab('notifications')}
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Notifications"
                    >
                        <FiBell size={16} />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                    </button>

                    {/* Date Badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                        <FiCalendar size={13} className="text-slate-400" />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Employee Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-sm">
                                AV
                            </div>
                            <span className="text-xs font-bold text-slate-800 hidden lg:block">
                                Alex Vance
                            </span>
                            <FiChevronDown size={14} className="text-slate-400" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl text-xs z-50">
                                <div className="p-3 border-b border-slate-100 mb-1">
                                    <p className="font-bold text-slate-900">Alex Vance</p>
                                    <p className="text-[11px] text-slate-400">alexander@stitchflow.ai</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        onNavigateTab('profile');
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                                >
                                    <FiUser size={14} /> My Profile
                                </button>
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
