'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewTab from './OverviewTab';
import EmployeesTab from './EmployeesTab';
import TasksTab from './TasksTab';
import AttendanceTab from './AttendanceTab';
import ProductionTab from './ProductionTab';
import InventoryTab from './InventoryTab';
import ReportsTab from './ReportsTab';
import ManagerSupportTab from './ManagerSupportTab';
import { ManagerTab } from '../types';
import { FiX, FiCheckSquare } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';

interface ManagerDashboardProps {
    initialTab?: ManagerTab;
}

export default function ManagerDashboard({ initialTab = 'overview' }: ManagerDashboardProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTabState] = useState<ManagerTab>(initialTab);
    const [collapsed, setCollapsed] = useState(false);

    const [mobileOpen, setMobileOpen] = useState(false);

    // Quick Task Modal
    const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
    const [quickTitle, setQuickTitle] = useState('');
    const [quickPriority, setQuickPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

    useEffect(() => {
        if (initialTab) {
            setActiveTabState(initialTab);
        }
    }, [initialTab]);

    const setActiveTab = (tab: ManagerTab) => {
        setActiveTabState(tab);
        const targetRoute = tab === 'overview' ? '/dashboard/manager' : `/dashboard/manager/${tab}`;
        router.push(targetRoute, { scroll: false });
    };

    const handleOpenQuickAction = (actionType: string) => {
        setIsQuickTaskOpen(true);
    };

    const createTaskMutation = useMutation({
        mutationFn: async (newTask: any) => {
            const res = await api.post('/api/manager/tasks', newTask);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-tasks'] });
            setIsQuickTaskOpen(false);
            setQuickTitle('');
        },
    });

    const handleQuickTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickTitle.trim()) return;
        createTaskMutation.mutate({
            title: quickTitle.trim(),
            priority: quickPriority,
        });
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab onNavigateTab={setActiveTab} onOpenQuickAction={handleOpenQuickAction} />;
            case 'employees':
                return <EmployeesTab />;
            case 'tasks':
                return <TasksTab />;
            case 'attendance':
                return <AttendanceTab />;
            case 'production':
                return <ProductionTab />;
            case 'inventory':
                return <InventoryTab />;
            case 'reports':
                return <ReportsTab />;
            case 'support':
                return <ManagerSupportTab />;
            default:
                return <OverviewTab onNavigateTab={setActiveTab} onOpenQuickAction={handleOpenQuickAction} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAFC] dark:bg-[#090D16] font-sans antialiased text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors">
            {/* Manager Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    activeTab={activeTab}
                    onOpenQuickAction={handleOpenQuickAction}
                    onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
                    {renderActiveTab()}
                </main>
            </div>

            {/* Quick Task Modal */}
            {isQuickTaskOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative font-sans max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button
                            onClick={() => setIsQuickTaskOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-5 flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                                <FiCheckSquare size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Dispatch Task</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Quick task assignment for operator shift</p>
                            </div>
                        </div>

                        <form onSubmit={handleQuickTaskSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Task Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Inspect seam stitching on Batch #BT-9042"
                                    value={quickTitle}
                                    onChange={(e) => setQuickTitle(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                                <select
                                    value={quickPriority}
                                    onChange={(e: any) => setQuickPriority(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 font-medium"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsQuickTaskOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTaskMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-extrabold hover:bg-slate-800 dark:hover:bg-indigo-500 shadow-md cursor-pointer disabled:opacity-60"
                                >
                                    {createTaskMutation.isPending ? 'Dispatching…' : 'Dispatch Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
