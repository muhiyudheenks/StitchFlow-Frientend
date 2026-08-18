'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/config';
import { EmployeeTab } from '../types';
import {
    FiSearch,
    FiBell,
    FiUserCheck,
    FiCalendar,
    FiClock,
    FiChevronDown,
    FiUser,
    FiLogOut,
    FiMenu
} from 'react-icons/fi';
import LogoutModal from '@/shared/components/LogoutModal';
import { useAppSelector } from '@/store/hooks';
import ThemeToggle from '@/shared/components/ThemeToggle';

interface HeaderProps {
    activeTab: EmployeeTab;
    onNavigateTab: (tab: EmployeeTab) => void;
    onToggleMobileMenu?: () => void;
}

const tabTitles: Record<EmployeeTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Employee Workstation Dashboard', subtitle: 'Overview of shift progress, assigned tasks, and production target' },
    profile: { title: 'Employee Profile & Account', subtitle: 'Personal credentials, department role, and editable emergency contacts' },
    tasks: { title: 'My Assigned Work Tasks', subtitle: 'View task details, update task progress %, and mark completed' },
    attendance: { title: 'Timekeeping, Attendance & Leave Portal', subtitle: 'Log shift check-in/out, view working hours counter, leave balances, and apply for leaves' },
    leave: { title: 'Timekeeping, Attendance & Leave Portal', subtitle: 'Log shift check-in/out, view working hours counter, leave balances, and apply for leaves' },
    production: { title: 'My Line Production Batch', subtitle: 'Track target vs completed garment pieces for Assembly Line A' },
    performance: { title: 'My Performance & Quality Score', subtitle: 'Review operator productivity rate, attendance score & quality metrics' },
    salary: { title: 'Salary Summary & Payslips', subtitle: 'View monthly earnings, overtime, incentives, and download PDF payslips' },
    notifications: { title: 'Notifications & Shift Announcements', subtitle: 'Task dispatches, leave updates, and company news' },
    support: { title: 'Help Desk & Manager Contact', subtitle: 'Direct HR / Manager contact links, issue report form & FAQs' },
};

export default function Header({ activeTab, onNavigateTab, onToggleMobileMenu }: HeaderProps) {
    const currentInfo = tabTitles[activeTab] || tabTitles.dashboard;
    const [profileOpen, setProfileOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
    const userName = user?.fullName || 'Employee User';
    const userEmail = user?.email || 'employee@stitchflow.com';
    const initials = userName
        ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'EU';

    // Fetch notifications to compute unread badge count
    const { data: notifications = [] } = useQuery<any[]>({
        queryKey: ['employee-notifications'],
        queryFn: async () => {
            const response = await api.get('/api/employee/notifications');
            return response.data?.data || [];
        },
        refetchInterval: 10000,
    });

    const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

    return (
        <>
            <header className="sticky top-0 z-20 flex flex-row items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-4 md:px-10 font-sans transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={onToggleMobileMenu}
                        className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-xs"
                        aria-label="Toggle Mobile Menu"
                    >
                        <FiMenu size={18} />
                    </button>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            <FiUserCheck size={13} />
                            <span>Operator Workstation</span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                            {currentInfo.title}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 hidden sm:block truncate">
                            {currentInfo.subtitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Shift Badge */}
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-900/50">
                        <FiClock size={13} className="text-purple-500 dark:text-purple-400" />
                        <span>Shift A (Morning)</span>
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" />

                    {/* Notifications Icon Button */}
                    <button
                        onClick={() => onNavigateTab('notifications')}
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        aria-label="Notifications"
                    >
                        <FiBell size={16} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-white text-[9px] font-extrabold shadow-sm animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Date Badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                        <FiCalendar size={13} className="text-slate-400 dark:text-slate-500" />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Employee Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <div className="h-8 w-8 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                                {initials}
                            </div>
                            <div className="hidden md:flex flex-col text-left">
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                                    {userName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold leading-tight">
                                    Assembly Operator
                                </span>
                            </div>
                            <FiChevronDown size={14} className="text-slate-400 hidden md:block" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs">
                                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                    <p className="font-extrabold text-slate-900 dark:text-white">{userName}</p>
                                    <p className="text-[11px] text-slate-400 font-medium truncate">{userEmail}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        onNavigateTab('profile');
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
                                >
                                    <FiUser size={14} /> My Account Profile
                                </button>
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        setIsLogoutModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800"
                                >
                                    <FiLogOut size={14} /> Logout
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
