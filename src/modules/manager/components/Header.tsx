'use client';

import React, { useState, useEffect } from 'react';
import { ManagerTab } from '../types';
import {
    FiSearch,
    FiBell,
    FiUserCheck,
    FiCalendar,
    FiChevronDown,
    FiUser,
    FiLogOut,
    FiMenu
} from 'react-icons/fi';
import LogoutModal from '@/shared/components/LogoutModal';
import { useAppSelector } from '@/store/hooks';
import api from '@/config';
import ThemeToggle from '@/shared/components/ThemeToggle';

interface HeaderProps {
    activeTab: ManagerTab;
    onOpenQuickAction?: (actionType: string) => void;
    onToggleMobileMenu?: () => void;
}

const tabTitles: Record<ManagerTab, { title: string; subtitle: string }> = {
    overview: { title: 'Manager Operational Dashboard', subtitle: 'Real-time production tracking, active line monitoring & team supervision' },
    employees: { title: 'Department Team Roster', subtitle: 'View operator profiles, performance metrics, and shift assignments' },
    tasks: { title: 'Task & Workflow Dispatch', subtitle: 'Assign tasks, monitor progress, set priorities & enforce deadlines' },
    attendance: { title: 'Attendance & Leave Approvals', subtitle: 'Review daily check-ins and process team leave requests' },
    production: { title: 'Production Batches & Line Output', subtitle: 'Manage manufacturing batches, target quantities & line progress' },
    inventory: { title: 'Material & Stock Monitor (Read-Only)', subtitle: 'Real-time raw materials, trims & finished goods availability' },
    reports: { title: 'Operational Reports & Analytics', subtitle: 'Export production summary, attendance logs & defect analytics' },
    support: { title: 'Manager Help & Support Desk', subtitle: 'Escalate operational, machine breakdown, or HR issues to Admin' },
};

export default function Header({ activeTab, onOpenQuickAction, onToggleMobileMenu }: HeaderProps) {
    const currentInfo = tabTitles[activeTab] || tabTitles.overview;
    const [profileOpen, setProfileOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const reduxUser = useAppSelector((state) => state.auth.user);
    const [managerUser, setManagerUser] = useState<{ fullName?: string; email?: string; role?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadUser = async () => {
            if (reduxUser) {
                setManagerUser(reduxUser);
                setLoading(false);
                return;
            }

            if (typeof window !== 'undefined') {
                const raw = localStorage.getItem('user');
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed && isMounted) {
                            setManagerUser(parsed);
                            setLoading(false);
                            return;
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }

            try {
                const { data } = await api.get('/api/profile');
                if (data?.user && isMounted) {
                    setManagerUser(data.user);
                }
            } catch (err) {
                // Graceful fallback handled below
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadUser();
        return () => {
            isMounted = false;
        };
    }, [reduxUser]);

    const managerName = managerUser?.fullName || 'Manager User';
    const managerEmail = managerUser?.email || 'manager@stitchflow.com';
    const initials = managerName
        ? managerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'MG';

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
                        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            <FiUserCheck size={13} />
                            <span>Manager Workstation</span>
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
                    {/* Search Bar */}
                    <div className="relative hidden sm:block w-48 md:w-64">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                        <input
                            type="text"
                            placeholder="Search manager station..."
                            className="w-full h-9 pl-9 pr-4 text-xs bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                        />
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" />

                    {/* Notifications */}
                    <button
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Notifications"
                    >
                        <FiBell size={16} />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    </button>

                    {/* Date Badge */}
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                        <FiCalendar size={13} className="text-slate-400 dark:text-slate-500" />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Manager Profile Dropdown */}
                    <div className="relative">
                        {loading ? (
                            <div className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
                                <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded hidden lg:block" />
                            </div>
                        ) : (
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-sm">
                                    {initials}
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden lg:block">
                                    {managerName}
                                </span>
                                <FiChevronDown size={14} className="text-slate-400 dark:text-slate-500" />
                            </button>
                        )}

                        {profileOpen && (
                            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl text-xs z-50">
                                <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                                    <p className="font-bold text-slate-900 dark:text-white">{managerName}</p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{managerEmail}</p>
                                </div>
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
