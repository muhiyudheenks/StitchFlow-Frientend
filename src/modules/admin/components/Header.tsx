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
    FiMenu
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import LogoutModal from '@/shared/components/LogoutModal';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

import ThemeToggle from '@/shared/components/ThemeToggle';

interface HeaderProps {
    activeTab: AdminTab;
    onOpenQuickAction?: (actionType: string) => void;
    onToggleMobileMenu?: () => void;
}

export default function Header({ activeTab, onOpenQuickAction, onToggleMobileMenu }: HeaderProps) {
    const router = useRouter();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const reduxUser = useAppSelector((state) => state.auth.user);
    const [localUser, setLocalUser] = useState<{ fullName?: string; email?: string } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('user');
            if (raw) {
                try {
                    setLocalUser(JSON.parse(raw));
                } catch (e) {
                    // ignore
                }
            }
        }
    }, []);

    const user = reduxUser || localUser;
    const adminName = user?.fullName || 'Admin User';
    const adminEmail = user?.email || 'admin@stitchflow.com';
    const initials = adminName
        ? adminName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'AU';

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

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 md:px-10 font-sans shadow-xs transition-colors">
                {/* Title & Mobile Toggle */}
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={onToggleMobileMenu}
                        className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-xs"
                        aria-label="Toggle Mobile Menu"
                    >
                        <FiMenu size={18} />
                    </button>

                    <div className="flex flex-col min-w-0">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                            {headerMeta.title}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5 truncate">
                            {headerMeta.desc}
                        </p>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Search Bar */}
                    <div className="relative hidden md:block w-64 lg:w-72">
                        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                        <input
                            type="text"
                            placeholder="Search employees, lines, SKU..."
                            className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all"
                        />
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Messages Button */}
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all shadow-2xs relative"
                        title="Messages"
                    >
                        <FiMessageSquare size={17} />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-slate-900" />
                    </button>

                    {/* Notifications Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all shadow-2xs relative"
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
                            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl text-xs z-50">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                                    <span className="font-extrabold text-slate-900 dark:text-white">Notifications</span>
                                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">3 New</span>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">Line A Reached Target</p>
                                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px]">1,080 Denim Jackets finished ahead of shift target.</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">Low Stock: Indigo Spools</p>
                                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px]">Thread inventory dropped below 1,000 units.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-sm">
                                {initials}
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden lg:block">
                                {adminName}
                            </span>
                            <FiChevronDown size={14} className="text-slate-400 dark:text-slate-500" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl text-xs z-50">
                                <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                                    <p className="font-bold text-slate-900 dark:text-white">{adminName}</p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{adminEmail}</p>
                                </div>
                                <button
                                    onClick={() => setProfileOpen(false)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium cursor-pointer"
                                >
                                    <FiUser size={14} /> Profile Settings
                                </button>
                                <button
                                    onClick={() => setProfileOpen(false)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium cursor-pointer"
                                >
                                    <FiSettings size={14} /> System Configuration
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        setIsLogoutModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold cursor-pointer"
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
