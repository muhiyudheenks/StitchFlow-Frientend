'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { managerNavItems } from '../constants';
import { ManagerTab } from '../types';
import { FiLayers, FiChevronLeft, FiChevronRight, FiLogOut, FiShield } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import LogoutModal from '@/shared/components/LogoutModal';

interface SidebarProps {
    activeTab: ManagerTab;
    setActiveTab: (tab: ManagerTab) => void;
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
    activeTab,
    setActiveTab,
    collapsed,
    setCollapsed,
}: SidebarProps) {
    const router = useRouter();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    return (
        <aside
            className={`relative flex flex-col justify-between bg-[#0F1424] text-slate-300 border-r border-slate-800/80 transition-all duration-300 z-30 font-sans ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Ambient background glow */}
            <div className="absolute top-0 left-0 w-full h-48 bg-indigo-600/10 blur-3xl pointer-events-none" />

            <div>
                {/* Header Branding */}
                <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
                    <div
                        className="flex items-center gap-3 overflow-hidden cursor-pointer"
                        onClick={() => setActiveTab('overview')}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                            <FiLayers size={20} />
                        </div>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col"
                            >
                                <span className="text-lg font-extrabold text-white tracking-tight leading-none">
                                    StitchFlow
                                </span>
                                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                                    <FiShield size={10} /> Manager OS
                                </span>
                            </motion.div>
                        )}
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
                        aria-label="Toggle Sidebar"
                    >
                        {collapsed ? <FiChevronRight size={15} /> : <FiChevronLeft size={15} />}
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="p-3 space-y-1 mt-2">
                    {managerNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${isActive
                                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <Icon
                                        size={19}
                                        className={`shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-300'
                                            }`}
                                    />
                                    {!collapsed && (
                                        <span className="truncate text-xs tracking-wide">
                                            {item.label}
                                        </span>
                                    )}
                                </div>

                                {!collapsed && item.badge && (
                                    <span
                                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${isActive
                                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
                                                : 'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}

                                {isActive && (
                                    <motion.div
                                        layoutId="managerSidebarActiveIndicator"
                                        className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Footer / User Profile & Logout */}
            <div className="p-3 border-t border-slate-800/80">
                {!collapsed ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-xs shadow-md">
                                M
                            </div>
                            <div className="min-w-0 flex flex-col">
                                <span className="text-xs font-bold text-slate-100 truncate">
                                    Robert Vance
                                </span>
                                <span className="text-[10px] text-indigo-400 truncate font-semibold">
                                    Line Manager
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Sign Out"
                        >
                            <FiLogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center p-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Sign Out"
                    >
                        <FiLogOut size={19} />
                    </button>
                )}
            </div>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </aside>
    );
}
