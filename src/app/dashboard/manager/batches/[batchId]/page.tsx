'use client';

import React, { useState, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/config';
import {
    FiArrowLeft,
    FiLayers,
    FiUsers,
    FiCheckSquare,
    FiClock,
    FiCalendar,
    FiUser,
    FiPlus,
    FiThumbsUp,
    FiThumbsDown,
    FiAlertCircle,
    FiCheckCircle,
    FiX,
    FiShieldOff,
    FiSend,
    FiUserPlus,
    FiUserX,
    FiTrash2,
} from 'react-icons/fi';

interface PageProps {
    params: Promise<{ batchId: string }>;
}

export default function ManagerBatchTasksPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const batchId = resolvedParams.batchId;
    const router = useRouter();
    const queryClient = useQueryClient();

    // Modal state for Dispatching Batch Task
    const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [garmentProduct, setGarmentProduct] = useState('');
    const [targetQuantity, setTargetQuantity] = useState(100);
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    // Modal state for Adding Employees
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [selectedWorkerType, setSelectedWorkerType] = useState<'Cutting' | 'Stitching' | 'Finishing'>('Stitching');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [addEmployeeError, setAddEmployeeError] = useState<string | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // 1. Fetch Batch Details
    const {
        data: batch,
        isLoading: isBatchLoading,
        error: batchError,
    } = useQuery<any>({
        queryKey: ['manager-batch-detail', batchId],
        queryFn: async () => {
            const res = await api.get(`/api/manager/batches/${batchId}`);
            return res.data?.data;
        },
        retry: false,
    });

    // 2. Fetch Tasks for this batch ONLY
    const { data: tasks = [], isLoading: isTasksLoading } = useQuery<any[]>({
        queryKey: ['manager-batch-tasks', batchId],
        queryFn: async () => {
            const res = await api.get(`/api/manager/batches/${batchId}/tasks`);
            return res.data?.data || [];
        },
        enabled: Boolean(batch),
    });

    // Mutations
    const dispatchTaskMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post(`/api/manager/batches/${batchId}/tasks`, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-batch-tasks', batchId] });
            queryClient.invalidateQueries({ queryKey: ['manager-batch-detail', batchId] });
            queryClient.invalidateQueries({ queryKey: ['manager-assigned-batches'] });
            setIsDispatchModalOpen(false);
            setTaskName('');
            setDescription('');
            setDueDate('');
            setErrorMessage(null);
            showToast('Batch task dispatched to all allocated workers successfully!');
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to dispatch task');
        },
    });

    const verifyTaskMutation = useMutation({
        mutationFn: async ({ taskId, status }: { taskId: string; status: 'Verified' | 'Completed' | 'Rejected' }) => {
            const res = await api.patch(`/api/manager/batches/${batchId}/tasks/${taskId}/verify`, { status });
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['manager-batch-tasks', batchId] });
            queryClient.invalidateQueries({ queryKey: ['manager-batch-detail', batchId] });
            queryClient.invalidateQueries({ queryKey: ['manager-assigned-batches'] });
            queryClient.invalidateQueries({ queryKey: ['managerTasks'] });
            queryClient.invalidateQueries({ queryKey: ['all-batch-tasks'] });
            showToast(`Task ${variables.status === 'Rejected' ? 'Returned for Rework' : 'Approved & Verified'}`);
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to verify task');
        },
    });

    // Fetch Available Employees for selected worker category
    const { data: availableEmployees = [], isLoading: isLoadingAvailable } = useQuery<any[]>({
        queryKey: ['available-employees', selectedWorkerType],
        queryFn: async () => {
            const res = await api.get(`/api/production/available-employees?workerType=${selectedWorkerType}`);
            return res.data?.data || [];
        },
        enabled: isAddEmployeeModalOpen,
    });

    const addMemberMutation = useMutation({
        mutationFn: async () => {
            if (selectedEmployeeIds.length === 0) throw new Error('Please select at least one employee');
            const res = await api.post(`/api/production/${batchId}/members`, {
                employeeIds: selectedEmployeeIds,
                employeeId: selectedEmployeeIds[0],
                employeeInput: selectedEmployeeIds,
                workerType: selectedWorkerType,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-batch-detail', batchId] });
            queryClient.invalidateQueries({ queryKey: ['manager-assigned-batches'] });
            queryClient.invalidateQueries({ queryKey: ['available-employees'] });
            setIsAddEmployeeModalOpen(false);
            setSelectedEmployeeIds([]);
            setAddEmployeeError(null);
            showToast('Selected worker(s) added to batch team!');
        },
        onError: (err: any) => {
            setAddEmployeeError(err.response?.data?.message || err.message || 'Failed to add employee(s)');
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: async (employeeId: string) => {
            const res = await api.delete(`/api/production/${batchId}/members/${employeeId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-batch-detail', batchId] });
            queryClient.invalidateQueries({ queryKey: ['manager-assigned-batches'] });
            queryClient.invalidateQueries({ queryKey: ['available-employees'] });
            showToast('Employee removed from batch team!');
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || err.message || 'Failed to remove employee');
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

    const handleDispatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!garmentProduct) {
            setErrorMessage('Please select a Garment Product');
            return;
        }

        dispatchTaskMutation.mutate({
            productName: garmentProduct,
            taskName: taskName.trim() || undefined,
            targetQuantity,
            dueDate: dueDate || undefined,
            description: description.trim(),
        });
    };

    // Check 403 Forbidden security response
    const isForbidden = (batchError as any)?.response?.status === 403;

    if (isForbidden) {
        return (
            <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#090D16] flex items-center justify-center p-6 font-sans">
                <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto">
                        <FiShieldOff size={32} />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">403 - Access Forbidden</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        You do not have authorization to view or manage tasks for this production batch. Batches are strictly scoped to their assigned manager.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/manager/production')}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-colors cursor-pointer"
                    >
                        Return to Manager Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isBatchLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#090D16] flex items-center justify-center p-6 font-sans">
                <div className="text-center space-y-3">
                    <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-500">Loading batch details & tasks...</p>
                </div>
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#090D16] flex items-center justify-center p-6 font-sans">
                <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto">
                        <FiAlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Batch Not Found</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">The requested production batch does not exist or has been removed.</p>
                    <button
                        onClick={() => router.push('/dashboard/manager/production')}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs cursor-pointer"
                    >
                        Back to Production Batches
                    </button>
                </div>
            </div>
        );
    }

    const membersList = batch.members || [];

    return (
        <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 font-sans p-4 sm:p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
                    <FiCheckCircle size={18} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Back Header & Title */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => router.push('/dashboard/manager/production')}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                    <FiArrowLeft size={16} />
                    <span>Back to Assigned Batches</span>
                </button>
            </div>

            {/* Batch Banner Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
                                {batch.batchNumber || 'BATCH'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                batch.status === 'Completed' || batch.status === 'COMPLETED'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-blue-100 text-blue-700'
                            }`}>
                                {batch.status || 'Active'}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {batch.batchName}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                            <FiUser className="text-indigo-500" />
                            <span>Manager: <strong className="text-slate-700 dark:text-slate-200">{batch.manager?.fullName || 'Self'}</strong></span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setAddEmployeeError(null);
                                setIsAddEmployeeModalOpen(true);
                            }}
                            disabled={batch.status === 'Completed' || batch.status === 'COMPLETED'}
                            className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <FiUserPlus size={15} />
                            <span>Add Employees</span>
                        </button>
                        <button
                            onClick={() => {
                                setGarmentProduct(batch.garmentName || batch.productName || '');
                                setErrorMessage(null);
                                setIsDispatchModalOpen(true);
                            }}
                            disabled={batch.status === 'Completed' || batch.status === 'COMPLETED'}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiSend size={15} />
                            <span>Dispatch Batch Task</span>
                        </button>
                    </div>
                </div>

                {/* Batch Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Garment Name</span>
                        <div className="font-extrabold text-slate-900 dark:text-white">{batch.garmentName || batch.productName || 'Garment'}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Members Count</span>
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                            <FiUsers className="text-indigo-500" />
                            <span>{batch.totalMembers || membersList.length} Employees</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Tasks Summary</span>
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                            <span className="text-emerald-600 font-extrabold">{batch.completedTasks || 0} Done</span>
                            <span>/</span>
                            <span className="text-amber-600 font-extrabold">{batch.pendingTasks || 0} Pending</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Due Date</span>
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                            <FiCalendar className="text-indigo-500" />
                            <span>{batch.dueDate ? new Date(batch.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-extrabold">
                        <span className="text-slate-700 dark:text-slate-300">Production Progress</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{batch.progress || batch.progressPercentage || 0}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(batch.progress || batch.progressPercentage || 0, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Allocated Team Members Section (3 Columns) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <FiUsers className="text-indigo-600" />
                            <span>Allocated Team Members ({membersList.length})</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Employees assigned to this batch grouped into cutting, stitching, and finishing teams.</p>
                    </div>
                </div>

                {(() => {
                    const cuttingSet = new Set(
                        (batch.cuttingWorkers || []).map((c: any) => (typeof c === 'object' ? (c._id || c.id || c)?.toString() : c?.toString())).filter(Boolean)
                    );
                    const finishingSet = new Set(
                        (batch.finishingWorkers || []).map((f: any) => (typeof f === 'object' ? (f._id || f.id || f)?.toString() : f?.toString())).filter(Boolean)
                    );
                    const stitchingSet = new Set(
                        (batch.stitchingWorkers || []).map((s: any) => (typeof s === 'object' ? (s._id || s.id || s)?.toString() : s?.toString())).filter(Boolean)
                    );

                    const categorizeMember = (m: any) => {
                        const empId = (typeof m === 'object' ? m._id || m.id || m : m)?.toString();
                        if (cuttingSet.has(empId)) return 'Cutting';
                        if (finishingSet.has(empId)) return 'Finishing';
                        if (stitchingSet.has(empId)) return 'Stitching';

                        if (typeof m === 'object') {
                            const desig = (m.workerType || m.workerCategory || m.designation || m.employeeType || '').toLowerCase();
                            if (desig.includes('cutting')) return 'Cutting';
                            if (desig.includes('finishing')) return 'Finishing';
                        }
                        return 'Stitching';
                    };

                    const categories = [
                        { key: 'Cutting', typeVal: 'Cutting' as const, title: 'CUTTING WORKERS', color: 'purple' },
                        { key: 'Stitching', typeVal: 'Stitching' as const, title: 'STITCHING WORKERS', color: 'indigo' },
                        { key: 'Finishing', typeVal: 'Finishing' as const, title: 'FINISHING WORKERS', color: 'amber' },
                    ];

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categories.map((cat) => {
                                const catMembers = membersList.filter((m: any) => categorizeMember(m) === cat.key);

                                return (
                                    <div
                                        key={cat.key}
                                        className="bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                                    >
                                        <div className="space-y-3">
                                            {/* Box Header */}
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                                        cat.color === 'purple' ? 'bg-purple-600' : cat.color === 'amber' ? 'bg-amber-500' : 'bg-indigo-600'
                                                    }`} />
                                                    <h4 className="text-xs font-extrabold tracking-wider uppercase text-slate-800 dark:text-slate-200">
                                                        {cat.title}
                                                    </h4>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                                                    cat.color === 'purple'
                                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                                                        : cat.color === 'amber'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                                                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                                                }`}>
                                                    {catMembers.length}
                                                </span>
                                            </div>

                                            {/* Members List inside Box */}
                                            {catMembers.length === 0 ? (
                                                <div className="py-6 text-center text-xs text-slate-400 font-semibold italic">
                                                    No {cat.key.toLowerCase()} workers assigned
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {catMembers.map((m: any) => {
                                                        const empId = typeof m === 'object' ? m._id || m.id : m;
                                                        const empName = typeof m === 'object' ? m.fullName || m.name || m.email : `Employee ${String(empId).slice(-4)}`;
                                                        const empCode = typeof m === 'object' ? (m.employeeId || `EMP-${String(empId).slice(-4).toUpperCase()}`) : `EMP-${String(empId).slice(-4).toUpperCase()}`;

                                                        return (
                                                            <div
                                                                key={empId}
                                                                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs shadow-xs"
                                                            >
                                                                <div className="min-w-0">
                                                                    <p className="font-extrabold text-slate-900 dark:text-white truncate">{empName}</p>
                                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                                        {empCode} • {cat.key} Worker
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm(`Remove ${empName} from this batch team?`)) {
                                                                            removeMemberMutation.mutate(empId);
                                                                        }
                                                                    }}
                                                                    disabled={removeMemberMutation.isPending || batch.status === 'Completed' || batch.status === 'COMPLETED'}
                                                                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 cursor-pointer disabled:opacity-40 transition-colors shrink-0"
                                                                    title="Remove worker"
                                                                >
                                                                    <FiTrash2 size={13} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom "+ Add [Category] Worker" Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedWorkerType(cat.typeVal);
                                                setSelectedEmployeeIds([]);
                                                setAddEmployeeError(null);
                                                setIsAddEmployeeModalOpen(true);
                                            }}
                                            disabled={batch.status === 'Completed' || batch.status === 'COMPLETED'}
                                            className="w-full py-2 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 mt-2"
                                        >
                                            <FiUserPlus size={14} />
                                            <span>+ Add {cat.key} Worker</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </div>

            {/* Assigned Batch Tasks List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <FiCheckSquare className="text-indigo-600" />
                            <span>Assigned Batch Tasks ({tasks.length})</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Dispatched tasks assigned to allocated batch employees.</p>
                    </div>

                    <button
                        onClick={() => setIsDispatchModalOpen(true)}
                        disabled={batch.status === 'Completed' || batch.status === 'COMPLETED' || membersList.length === 0}
                        className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                        <FiSend size={15} />
                        <span>+ Assign Task</span>
                    </button>
                </div>

                {(() => {
                    const activeTasksList = tasks.filter((t: any) => {
                        const s = (t.status || '').toLowerCase();
                        return s !== 'completed' && s !== 'verified';
                    });

                    const completedTasksList = tasks.filter((t: any) => {
                        const s = (t.status || '').toLowerCase();
                        return s === 'completed' || s === 'verified';
                    });

                    const renderTaskTable = (taskList: any[], isCompletedSection = false) => (
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
                                    {taskList.map((t: any) => (
                                        <tr key={t.id || t._id} className={isCompletedSection ? 'bg-slate-50/40 dark:bg-slate-800/30 hover:bg-slate-50/80' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'}>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                                                    {t.workerType || 'Stitching'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                                                {t.taskName || t.title}
                                                {t.description && <span className="block text-[11px] font-normal text-slate-400">{t.description}</span>}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                                                {t.assignedEmployeeName || 'Unassigned'}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono">
                                                {t.completedQuantity || 0} / {t.targetQuantity || 100} pcs
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                                    t.status === 'Completed' || t.status === 'Verified'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : t.status === 'Under Review' || t.status === 'under_review'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : t.status === 'In Progress' || t.status === 'in_progress'
                                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                }`}>
                                                    {t.status === 'Verified' || t.status === 'Completed' ? '✓ Verified / Approved' : t.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {(t.status === 'Under Review' || t.status === 'under_review' || t.status === 'in_progress') && (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => verifyTaskMutation.mutate({ taskId: t.id || t._id, status: 'Verified' })}
                                                            disabled={verifyTaskMutation.isPending}
                                                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                                        >
                                                            <FiThumbsUp size={12} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => verifyTaskMutation.mutate({ taskId: t.id || t._id, status: 'Rejected' })}
                                                            disabled={verifyTaskMutation.isPending}
                                                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                                        >
                                                            <FiThumbsDown size={12} /> Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {(t.status === 'Verified' || t.status === 'Completed') && (
                                                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                                                        <FiCheckCircle size={13} /> Verified
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );

                    return (
                        <div className="space-y-6">
                            {/* Active / Open Tasks Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div>
                                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                            <FiCheckSquare className="text-indigo-600" />
                                            <span>Active / Open Tasks ({activeTasksList.length})</span>
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Tasks currently pending or in progress for allocated workers.</p>
                                    </div>
                                </div>

                                {isTasksLoading ? (
                                    <div className="py-8 text-center text-xs font-bold text-slate-400">Loading batch tasks...</div>
                                ) : activeTasksList.length === 0 ? (
                                    <div className="py-8 text-center space-y-2">
                                        <p className="text-xs font-bold text-slate-500">No active/open tasks pending for this batch.</p>
                                    </div>
                                ) : (
                                    renderTaskTable(activeTasksList, false)
                                )}
                            </div>

                            {/* Completed Tasks Section */}
                            {completedTasksList.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                            <FiCheckCircle className="text-emerald-600" />
                                            <span>Completed &amp; Verified Tasks ({completedTasksList.length})</span>
                                        </h3>
                                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border border-emerald-200">
                                            Finished &amp; Approved
                                        </span>
                                    </div>

                                    {renderTaskTable(completedTasksList, true)}
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* DISPATCH BATCH TASK MODAL */}
            {isDispatchModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsDispatchModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-5 flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                                <FiSend size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Dispatch Batch Task</h3>
                                <p className="text-xs text-slate-500">Automatically creates tasks for all allocated workers</p>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Production Batch *</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={`${batch.batchName} (${batch.batchNumber || 'BATCH'})`}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold outline-none cursor-not-allowed"
                                />
                                <div className="mt-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs flex items-center justify-between">
                                    <span className="font-bold text-indigo-700 dark:text-indigo-300">Garment (Read-only):</span>
                                    <span className="font-extrabold text-indigo-900 dark:text-indigo-100">{batch.garmentName || batch.productName || 'Garment Product'}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Task Name / Operation (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Auto-generated if left blank (e.g. Denim Shirt Production)"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Quantity *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={targetQuantity}
                                        onChange={(e) => setTargetQuantity(Number(e.target.value))}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description / Instructions</label>
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
                                    onClick={() => setIsDispatchModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={dispatchTaskMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 shadow-md cursor-pointer disabled:opacity-60 transition-colors"
                                >
                                    {dispatchTaskMutation.isPending ? 'Dispatching…' : 'Dispatch Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD EMPLOYEE TO BATCH MODAL */}
            {isAddEmployeeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white">
                        <button
                            onClick={() => setIsAddEmployeeModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-5 flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                                <FiUserPlus size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold">Add Employee to Batch</h3>
                                <p className="text-xs text-slate-500">Assign team members from your available employees</p>
                            </div>
                        </div>

                        {addEmployeeError && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{addEmployeeError}</span>
                            </div>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setAddEmployeeError(null);
                                addMemberMutation.mutate();
                            }}
                            className="space-y-4 text-xs"
                        >
                            <div>
                                <label className="block font-bold mb-1">Worker Category *</label>
                                <select
                                    value={selectedWorkerType}
                                    onChange={(e: any) => {
                                        setSelectedWorkerType(e.target.value);
                                        setSelectedEmployeeIds([]);
                                    }}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 font-bold outline-none cursor-pointer"
                                >
                                    <option value="Stitching">Stitching Worker</option>
                                    <option value="Cutting">Cutting Worker</option>
                                    <option value="Finishing">Finishing Worker</option>
                                </select>
                            </div>

                            <div>
                                {(() => {
                                    const existingMemberIds = new Set(
                                        (batch?.members || []).map((m: any) => (typeof m === 'object' ? (m._id || m.id)?.toString() : m?.toString())).filter(Boolean)
                                    );
                                    const selectableEmployees = availableEmployees.filter((emp: any) => {
                                        const empIdStr = (emp._id || emp.id)?.toString();
                                        if (existingMemberIds.has(empIdStr)) return false;

                                        const empRole = (emp.employeeType || emp.designation || '').toLowerCase();
                                        const selectedCat = selectedWorkerType.toLowerCase();

                                        if (selectedCat === 'cutting') {
                                            return empRole.includes('cutting');
                                        }
                                        if (selectedCat === 'finishing') {
                                            return empRole.includes('finishing');
                                        }
                                        if (selectedCat === 'stitching') {
                                            return empRole.includes('stitching') || (!empRole.includes('cutting') && !empRole.includes('finishing'));
                                        }
                                        return true;
                                    });

                                    return (
                                        <>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block font-bold">Select Employee(s) *</label>
                                                {selectableEmployees.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (selectedEmployeeIds.length === selectableEmployees.length) {
                                                                setSelectedEmployeeIds([]);
                                                            } else {
                                                                setSelectedEmployeeIds(selectableEmployees.map((e: any) => (e._id || e.id)?.toString()));
                                                            }
                                                        }}
                                                        className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                                    >
                                                        {selectedEmployeeIds.length === selectableEmployees.length ? 'Deselect All' : 'Select All'}
                                                    </button>
                                                )}
                                            </div>

                                            {isLoadingAvailable ? (
                                                <div className="py-4 text-center text-slate-400 font-semibold">Loading available workers...</div>
                                            ) : selectableEmployees.length === 0 ? (
                                                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 text-amber-700 dark:text-amber-300 font-semibold">
                                                    No available {selectedWorkerType.toLowerCase()} workers found (all may be busy on other active batches or already allocated to this batch).
                                                </div>
                                            ) : (
                                                <div className="max-h-48 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                                                    {selectableEmployees.map((emp: any) => {
                                                        const id = (emp._id || emp.id)?.toString();
                                                        const isChecked = selectedEmployeeIds.includes(id);

                                                        return (
                                                            <label
                                                                key={id}
                                                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                                                    isChecked
                                                                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800'
                                                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedEmployeeIds((prev) => [...prev, id]);
                                                                            } else {
                                                                                setSelectedEmployeeIds((prev) => prev.filter((i) => i !== id));
                                                                            }
                                                                        }}
                                                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                                    />
                                                                    <div className="min-w-0">
                                                                        <p className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                                                                            {emp.fullName || emp.name}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 truncate">{emp.email}</p>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {selectedEmployeeIds.length > 0 && (
                                                <p className="mt-1.5 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
                                                    {selectedEmployeeIds.length} worker{selectedEmployeeIds.length > 1 ? 's' : ''} selected
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAddEmployeeModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addMemberMutation.isPending || selectedEmployeeIds.length === 0}
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md cursor-pointer disabled:opacity-50 transition-colors"
                                >
                                    {addMemberMutation.isPending ? 'Adding…' : 'Add to Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
