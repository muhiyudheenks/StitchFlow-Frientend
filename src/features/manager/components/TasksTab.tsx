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
    FiCheckCircle
} from 'react-icons/fi';

export default function TasksTab() {
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [targetQuantity, setTargetQuantity] = useState(100);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showSuccessToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Fetch Batches assigned to Manager
    const { data: batches = [] } = useQuery<any[]>({
        queryKey: ['production-batches'],
        queryFn: async () => {
            const response = await api.get('/api/production');
            return response.data?.data || [];
        },
    });

    // Fetch Active Employees for Task Assignment
    const { data: employees = [] } = useQuery<any[]>({
        queryKey: ['manager-employees'],
        queryFn: async () => {
            const response = await api.get('/api/manager/employees');
            return response.data?.data || [];
        },
    });

    // Fetch Tasks directly from /api/tasks with optional batch filter
    const { data: allTasks = [], isLoading: isLoadingTasks } = useQuery<any[]>({
        queryKey: ['managerTasks', selectedBatchId],
        queryFn: async () => {
            const params = selectedBatchId ? { batchId: selectedBatchId } : {};
            const res = await api.get('/api/tasks', { params });
            return res.data?.data || [];
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async (payload: { batchId: string; employeeId: string; taskName: string; targetQuantity: number; description: string; deadline: string }) => {
            const response = await api.post('/api/tasks', {
                batchId: payload.batchId,
                assignedEmployee: payload.employeeId,
                taskName: payload.taskName,
                targetQuantity: payload.targetQuantity,
                description: payload.description,
                dueDate: payload.deadline,
            });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate all query keys across Manager module
            queryClient.invalidateQueries({ queryKey: ['managerTasks'] });
            queryClient.invalidateQueries({ queryKey: ['all-batch-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['managerDashboard'] });
            queryClient.invalidateQueries({ queryKey: ['manager-overview'] });
            queryClient.invalidateQueries({ queryKey: ['batchDetails'] });
            queryClient.invalidateQueries({ queryKey: ['productionSummary'] });
            queryClient.invalidateQueries({ queryKey: ['production-batches'] });

            setIsCreateModalOpen(false);
            setTaskName('');
            setDescription('');
            setSelectedEmployeeId('');
            setDeadline('');
            setTargetQuantity(100);
            setErrorMessage(null);
            showSuccessToast('Task created and assigned successfully!');
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to create task');
        },
    });

    const handleCreateTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        if (!selectedBatchId) {
            setErrorMessage('Please select a Production Batch');
            return;
        }
        if (!selectedEmployeeId) {
            setErrorMessage('Please select an Employee to assign');
            return;
        }
        if (!taskName.trim()) {
            setErrorMessage('Task Name is required');
            return;
        }

        createTaskMutation.mutate({
            batchId: selectedBatchId,
            employeeId: selectedEmployeeId,
            taskName: taskName.trim(),
            targetQuantity: Number(targetQuantity || 100),
            description: description.trim(),
            deadline,
        });
    };

    // Helper to categorize task status into Task Board Columns
    const getTaskCategory = (statusStr: string) => {
        const s = (statusStr || '').toLowerCase().replace(/_/g, ' ').trim();
        if (s === 'in progress') return 'In Progress';
        if (s === 'completed' || s === 'under review' || s === 'rejected') return 'Completed';
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
                        <span>Task Assignment &amp; Management</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Task Dispatch &amp; Execution
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Assign tasks to employees. Employees are automatically added to the batch when assigned.
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (batches.length > 0 && !selectedBatchId) {
                            setSelectedBatchId(batches[0]._id || batches[0].id);
                        }
                        setIsCreateModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Assign Task to Employee</span>
                </button>
            </div>

            {/* Batch Filter Bar */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <FiLayers size={16} className="text-purple-600" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Filter by Batch:</span>
                <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                    <option value="">All Assigned Batches ({allTasks.length} Tasks)</option>
                    {batches.map((b: any) => (
                        <option key={b._id || b.id} value={b._id || b.id}>
                            {b.batchName} ({b.membersCount || (b.members || []).length || 0} Members)
                        </option>
                    ))}
                </select>
            </div>

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
                            Completed: { title: 'Completed / Review', color: 'bg-emerald-500' },
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
                                                            {t.batchName || 'Batch'}
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
                                                    <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                        {t.completedQuantity || 0} / {t.targetQuantity || 100} pcs
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* CREATE TASK MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-4">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Assign Task to Employee</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Select batch, assigned employee, task name, target quantity, and deadline. Assigned employee will be added to the batch automatically.
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
                            {/* Batch Selection */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Production Batch *</label>
                                <select
                                    value={selectedBatchId}
                                    onChange={(e) => setSelectedBatchId(e.target.value)}
                                    required
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 font-semibold cursor-pointer text-slate-900 dark:text-slate-100"
                                >
                                    <option value="">-- Select Production Batch --</option>
                                    {batches.map((b: any) => (
                                        <option key={b._id || b.id} value={b._id || b.id}>
                                            {b.batchName} ({b.membersCount || (b.members || []).length || 0} Members)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Employee Selection: All Active Employees */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Assigned Employee *</label>
                                <select
                                    value={selectedEmployeeId}
                                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                    required
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 font-semibold cursor-pointer text-slate-900 dark:text-slate-100"
                                >
                                    <option value="">-- Select Employee --</option>
                                    {employees.map((emp: any) => (
                                        <option key={emp.id || emp._id} value={emp.id || emp._id}>
                                            {emp.name || emp.fullName} ({emp.department || 'Production'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Task Name */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Task Name / Operation *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Front Pocket Stitching & Hemming"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 font-bold text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            {/* Target Quantity */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Target Quantity * (Pieces)</label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    value={targetQuantity}
                                    onChange={(e) => setTargetQuantity(Number(e.target.value))}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 font-bold text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            {/* Task Description */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Description / Instructions</label>
                                <textarea
                                    rows={2}
                                    placeholder="Enter operation instructions or quality specifications..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Due Date</label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 font-mono text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTaskMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer disabled:opacity-60"
                                >
                                    {createTaskMutation.isPending ? 'Assigning…' : 'Assign Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
