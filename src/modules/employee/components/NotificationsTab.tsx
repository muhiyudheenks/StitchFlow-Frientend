'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import { EmployeeTab } from '../types';
import {
    FiBell,
    FiClipboard,
    FiCalendar,
    FiClock,
    FiPackage,
    FiAlertTriangle,
    FiCheckCircle,
    FiLayers,
    FiArrowRight,
} from 'react-icons/fi';

interface NotificationsTabProps {
    onNavigateTab?: (tab: EmployeeTab) => void;
}

// Relative time formatter
function getRelativeTime(dateString: string | Date): string {
    if (!dateString) return 'Recently';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return past.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Notification Icon Resolver
function getNotificationIcon(type?: string) {
    switch (type) {
        case 'TASK_ASSIGNED':
        case 'TASK_STATUS':
        case 'TASK':
            return <FiClipboard className="text-purple-600 dark:text-purple-400" size={20} />;
        case 'ATTENDANCE':
            return <FiCalendar className="text-emerald-600 dark:text-emerald-400" size={20} />;
        case 'LEAVE':
            return <FiClock className="text-amber-600 dark:text-amber-400" size={20} />;
        case 'BATCH_EVENT':
            return <FiPackage className="text-indigo-600 dark:text-indigo-400" size={20} />;
        case 'ANNOUNCEMENT':
            return <FiBell className="text-sky-600 dark:text-sky-400" size={20} />;
        default:
            return <FiAlertTriangle className="text-rose-600 dark:text-rose-400" size={20} />;
    }
}

export default function NotificationsTab({ onNavigateTab }: NotificationsTabProps) {
    const queryClient = useQueryClient();

    // Fetch Real Notifications from Backend
    const { data: notifications = [], isLoading } = useQuery<any[]>({
        queryKey: ['employee-notifications'],
        queryFn: async () => {
            const response = await api.get('/api/employee/notifications');
            return response.data?.data || [];
        },
        refetchInterval: 5000, // Poll every 5 seconds for real-time dispatches
    });

    // Mark Single Notification as Read
    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch(`/api/employee/notifications/${id}/read`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-notifications'] });
        },
    });

    // Mark All Notifications as Read
    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            const response = await api.patch('/api/employee/notifications/read-all');
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-notifications'] });
        },
    });

    const handleNotificationClick = (n: any) => {
        const isUnread = !n.isRead && !n.read;
        if (isUnread) {
            markReadMutation.mutate(n.id || n._id);
        }

        // Navigate to My Tasks if it's a task assignment or status update
        if (n.type === 'TASK_ASSIGNED' || n.type === 'TASK_STATUS' || n.type === 'TASK' || n.taskId) {
            if (onNavigateTab) {
                onNavigateTab('tasks');
            }
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

    return (
        <div className="space-y-6 font-sans">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        <FiBell size={14} />
                        <span>Real-Time Employee Activity Stream</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notifications</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        View real-time updates for assigned tasks, production batch allocations, shift attendance, and leave requests.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={() => markAllReadMutation.mutate()}
                        disabled={markAllReadMutation.isPending}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm self-start sm:self-auto disabled:opacity-50"
                    >
                        <FiCheckCircle size={15} />
                        <span>{markAllReadMutation.isPending ? 'Marking All…' : 'Mark All as Read'}</span>
                    </button>
                )}
            </div>

            {/* Notifications Feed Container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                {isLoading ? (
                    /* Loading Skeletons */
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse flex items-start gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    /* Empty State */
                    <div className="py-16 text-center space-y-3">
                        <div className="h-14 w-14 rounded-3xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-100 dark:border-purple-900/50">
                            <FiBell size={24} />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No notifications yet</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            When your manager assigns tasks, updates batch status, or approves attendance/leave, notifications will appear here.
                        </p>
                    </div>
                ) : (
                    /* Real Notification Cards */
                    <div className="space-y-3">
                        {notifications.map((n) => {
                            const isUnread = !n.isRead && !n.read;
                            const isTaskNotification = n.type === 'TASK_ASSIGNED' || n.type === 'TASK_STATUS' || n.type === 'TASK' || n.taskId;

                            return (
                                <div
                                    key={n.id || n._id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all cursor-pointer ${
                                        isUnread
                                            ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50 shadow-2xs'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                                            isUnread
                                                ? 'bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-800'
                                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                                        }`}>
                                            {getNotificationIcon(n.type)}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className={`text-sm font-extrabold ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {n.title}
                                                </h4>

                                                {isUnread && (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-600 text-white">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                                                {n.message}
                                            </div>

                                            {/* Optional Metadata Chips */}
                                            {(n.batchName || n.taskName) && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    {n.batchName && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                                                            <FiLayers size={10} /> {n.batchName}
                                                        </span>
                                                    )}
                                                    {n.taskName && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                                                            <FiClipboard size={10} /> {n.taskName}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {getRelativeTime(n.createdAt)}
                                        </span>

                                        {isTaskNotification && (
                                            <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline">
                                                <span>View Task</span>
                                                <FiArrowRight size={12} />
                                            </span>
                                        )}

                                        {isUnread && (
                                            <span className="h-2.5 w-2.5 rounded-full bg-purple-600 animate-pulse" title="Unread" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
