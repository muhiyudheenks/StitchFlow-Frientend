'use client';

import React, { useState } from 'react';
import { AdminTab } from '../types';
import {
    FiSearch,
    FiBell,
    FiMessageSquare,
    FiSun,
    FiMoon,
    FiChevronDown,
    FiUser,
    FiSettings,
    FiLogOut,
    FiPlus
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    activeTab: AdminTab;
    onOpenQuickAction: (actionType: string) => void;
}

export default function Header({ activeTab, onOpenQuickAction }: HeaderProps) {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const getTabTitle = (tab: AdminTab) => {
        switch (tab) {
            case 'dashboard':
                return { title: 'Executive Overview', desc: 'Real-time telemetry and plant performance metrics.' };
            case 'employees':
                return { title: 'Employee Directory', desc: 'Manage factory floor workers, shifts, and skills.' };
            case 'managers':
                return { title: 'Line Supervisors & Managers', desc: 'Assembly line leads, allocations, and targets.' };
            case 'production':
                return { title: 'Production & Line Balancer', desc: 'Live throughput, workstation statuses, and machine QMS.' };
            case 'inventory':
                return { title: 'Inventory & Stock Control', desc: 'Fabrics, thread spools, trims, and finished goods.' };
            case 'attendance':
                return { title: 'Attendance & Roster Analytics', desc: 'Shift clock-ins, biometric logs, and leave tracking.' };
            case 'analytics':
                return { title: 'Operational Intelligence', desc: 'Deep metrics on yield, efficiency, and revenue.' };
            case 'reports':
                return { title: 'Reports & Export Hub', desc: 'Audit compliance, shift logs, and executive summaries.' };
            case 'settings':
                return { title: 'System Settings', desc: 'Platform configurations, roles, and integrations.' };
            default:
                return { title: 'Admin Console', desc: 'StitchFlow Manufacturing System' };
        }
    };

    const headerMeta = getTabTitle(activeTab);

    return (
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-xl px-6 md:px-10 font-sans shadow-xs">
            {/* Title & Description */}
            <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {headerMeta.title}
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
                    {headerMeta.desc}
                </p>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="relative hidden md:block w-64 lg:w-72">
                    <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search employees, lines, SKU..."
                        className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                </div>

                {/* Quick Action Button */}
                <button
                    onClick={() => onOpenQuickAction('Add Employee')}
                    className="hidden lg:flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
                >
                    <FiPlus size={15} />
                    <span>Quick Action</span>
                </button>

                <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                {/* Theme Toggle (UI only) */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs"
                    title="Toggle Theme"
                >
                    {darkMode ? <FiSun size={17} className="text-amber-500" /> : <FiMoon size={17} />}
                </button>

                {/* Messages Button */}
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs relative"
                    title="Messages"
                >
                    <FiMessageSquare size={17} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-600 ring-2 ring-white" />
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                    <button
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs relative"
                        title="Notifications"
                    >
                        <FiBell size={17} />
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                        </span>
                    </button>

                    {/* Notifications Dropdown */}
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl text-xs z-50">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                                <span className="font-extrabold text-slate-900">Notifications</span>
                                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">3 New</span>
                            </div>
                            <div className="space-y-2.5">
                                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                                    <p className="font-bold text-slate-800">Line A Reached Target</p>
                                    <p className="text-slate-500 mt-0.5 text-[11px]">1,080 Denim Jackets finished ahead of shift target.</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="font-bold text-slate-800">Low Stock: Indigo Spools</p>
                                    <p className="text-slate-500 mt-0.5 text-[11px]">Thread inventory dropped below 1,000 units.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Admin Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs"
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
                                <p className="text-[11px] text-slate-400">alex.vance@stitchflow.com</p>
                            </div>
                            <button
                                onClick={() => setProfileOpen(false)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                            >
                                <FiUser size={14} /> Profile Settings
                            </button>
                            <button
                                onClick={() => setProfileOpen(false)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                            >
                                <FiSettings size={14} /> System Configuration
                            </button>
                            <div className="h-px bg-slate-100 my-1" />
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold"
                            >
                                <FiLogOut size={14} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
