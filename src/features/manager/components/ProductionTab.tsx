'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiCpu,
    FiCheckCircle,
    FiLayers,
    FiUsers,
    FiUserCheck,
    FiClock,
    FiFileText,
    FiCheckSquare,
    FiAlertCircle
} from 'react-icons/fi';
import { ManagerProductionBatch } from '../types';

export default function ProductionTab() {
    const queryClient = useQueryClient();
    const [selectedBatch, setSelectedBatch] = useState<any | null>(null);

    // Fetch Batches assigned to Manager
    const { data: batches = [], isLoading } = useQuery<any[]>({
        queryKey: ['production-batches'],
        queryFn: async () => {
            const response = await api.get('/api/production');
            return response.data?.data || [];
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await api.put(`/api/production/${id}`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['production-batches'] });
        },
    });

    return (
        <div className="space-y-6 font-sans">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        <FiCpu size={14} />
                        <span>Manager Batch Overview</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Production Batches &amp; Overview</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Monitor batch progress, task statistics, and dynamically assigned batch members.
                    </p>
                </div>
            </div>

            {/* Batches Table & Overview */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="py-4 px-6">Batch Name</th>
                                <th className="py-4 px-6">Manager</th>
                                <th className="py-4 px-6">Task Statistics</th>
                                <th className="py-4 px-6">Batch Progress</th>
                                <th className="py-4 px-6">Active Members</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Batch Action</th>
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
                                        No production batches assigned yet.
                                    </td>
                                </tr>
                            ) : (
                                batches.map((b) => {
                                    const batchId = b.id || b._id;
                                    const progress = b.progressPercentage || 0;
                                    const managerName = b.managerName || (b.manager as any)?.fullName || 'Assigned Manager';
                                    const membersList = Array.isArray(b.members) ? b.members : [];

                                    return (
                                        <tr key={batchId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                                    <FiLayers size={15} />
                                                </div>
                                                <div>
                                                    <span>{b.batchName}</span>
                                                    {b.notes && <span className="text-[10px] text-slate-400 block font-normal leading-tight mt-0.5">{b.notes}</span>}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-slate-800 dark:text-slate-200 font-bold">
                                                {managerName}
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
                                                <div className="flex items-center gap-1">
                                                    <div className="flex -space-x-1.5 overflow-hidden">
                                                        {membersList.slice(0, 3).map((m: any, idx: number) => (
                                                            <div
                                                                key={m.id || idx}
                                                                className="inline-block h-6 w-6 rounded-full bg-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 uppercase"
                                                            >
                                                                {(m.name || 'W').charAt(0)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                                        {membersList.length} {membersList.length === 1 ? 'Worker' : 'Workers'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                        b.status === 'COMPLETED' || b.status === 'Completed'
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                                            : b.status === 'IN_PROGRESS' || b.status === 'In Progress' || b.status === 'ASSIGNED'
                                                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200'
                                                            : b.status === 'PENDING_MANAGER' || b.status === 'UNASSIGNED'
                                                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                                                            : b.status === 'CANCELLED' || b.status === 'On Hold'
                                                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200'
                                                            : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200'
                                                    }`}
                                                >
                                                    {b.status || 'PENDING_MANAGER'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedBatch(b)}
                                                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
                                                    >
                                                        View Overview
                                                    </button>

                                                    <select
                                                        value={b.status || 'PENDING_MANAGER'}
                                                        onChange={(e) => {
                                                            if (batchId) {
                                                                updateStatusMutation.mutate({ id: batchId, status: e.target.value });
                                                            }
                                                        }}
                                                        className="h-8 px-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer text-slate-900 dark:text-slate-100"
                                                    >
                                                        <option value="PENDING_MANAGER">PENDING_MANAGER</option>
                                                        <option value="ASSIGNED">ASSIGNED</option>
                                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="On Hold">On Hold</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* READ ONLY BATCH OVERVIEW MODAL (MEMBERS LIST GENERATED DYNAMICALLY FROM ASSIGNED TASKS) */}
            {selectedBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto hide-scrollbar font-sans space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                    Batch Overview
                                </span>
                                <h3 className="text-xl font-extrabold tracking-tight mt-1">{selectedBatch.batchName}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedBatch(null)}
                                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Batch Info Grid */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Manager</span>
                                <div className="font-extrabold text-slate-900 dark:text-white">
                                    {selectedBatch.managerName || (selectedBatch.manager as any)?.fullName || 'Assigned Manager'}
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Batch Status</span>
                                <div className="font-extrabold text-purple-600 dark:text-purple-400 uppercase">
                                    {selectedBatch.status || 'Active'}
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 col-span-2">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Notes</span>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    {selectedBatch.notes || 'No special instructions recorded for this production batch.'}
                                </p>
                            </div>
                        </div>

                        {/* Task Statistics */}
                        <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                                <span>Batch Output Progress</span>
                                <span>{selectedBatch.progressPercentage || 0}% Completed</span>
                            </div>
                            <div className="h-2 w-full bg-purple-200/60 dark:bg-purple-900/50 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${selectedBatch.progressPercentage || 0}%` }} />
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-semibold">
                                <span>Total Tasks: {selectedBatch.totalTasks || 0}</span>
                                <span>Completed: {selectedBatch.completedTasks || 0}</span>
                                <span>Pending: {selectedBatch.pendingTasks || 0}</span>
                            </div>
                        </div>

                        {/* Dynamic Read-Only Batch Members Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FiUsers className="text-purple-600" />
                                    <span>Current Batch Members (Derived from Task Assignments)</span>
                                </h4>
                                <span className="text-xs text-slate-400 font-bold">
                                    {(selectedBatch.members || []).length} Members
                                </span>
                            </div>

                            <div className="space-y-2 max-h-48 overflow-y-auto hide-scrollbar border border-slate-100 dark:border-slate-800 rounded-2xl p-3 bg-slate-50/50 dark:bg-slate-800/40">
                                {(selectedBatch.members || []).length === 0 ? (
                                    <p className="text-xs text-slate-400 italic p-3 text-center">
                                        No workers assigned to tasks in this batch yet. Assigning a task will automatically add the employee here.
                                    </p>
                                ) : (
                                    (selectedBatch.members || []).map((m: any, idx: number) => (
                                        <div key={m.id || idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold flex items-center justify-center uppercase">
                                                    {(m.name || 'W').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white">{m.name || 'Worker'}</div>
                                                    <div className="text-[10px] text-slate-400">{m.email || 'Production Worker'}</div>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                {m.department || 'Production'}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedBatch(null)}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Close Overview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
