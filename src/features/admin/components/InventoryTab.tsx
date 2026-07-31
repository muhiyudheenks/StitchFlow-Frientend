'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useFabricInventory,
    useThreadInventory,
    useGarmentInventory,
    useInventorySummary,
    useInventoryAnalytics,
    useInventoryTransactions,
    useFabricMutations,
    useThreadMutations,
    useGarmentMutations,
} from '../hooks/useInventory';
import {
    FabricItemData,
    ThreadItemData,
    GarmentItemData,
} from '../services/inventory-service';
import {
    FiBox,
    FiPlus,
    FiAlertTriangle,
    FiCheckCircle,
    FiSearch,
    FiTrash2,
    FiEdit3,
    FiLayers,
    FiTrendingUp,
    FiActivity,
    FiPackage,
    FiGrid,
    FiList,
    FiX,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
} from 'react-icons/fi';

interface InventoryTabProps {
    onOpenQuickAction?: (actionType: string) => void;
}

export default function InventoryTab({ onOpenQuickAction }: InventoryTabProps) {
    const [activeSubTab, setActiveSubTab] = useState<'overview' | 'fabric' | 'thread' | 'garments' | 'transactions'>('overview');

    // Search & Filter States
    const [fabricSearch, setFabricSearch] = useState('');
    const [fabricTypeFilter, setFabricTypeFilter] = useState('All');
    const [fabricStatusFilter, setFabricStatusFilter] = useState('All');
    const [fabricPage, setFabricPage] = useState(1);

    const [threadSearch, setThreadSearch] = useState('');
    const [threadTypeFilter, setThreadTypeFilter] = useState('All');
    const [threadStatusFilter, setThreadStatusFilter] = useState('All');
    const [threadPage, setThreadPage] = useState(1);

    const [garmentSearch, setGarmentSearch] = useState('');
    const [garmentCategoryFilter, setGarmentCategoryFilter] = useState('All');
    const [garmentStatusFilter, setGarmentStatusFilter] = useState('All');
    const [garmentPage, setGarmentPage] = useState(1);

    const [txPage, setTxPage] = useState(1);

    // Modals
    const [fabricModalOpen, setFabricModalOpen] = useState(false);
    const [editingFabric, setEditingFabric] = useState<FabricItemData | null>(null);

    const [threadModalOpen, setThreadModalOpen] = useState(false);
    const [editingThread, setEditingThread] = useState<ThreadItemData | null>(null);

    const [garmentModalOpen, setGarmentModalOpen] = useState(false);
    const [editingGarment, setEditingGarment] = useState<GarmentItemData | null>(null);

    // Queries
    const { data: summary } = useInventorySummary();
    const { data: analytics } = useInventoryAnalytics();

    const { data: fabricData, isLoading: isLoadingFabric } = useFabricInventory({
        search: fabricSearch,
        fabricType: fabricTypeFilter,
        status: fabricStatusFilter,
        page: fabricPage,
        limit: 8,
    });

    const { data: threadData, isLoading: isLoadingThread } = useThreadInventory({
        search: threadSearch,
        threadType: threadTypeFilter,
        status: threadStatusFilter,
        page: threadPage,
        limit: 8,
    });

    const { data: garmentData, isLoading: isLoadingGarments } = useGarmentInventory({
        search: garmentSearch,
        category: garmentCategoryFilter,
        status: garmentStatusFilter,
        page: garmentPage,
        limit: 8,
    });

    const { data: txData, isLoading: isLoadingTx } = useInventoryTransactions({
        page: txPage,
        limit: 10,
    });

    // Mutations
    const { createFabric, updateFabric, deleteFabric } = useFabricMutations();
    const { createThread, updateThread, deleteThread } = useThreadMutations();
    const { createGarment, updateGarment, deleteGarment } = useGarmentMutations();

    const fabricsList: FabricItemData[] = fabricData?.data || [];
    const fabricPagination = fabricData?.pagination || { page: 1, totalPages: 1, total: 0 };

    const threadsList: ThreadItemData[] = threadData?.data || [];
    const threadPagination = threadData?.pagination || { page: 1, totalPages: 1, total: 0 };

    const garmentsList: GarmentItemData[] = garmentData?.data || [];
    const garmentPagination = garmentData?.pagination || { page: 1, totalPages: 1, total: 0 };

    const transactionsList = txData?.data || [];
    const txPagination = txData?.pagination || { page: 1, totalPages: 1, total: 0 };

    // Handlers for Fabric Form
    const handleSaveFabric = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload: FabricItemData = {
            fabricName: formData.get('fabricName') as string,
            fabricType: formData.get('fabricType') as string,
            gsm: Number(formData.get('gsm')),
            color: formData.get('color') as string,
            width: formData.get('width') as string,
            rollNumber: formData.get('rollNumber') as string,
            supplier: formData.get('supplier') as string,
            unit: formData.get('unit') as 'Meters' | 'Kg',
            currentStock: Number(formData.get('currentStock')),
            minimumStock: Number(formData.get('minimumStock')),
            unitCost: Number(formData.get('unitCost')),
            warehouseLocation: formData.get('warehouseLocation') as string,
        };

        if (editingFabric?._id) {
            updateFabric.mutate({ id: editingFabric._id, data: payload }, {
                onSuccess: () => { setFabricModalOpen(false); setEditingFabric(null); }
            });
        } else {
            createFabric.mutate(payload, {
                onSuccess: () => setFabricModalOpen(false)
            });
        }
    };

    // Handlers for Thread Form
    const handleSaveThread = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload: ThreadItemData = {
            threadType: formData.get('threadType') as string,
            color: formData.get('color') as string,
            brand: formData.get('brand') as string,
            supplier: formData.get('supplier') as string,
            unit: formData.get('unit') as 'Spools' | 'Cones' | 'Yards',
            currentStock: Number(formData.get('currentStock')),
            minimumStock: Number(formData.get('minimumStock')),
            unitCost: Number(formData.get('unitCost')),
            warehouse: formData.get('warehouse') as string,
        };

        if (editingThread?._id) {
            updateThread.mutate({ id: editingThread._id, data: payload }, {
                onSuccess: () => { setThreadModalOpen(false); setEditingThread(null); }
            });
        } else {
            createThread.mutate(payload, {
                onSuccess: () => setThreadModalOpen(false)
            });
        }
    };

    // Handlers for Garment Form
    const handleSaveGarment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload: GarmentItemData = {
            productName: formData.get('productName') as string,
            styleNumber: formData.get('styleNumber') as string,
            category: formData.get('category') as string,
            size: formData.get('size') as string,
            color: formData.get('color') as string,
            quantityAvailable: Number(formData.get('quantityAvailable')),
            quantityReserved: Number(formData.get('quantityReserved')),
            warehouse: formData.get('warehouse') as string,
            unitCost: Number(formData.get('unitCost')),
            sellingPrice: Number(formData.get('sellingPrice')),
            status: formData.get('status') as 'Ready' | 'Reserved' | 'Dispatched',
        };

        if (editingGarment?._id) {
            updateGarment.mutate({ id: editingGarment._id, data: payload }, {
                onSuccess: () => { setGarmentModalOpen(false); setEditingGarment(null); }
            });
        } else {
            createGarment.mutate(payload, {
                onSuccess: () => setGarmentModalOpen(false)
            });
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Garment Manufacturing ERP Inventory
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Raw materials fabric, thread accessories, finished garments, and automated stock movement log
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => {
                            setEditingFabric(null);
                            setFabricModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <FiPlus size={15} />
                        <span>Add Fabric</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingThread(null);
                            setThreadModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <FiPlus size={15} />
                        <span>Add Thread</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingGarment(null);
                            setGarmentModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <FiPlus size={15} />
                        <span>Add Garment</span>
                    </button>
                </div>
            </div>

            {/* Top 5 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-xs">
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Total Fabric Stock</span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {summary?.totalFabricStock ? summary.totalFabricStock.toLocaleString() : 0} <span className="text-xs font-normal text-slate-400">Meters/Kg</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">Raw Materials</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-xs">
                    <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">Total Thread Stock</span>
                    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                        {summary?.totalThreadStock ? summary.totalThreadStock.toLocaleString() : 0} <span className="text-xs font-normal text-slate-400">Spools</span>
                    </div>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1 block">Accessories</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-xs">
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">Finished Garments</span>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {summary?.finishedGarmentsCount ? summary.finishedGarmentsCount.toLocaleString() : 0} <span className="text-xs font-normal text-slate-400">Pcs</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">Finished Goods</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-xs">
                    <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">Low Stock Items</span>
                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                        {summary?.lowStockItemsCount ?? 0} <span className="text-xs font-normal text-slate-400">Alerts</span>
                    </div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1 block">Reorder Threshold</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 shadow-xs">
                    <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">Inventory Value</span>
                    <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 font-mono">
                        ₹{summary?.inventoryValue ? summary.inventoryValue.toLocaleString() : '0.00'}
                    </div>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1 block">Valuation Total</span>
                </div>
            </div>

            {/* Navigation Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
                {[
                    { key: 'overview', label: 'Dashboard & Analytics', icon: FiActivity },
                    { key: 'fabric', label: '1. Fabric Inventory (Raw)', icon: FiLayers },
                    { key: 'thread', label: '2. Thread Inventory (Accessories)', icon: FiBox },
                    { key: 'garments', label: '3. Finished Garments (Goods)', icon: FiPackage },
                    { key: 'transactions', label: 'Stock Movement Log', icon: FiList },
                ].map((t) => {
                    const Icon = t.icon;
                    const isActive = activeSubTab === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setActiveSubTab(t.key as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${isActive
                                ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-md'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Icon size={14} />
                            <span>{t.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT: 1. OVERVIEW & ANALYTICS */}
            {activeSubTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Consumption & Production Chart Section */}
                        <div className="lg:col-span-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Inventory Consumption &amp; Production Telemetry
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Live fabric roll usage, thread spool deductions, and finished garment outputs
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Fabric Consumption</span>
                                    <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">
                                        {analytics?.fabricConsumption ?? 0} m
                                    </div>
                                    <span className="text-[10px] text-purple-500">Cut &amp; Lay Output</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Thread Consumption</span>
                                    <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-1">
                                        {analytics?.threadConsumption ?? 0} Spools
                                    </div>
                                    <span className="text-[10px] text-indigo-500">Stitching Operations</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Finished Production</span>
                                    <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
                                        {analytics?.finishedProduction ?? 0} Pcs
                                    </div>
                                    <span className="text-[10px] text-emerald-500">Completed Garments</span>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Alerts Card */}
                        <div className="lg:col-span-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Low Stock Alerts</h3>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200 dark:border-amber-900/50">
                                        {summary?.lowStockItemsCount ?? 0} Critical
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Items that reached reorder minimum thresholds and require immediate purchase orders.
                                </p>
                            </div>

                            <button
                                onClick={() => setActiveSubTab('fabric')}
                                className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-purple-600 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors text-center cursor-pointer"
                            >
                                Review Raw Material Stocks
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 1. FABRIC INVENTORY */}
            {activeSubTab === 'fabric' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-6 relative">
                            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            <input
                                type="text"
                                placeholder="Search fabric name, ID, color, supplier..."
                                value={fabricSearch}
                                onChange={(e) => { setFabricSearch(e.target.value); setFabricPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-purple-500 shadow-xs"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                value={fabricTypeFilter}
                                onChange={(e) => { setFabricTypeFilter(e.target.value); setFabricPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-purple-500 shadow-xs"
                            >
                                <option value="All">All Fabric Types</option>
                                <option value="Denim">Denim</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Linen">Linen</option>
                                <option value="Polyester">Polyester</option>
                                <option value="Silk">Silk</option>
                            </select>
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                value={fabricStatusFilter}
                                onChange={(e) => { setFabricStatusFilter(e.target.value); setFabricPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-purple-500 shadow-xs"
                            >
                                <option value="All">All Statuses</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                                        <th className="py-4 px-6">Fabric ID</th>
                                        <th className="py-4 px-6">Fabric Name</th>
                                        <th className="py-4 px-6">Type &amp; GSM</th>
                                        <th className="py-4 px-6">Color &amp; Width</th>
                                        <th className="py-4 px-6">Roll # / Supplier</th>
                                        <th className="py-4 px-6">Current Stock</th>
                                        <th className="py-4 px-6">Unit Cost / Total</th>
                                        <th className="py-4 px-6">Location</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {isLoadingFabric ? (
                                        <tr>
                                            <td colSpan={10} className="py-12 text-center text-slate-400 font-semibold">
                                                Loading fabric inventory...
                                            </td>
                                        </tr>
                                    ) : fabricsList.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="py-12 text-center text-slate-400 font-semibold">
                                                No fabric records found matching your filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        fabricsList.map((item) => (
                                            <tr key={item._id || item.fabricId} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors">
                                                <td className="py-4 px-6 font-mono font-bold text-purple-700 dark:text-purple-400">{item.fabricId}</td>
                                                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{item.fabricName}</td>
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.fabricType}</span>
                                                    <span className="text-[10px] text-slate-400 block">{item.gsm} GSM</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold">{item.color}</span>
                                                    <span className="text-[10px] text-slate-400 block">{item.width}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-mono text-slate-800 dark:text-slate-200">{item.rollNumber || 'R-101'}</span>
                                                    <span className="text-[10px] text-slate-400 block">{item.supplier}</span>
                                                </td>
                                                <td className="py-4 px-6 font-mono font-extrabold text-slate-900 dark:text-white">
                                                    {item.currentStock.toLocaleString()} {item.unit}
                                                    <span className="text-[10px] text-slate-400 font-normal block">Min: {item.minimumStock}</span>
                                                </td>
                                                <td className="py-4 px-6 font-mono">
                                                    <span className="font-bold">${item.unitCost}</span>
                                                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold">${item.totalValue ?? (item.currentStock * item.unitCost)}</span>
                                                </td>
                                                <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">{item.warehouseLocation}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${item.status === 'In Stock' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-900/50' :
                                                        item.status === 'Low Stock' ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-amber-900/50' :
                                                            'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200 dark:border-rose-900/50 animate-pulse'
                                                        }`}>
                                                        {item.status === 'Low Stock' && <FiAlertTriangle size={12} />}
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingFabric(item); setFabricModalOpen(true); }}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        >
                                                            <FiEdit3 size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => item._id && deleteFabric.mutate(item._id)}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                            <span>Showing page {fabricPagination.page} of {fabricPagination.totalPages} ({fabricPagination.total} total items)</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setFabricPage((p) => Math.max(1, p - 1))}
                                    disabled={fabricPage <= 1}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                <span className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold">{fabricPage}</span>
                                <button
                                    onClick={() => setFabricPage((p) => Math.min(fabricPagination.totalPages, p + 1))}
                                    disabled={fabricPage >= fabricPagination.totalPages}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 2. THREAD INVENTORY */}
            {activeSubTab === 'thread' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-6 relative">
                            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            <input
                                type="text"
                                placeholder="Search thread type, brand, color, supplier..."
                                value={threadSearch}
                                onChange={(e) => { setThreadSearch(e.target.value); setThreadPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-500 shadow-xs"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                value={threadTypeFilter}
                                onChange={(e) => { setThreadTypeFilter(e.target.value); setThreadPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 shadow-xs"
                            >
                                <option value="All">All Thread Types</option>
                                <option value="Polyester 40/2">Polyester 40/2</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Nylon">Nylon</option>
                                <option value="Elastic Thread">Elastic Thread</option>
                            </select>
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                value={threadStatusFilter}
                                onChange={(e) => { setThreadStatusFilter(e.target.value); setThreadPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 shadow-xs"
                            >
                                <option value="All">All Statuses</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs min-w-[850px]">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                                        <th className="py-4 px-6">Thread ID</th>
                                        <th className="py-4 px-6">Thread Type &amp; Brand</th>
                                        <th className="py-4 px-6">Color</th>
                                        <th className="py-4 px-6">Supplier</th>
                                        <th className="py-4 px-6">Current Stock</th>
                                        <th className="py-4 px-6">Unit Cost / Total</th>
                                        <th className="py-4 px-6">Warehouse</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {isLoadingThread ? (
                                        <tr>
                                            <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold">
                                                Loading thread inventory...
                                            </td>
                                        </tr>
                                    ) : threadsList.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold">
                                                No thread records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        threadsList.map((item) => (
                                            <tr key={item._id || item.threadId} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors">
                                                <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.threadId}</td>
                                                <td className="py-4 px-6">
                                                    <span className="font-bold text-slate-900 dark:text-white">{item.threadType}</span>
                                                    <span className="text-[10px] text-slate-400 block">Brand: {item.brand}</span>
                                                </td>
                                                <td className="py-4 px-6 font-semibold">{item.color}</td>
                                                <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">{item.supplier}</td>
                                                <td className="py-4 px-6 font-mono font-extrabold text-slate-900 dark:text-white">
                                                    {item.currentStock.toLocaleString()} {item.unit}
                                                    <span className="text-[10px] text-slate-400 font-normal block">Min: {item.minimumStock}</span>
                                                </td>
                                                <td className="py-4 px-6 font-mono">
                                                    <span className="font-bold">${item.unitCost}</span>
                                                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-bold">${item.totalValue ?? (item.currentStock * item.unitCost)}</span>
                                                </td>
                                                <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">{item.warehouse}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${item.status === 'In Stock' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-900/50' :
                                                        item.status === 'Low Stock' ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-amber-900/50' :
                                                            'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200 dark:border-rose-900/50 animate-pulse'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingThread(item); setThreadModalOpen(true); }}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        >
                                                            <FiEdit3 size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => item._id && deleteThread.mutate(item._id)}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                            <span>Showing page {threadPagination.page} of {threadPagination.totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setThreadPage((p) => Math.max(1, p - 1))}
                                    disabled={threadPage <= 1}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold">{threadPage}</span>
                                <button
                                    onClick={() => setThreadPage((p) => Math.min(threadPagination.totalPages, p + 1))}
                                    disabled={threadPage >= threadPagination.totalPages}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 3. FINISHED GARMENTS INVENTORY */}
            {activeSubTab === 'garments' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-6 relative">
                            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            <input
                                type="text"
                                placeholder="Search product name, style #, product ID..."
                                value={garmentSearch}
                                onChange={(e) => { setGarmentSearch(e.target.value); setGarmentPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-500 shadow-xs"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                value={garmentCategoryFilter}
                                onChange={(e) => { setGarmentCategoryFilter(e.target.value); setGarmentPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 shadow-xs"
                            >
                                <option value="All">All Categories</option>
                                <option value="Denim Outerwear">Denim Outerwear</option>
                                <option value="Casual Shirts">Casual Shirts</option>
                                <option value="T-Shirts">T-Shirts</option>
                                <option value="Trousers">Trousers</option>
                            </select>
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                value={garmentStatusFilter}
                                onChange={(e) => { setGarmentStatusFilter(e.target.value); setGarmentPage(1); }}
                                className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 shadow-xs"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Ready">Ready</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Dispatched">Dispatched</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                                        <th className="py-4 px-6">Product ID</th>
                                        <th className="py-4 px-6">Product Name &amp; Style</th>
                                        <th className="py-4 px-6">Category &amp; Size</th>
                                        <th className="py-4 px-6">Available / Reserved</th>
                                        <th className="py-4 px-6">Total Quantity</th>
                                        <th className="py-4 px-6">Cost / Selling Price</th>
                                        <th className="py-4 px-6">Warehouse</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {isLoadingGarments ? (
                                        <tr>
                                            <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold">
                                                Loading finished garments...
                                            </td>
                                        </tr>
                                    ) : garmentsList.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold">
                                                No finished garment products found.
                                            </td>
                                        </tr>
                                    ) : (
                                        garmentsList.map((item) => (
                                            <tr key={item._id || item.productId} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-colors">
                                                <td className="py-4 px-6 font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.productId}</td>
                                                <td className="py-4 px-6">
                                                    <span className="font-bold text-slate-900 dark:text-white">{item.productName}</span>
                                                    <span className="text-[10px] text-slate-400 block font-mono">Style: {item.styleNumber}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold">{item.category}</span>
                                                    <span className="text-[10px] text-slate-400 block">Size: {item.size} • {item.color}</span>
                                                </td>
                                                <td className="py-4 px-6 font-mono">
                                                    <span className="text-emerald-600 font-bold">{item.quantityAvailable} Avail</span>
                                                    <span className="text-[10px] text-amber-600 block">{item.quantityReserved} Resv</span>
                                                </td>
                                                <td className="py-4 px-6 font-mono font-extrabold text-slate-900 dark:text-white">
                                                    {(item.totalQuantity ?? (item.quantityAvailable + item.quantityReserved)).toLocaleString()} Pcs
                                                </td>
                                                <td className="py-4 px-6 font-mono">
                                                    <span className="text-slate-500 font-bold">${item.unitCost} Cost</span>
                                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">${item.sellingPrice} Sell</span>
                                                </td>
                                                <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">{item.warehouse}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${item.status === 'Ready' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-900/50' :
                                                        item.status === 'Reserved' ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-amber-900/50' :
                                                            'bg-purple-50 dark:bg-purple-950/50 text-purple-600 border-purple-200 dark:border-purple-900/50'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingGarment(item); setGarmentModalOpen(true); }}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        >
                                                            <FiEdit3 size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => item._id && deleteGarment.mutate(item._id)}
                                                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                            <span>Showing page {garmentPagination.page} of {garmentPagination.totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setGarmentPage((p) => Math.max(1, p - 1))}
                                    disabled={garmentPage <= 1}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold">{garmentPage}</span>
                                <button
                                    onClick={() => setGarmentPage((p) => Math.min(garmentPagination.totalPages, p + 1))}
                                    disabled={garmentPage >= garmentPagination.totalPages}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: STOCK TRANSACTIONS HISTORY */}
            {activeSubTab === 'transactions' && (
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden p-6 sm:p-8">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        Stock Movement Audit Log
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[750px]">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                                    <th className="py-4 px-6">Timestamp / Date</th>
                                    <th className="py-4 px-6">Inventory Item</th>
                                    <th className="py-4 px-6">Category Type</th>
                                    <th className="py-4 px-6">Movement Quantity</th>
                                    <th className="py-4 px-6">Movement Type</th>
                                    <th className="py-4 px-6">User / Operator</th>
                                    <th className="py-4 px-6">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                {isLoadingTx ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                                            Loading stock movement history...
                                        </td>
                                    </tr>
                                ) : transactionsList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                                            No stock movement transactions recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    transactionsList.map((tx: any) => (
                                        <tr key={tx._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-4 px-6 font-mono text-slate-500">
                                                {new Date(tx.date || tx.createdAt).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{tx.item}</td>
                                            <td className="py-4 px-6 font-semibold">{tx.itemType}</td>
                                            <td className="py-4 px-6 font-mono font-extrabold">
                                                <span className={tx.quantity >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                                    {tx.quantity >= 0 ? `+${tx.quantity}` : tx.quantity}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${tx.movementType === 'Purchase' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200' :
                                                    tx.movementType === 'Production' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200' :
                                                        tx.movementType === 'Return' ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200' :
                                                            'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200'
                                                    }`}>
                                                    {tx.movementType}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-semibold">{tx.user}</td>
                                            <td className="py-4 px-6 text-slate-500">{tx.notes || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* FABRIC MODAL */}
            {fabricModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => { setFabricModalOpen(false); setEditingFabric(null); }}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <h3 className="text-xl font-extrabold tracking-tight mb-4">
                            {editingFabric ? 'Edit Fabric Record' : 'Add New Fabric Raw Material'}
                        </h3>

                        <form onSubmit={handleSaveFabric} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold mb-1">Fabric Name *</label>
                                <input
                                    type="text"
                                    name="fabricName"
                                    defaultValue={editingFabric?.fabricName || ''}
                                    required
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Fabric Type *</label>
                                    <select
                                        name="fabricType"
                                        defaultValue={editingFabric?.fabricType || 'Denim'}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    >
                                        <option value="Denim">Denim</option>
                                        <option value="Cotton">Cotton</option>
                                        <option value="Linen">Linen</option>
                                        <option value="Polyester">Polyester</option>
                                        <option value="Silk">Silk</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">GSM *</label>
                                    <input
                                        type="number"
                                        name="gsm"
                                        defaultValue={editingFabric?.gsm || 240}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Color *</label>
                                    <input
                                        type="text"
                                        name="color"
                                        defaultValue={editingFabric?.color || 'Indigo Blue'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Width *</label>
                                    <input
                                        type="text"
                                        name="width"
                                        defaultValue={editingFabric?.width || '60 inches'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Roll Number</label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        defaultValue={editingFabric?.rollNumber || 'R-809'}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Supplier *</label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        defaultValue={editingFabric?.supplier || 'Textile Mills Ltd'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Unit *</label>
                                    <select
                                        name="unit"
                                        defaultValue={editingFabric?.unit || 'Meters'}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    >
                                        <option value="Meters">Meters</option>
                                        <option value="Kg">Kg</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Current Stock *</label>
                                    <input
                                        type="number"
                                        name="currentStock"
                                        defaultValue={editingFabric?.currentStock ?? 1200}
                                        required
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Min Stock *</label>
                                    <input
                                        type="number"
                                        name="minimumStock"
                                        defaultValue={editingFabric?.minimumStock ?? 200}
                                        required
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Unit Cost (₹) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="unitCost"
                                        defaultValue={editingFabric?.unitCost ?? 4.50}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Warehouse Location *</label>
                                    <input
                                        type="text"
                                        name="warehouseLocation"
                                        defaultValue={editingFabric?.warehouseLocation || 'Warehouse A - Bay 12'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setFabricModalOpen(false); setEditingFabric(null); }}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer"
                                >
                                    {editingFabric ? 'Update Fabric' : 'Save Fabric'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* THREAD MODAL */}
            {threadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => { setThreadModalOpen(false); setEditingThread(null); }}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <h3 className="text-xl font-extrabold tracking-tight mb-4">
                            {editingThread ? 'Edit Thread Accessories Record' : 'Add New Thread / Accessories Stock'}
                        </h3>

                        <form onSubmit={handleSaveThread} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Thread Type *</label>
                                    <input
                                        type="text"
                                        name="threadType"
                                        defaultValue={editingThread?.threadType || 'Polyester 40/2'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Color *</label>
                                    <input
                                        type="text"
                                        name="color"
                                        defaultValue={editingThread?.color || 'Navy Blue'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Brand *</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        defaultValue={editingThread?.brand || 'Coats Epic'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Supplier *</label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        defaultValue={editingThread?.supplier || 'Thread Supplies Corp'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Unit *</label>
                                    <select
                                        name="unit"
                                        defaultValue={editingThread?.unit || 'Spools'}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    >
                                        <option value="Spools">Spools</option>
                                        <option value="Cones">Cones</option>
                                        <option value="Yards">Yards</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Current Stock *</label>
                                    <input
                                        type="number"
                                        name="currentStock"
                                        defaultValue={editingThread?.currentStock ?? 500}
                                        required
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Min Stock *</label>
                                    <input
                                        type="number"
                                        name="minimumStock"
                                        defaultValue={editingThread?.minimumStock ?? 100}
                                        required
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Unit Cost ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="unitCost"
                                        defaultValue={editingThread?.unitCost ?? 1.85}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Warehouse *</label>
                                    <input
                                        type="text"
                                        name="warehouse"
                                        defaultValue={editingThread?.warehouse || 'Storage Rack B-4'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setThreadModalOpen(false); setEditingThread(null); }}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md cursor-pointer"
                                >
                                    {editingThread ? 'Update Thread' : 'Save Thread'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* GARMENT MODAL */}
            {garmentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => { setGarmentModalOpen(false); setEditingGarment(null); }}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <h3 className="text-xl font-extrabold tracking-tight mb-4">
                            {editingGarment ? 'Edit Finished Garment Record' : 'Add New Finished Garment Stock'}
                        </h3>

                        <form onSubmit={handleSaveGarment} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="productName"
                                    defaultValue={editingGarment?.productName || 'Heritage Denim Jacket'}
                                    required
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Style Number *</label>
                                    <input
                                        type="text"
                                        name="styleNumber"
                                        defaultValue={editingGarment?.styleNumber || 'ST-9001'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Category *</label>
                                    <select
                                        name="category"
                                        defaultValue={editingGarment?.category || 'Denim Outerwear'}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    >
                                        <option value="Denim Outerwear">Denim Outerwear</option>
                                        <option value="Casual Shirts">Casual Shirts</option>
                                        <option value="T-Shirts">T-Shirts</option>
                                        <option value="Trousers">Trousers</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Size *</label>
                                    <select
                                        name="size"
                                        defaultValue={editingGarment?.size || 'L'}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    >
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Color *</label>
                                    <input
                                        type="text"
                                        name="color"
                                        defaultValue={editingGarment?.color || 'Washed Blue'}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Quantity Available *</label>
                                    <input
                                        type="number"
                                        name="quantityAvailable"
                                        defaultValue={editingGarment?.quantityAvailable ?? 450}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Quantity Reserved *</label>
                                    <input
                                        type="number"
                                        name="quantityReserved"
                                        defaultValue={editingGarment?.quantityReserved ?? 50}
                                        required
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Unit Cost ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="unitCost"
                                        defaultValue={editingGarment?.unitCost ?? 18.50}
                                        required
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Selling Price ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="sellingPrice"
                                        defaultValue={editingGarment?.sellingPrice ?? 45.00}
                                        required
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Status *</label>
                                    <select
                                        name="status"
                                        defaultValue={editingGarment?.status || 'Ready'}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                    >
                                        <option value="Ready">Ready</option>
                                        <option value="Reserved">Reserved</option>
                                        <option value="Dispatched">Dispatched</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-1">Warehouse Location *</label>
                                <input
                                    type="text"
                                    name="warehouse"
                                    defaultValue={editingGarment?.warehouse || 'Finished Dispatch Hub 1'}
                                    required
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setGarmentModalOpen(false); setEditingGarment(null); }}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md cursor-pointer"
                                >
                                    {editingGarment ? 'Update Garment' : 'Save Garment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
