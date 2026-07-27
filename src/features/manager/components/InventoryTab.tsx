'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/config';
import {
    FiBox,
    FiShield,
    FiAlertTriangle,
    FiCheckCircle,
    FiInfo
} from 'react-icons/fi';
import { ManagerInventoryItem } from '../types';

export default function InventoryTab() {
    const { data: inventoryData, isLoading, isError } = useQuery<{ items: ManagerInventoryItem[]; alertsCount: number }>({
        queryKey: ['manager-inventory'],
        queryFn: async () => {
            const response = await api.get('/api/manager/inventory');
            const data = response.data?.data;
            if (Array.isArray(data)) {
                return { items: data, alertsCount: 0 };
            }
            return {
                items: Array.isArray(data?.items) ? data.items : [],
                alertsCount: data?.alertsCount || 0,
            };
        },
    });

    const items = inventoryData?.items || [];

    return (
        <div className="space-y-6 font-sans">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                        <FiBox size={14} />
                        <span>Factory Material Monitor</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Raw Materials &amp; Finished Goods Inventory
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Monitor fabric rolls, threads, trims, and finished apparel stock levels in real time.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold shrink-0">
                    <FiShield className="text-indigo-600 dark:text-indigo-400" size={16} />
                    <span>Manager View Only (Stock Modifications Locked)</span>
                </div>
            </div>

            {/* Read-Only Notice Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200 text-xs flex items-center gap-3">
                <FiInfo className="text-indigo-600 dark:text-indigo-400 text-base shrink-0" />
                <span className="font-medium">
                    Inventory additions, stock adjustments, and quantity removals are restricted to Admin accounts. Managers have full read access to monitor raw materials for production planning.
                </span>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="py-4 px-6">SKU Code</th>
                                <th className="py-4 px-6">Item Description</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Current Stock</th>
                                <th className="py-4 px-6">Reorder Threshold</th>
                                <th className="py-4 px-6">Stock Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                        Loading material stock...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-rose-500 font-semibold">
                                        Failed to load inventory stock levels. Please try again.
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                        No inventory items recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, idx) => {
                                    const qty = item.quantity ?? item.stock ?? 0;
                                    const threshold = item.reorderLevel ?? item.minimumStock ?? 0;
                                    const unitStr = item.unit || 'Units';
                                    const skuStr = item.sku || (item.id ? `SKU-${item.id}` : `SKU-${idx + 1}`);
                                    const isLowStock =
                                        item.status === 'low_stock' ||
                                        item.status === 'Low Stock' ||
                                        item.status === 'Out of Stock' ||
                                        (qty <= threshold && threshold > 0);

                                    return (
                                        <tr key={item.id || item._id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-4 px-6 font-mono font-bold text-slate-800 dark:text-slate-200">
                                                {skuStr}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                                                {item.name || 'Unnamed Material'}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                                                {item.category || 'General'}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                                                {qty.toLocaleString()} <span className="text-slate-400 font-normal">{unitStr}</span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                                                {threshold.toLocaleString()} {unitStr}
                                            </td>
                                            <td className="py-4 px-6">
                                                {isLowStock ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                                                        <FiAlertTriangle size={12} /> Low Stock Alert
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                                                        <FiCheckCircle size={12} /> In Stock
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
