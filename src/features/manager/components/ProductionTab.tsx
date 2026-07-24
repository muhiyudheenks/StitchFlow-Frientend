'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiCpu,
    FiPlus,
    FiCheckCircle,
    FiLayers,
    FiX
} from 'react-icons/fi';
import { ManagerProductionBatch } from '../types';

export default function ProductionTab() {
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [productName, setProductName] = useState('');
    const [targetQuantity, setTargetQuantity] = useState(1000);
    const [line, setLine] = useState('Assembly Line A');
    const [dueDate, setDueDate] = useState('');

    const { data: batches = [], isLoading } = useQuery<ManagerProductionBatch[]>({
        queryKey: ['manager-production'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/manager/production', {
                withCredentials: true,
            });
            return response.data?.data || [];
        },
    });

    const createBatchMutation = useMutation({
        mutationFn: async (batchData: any) => {
            const response = await axios.post(
                'http://localhost:5000/api/manager/production',
                batchData,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-production'] });
            setIsCreateModalOpen(false);
            setProductName('');
            setTargetQuantity(1000);
            setDueDate('');
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await axios.put(
                `http://localhost:5000/api/manager/production/${id}`,
                { status },
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-production'] });
        },
    });

    const handleCreateBatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName.trim()) return;
        createBatchMutation.mutate({
            productName: productName.trim(),
            targetQuantity: Number(targetQuantity),
            line,
            dueDate,
        });
    };

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
                        <FiCpu size={14} />
                        <span>Manufacturing Line Operations</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Production Batches &amp; Output Tracking</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Schedule new garment production runs, adjust batch status, and monitor target fulfillment rates.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Create Production Batch</span>
                </button>
            </div>

            {/* Batches Table */}
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6">Batch ID</th>
                                <th className="py-4 px-6">Product Garment</th>
                                <th className="py-4 px-6">Assigned Line</th>
                                <th className="py-4 px-6">Fulfillment</th>
                                <th className="py-4 px-6">Due Date</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                                        Loading production batches...
                                    </td>
                                </tr>
                            ) : (
                                batches.map((b) => {
                                    const pct = Math.round((b.completedQuantity / b.targetQuantity) * 100) || 0;
                                    return (
                                        <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-4 px-6 font-mono font-bold text-indigo-700">{b.batchNumber}</td>
                                            <td className="py-4 px-6 font-bold text-slate-900">{b.productName}</td>
                                            <td className="py-4 px-6 text-slate-700 font-semibold">{b.line}</td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="font-bold">{b.completedQuantity.toLocaleString()} / {b.targetQuantity.toLocaleString()}</span>
                                                        <span className="text-slate-400">{pct}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-28 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-500">{b.dueDate}</td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize ${b.status === 'completed'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : b.status === 'in_production'
                                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}
                                                >
                                                    {b.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <select
                                                    value={b.status}
                                                    onChange={(e) => updateStatusMutation.mutate({ id: b.id, status: e.target.value })}
                                                    className="h-8 px-2 rounded-lg border border-slate-200 text-xs font-bold outline-none bg-slate-50 focus:bg-white transition-all cursor-pointer"
                                                >
                                                    <option value="planned">Planned</option>
                                                    <option value="in_production">In Production</option>
                                                    <option value="quality_check">Quality Check</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Batch Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900">Create Production Batch</h3>
                            <p className="text-xs text-slate-500 mt-1">Schedule new garment manufacturing order for assembly lines.</p>
                        </div>

                        <form onSubmit={handleCreateBatchSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Vintage Denim Jacket"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Target Pieces *</label>
                                    <input
                                        type="number"
                                        required
                                        min={10}
                                        value={targetQuantity}
                                        onChange={(e) => setTargetQuantity(Number(e.target.value))}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Assigned Line</label>
                                    <select
                                        value={line}
                                        onChange={(e) => setLine(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                    >
                                        <option value="Assembly Line A">Assembly Line A</option>
                                        <option value="Cutting & Laying">Cutting &amp; Laying</option>
                                        <option value="Quality Control Line">Quality Control Line</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Target Completion Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createBatchMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 shadow-md cursor-pointer disabled:opacity-60"
                                >
                                    {createBatchMutation.isPending ? 'Creating…' : 'Create Batch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
