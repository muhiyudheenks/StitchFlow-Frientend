'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockInventoryItems } from '../data/mockData';
import { FiBox, FiPlus, FiAlertTriangle, FiCheckCircle, FiSearch } from 'react-icons/fi';

interface InventoryTabProps {
    onOpenQuickAction: (actionType: string) => void;
}

export default function InventoryTab({ onOpenQuickAction }: InventoryTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const filteredItems = mockInventoryItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="space-y-6 font-sans">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Fabric & Garment Inventory Control
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Track raw materials, spools, trims, finished stock, and warehouse bins
                    </p>
                </div>

                <button
                    onClick={() => onOpenQuickAction('Update Stock')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
                >
                    <FiPlus size={16} />
                    <span>Add New Stock Entry</span>
                </button>
            </div>

            {/* Inventory Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Raw Denim Fabric</span>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">4,500 m</div>
                    <span className="text-xs text-emerald-600 mt-1 block">Optimal Stock Level</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Low Stock Spools</span>
                    <div className="text-3xl font-extrabold text-amber-600 mt-2">820 Spools</div>
                    <span className="text-xs text-amber-600 mt-1 block">Reorder threshold: 1,000</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Finished Garments</span>
                    <div className="text-3xl font-extrabold text-purple-700 mt-2">1,450 Units</div>
                    <span className="text-xs text-purple-600 mt-1 block">Ready for Dispatch</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Warehouse Usage</span>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">78% Full</div>
                    <span className="text-xs text-slate-500 mt-1 block">Bay A, B & Packaging</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 relative">
                    <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                        type="text"
                        placeholder="Search by SKU, item name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all shadow-xs"
                    />
                </div>

                <div className="sm:col-span-4">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 shadow-xs"
                    >
                        <option value="All">All Categories</option>
                        <option value="Raw Fabric">Raw Fabric</option>
                        <option value="Threads & Trims">Threads & Trims</option>
                        <option value="Finished Garment">Finished Garment</option>
                        <option value="Packaging">Packaging</option>
                    </select>
                </div>
            </div>

            {/* Inventory Table */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                                <th className="py-4 px-6">SKU Code</th>
                                <th className="py-4 px-6">Item Name</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Quantity In Stock</th>
                                <th className="py-4 px-6">Reorder Threshold</th>
                                <th className="py-4 px-6">Warehouse Location</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                                    <td className="py-4 px-6 font-mono font-bold text-purple-700">{item.sku}</td>
                                    <td className="py-4 px-6 font-bold text-slate-900">{item.name}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 font-mono font-extrabold text-slate-900">
                                        {item.quantity.toLocaleString()} {item.unit}
                                    </td>
                                    <td className="py-4 px-6 font-mono text-slate-500">
                                        {item.reorderLevel.toLocaleString()} {item.unit}
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">{item.location}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
