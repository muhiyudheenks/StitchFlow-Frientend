'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiBox,
    FiShield,
    FiAlertTriangle,
    FiCheckCircle,
    FiInfo
} from 'react-icons/fi';
import { ManagerInventoryItem } from '../types';

export default function InventoryTab() {
    const { data: inventoryData, isLoading } = useQuery<{ items: ManagerInventoryItem[]; alertsCount: number }>({
        queryKey: ['manager-inventory'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/manager/inventory', {
                withCredentials: true,
            });
            return response.data?.data || { items: [], alertsCount: 0 };
        },
    });

    const items = inventoryData?.items || [];

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
                        <FiBox size={14} />
                        <span>Factory Material Monitor</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Raw Materials &amp; Finished Goods Inventory</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Monitor fabric rolls, threads, trims, and finished apparel stock levels in real time.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shrink-0">
                    <FiShield className="text-indigo-600" size={16} />
                    <span>Manager View Only (Stock Modifications Locked)</span>
                </div>
            </div>

            {/* Read-Only Notice Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs flex items-center gap-3">
                <FiInfo className="text-indigo-600 text-base shrink-0" />
                <span className="font-medium">
                    Inventory additions, stock adjustments, and quantity removals are restricted to Admin accounts. Managers have full read access to monitor raw materials for production line planning.
                </span>
            </div>

            {/* Inventory Table */}
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6">SKU Code</th>
                                <th className="py-4 px-6">Item Description</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Current Stock</th>
                                <th className="py-4 px-6">Reorder Threshold</th>
                                <th className="py-4 px-6">Stock Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                        Loading material stock...
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6 font-mono font-bold text-slate-800">{item.sku}</td>
                                        <td className="py-4 px-6 font-bold text-slate-900">{item.name}</td>
                                        <td className="py-4 px-6 text-slate-600">{item.category}</td>
                                        <td className="py-4 px-6 font-bold text-slate-900">
                                            {item.quantity.toLocaleString()} <span className="text-slate-400 font-normal">{item.unit}</span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500">{item.reorderLevel.toLocaleString()} {item.unit}</td>
                                        <td className="py-4 px-6">
                                            {item.status === 'low_stock' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                                                    <FiAlertTriangle size={12} /> Low Stock Alert
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <FiCheckCircle size={12} /> In Stock
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
