'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiCheckSquare,
    FiCheckCircle,
    FiCalendar,
    FiX,
    FiPlay,
    FiCpu
} from 'react-icons/fi';

export default function TasksTab() {
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // Fetch assigned tasks for logged-in employee from MongoDB
    const { data: myTasks = [], isLoading } = useQuery<any[]>({
        queryKey: ['employee-tasks'],
        queryFn: async () => {
            const response = await api.get('/api/tasks');
            return response.data?.data || [];
        },
    });

    const updateProgressMutation = useMutation({
        mutationFn: async ({ taskId, completedQuantity, status }: { taskId: string; completedQuantity: number; status?: string }) => {
            const response = await api.patch(`/api/tasks/${taskId}/progress`, {
                completedQuantity,
                status,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
            setActionMessage('Task progress updated!');
            setTimeout(() => setActionMessage(null), 3000);
        },
    });

    const submitCompleteMutation = useMutation({
        mutationFn: async (taskId: string) => {
            const response = await api.patch(`/api/tasks/${taskId}/complete`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
            setActionMessage('Task submitted for Manager verification!');
            setTimeout(() => setActionMessage(null), 3000);
        },
    });

    const handleQuantityChange = (taskId: string, targetQty: number, currentCompleted: number, newCompleted: number) => {
        const validQty = Math.max(0, Math.min(targetQty, newCompleted));
        const newStatus = validQty >= targetQty ? 'Under Review' : validQty > 0 ? 'In Progress' : 'Pending';
        updateProgressMutation.mutate({ taskId, completedQuantity: validQty, status: newStatus });
    };

    const handleStartTask = (taskId: string) => {
        updateProgressMutation.mutate({ taskId, completedQuantity: 1, status: 'In Progress' });
    };

    const handleMarkComplete = (taskId: string) => {
        submitCompleteMutation.mutate(taskId);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Action Feedback Banner */}
            {actionMessage && (
                <div className="p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-lg flex items-center justify-between animate-bounce">
                    <div className="flex items-center gap-2">
                        <FiCheckCircle size={16} />
                        <span>{actionMessage}</span>
                    </div>
                </div>
            )}

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        <FiCheckSquare size={14} />
                        <span>My Workstation Tasks</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Assigned Work Tasks</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        View assigned batch operation tasks, log completed garment pieces, and submit work for manager review.
                    </p>
                </div>
            </div>

            {/* Task Grid */}
            {isLoading ? (
                <div className="p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    Loading your assigned tasks from database…
                </div>
            ) : myTasks.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    No assigned tasks for your account at this time.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myTasks.map((t: any) => {
                        const targetQty = Number(t.targetQuantity || 100);
                        const completedQty = Number(t.completedQuantity || 0);
                        const progressPct = Math.min(100, Math.round((completedQty / targetQty) * 100));

                        return (
                            <div key={t.id || t._id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                                            <FiCpu size={12} /> {t.batchName || 'Batch'}
                                        </span>

                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                                                t.status === 'Completed' || t.status === 'Verified'
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                                    : t.status === 'Under Review'
                                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                                                    : t.status === 'In Progress'
                                                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            {t.status || 'Pending'}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {t.workerType || t.operationType || 'Stitching'} Worker
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                                Priority: {t.priority || 'Medium'}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                                            {t.taskName || t.operationName || t.title}
                                        </h3>
                                    </div>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {t.description || 'No special instructions provided.'}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <span className="flex items-center gap-1 font-mono text-[11px]">
                                            <FiCalendar size={13} /> Due: {t.dueDate || 'N/A'}
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            Target: {targetQty} pcs ({completedQty} Done)
                                        </span>
                                    </div>

                                    {/* Completed Quantity Input Slider */}
                                    <div className="space-y-1">
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={targetQty}
                                            step="1"
                                            value={completedQty}
                                            disabled={t.status === 'Completed' || t.status === 'Verified' || t.status === 'Under Review'}
                                            onChange={(e) => handleQuantityChange(t.id || t._id, targetQty, completedQty, Number(e.target.value))}
                                            className="w-full accent-purple-600 cursor-pointer disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => setSelectedTask(t)}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                                    >
                                        View Specs
                                    </button>

                                    {t.status === 'Pending' ? (
                                        <button
                                            onClick={() => handleStartTask(t.id || t._id)}
                                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                                        >
                                            <FiPlay size={14} /> Start Task
                                        </button>
                                    ) : t.status === 'In Progress' ? (
                                        <button
                                            onClick={() => handleMarkComplete(t.id || t._id)}
                                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                                        >
                                            <FiCheckCircle size={14} /> Submit for Review
                                        </button>
                                    ) : (
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                                            <FiCheckCircle /> {t.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button
                            onClick={() => setSelectedTask(null)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                Task Specifications
                            </span>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-2">
                                {selectedTask.taskName || selectedTask.operationName || selectedTask.title}
                            </h3>
                        </div>

                        <div className="space-y-3 text-xs mb-6">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Batch Name</span>
                                <div className="font-extrabold text-purple-600">{selectedTask.batchName || 'Production Batch'}</div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Worker Role</span>
                                <div className="font-extrabold">{selectedTask.workerType || 'Stitching'} Worker</div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">Instructions</span>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                    {selectedTask.description || 'No detailed instructions provided.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 font-extrabold text-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
