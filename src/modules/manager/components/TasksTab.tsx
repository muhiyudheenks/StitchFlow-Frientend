'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiCheckSquare,
    FiPlus,
    FiUser,
    FiCalendar,
    FiX,
    FiLayers,
    FiAlertCircle,
    FiCheckCircle,
    FiXCircle,
    FiThumbsUp,
    FiThumbsDown
} from 'react-icons/fi';

export default function TasksTab() {
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [taskName, setTaskName] = useState('');
    const [garmentProduct, setGarmentProduct] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [targetQuantity, setTargetQuantity] = useState(100);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showSuccessToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Fetch Batches assigned to logged-in Manager ONLY
    const { data: batches = [] } = useQuery<any[]>({
        queryKey: ['production-batches'],
        queryFn: async () => {
            const response = await api.get('/api/production');
            return response.data?.data || [];
        },
    });

    // Derive selected batch and its assigned members (employees added by Admin)
    const activeBatchId = selectedBatchId || (batches.length > 0 ? batches[0]._id || batches[0].id : '');
    const currentBatch = batches.find((b: any) => (b._id || b.id) === activeBatchId);
    const batchMembers: any[] = currentBatch?.members || [];

    // Fetch Tasks for assigned batches
    const { data: allTasks = [], isLoading: isLoadingTasks } = useQuery<any[]>({
        queryKey: ['managerTasks', activeBatchId],
        queryFn: async () => {
            const params = activeBatchId ? { batchId: activeBatchId } : {};
            const res = await api.get('/api/tasks', { params });
            return res.data?.data || [];
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async (payload: { batchId: string; taskName?: string; garmentProduct: string; targetQuantity: number; description: string; deadline: string }) => {
            const response = await api.post(`/api/manager/batches/${payload.batchId}/tasks`, {
                taskName: payload.taskName,
                productName: payload.garmentProduct,
                targetQuantity: payload.targetQuantity,
                description: payload.description,
                dueDate: payload.deadline,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['managerTasks'] });
            queryClient.invalidateQueries({ queryKey: ['all-batch-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['managerDashboard'] });
            queryClient.invalidateQueries({ queryKey: ['manager-overview'] });
            queryClient.invalidateQueries({ queryKey: ['batchDetails'] });
            queryClient.invalidateQueries({ queryKey: ['productionSummary'] });
            queryClient.invalidateQueries({ queryKey: ['production-batches'] });
            queryClient.invalidateQueries({ queryKey: ['manager-assigned-batches'] });

            setIsCreateModalOpen(false);
            setTaskName('');
            setDescription('');
            setSelectedEmployeeId('');
            setDeadline('');
            setTargetQuantity(100);
            setErrorMessage(null);
            showSuccessToast('Batch task dispatched to all allocated workers successfully!');
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to dispatch task');
        },
    });

    const verifyTaskMutation = useMutation({
        mutationFn: async ({ taskId, status }: { taskId: string; status: 'Verified' | 'Completed' | 'Rejected' }) => {
            const response = await api.patch(`/api/tasks/${taskId}/verify`, { status });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['managerTasks'] });
            queryClient.invalidateQueries({ queryKey: ['all-batch-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['manager-overview'] });
            queryClient.invalidateQueries({ queryKey: ['manager-assigned-batches'] });
            showSuccessToast(`Task ${variables.status === 'Rejected' ? 'Returned for Rework' : 'Approved & Verified'}`);
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to verify task');
        },
    });

    // Fetch Active Garment Products for dropdown
    const { data: activeProducts = [] } = useQuery<any[]>({
        queryKey: ['active-garment-products'],
        queryFn: async () => {
            const res = await api.get('/api/garment-products/active');
            return res.data?.data || [];
        },
    });

    const handleCreateTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!activeBatchId) {
            setErrorMessage('Please select a Production Batch');
            return;
        }

        const batchGarment = currentBatch?.productName || currentBatch?.garmentName || 'Garment Product';

        createTaskMutation.mutate({
            batchId: activeBatchId,
            garmentProduct: batchGarment,
            taskName: taskName.trim() || undefined,
            targetQuantity: Number(targetQuantity || 100),
            description: description.trim(),
            deadline,
        });
    };

    const getTaskCategory = (statusStr: string) => {
        const s = (statusStr || '').trim();
        // Pending: not started yet
        if (s === 'Pending') return 'Pending';
        // In Progress: actively being worked on, OR Rejected (returned for rework)
        if (s === 'In Progress' || s === 'Rejected') return 'In Progress';
        // Completed / Needs Review: fully done and awaiting verification, OR already verified
        if (s === 'Under Review' || s === 'Verified' || s === 'Completed') return 'Completed';
        return 'Pending';
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
                    <FiCheckCircle size={18} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        <FiCheckSquare size={14} />
                        <span>Batch Workstation Dispatch</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Batch Task Dispatch &amp; Verification
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Assign tasks directly to employees allocated to your production batch and verify completed work.
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (batches.length > 0 && !selectedBatchId) {
                            setSelectedBatchId(batches[0]._id || batches[0].id);
                        }
                        setIsCreateModalOpen(true);
                    }}
                    disabled={batches.length === 0 || !activeBatchId}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiPlus size={16} />
                    <span>Assign Task to Batch Employee</span>
                </button>
            </div>

            {/* Warning if No Batches Assigned */}
            {batches.length === 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                    <FiAlertCircle size={18} className="text-amber-600 shrink-0" />
                    <span>No production batches have been assigned to you yet.</span>
                </div>
            )}

            {/* Batch Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                    <FiLayers size={16} className="text-purple-600" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Active Batch:</span>
                    <select
                        value={activeBatchId}
                        onChange={(e) => {
                            setSelectedBatchId(e.target.value);
                            setSelectedEmployeeId('');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                        {batches.length === 0 && <option value="">No Batches Assigned to You</option>}
                        {batches.map((b: any) => (
                            <option key={b._id || b.id} value={b._id || b.id}>
                                {b.batchName} ({b.membersCount || (b.members || []).length || 0} Employees)
                            </option>
                        ))}
                    </select>
                </div>

                {currentBatch && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span>Garment Product: <strong className="text-slate-800 dark:text-slate-200 font-bold">{currentBatch.productName || 'Denim Apparel'}</strong></span>
                        <span>•</span>
                        <span>Allocated Members: <strong className="text-purple-600 font-bold">{batchMembers.length} Workers</strong></span>
                    </div>
                )}
            </div>

            {/* Warning if Batch Has No Employees */}
            {currentBatch && batchMembers.length === 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                    <FiAlertCircle size={18} className="text-amber-600 shrink-0" />
                    <span>No employees have been added to this batch yet. Contact Admin to assign employees to this production batch before dispatching tasks.</span>
                </div>
            )}

            {/* Task Board Columns */}
            {isLoadingTasks ? (
                <div className="p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    Loading task board from database…
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(['Pending', 'In Progress', 'Completed'] as const).map((colTitle) => {
                        const colTasks = allTasks.filter((t: any) => getTaskCategory(t.status) === colTitle);
                        const colInfoMap = {
                            Pending: { title: 'Pending Tasks', color: 'bg-amber-500' },
                            'In Progress': { title: 'In Progress', color: 'bg-purple-500' },
                            Completed: { title: 'Completed / Needs Review', color: 'bg-emerald-500' },
                        };
                        const colInfo = colInfoMap[colTitle];

                        return (
                            <div key={colTitle} className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2.5 w-2.5 rounded-full ${colInfo.color}`} />
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                            {colInfo.title}
                                        </h3>
                                    </div>
                                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                        {colTasks.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {colTasks.length === 0 ? (
                                        <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                                            No tasks in {colTitle.toLowerCase()}.
                                        </div>
                                    ) : (
                                        colTasks.map((t: any) => (
                                            <div key={t.id || t._id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 block mb-0.5">
                                                            {t.batchName || currentBatch?.batchName || 'Batch'}
                                                        </span>
                                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                                            {t.taskName || t.operationName || t.title}
                                                        </h4>
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 shrink-0">
                                                        {t.operationType || 'Stitching'}
                                                    </span>
                                                </div>

                                                {(t.description || t.instructions) && (
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                        {t.description || t.instructions}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                                                        <FiUser size={12} className="text-purple-600" />
                                                        <span>{t.assignedEmployeeName || t.assignedToName || 'Unassigned'}</span>
                                                    </div>
                                                </div>

                                                {/* Real progress display for all tasks */}
                                                {(() => {
                                                    const targetQty    = Number(t.targetQuantity ?? 0);
                                                    const completedQty = Number(t.completedQuantity ?? 0);
                                                    const progressPct  = targetQty > 0 ? Math.min(100, Math.round((completedQty / targetQty) * 100)) : 0;
                                                    const isFullyDone  = completedQty >= targetQty && targetQty > 0;
                                                    return (
                                                        <div className="space-y-1.5 pt-1">
                                                            <div className="flex items-center justify-between text-[10px] font-bold">
                                                                <span className="font-mono text-slate-600 dark:text-slate-400">
                                                                    {completedQty} / {targetQty} pcs
                                                                </span>
                                                                <span className={`font-extrabold ${isFullyDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400'}`}>
                                                                    {progressPct}% Complete
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-300 ${isFullyDone ? 'bg-emerald-500' : 'bg-purple-600'}`}
                                                                    style={{ width: `${progressPct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Manager Verification Actions — only when Under Review */}
                                                {t.status === 'Under Review' && (
                                                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                                                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                                            Review Required
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                onClick={() => verifyTaskMutation.mutate({ taskId: t.id || t._id, status: 'Verified' })}
                                                                disabled={verifyTaskMutation.isPending}
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                                                title="Approve Task"
                                                            >
                                                                <FiThumbsUp size={11} /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => verifyTaskMutation.mutate({ taskId: t.id || t._id, status: 'Rejected' })}
                                                                disabled={verifyTaskMutation.isPending}
                                                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                                                title="Reject & Return for Rework"
                                                            >
                                                                <FiThumbsDown size={11} /> Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {(t.status === 'Verified' || (t.status === 'Completed' && t.verifiedByManager)) && (
                                                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1">
                                                            <FiCheckCircle size={11} /> Verified / Approved
                                                        </span>
                                                        {t.verifiedByManager && (
                                                            <span className="text-[10px] font-medium text-slate-400">
                                                                By {t.verifiedByManager}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {t.status === 'Rejected' && (
                                                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 flex items-center gap-1">
                                                            <FiXCircle size={11} /> Rejected / Rework
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* DISPATCH BATCH TASK MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-5 flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                                <FiPlus size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Dispatch Batch Task</h3>
                                <p className="text-xs text-slate-500">Automatically creates tasks for all allocated workers</p>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
                            {/* Selected Batch */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Production Batch *</label>
                                <select
                                    value={activeBatchId}
                                    onChange={(e) => {
                                        setSelectedBatchId(e.target.value);
                                        setSelectedEmployeeId('');
                                    }}
                                    required
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold outline-none focus:border-indigo-500 cursor-pointer"
                                >
                                    {batches.map((b: any) => (
                                        <option key={b._id || b.id} value={b._id || b.id}>
                                            {b.batchName} ({b.membersCount || (b.members || []).length || 0} Employees)
                                        </option>
                                    ))}
                                </select>
                                {/* Read-only Garment reference text */}
                                <div className="mt-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-xs flex items-center justify-between">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">Garment (Read-only):</span>
                                    <span className="font-extrabold text-purple-900 dark:text-purple-100">{currentBatch?.productName || currentBatch?.garmentName || 'Garment Product'}</span>
                                </div>
                            </div>

                            {/* Task Name */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Task Name / Operation (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Auto-generated if left blank (e.g. Denim Shirt Production)"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-indigo-500"
                                />
                            </div>

                            {/* Target Quantity & Due Date */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Target Quantity *</label>
                                    <input
                                        type="number"
                                        required
                                        min={1}
                                        value={targetQuantity}
                                        onChange={(e) => setTargetQuantity(Number(e.target.value))}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Due Date</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Task Description */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Description / Instructions</label>
                                <textarea
                                    rows={2}
                                    placeholder="Assembly instructions or quality tolerances..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-indigo-500 resize-none"
                                />
                            </div>

                            <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTaskMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {createTaskMutation.isPending ? 'Dispatching…' : 'Dispatch Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
