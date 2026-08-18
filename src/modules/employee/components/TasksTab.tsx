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
    FiCpu,
    FiAlertCircle,
    FiInfo,
} from 'react-icons/fi';

export default function TasksTab() {
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

    // Fetch assigned tasks for logged-in employee from MongoDB
    const { data: myTasks = [], isLoading } = useQuery<any[]>({
        queryKey: ['employee-tasks'],
        queryFn: async () => {
            const response = await api.get('/api/tasks');
            return response.data?.data || [];
        },
    });

    const showMessage = (text: string, type: 'success' | 'warning' | 'error' = 'success') => {
        setActionMessage({ text, type });
        setTimeout(() => setActionMessage(null), 4000);
    };

    // Update progress: send only completedQuantity — backend derives status
    const updateProgressMutation = useMutation({
        mutationFn: async ({ taskId, completedQuantity }: { taskId: string; completedQuantity: number }) => {
            const response = await api.patch(`/api/tasks/${taskId}/progress`, { completedQuantity });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
            showMessage('Progress saved!', 'success');
        },
        onError: (err: any) => {
            showMessage(err.response?.data?.message || 'Failed to update progress', 'error');
        },
    });

    // Submit for review: backend enforces completedQuantity === targetQuantity
    const submitCompleteMutation = useMutation({
        mutationFn: async (taskId: string) => {
            const response = await api.patch(`/api/tasks/${taskId}/complete`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['employee-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
            if (data?.incomplete) {
                // Backend enforced: task is not 100% complete yet
                showMessage(data.message || 'Complete all assigned pieces before submitting for review.', 'warning');
            } else {
                showMessage('Task submitted for Manager verification!', 'success');
            }
        },
        onError: (err: any) => {
            showMessage(err.response?.data?.message || 'Failed to submit task', 'error');
        },
    });

    // Start Task: set completedQuantity = 0, status driven by backend (moves to In Progress via startedAt)
    const handleStartTask = (taskId: string) => {
        updateProgressMutation.mutate({ taskId, completedQuantity: 0 });
    };

    // Employee adjusts slider — only update if task is in a workable state
    const handleQuantityChange = (taskId: string, targetQty: number, newCompleted: number) => {
        const validQty = Math.max(0, Math.min(targetQty, newCompleted));
        updateProgressMutation.mutate({ taskId, completedQuantity: validQty });
    };

    // Submit for review button — backend validates quantity
    const handleMarkComplete = (taskId: string, completedQty: number, targetQty: number) => {
        if (completedQty < targetQty) {
            showMessage(
                `Cannot submit yet: ${completedQty} of ${targetQty} pieces completed. Complete all ${targetQty - completedQty} remaining piece(s) first.`,
                'warning'
            );
            return;
        }
        submitCompleteMutation.mutate(taskId);
    };

    const isTaskEditable = (status: string) =>
        status === 'Pending' || status === 'In Progress';

    return (
        <div className="space-y-6 font-sans">
            {/* Action Feedback Banner */}
            {actionMessage && (
                <div className={`p-4 rounded-2xl font-extrabold text-xs shadow-lg flex items-center gap-2 ${
                    actionMessage.type === 'success'
                        ? 'bg-emerald-600 text-white'
                        : actionMessage.type === 'warning'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-600 text-white'
                }`}>
                    {actionMessage.type === 'success' && <FiCheckCircle size={16} />}
                    {actionMessage.type === 'warning' && <FiAlertCircle size={16} />}
                    {actionMessage.type === 'error'   && <FiAlertCircle size={16} />}
                    <span>{actionMessage.text}</span>
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
                        const targetQty    = Number(t.targetQuantity || 1);
                        const completedQty = Number(t.completedQuantity ?? 0);
                        const remaining    = Math.max(0, targetQty - completedQty);
                        // Progress percentage: real math, never hardcoded
                        const progressPct  = targetQty > 0 ? Math.min(100, Math.round((completedQty / targetQty) * 100)) : 0;
                        const isFullyDone  = completedQty >= targetQty;
                        const canEdit      = isTaskEditable(t.status);

                        return (
                            <div key={t.id || t._id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    {/* Status + Batch row */}
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                                            <FiCpu size={12} /> {t.batchName || 'Batch'}
                                        </span>

                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                                            t.status === 'Verified'
                                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                                : t.status === 'Under Review'
                                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                                                : t.status === 'In Progress'
                                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200'
                                                : t.status === 'Rejected'
                                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                        }`}>
                                            {t.status === 'Under Review' ? 'Submitted' : (t.status || 'Pending')}
                                        </span>
                                    </div>

                                    {/* Task name and badges */}
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

                                    {/* Due date + quantity summary */}
                                    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <span className="flex items-center gap-1 font-mono text-[11px]">
                                            <FiCalendar size={13} /> Due: {t.dueDate || 'N/A'}
                                        </span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {completedQty} / {targetQty} pcs
                                        </span>
                                    </div>

                                    {/* Progress section: visible once task is started */}
                                    {(t.status === 'In Progress' || t.status === 'Under Review' || t.status === 'Verified' || t.status === 'Rejected') && (
                                        <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                            {/* Quantity breakdown */}
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">{targetQty}</div>
                                                    <div className="text-[10px] text-slate-400 font-semibold">Assigned</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{completedQty}</div>
                                                    <div className="text-[10px] text-slate-400 font-semibold">Completed</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400">{remaining}</div>
                                                    <div className="text-[10px] text-slate-400 font-semibold">Remaining</div>
                                                </div>
                                            </div>

                                            {/* Visual progress bar */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-[10px] font-bold">
                                                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                                                    <span className={`font-extrabold ${isFullyDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400'}`}>
                                                        {progressPct}%
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-300 ${isFullyDone ? 'bg-emerald-500' : 'bg-purple-600'}`}
                                                        style={{ width: `${progressPct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Slider: only when task is editable (Pending → show after start, In Progress) */}
                                    {canEdit && t.status === 'In Progress' && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Update Completed Pieces
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max={targetQty}
                                                step="1"
                                                value={completedQty}
                                                onChange={(e) => handleQuantityChange(t.id || t._id, targetQty, Number(e.target.value))}
                                                className="w-full accent-purple-600 cursor-pointer"
                                                disabled={updateProgressMutation.isPending}
                                            />
                                        </div>
                                    )}

                                    {/* Rejected notice */}
                                    {t.status === 'Rejected' && (
                                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-bold text-rose-700 dark:text-rose-300">
                                            <FiAlertCircle size={13} />
                                            <span>Returned for rework. Update your completed pieces and resubmit.</span>
                                        </div>
                                    )}

                                    {/* Under Review notice */}
                                    {t.status === 'Under Review' && (
                                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs font-bold text-amber-700 dark:text-amber-300">
                                            <FiInfo size={13} />
                                            <span>Awaiting manager verification.</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action buttons */}
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
                                            disabled={updateProgressMutation.isPending}
                                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition-colors disabled:opacity-60"
                                        >
                                            <FiPlay size={14} /> Start Task
                                        </button>
                                    ) : t.status === 'In Progress' || t.status === 'Rejected' ? (
                                        <button
                                            onClick={() => handleMarkComplete(t.id || t._id, completedQty, targetQty)}
                                            disabled={submitCompleteMutation.isPending}
                                            title={!isFullyDone ? `Complete ${remaining} more piece(s) before submitting` : 'Submit for manager review'}
                                            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition-all disabled:opacity-60 ${
                                                isFullyDone
                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <FiCheckCircle size={14} />
                                            {isFullyDone ? 'Submit for Review' : `${completedQty}/${targetQty} — Not Ready`}
                                        </button>
                                    ) : (
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                                            <FiCheckCircle /> {t.status === 'Verified' ? 'Verified ✓' : t.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Specs Modal */}
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
                            {[
                                { label: 'Batch Name',       value: selectedTask.batchName || 'Production Batch', highlight: true },
                                { label: 'Worker Role',      value: `${selectedTask.workerType || 'Stitching'} Worker` },
                                { label: 'Assigned Qty',     value: `${selectedTask.targetQuantity || 0} pcs` },
                                { label: 'Completed Qty',    value: `${selectedTask.completedQuantity || 0} pcs` },
                                { label: 'Status',           value: selectedTask.status || 'Pending' },
                            ].map(({ label, value, highlight }) => (
                                <div key={label} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 block uppercase">{label}</span>
                                    <div className={`font-extrabold ${highlight ? 'text-purple-600' : ''}`}>{value}</div>
                                </div>
                            ))}
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
