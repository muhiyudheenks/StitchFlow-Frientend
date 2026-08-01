'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiTag,
    FiPlus,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiX,
    FiLayers,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
} from 'react-icons/fi';

const CATEGORIES = ['All', 'Shirt', 'Pant', 'T-Shirt', 'Jacket', 'Uniform', 'Other'];

export default function GarmentProductsTab() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    // Form Fields
    const [productName, setProductName] = useState('');
    const [productCode, setProductCode] = useState('');
    const [category, setCategory] = useState('Shirt');
    const [description, setDescription] = useState('');
    const [defaultTargetQuantity, setDefaultTargetQuantity] = useState(100);
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // 1. Fetch Garment Products
    const { data: responseData, isLoading } = useQuery<any>({
        queryKey: ['admin-garment-products', search, categoryFilter, statusFilter, page],
        queryFn: async () => {
            const res = await api.get('/api/admin/garment-products', {
                params: {
                    search: search.trim() || undefined,
                    category: categoryFilter !== 'All' ? categoryFilter : undefined,
                    status: statusFilter !== 'All' ? statusFilter : undefined,
                    page,
                    limit: 10,
                },
            });
            return res.data;
        },
    });

    const products = responseData?.data || [];
    const pagination = responseData?.pagination || { page: 1, totalPages: 1, total: 0 };

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post('/api/admin/garment-products', payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-garment-products'] });
            queryClient.invalidateQueries({ queryKey: ['active-garment-products'] });
            setIsAddModalOpen(false);
            resetForm();
            showToast('Garment product created successfully!');
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to create garment product');
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
            const res = await api.put(`/api/admin/garment-products/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-garment-products'] });
            queryClient.invalidateQueries({ queryKey: ['active-garment-products'] });
            setEditingProduct(null);
            resetForm();
            showToast('Garment product updated successfully!');
        },
        onError: (err: any) => {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to update garment product');
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.patch(`/api/admin/garment-products/${id}/status`);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin-garment-products'] });
            queryClient.invalidateQueries({ queryKey: ['active-garment-products'] });
            showToast(`Product ${data.data?.status === 'Active' ? 'activated' : 'deactivated'}`);
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Failed to toggle status');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/api/admin/garment-products/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-garment-products'] });
            queryClient.invalidateQueries({ queryKey: ['active-garment-products'] });
            showToast('Garment product deleted successfully');
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Cannot delete product in use');
        },
    });

    const resetForm = () => {
        setProductName('');
        setProductCode('');
        setCategory('Shirt');
        setDescription('');
        setDefaultTargetQuantity(100);
        setStatus('Active');
        setErrorMessage(null);
    };

    const openEditModal = (p: any) => {
        setEditingProduct(p);
        setProductName(p.productName);
        setProductCode(p.productCode);
        setCategory(p.category || 'Shirt');
        setDescription(p.description || '');
        setDefaultTargetQuantity(p.defaultTargetQuantity || 100);
        setStatus(p.status || 'Active');
        setErrorMessage(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!productName.trim()) {
            setErrorMessage('Product Name is required');
            return;
        }

        const payload = {
            productName: productName.trim(),
            productCode: productCode.trim().toUpperCase() || undefined,
            category,
            description: description.trim(),
            defaultTargetQuantity: Number(defaultTargetQuantity || 100),
            status,
        };

        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct._id || editingProduct.id, payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
                    <FiCheckCircle size={18} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                        <FiTag size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Garment Products</h1>
                        <p className="text-xs text-slate-500">Centralized garment catalog for standard production task dispatching</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setIsAddModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer shrink-0"
                >
                    <FiPlus size={16} />
                    <span>Add Garment Product</span>
                </button>
            </div>

            {/* Controls Bar: Search & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative col-span-1 sm:col-span-1">
                    <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search product name, code..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-purple-500"
                    />
                </div>

                <div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setPage(1);
                        }}
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-purple-500 cursor-pointer"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                Category: {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-purple-500 cursor-pointer"
                    >
                        <option value="All">Status: All</option>
                        <option value="Active">Status: Active Only</option>
                        <option value="Inactive">Status: Inactive Only</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                {isLoading ? (
                    <div className="py-12 text-center text-xs font-bold text-slate-400">Loading garment products...</div>
                ) : products.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-500 flex items-center justify-center mx-auto">
                            <FiTag size={24} />
                        </div>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No Garment Products Found</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">Click "Add Garment Product" to define master product items for manager task dispatching.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase text-slate-500">
                                    <th className="py-3 px-4">Product Code</th>
                                    <th className="py-3 px-4">Product Name</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Default Qty</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                {products.map((p: any) => (
                                    <tr key={p._id || p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                                            {p.productCode}
                                        </td>
                                        <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                                            {p.productName}
                                            {p.description && <span className="block text-[11px] font-normal text-slate-400 line-clamp-1">{p.description}</span>}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono">
                                            {p.defaultTargetQuantity || 100} pcs
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                onClick={() => toggleStatusMutation.mutate(p._id || p.id)}
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase cursor-pointer transition-transform active:scale-95 ${
                                                    p.status === 'Active'
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                                                }`}
                                            >
                                                {p.status}
                                            </button>
                                        </td>
                                        <td className="py-3.5 px-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                                                title="Edit Product"
                                            >
                                                <FiEdit2 size={13} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to delete product '${p.productName}'?`)) {
                                                        deleteMutation.mutate(p._id || p.id);
                                                    }
                                                }}
                                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 cursor-pointer"
                                                title="Delete Product"
                                            >
                                                <FiTrash2 size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-slate-400">
                            Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total products)
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                            >
                                <FiChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                                disabled={page === pagination.totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                            >
                                <FiChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ADD / EDIT MODAL */}
            {(isAddModalOpen || editingProduct) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => {
                                setIsAddModalOpen(false);
                                setEditingProduct(null);
                                resetForm();
                            }}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-5 flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600">
                                <FiTag size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold">{editingProduct ? 'Edit Garment Product' : 'Add Garment Product'}</h3>
                                <p className="text-xs text-slate-500">Define standard product attributes for tasks & inventory</p>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold mb-1">Product Name * (Unique)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Denim Shirt"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 font-medium outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Product Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. GP-0001"
                                        value={productCode}
                                        onChange={(e) => setProductCode(e.target.value)}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 uppercase font-mono outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Category *</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 font-bold outline-none cursor-pointer"
                                    >
                                        {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold mb-1">Default Target Qty</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={defaultTargetQuantity}
                                        onChange={(e) => setDefaultTargetQuantity(Number(e.target.value))}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 font-medium outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e: any) => setStatus(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 font-bold outline-none cursor-pointer"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="Optional product description or specifications..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 font-medium outline-none focus:border-purple-500 resize-none"
                                />
                            </div>

                            <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditingProduct(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer disabled:opacity-50 transition-colors"
                                >
                                    {editingProduct ? (updateMutation.isPending ? 'Updating…' : 'Update Product') : createMutation.isPending ? 'Creating…' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
