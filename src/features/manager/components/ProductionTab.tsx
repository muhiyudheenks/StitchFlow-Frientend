'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiCpu,
    FiLayers,
    FiUsers,
    FiUserPlus,
    FiUserMinus,
    FiPlus,
    FiCheckSquare,
    FiCheckCircle,
    FiAlertCircle,
    FiX,
    FiThumbsUp,
    FiThumbsDown,
    FiCheck,
    FiSearch,
    FiSquare,
    FiCheckSquare as FiCheckSquareIcon
} from 'react-icons/fi';

type WorkerType = 'Cutting' | 'Stitching' | 'Finishing';

export default function ProductionTab() {
    const queryClient = useQueryClient();
    const [selectedBatch, setSelectedBatch] = useState<any | null>(null);

    // Add Employee Multi-Select Modal State
    const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
    const [activeAddWorkerType, setActiveAddWorkerType] = useState<WorkerType>('Stitching');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

    // Assign Task Modal State
    const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
    const [taskWorkerType, setTaskWorkerType] = useState<WorkerType>('Stitching');
    const [taskEmployeeId, setTaskEmployeeId] = useState('');
    const [taskName, setTaskName] = useState('');
    const [targetQuantity, setTargetQuantity] = useState(100);
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    // Feedback messages
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // 1. Fetch Batches assigned to Manager
    const { data: batches = [], isLoading } = useQuery<any[]>({
        queryKey: ['production-batches'],
        queryFn: async () => {
            const response = await api.get('/api/production');
            return response.data?.data || [];
        },
    });

    // Keep selectedBatch synced with query data
    const activeBatch = batches.find((b: any) => (b.id || b._id) === (selectedBatch?.id || selectedBatch?._id)) || selectedBatch;

    // 2. Fetch Available Employees for all 3 worker types to evaluate availability & populate dropdowns
    const { data: availableCutting = [], isLoading: loadingCutting } = useQuery<any[]>({
        queryKey: ['available-employees', 'Cutting'],
        queryFn: async () => {
            const res = await api.get('/api/production/available-employees', { params: { workerType: 'Cutting' } });
            return res.data?.data || [];
        },
    });

    const { data: availableStitching = [], isLoading: loadingStitching } = useQuery<any[]>({
        queryKey: ['available-employees', 'Stitching'],
        queryFn: async () => {
            const res = await api.get('/api/production/available-employees', { params: { workerType: 'Stitching' } });
            return res.data?.data || [];
        },
    });

    const { data: availableFinishing = [], isLoading: loadingFinishing } = useQuery<any[]>({
        queryKey: ['available-employees', 'Finishing'],
        queryFn: async () => {
            const res = await api.get('/api/production/available-employees', { params: { workerType: 'Finishing' } });
            return res.data?.data || [];
        },
    });

    // Currently active available list based on modal worker type
    const activeAvailableList = activeAddWorkerType === 'Cutting'
        ? availableCutting
        : activeAddWorkerType === 'Finishing'
        ? availableFinishing
        : availableStitching;

    // Current batch member ID set to prevent duplicates
    const currentMemberIds = new Set((activeBatch?.members || []).map((m: any) => (m.id || m._id || m.toString())));

    // Filter available workers by workerType, batch membership, and search query
    const filteredAvailableList = activeAvailableList.filter((emp: any) => {
        const empId = emp.id || emp._id;
        if (currentMemberIds.has(empId)) return false;

        const et = (emp.employeeType || emp.designation || '').toLowerCase();
        const wtLower = activeAddWorkerType.toLowerCase();

        let matchesWorkerType = false;
        if (wtLower === 'cutting') {
            matchesWorkerType = et.includes('cutting');
        } else if (wtLower === 'finishing') {
            matchesWorkerType = et.includes('finishing');
        } else {
            matchesWorkerType = et.includes('stitching') || (!et.includes('cutting') && !et.includes('finishing'));
        }

        if (!matchesWorkerType) return false;

        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
            (emp.name || emp.fullName || '').toLowerCase().includes(q) ||
            (emp.employeeId || '').toLowerCase().includes(q) ||
            (emp.designation || '').toLowerCase().includes(q) ||
            (emp.department || '').toLowerCase().includes(q)
        );
    });

    // 3. Fetch Tasks for selected batch
    const { data: batchTasks = [] } = useQuery<any[]>({
        queryKey: ['batch-tasks', activeBatch?.id || activeBatch?._id],
        queryFn: async () => {
            if (!activeBatch) return [];
            const id = activeBatch.id || activeBatch._id;
            const res = await api.get('/api/tasks', { params: { batchId: id } });
            return res.data?.data || [];
        },
        enabled: Boolean(activeBatch),
    });

    // Mutations
    const addMembersMutation = useMutation({
        mutationFn: async (payload: { batchId: string; employeeIds: string[]; workerType: WorkerType }) => {
            const response = await api.post(`/api/production/${payload.batchId}/members`, {
                employeeIds: payload.employeeIds,
                workerType: payload.workerType,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['production-batches'] });
            queryClient.invalidateQueries({ queryKey: ['available-employees'] });
            setIsAddWorkerModalOpen(false);
            setSelectedEmployeeIds([]);
            setSearchTerm('');
            setErrorMessage(null);
            showToast('Selected workers added to batch successfully!');
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to add workers to batch');
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: async (payload: { batchId: string; employeeId: string }) => {
            const response = await api.delete(`/api/production/${payload.batchId}/members/${payload.employeeId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['production-batches'] });
            queryClient.invalidateQueries({ queryKey: ['available-employees'] });
            showToast('Employee removed from batch!');
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await api.post('/api/tasks', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['production-batches'] });
            queryClient.invalidateQueries({ queryKey: ['batch-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['managerTasks'] });
            setIsAssignTaskModalOpen(false);
            setTaskName('');
            setTaskEmployeeId('');
            setDescription('');
            setDueDate('');
            setErrorMessage(null);
            showToast('Task assigned successfully!');
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to assign task');
        },
    });

    const verifyTaskMutation = useMutation({
        mutationFn: async ({ taskId, status }: { taskId: string; status: 'Completed' | 'Rejected' }) => {
            const response = await api.patch(`/api/tasks/${taskId}/verify`, { status });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['production-batches'] });
            queryClient.invalidateQueries({ queryKey: ['batch-tasks'] });
            showToast(`Task ${variables.status === 'Completed' ? 'Approved' : 'Rejected'}`);
        },
    });

    const completeBatchMutation = useMutation({
        mutationFn: async (batchId: string) => {
            const response = await api.patch(`/api/production/${batchId}/complete`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['production-batches'] });
            queryClient.invalidateQueries({ queryKey: ['available-employees'] });
            showToast('Batch completed successfully! All members released for future batches.');
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to complete batch');
        },
    });

    // Open Category Modal helper
    const handleOpenAddCategoryModal = (type: WorkerType) => {
        setActiveAddWorkerType(type);
        setSelectedEmployeeIds([]);
        setSearchTerm('');
        setErrorMessage(null);
        setIsAddWorkerModalOpen(true);
    };

    // Toggle multi-select employee selection
    const handleToggleEmployeeSelect = (id: string) => {
        setSelectedEmployeeIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAllFiltered = () => {
        const filteredIds = filteredAvailableList.map((e: any) => e.id || e._id);
        const allSelected = filteredIds.every((id) => selectedEmployeeIds.includes(id));

        if (allSelected) {
            setSelectedEmployeeIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
        } else {
            setSelectedEmployeeIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
        }
    };

    // Member lists grouped by worker category
    const cuttingWorkersList = activeBatch?.cuttingWorkers || [];
    const stitchingWorkersList = activeBatch?.stitchingWorkers || [];
    const finishingWorkersList = activeBatch?.finishingWorkers || [];

    // Filter members for Task Assignment modal based on selected taskWorkerType
    const taskEligibleMembers = taskWorkerType === 'Cutting'
        ? cuttingWorkersList
        : taskWorkerType === 'Finishing'
        ? finishingWorkersList
        : stitchingWorkersList;

    const allTasksCompleted = batchTasks.length > 0 && batchTasks.every((t: any) => t.status === 'Completed' || t.status === 'Verified');

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
                        <FiCpu size={14} />
                        <span>My Assigned Production Batches</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Assigned Batches</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Monitor assigned batch information, allocate worker categories, dispatch tasks, and review completion.
                    </p>
                </div>
            </div>

            {/* Batches Overview Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="py-4 px-6">Batch Name</th>
                                <th className="py-4 px-6">Product Garment</th>
                                <th className="py-4 px-6">Task Statistics</th>
                                <th className="py-4 px-6">Batch Progress</th>
                                <th className="py-4 px-6">Members</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                                        Loading production batches from database...
                                    </td>
                                </tr>
                            ) : batches.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                                        No production batches have been assigned to you yet.
                                    </td>
                                </tr>
                            ) : (
                                batches.map((b) => {
                                    const batchId = b.id || b._id;
                                    const progress = b.progressPercentage || 0;
                                    const membersList = Array.isArray(b.members) ? b.members : [];

                                    return (
                                        <tr key={batchId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                                    <FiLayers size={15} />
                                                </div>
                                                <div>
                                                    <span>{b.batchName}</span>
                                                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 block">{b.batchNumber || b.batchCode || 'BATCH'}</span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-slate-800 dark:text-slate-200 font-bold">
                                                {b.productName || 'Denim Apparel'}
                                            </td>

                                            <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-semibold">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{b.completedTasks || 0} Done</span>
                                                    <span>/</span>
                                                    <span>{b.totalTasks || 0} Total</span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="font-bold">{progress}% Completed</span>
                                                    </div>
                                                    <div className="h-1.5 w-28 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                                    {membersList.length} Allocated Workers
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                        b.status === 'COMPLETED' || b.status === 'Completed'
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200'
                                                    }`}
                                                >
                                                    {b.status || 'Active'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => setSelectedBatch(b)}
                                                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs cursor-pointer transition-colors"
                                                >
                                                    Open Batch Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DEDICATED BATCH DETAILS VIEW MODAL */}
            {activeBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto hide-scrollbar font-sans space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 uppercase">
                                        Batch Details Page
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                        activeBatch.status === 'Completed' || activeBatch.status === 'COMPLETED'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                        {activeBatch.status || 'Active'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-extrabold tracking-tight mt-1">{activeBatch.batchName}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedBatch(null)}
                                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Banner & Information */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Garment Product</span>
                                <div className="font-extrabold text-slate-900 dark:text-white">{activeBatch.productName || 'Denim Apparel'}</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Target Quantity</span>
                                <div className="font-extrabold text-slate-900 dark:text-white">{activeBatch.quantity || 100} pcs</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Batch Code</span>
                                <div className="font-extrabold font-mono text-purple-600 dark:text-purple-400">{activeBatch.batchNumber || activeBatch.batchCode || 'BATCH'}</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Total Allocated Members</span>
                                <div className="font-extrabold text-slate-900 dark:text-white">{activeBatch.members?.length || 0} Workers</div>
                            </div>
                        </div>

                        {/* Progress Bar & Batch Completion Trigger */}
                        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-slate-900/10 border border-purple-200 dark:border-purple-900/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Batch Fulfillment Progress</h4>
                                    <p className="text-xs text-slate-500">Completed: {activeBatch.completedTasks || 0} / Total Tasks: {activeBatch.totalTasks || 0}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-extrabold text-purple-600">{activeBatch.progressPercentage || 0}%</span>
                                </div>
                            </div>
                            <div className="h-2.5 w-full bg-purple-200 dark:bg-purple-950 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${activeBatch.progressPercentage || 0}%` }} />
                            </div>

                            {activeBatch.status !== 'Completed' && activeBatch.status !== 'COMPLETED' && (
                                <div className="pt-2 flex justify-end">
                                    <button
                                        onClick={() => completeBatchMutation.mutate(activeBatch.id || activeBatch._id)}
                                        disabled={!allTasksCompleted || completeBatchMutation.isPending}
                                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        title={!allTasksCompleted ? 'Complete and approve all tasks first' : 'Mark batch as completed'}
                                    >
                                        <FiCheck size={14} />
                                        <span>{completeBatchMutation.isPending ? 'Completing…' : 'Complete Batch & Release Workers'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* MEMBERS SECTION WITH 3 CATEGORY ADD BUTTONS */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div>
                                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FiUsers className="text-purple-600" />
                                        <span>Batch Members ({activeBatch.members?.length || 0})</span>
                                    </h4>
                                    <p className="text-xs text-slate-500">Allocate active available workers into Cutting, Stitching, and Finishing categories.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {(['Cutting', 'Stitching', 'Finishing'] as const).map((cat) => {
                                    const groupList = cat === 'Cutting' ? cuttingWorkersList : cat === 'Finishing' ? finishingWorkersList : stitchingWorkersList;
                                    const availableCount = cat === 'Cutting' ? availableCutting.length : cat === 'Finishing' ? availableFinishing.length : availableStitching.length;
                                    const isAvailableEmpty = availableCount === 0;
                                    const isBatchClosed = activeBatch.status === 'Completed' || activeBatch.status === 'COMPLETED';

                                    return (
                                        <div key={cat} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                                                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                                        {cat} Workers ({groupList.length})
                                                    </span>
                                                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-purple-600 border border-slate-200 dark:border-slate-800">
                                                        {groupList.length} Members
                                                    </span>
                                                </div>

                                                <div className="space-y-2 max-h-48 overflow-y-auto hide-scrollbar">
                                                    {groupList.length === 0 ? (
                                                        <p className="text-[11px] text-slate-400 italic py-4 text-center">No {cat.toLowerCase()} workers added to batch.</p>
                                                    ) : (
                                                        groupList.map((w: any) => (
                                                            <div key={w.id || w._id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs shadow-2xs">
                                                                <div>
                                                                    <div className="font-bold text-slate-900 dark:text-white leading-tight">{w.name || w.fullName}</div>
                                                                    <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-semibold">{w.employeeId || 'EMP-WORKER'} • {w.designation}</div>
                                                                </div>

                                                                {!isBatchClosed && (
                                                                    <button
                                                                        onClick={() => removeMemberMutation.mutate({ batchId: activeBatch.id || activeBatch._id, employeeId: w.id || w._id })}
                                                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                                                                        title="Remove Worker from Batch"
                                                                    >
                                                                        <FiUserMinus size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            {/* Category-Specific Add Button */}
                                            {!isBatchClosed && (
                                                <button
                                                    onClick={() => handleOpenAddCategoryModal(cat)}
                                                    disabled={isAvailableEmpty}
                                                    className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    title={isAvailableEmpty ? `No available ${cat} Workers` : `Add ${cat} Workers`}
                                                >
                                                    <FiUserPlus size={14} />
                                                    <span>
                                                        {isAvailableEmpty ? `No available ${cat} Workers` : `+ Add ${cat} Worker`}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ASSIGNED TASKS SECTION */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div>
                                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FiCheckSquare className="text-purple-600" />
                                        <span>Assigned Batch Tasks ({batchTasks.length})</span>
                                    </h4>
                                    <p className="text-xs text-slate-500">Operation tasks dispatched to worker categories.</p>
                                </div>

                                {activeBatch.status !== 'Completed' && activeBatch.status !== 'COMPLETED' && (
                                    <button
                                        onClick={() => {
                                            setErrorMessage(null);
                                            setIsAssignTaskModalOpen(true);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                                    >
                                        <FiPlus size={14} />
                                        <span>Assign Task</span>
                                    </button>
                                )}
                            </div>

                            <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase text-slate-500">
                                            <th className="py-3 px-4">Worker Category</th>
                                            <th className="py-3 px-4">Operation Task</th>
                                            <th className="py-3 px-4">Assigned Worker</th>
                                            <th className="py-3 px-4">Quantity</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 text-right">Review Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                        {batchTasks.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                                                    No tasks assigned for this batch yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            batchTasks.map((t: any) => (
                                                <tr key={t.id || t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200">
                                                            {t.workerType || t.operationType || 'Stitching'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                                                        {t.taskName || t.title}
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                                                        {t.assignedEmployeeName || 'Unassigned'}
                                                    </td>
                                                    <td className="py-3 px-4 font-mono">
                                                        {t.completedQuantity || 0} / {t.targetQuantity || 100} pcs
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                                            t.status === 'Completed' || t.status === 'Verified'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : t.status === 'Under Review'
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {t.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        {(t.status === 'Under Review' || t.status === 'Completed') && activeBatch.status !== 'Completed' && (
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => verifyTaskMutation.mutate({ taskId: t.id || t._id, status: 'Completed' })}
                                                                    className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    <FiThumbsUp size={11} /> Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => verifyTaskMutation.mutate({ taskId: t.id || t._id, status: 'Rejected' })}
                                                                    className="px-2 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    <FiThumbsDown size={11} /> Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedBatch(null)}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Close Page
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCHABLE MULTI-SELECT ADD WORKERS MODAL */}
            {isAddWorkerModalOpen && activeBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative font-sans text-slate-900 dark:text-white max-h-[90vh] flex flex-col">
                        <button
                            onClick={() => setIsAddWorkerModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 uppercase">
                                Multi-Select Allocation
                            </span>
                            <h3 className="text-xl font-extrabold mt-1">Add {activeAddWorkerType} Workers</h3>
                            <p className="text-xs text-slate-500">Select active employees not assigned to any other active batch.</p>
                        </div>

                        {errorMessage && (
                            <div className="mb-3 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Search Input Bar */}
                        <div className="relative mb-3">
                            <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder={`Search ${activeAddWorkerType} workers by name, ID, or designation...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Select All Toggle Bar */}
                        {filteredAvailableList.length > 0 && (
                            <div className="flex items-center justify-between pb-2 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-2">
                                <button
                                    type="button"
                                    onClick={handleSelectAllFiltered}
                                    className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-1.5 text-xs"
                                >
                                    <FiCheckSquareIcon size={14} />
                                    <span>
                                        {filteredAvailableList.every((e: any) => selectedEmployeeIds.includes(e.id || e._id))
                                            ? 'Deselect All Filtered'
                                            : 'Select All Filtered'}
                                    </span>
                                </button>
                                <span className="text-slate-400 text-[11px]">
                                    {selectedEmployeeIds.length} worker(s) selected
                                </span>
                            </div>
                        )}

                        {/* Searchable Multi-Select Worker List */}
                        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2 max-h-64 border border-slate-100 dark:border-slate-800 rounded-2xl p-2 bg-slate-50/50 dark:bg-slate-800/40">
                            {filteredAvailableList.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-400 font-semibold">
                                    No available {activeAddWorkerType.toLowerCase()} workers match your search.
                                </div>
                            ) : (
                                filteredAvailableList.map((emp: any) => {
                                    const empId = emp.id || emp._id;
                                    const isSelected = selectedEmployeeIds.includes(empId);

                                    return (
                                        <div
                                            key={empId}
                                            onClick={() => handleToggleEmployeeSelect(empId)}
                                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                                isSelected
                                                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 shadow-2xs'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                                                    isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                                                }`}>
                                                    {isSelected && <FiCheck size={12} />}
                                                </div>

                                                <div>
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                                                        <span>{emp.name || emp.fullName}</span>
                                                        <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded">
                                                            {emp.employeeId || 'EMP-WORKER'}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                        {emp.designation} • {emp.department}
                                                    </div>
                                                </div>
                                            </div>

                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                {emp.availabilityStatus || 'Active & Available'}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 mt-4">
                            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
                                Selected: {selectedEmployeeIds.length} {activeAddWorkerType} Worker(s)
                            </span>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddWorkerModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedEmployeeIds.length === 0) {
                                            setErrorMessage('Please select at least one worker');
                                            return;
                                        }
                                        addMembersMutation.mutate({
                                            batchId: activeBatch.id || activeBatch._id,
                                            employeeIds: selectedEmployeeIds,
                                            workerType: activeAddWorkerType,
                                        });
                                    }}
                                    disabled={selectedEmployeeIds.length === 0 || addMembersMutation.isPending}
                                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md cursor-pointer disabled:opacity-50 transition-all"
                                >
                                    {addMembersMutation.isPending ? 'Adding Workers…' : `Add Selected Workers (${selectedEmployeeIds.length})`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ASSIGN TASK MODAL */}
            {isAssignTaskModalOpen && activeBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative font-sans text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button
                            onClick={() => setIsAssignTaskModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <h3 className="text-xl font-extrabold mb-1">Assign Task to Worker Category</h3>
                        <p className="text-xs text-slate-500 mb-4">Choose worker type, then select from allocated batch members of that category.</p>

                        {errorMessage && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setErrorMessage(null);
                                if (!taskEmployeeId) {
                                    setErrorMessage('Please select a batch worker');
                                    return;
                                }
                                if (!taskName.trim()) {
                                    setErrorMessage('Task operation name is required');
                                    return;
                                }
                                createTaskMutation.mutate({
                                    batchId: activeBatch.id || activeBatch._id,
                                    assignedEmployee: taskEmployeeId,
                                    workerType: taskWorkerType,
                                    taskName: taskName.trim(),
                                    targetQuantity: Number(targetQuantity || 100),
                                    priority,
                                    dueDate,
                                    description: description.trim(),
                                });
                            }}
                            className="space-y-4 text-xs"
                        >
                            {/* Worker Type */}
                            <div>
                                <label className="block font-bold mb-1">Worker Type *</label>
                                <select
                                    value={taskWorkerType}
                                    onChange={(e) => {
                                        setTaskWorkerType(e.target.value as WorkerType);
                                        setTaskEmployeeId('');
                                    }}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold outline-none cursor-pointer"
                                >
                                    <option value="Cutting">▼ Cutting</option>
                                    <option value="Stitching">▼ Stitching</option>
                                    <option value="Finishing">▼ Finishing</option>
                                </select>
                            </div>

                            {/* Employee Dropdown filtered by Worker Type */}
                            <div>
                                <label className="block font-bold mb-1">Employee ({taskWorkerType} Members in Batch) *</label>
                                {taskEligibleMembers.length === 0 ? (
                                    <div className="p-3 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold">
                                        No {taskWorkerType.toLowerCase()} workers added to this batch yet. Add a {taskWorkerType.toLowerCase()} worker to the batch first.
                                    </div>
                                ) : (
                                    <select
                                        value={taskEmployeeId}
                                        onChange={(e) => setTaskEmployeeId(e.target.value)}
                                        required
                                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold outline-none cursor-pointer"
                                    >
                                        <option value="">-- Select {taskWorkerType} Worker --</option>
                                        {taskEligibleMembers.map((emp: any) => (
                                            <option key={emp.id || emp._id} value={emp.id || emp._id}>
                                                {emp.name || emp.fullName} ({emp.designation || emp.department})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Operation Name */}
                            <div>
                                <label className="block font-bold mb-1">Operation Task Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Stitch Side Seam"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold outline-none"
                                />
                            </div>

                            {/* Target Quantity */}
                            <div>
                                <label className="block font-bold mb-1">Target Quantity * (Pieces)</label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    value={targetQuantity}
                                    onChange={(e) => setTargetQuantity(Number(e.target.value))}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold outline-none"
                                />
                            </div>

                            {/* Priority & Due Date */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as any)}
                                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold outline-none cursor-pointer"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-mono outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-1">Description / Instructions</label>
                                <textarea
                                    rows={2}
                                    placeholder="Enter operation specifications..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAssignTaskModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={taskEligibleMembers.length === 0 || createTaskMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer disabled:opacity-50"
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
