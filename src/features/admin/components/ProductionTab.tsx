'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/config';
import { useProductionBatches, useProductionMutations } from '../hooks/useProduction';
import { useManagers } from '../hooks/useManagers';
import { ProductionBatchData, BatchTaskData, CreateBatchPayload } from '../services/production-service';
import {
    FiCpu,
    FiPlus,
    FiCheckCircle,
    FiClock,
    FiUsers,
    FiEdit3,
    FiCheckSquare,
    FiX,
    FiLayers,
    FiAlertCircle,
    FiTrash2,
    FiList,
} from 'react-icons/fi';

interface ProductionTabProps {
    onOpenQuickAction?: (actionType: string) => void;
}

export default function ProductionTab({ onOpenQuickAction }: ProductionTabProps) {
    const { data: batches = [], isLoading: isLoadingBatches } = useProductionBatches();
    const { createBatch, updateBatch, createBatchTask, updateBatchTask, deleteBatchTask } = useProductionMutations();
    const { data: managers = [], isLoading: isLoadingManagers, isError: isErrorManagers, error: managersError } = useManagers();

    // Debug log managers length
    React.useEffect(() => {
        console.log('[ProductionTab] managers array length:', managers.length);
        console.log('[ProductionTab] managers data:', managers);
    }, [managers]);

    // Feedback notifications
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

    // Modals
    const [createBatchModalOpen, setCreateBatchModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<ProductionBatchData | null>(null);

    // Selected Batch for Task Assignment Section
    const [selectedBatch, setSelectedBatch] = useState<ProductionBatchData | null>(null);
    const currentSelectedBatch = selectedBatch
        ? batches.find((b: any) => (b._id || b.id) === (selectedBatch._id || selectedBatch.id)) || selectedBatch
        : null;
    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<BatchTaskData | null>(null);

    // Selected workers state for Batch Creation/Editing
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedFinishingWorkers, setSelectedFinishingWorkers] = useState<string[]>([]);

    const showSuccessToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const openCreateBatchModal = () => {
        setEditingBatch(null);
        setSelectedEmployees([]);
        setSelectedFinishingWorkers([]);
        setFormErrorMessage(null);
        setCreateBatchModalOpen(true);
    };

    const openEditBatchModal = (batch: ProductionBatchData) => {
        setEditingBatch(batch);
        setSelectedEmployees(Array.isArray(batch.employees) ? batch.employees.map((e: any) => e._id || e.id || e) : []);
        setSelectedFinishingWorkers(Array.isArray(batch.finishingWorkers) ? batch.finishingWorkers.map((f: any) => f._id || f.id || f) : []);
        setFormErrorMessage(null);
        setCreateBatchModalOpen(true);
    };

    const { data: garmentProducts = [] } = useQuery<any[]>({
        queryKey: ['active-garment-products'],
        queryFn: async () => {
            const res = await api.get('/api/garment-products/active');
            return res.data?.data || [];
        },
    });

    // Owner Save Batch (Send exact batchName, managerId, employeeIds, finishingWorkerIds, notes)
    const handleSaveBatch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormErrorMessage(null);
        const formData = new FormData(e.currentTarget);
        const nextBatchName = `Batch ${batches.length + 1}`;

        const managerId = formData.get('managerId') as string;
        if (!managerId) {
            setFormErrorMessage('Please select a Batch Manager');
            return;
        }

        const productName = (formData.get('productName') as string) || '';
        if (!productName) {
            setFormErrorMessage('Please select a Garment Product');
            return;
        }

        const payload: any = {
            batchName: (formData.get('batchName') as string) || nextBatchName,
            managerId,
            productName,
            notes: formData.get('notes') as string,
            status: 'PENDING_MANAGER',
        };

        if (editingBatch?._id || editingBatch?.id) {
            const id = editingBatch._id || editingBatch.id!;
            updateBatch.mutate({ id, data: payload }, {
                onSuccess: () => {
                    setCreateBatchModalOpen(false);
                    setEditingBatch(null);
                    showSuccessToast('Production batch updated successfully!');
                },
                onError: (err: any) => {
                    const msg = err.response?.data?.message || err.message || 'Failed to update batch';
                    setFormErrorMessage(msg);
                },
            });
        } else {
            createBatch.mutate(payload, {
                onSuccess: () => {
                    setCreateBatchModalOpen(false);
                    showSuccessToast(`Production batch created successfully!`);
                },
                onError: (err: any) => {
                    const msg = err.response?.data?.message || err.message || 'Failed to create batch';
                    setFormErrorMessage(msg);
                },
            });
        }
    };

    // Manager Save Task
    const handleSaveTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedBatch?._id && !selectedBatch?.id) return;
        const batchId = selectedBatch._id || selectedBatch.id!;

        const formData = new FormData(e.currentTarget);
        const payload: Partial<BatchTaskData> = {
            garmentProduct: formData.get('garmentProduct') as string,
            operationName: formData.get('operationName') as string,
            assignedTo: formData.get('assignedTo') as string,
            taskType: formData.get('taskType') as any,
            quantity: Number(formData.get('quantity')),
            startDate: formData.get('startDate') as string,
            dueDate: formData.get('dueDate') as string,
            estimatedDuration: formData.get('estimatedDuration') as string,
            priority: formData.get('priority') as any,
            instructions: formData.get('instructions') as string,
        };

        if (editingTask?._id || editingTask?.id) {
            const taskId = editingTask._id || editingTask.id!;
            updateBatchTask.mutate({ taskId, data: payload }, {
                onSuccess: () => {
                    setCreateTaskModalOpen(false);
                    setEditingTask(null);
                    showSuccessToast('Task assignment updated!');
                },
            });
        } else {
            createBatchTask.mutate({ batchId, data: payload }, {
                onSuccess: () => {
                    setCreateTaskModalOpen(false);
                    showSuccessToast('New task assigned to batch worker!');
                },
            });
        }
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

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        <FiCpu size={14} />
                        <span>Factory Floor Team Architecture</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Production Batches (Team Containers)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Provision production teams (Batch 1, Batch 2...), assign manager, stitching workers, and finishing workers
                    </p>
                </div>

                <button
                    onClick={openCreateBatchModal}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Create Production Batch</span>
                </button>
            </div>

            {/* Production Batches Cards Grid */}
            {isLoadingBatches ? (
                <div className="p-12 text-center text-slate-400 font-semibold bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800">
                    Loading production batches from database…
                </div>
            ) : batches.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-semibold bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">No production batches provisioned yet.</p>
                    <p className="text-xs text-slate-400">Click &quot;Create Production Batch&quot; above to setup your first team container.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map((batch: ProductionBatchData, idx: number) => {
                        const batchName = batch.batchName || `Batch ${idx + 1}`;
                        const managerName = batch.managerName || (batch.manager as any)?.fullName || 'Unassigned';
                        const isSelected = (selectedBatch?._id || selectedBatch?.id) === (batch._id || batch.id);

                        return (
                            <motion.div
                                key={batch._id || batch.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className={`rounded-3xl border p-6 shadow-xs transition-all flex flex-col justify-between cursor-pointer ${
                                    isSelected
                                        ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-lg'
                                        : 'bg-white/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
                                }`}
                                onClick={() => setSelectedBatch(batch)}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-md">
                                                <FiLayers size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                    {batchName}
                                                </h3>
                                                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block">
                                                    Team Container
                                                </span>
                                            </div>
                                        </div>

                                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-900/50 uppercase">
                                            {batch.status || 'ACTIVE'}
                                        </span>
                                    </div>

                                    {/* Team Stats */}
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                            <span className="text-[9px] font-bold uppercase text-slate-400 block">Manager</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block mt-0.5" title={managerName}>
                                                {managerName}
                                            </span>
                                        </div>

                                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                            <span className="text-[9px] font-bold uppercase text-slate-400 block">Stitching</span>
                                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block mt-0.5">
                                                {batch.employeesCount ?? (batch.employees?.length || 0)} Workers
                                            </span>
                                        </div>

                                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                            <span className="text-[9px] font-bold uppercase text-slate-400 block">Finishing</span>
                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                                                {batch.finishingWorkersCount ?? (batch.finishingWorkers?.length || 0)} Workers
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Indicator */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">Batch Tasks Progress</span>
                                            <span className="text-purple-600 dark:text-purple-400 font-mono">{batch.progressPercentage ?? 0}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-600 rounded-full"
                                                style={{ width: `${batch.progressPercentage ?? 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBatch(batch);
                                        }}
                                        className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        {(() => {
                                            const allT = batch.tasks || [];
                                            const activeT = allT.filter((t: any) => {
                                                const s = (t.status || '').toLowerCase();
                                                return s !== 'completed' && s !== 'verified';
                                            });
                                            const openCount = batch.pendingTasks ?? (allT.length > 0 ? activeT.length : 0);
                                            return <><FiList size={14} /> Open Tasks ({openCount})</>;
                                        })()}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditBatchModal(batch);
                                        }}
                                        className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                        title="Edit Batch Team"
                                    >
                                        <FiEdit3 size={14} /> Edit
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* MANAGER TASK ASSIGNMENT SECTION (Opened for selected batch) */}
            {currentSelectedBatch && (
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn font-sans">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                                    {currentSelectedBatch.batchName}
                                </span>
                                <span className="text-xs font-bold text-slate-400">Task Assignment Section</span>
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                Tasks &amp; Operations for {currentSelectedBatch.batchName}
                            </h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setEditingTask(null);
                                    setCreateTaskModalOpen(true);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                            >
                                <FiPlus size={15} />
                                <span>Assign New Task</span>
                            </button>
                            <button
                                onClick={() => setSelectedBatch(null)}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Tasks List */}
                    {(!currentSelectedBatch.tasks || currentSelectedBatch.tasks.length === 0) ? (
                        <div className="py-12 text-center text-slate-400 font-semibold space-y-2">
                            <FiList size={24} className="mx-auto text-slate-300" />
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No tasks assigned for this batch yet.</p>
                            <p className="text-xs text-slate-400">Click &quot;Assign New Task&quot; above to delegate garment operations to stitching or finishing workers.</p>
                        </div>
                    ) : (
                        (() => {
                            const allTasks = currentSelectedBatch.tasks || [];
                            const activeTasks = allTasks.filter((t: any) => {
                                const s = (t.status || '').toLowerCase();
                                return s !== 'completed' && s !== 'verified';
                            });
                            const completedTasks = allTasks.filter((t: any) => {
                                const s = (t.status || '').toLowerCase();
                                return s === 'completed' || s === 'verified';
                            });

                            const renderAdminTaskTable = (taskList: BatchTaskData[], isCompleted = false) => (
                                <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                                    <table className="w-full text-left text-xs min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                                                <th className="py-4 px-6">Operation / Garment</th>
                                                <th className="py-4 px-6">Assigned Worker</th>
                                                <th className="py-4 px-6">Worker Type</th>
                                                <th className="py-4 px-6">Quantity</th>
                                                <th className="py-4 px-6">Duration &amp; Due Date</th>
                                                <th className="py-4 px-6">Priority</th>
                                                <th className="py-4 px-6">Status</th>
                                                <th className="py-4 px-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                            {taskList.map((task: BatchTaskData) => (
                                                <tr key={task.id || task._id} className={isCompleted ? 'bg-slate-50/40 dark:bg-slate-800/30' : 'hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors'}>
                                                    <td className="py-4 px-6">
                                                        <span className="font-extrabold text-slate-900 dark:text-white block">{task.operationName}</span>
                                                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">{task.garmentProduct}</span>
                                                    </td>
                                                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">
                                                        {task.assignedToName || (task.assignedTo as any)?.fullName || 'Unassigned'}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                                            task.taskType === 'Finishing' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200' :
                                                            'bg-purple-50 dark:bg-purple-950/50 text-purple-600 border-purple-200'
                                                        }`}>
                                                            {task.taskType || 'Stitching'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 font-mono font-extrabold">
                                                        {task.completedQuantity || 0} / {task.quantity} Pcs
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="font-semibold block">{task.estimatedDuration || '4 hrs'}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono block">
                                                            Due: {task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                            task.priority === 'Urgent' ? 'text-rose-600 font-extrabold' :
                                                            task.priority === 'High' ? 'text-amber-600' : 'text-slate-600'
                                                        }`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                                                            task.status === 'Completed' || task.status === 'Verified'
                                                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200'
                                                                : task.status === 'In Progress'
                                                                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 border-indigo-200'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200'
                                                        }`}>
                                                            {task.status === 'Verified' || task.status === 'Completed' ? '✓ Verified / Approved' : task.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingTask(task);
                                                                    setCreateTaskModalOpen(true);
                                                                }}
                                                                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            >
                                                                <FiEdit3 size={15} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const taskId = task.id || task._id;
                                                                    if (taskId && confirm('Delete this task assignment?')) {
                                                                        deleteBatchTask.mutate(taskId);
                                                                    }
                                                                }}
                                                                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            >
                                                                <FiTrash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );

                            return (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <FiList className="text-purple-600" /> Active / Open Tasks ({activeTasks.length})
                                        </h4>
                                        {activeTasks.length === 0 ? (
                                            <p className="text-xs text-slate-400 py-4 font-semibold">No open/active tasks pending for this batch.</p>
                                        ) : (
                                            renderAdminTaskTable(activeTasks, false)
                                        )}
                                    </div>

                                    {completedTasks.length > 0 && (
                                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <h4 className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                                <FiCheckCircle className="text-emerald-600" /> Completed &amp; Verified Tasks ({completedTasks.length})
                                            </h4>
                                            {renderAdminTaskTable(completedTasks, true)}
                                        </div>
                                    )}
                                </div>
                            );
                        })()
                    )}
                </div>
            )}

            {/* OWNER CREATE/EDIT PRODUCTION BATCH MODAL (TEAM CONTAINER ONLY) */}
            {createBatchModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto hide-scrollbar font-sans">
                        <button
                            onClick={() => {
                                setCreateBatchModalOpen(false);
                                setEditingBatch(null);
                            }}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <h3 className="text-xl font-extrabold tracking-tight mb-1">
                            {editingBatch ? 'Edit Production Batch Team' : 'Create Production Batch (Team Container)'}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">Provision the batch working team: Manager, Stitching Workers, and Finishing Workers.</p>

                        {formErrorMessage && (
                            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{formErrorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSaveBatch} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Batch Name *</label>
                                <input
                                    type="text"
                                    name="batchName"
                                    defaultValue={editingBatch?.batchName || `Batch ${batches.length + 1}`}
                                    required
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 font-mono font-bold text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Garment Product * (Permanent Batch Garment)</label>
                                {garmentProducts.length === 0 ? (
                                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                                        No garment products found. Please add items in Admin Garment Products catalog or Finished Garments inventory.
                                    </div>
                                ) : (
                                    <select
                                        name="productName"
                                        defaultValue={editingBatch?.productName || editingBatch?.garmentName || ''}
                                        required
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 cursor-pointer font-bold text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">-- Select Garment Product --</option>
                                        {garmentProducts.map((p: any) => (
                                            <option key={p._id || p.id} value={p.productName}>
                                                {p.productName} ({p.productCode} - {p.category})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Batch Manager * (Required)</label>
                                <select
                                    name="managerId"
                                    defaultValue={
                                        editingBatch?.manager
                                            ? typeof editingBatch.manager === 'object'
                                                ? editingBatch.manager._id || editingBatch.manager.id
                                                : editingBatch.manager
                                            : ''
                                    }
                                    onChange={(e) => {
                                        console.log('[CreateBatchModal] selected manager id:', e.target.value);
                                    }}
                                    required
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 cursor-pointer font-semibold text-slate-900 dark:text-slate-100"
                                >
                                    <option value="">-- Select Manager --</option>
                                    {isLoadingManagers ? (
                                        <option value="" disabled>Loading managers...</option>
                                    ) : isErrorManagers ? (
                                        <option value="" disabled>Error loading managers: {(managersError as any)?.response?.data?.message || (managersError as any)?.message || 'Failed to load managers'}</option>
                                    ) : managers?.length === 0 ? (
                                        <option value="" disabled>No managers available</option>
                                    ) : (
                                        managers?.map((m: any) => (
                                            <option key={m._id || m.id} value={m._id || m.id}>
                                                {m.name || m.fullName} ({m.email})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    rows={2}
                                    defaultValue={editingBatch?.notes || ''}
                                    placeholder="Enter team instructions or shift specifications..."
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500 text-slate-900 dark:text-slate-100"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCreateBatchModalOpen(false);
                                        setEditingBatch(null);
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer"
                                >
                                    {editingBatch ? 'Save Batch' : 'Create Production Batch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MANAGER CREATE/EDIT TASK MODAL */}
            {createTaskModalOpen && selectedBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto font-sans">
                        <button
                            onClick={() => {
                                setCreateTaskModalOpen(false);
                                setEditingTask(null);
                            }}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <h3 className="text-xl font-extrabold tracking-tight mb-1">
                            {editingTask ? 'Edit Task Assignment' : `Assign New Task (${selectedBatch.batchName})`}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">Assign garment operations, target quantities, and due dates to workers.</p>

                        <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold mb-1">Garment / Product Name *</label>
                                <input
                                    type="text"
                                    name="garmentProduct"
                                    defaultValue={editingTask?.garmentProduct || 'Heritage Denim Jacket ST-90'}
                                    required
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Operation / Task Name *</label>
                                    <input
                                        type="text"
                                        name="operationName"
                                        defaultValue={editingTask?.operationName || 'Front Pocket Stitching'}
                                        required
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Task Type *</label>
                                    <select
                                        name="taskType"
                                        defaultValue={editingTask?.taskType || 'Stitching'}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    >
                                        <option value="Stitching">Stitching Worker Task</option>
                                        <option value="Finishing">Finishing Worker Task</option>
                                        <option value="General">General Operation</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-1">Assigned Employee *</label>
                                <select
                                    name="assignedTo"
                                    defaultValue={
                                        editingTask?.assignedTo
                                            ? typeof editingTask.assignedTo === 'object'
                                                ? editingTask.assignedTo._id || editingTask.assignedTo.id
                                                : editingTask.assignedTo
                                            : ''
                                    }
                                    required
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500 font-semibold cursor-pointer"
                                >
                                    <option value="">-- Select Worker from Batch --</option>
                                    <optgroup label="Stitching Workers">
                                        {(selectedBatch.employees || []).map((emp: any) => (
                                            <option key={emp._id || emp.id || emp} value={emp._id || emp.id || emp}>
                                                {emp.fullName || emp.name || emp} (Stitching)
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Finishing Workers">
                                        {(selectedBatch.finishingWorkers || []).map((emp: any) => (
                                            <option key={emp._id || emp.id || emp} value={emp._id || emp.id || emp}>
                                                {emp.fullName || emp.name || emp} (Finishing)
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Target Quantity (Pcs) *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        defaultValue={editingTask?.quantity || 500}
                                        required
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500 font-mono font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Estimated Duration *</label>
                                    <input
                                        type="text"
                                        name="estimatedDuration"
                                        defaultValue={editingTask?.estimatedDuration || '4 hours'}
                                        required
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        defaultValue={editingTask?.startDate ? new Date(editingTask.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Due Date *</label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        defaultValue={editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                                        required
                                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Priority *</label>
                                    <select
                                        name="priority"
                                        defaultValue={editingTask?.priority || 'Medium'}
                                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-1">Instructions / Technical Specifications</label>
                                <textarea
                                    name="instructions"
                                    rows={2}
                                    defaultValue={editingTask?.instructions || ''}
                                    placeholder="Enter seam guidelines, thread density, or special finishing instructions..."
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCreateTaskModalOpen(false);
                                        setEditingTask(null);
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md cursor-pointer"
                                >
                                    {editingTask ? 'Update Task' : 'Assign Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
