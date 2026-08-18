'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiCheckSquare,
    FiPlus,
    FiEdit3,
    FiX,
    FiAlertCircle,
    FiCheckCircle,
    FiPhone,
    FiMail
} from 'react-icons/fi';

import { MANAGER_DESIGNATIONS } from '@/shared/constants/userSchema.constants';

interface ManagersTabProps {
    onOpenQuickAction: (actionType: string) => void;
}

const DEPARTMENT_OPTIONS = [
    'Production',
    'Quality Control',
    'Finishing',
    'Inventory',
    'Packing',
    'Maintenance',
];

export default function ManagersTab({ onOpenQuickAction }: ManagersTabProps) {
    const queryClient = useQueryClient();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingManager, setEditingManager] = useState<any | null>(null);

    // Form fields for Add Manager
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [designation, setDesignation] = useState('Production Manager');

    // Form fields for Edit Manager
    const [editDepartment, setEditDepartment] = useState('Production');
    const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'on_leave'>('active');

    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch Managers list strictly
    const { data: managersData = [], isLoading, isError, error } = useQuery<any[]>({
        queryKey: ['admin-managers'],
        queryFn: async () => {
            const response = await api.get('/api/admin/managers');
            return response.data?.managers || response.data?.data || response.data || [];
        },
    });

    const managersList = Array.isArray(managersData) ? managersData : [];

    // Add Manager Mutation
    const addManagerMutation = useMutation({
        mutationFn: async (payload: { fullName: string; email: string; phone?: string; designation?: string }) => {
            const res = await api.post('/api/admin/managers', payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-managers'] });
            setIsAddModalOpen(false);
            resetForm();
            setSuccessMessage('New manager created and setup password invitation sent!');
            setTimeout(() => setSuccessMessage(null), 4000);
        },
        onError: (err: any) => {
            setFormError(err.response?.data?.message || err.message || 'Failed to create manager');
        },
    });

    // Edit Manager Mutation
    const editManagerMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
            const res = await api.put(`/api/admin/managers/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-managers'] });
            setEditingManager(null);
            resetForm();
            setSuccessMessage('Manager details updated successfully!');
            setTimeout(() => setSuccessMessage(null), 4000);
        },
        onError: (err: any) => {
            setFormError(err.response?.data?.message || err.message || 'Failed to update manager');
        },
    });

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setPhone('');
        setDesignation('Production Manager');
        setEditDepartment('Production');
        setEditStatus('active');
        setFormError(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (mgr: any) => {
        resetForm();
        setEditingManager(mgr);
        setFullName(mgr.fullName || mgr.name || '');
        setEmail(mgr.email || '');
        setPhone(mgr.phone || '');
        setEditDepartment(mgr.department || 'Production');
        setEditStatus(mgr.status === 'On Leave' ? 'on_leave' : mgr.status === 'Inactive' ? 'inactive' : 'active');
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!fullName.trim()) return setFormError('Full Name is required');
        if (!email.trim()) return setFormError('Email Address is required');

        addManagerMutation.mutate({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim() || undefined,
            designation,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingManager) return;
        setFormError(null);
        if (!fullName.trim()) return setFormError('Full Name is required');

        editManagerMutation.mutate({
            id: editingManager.id || editingManager._id,
            payload: {
                fullName: fullName.trim(),
                phone: phone.trim() || undefined,
                department: editDepartment,
                status: editStatus,
            },
        });
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Top Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Line Supervisors &amp; Plant Managers
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage leadership allocations, line productivity, and plant managers
                    </p>
                </div>

                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Add Manager</span>
                </button>
            </div>

            {/* Notification Banner */}
            {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <FiCheckCircle size={16} className="text-emerald-500" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Manager Cards Grid */}
            {isLoading ? (
                <div className="p-12 text-center text-slate-400 font-semibold bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800">
                    Loading manager roster from server...
                </div>
            ) : managersList.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-semibold bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800">
                    No manager records found in the database.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {managersList.map((mgr: any, idx: number) => {
                        const name = mgr.fullName || mgr.name || 'Manager User';
                        const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                        const isVerified = mgr.isVerified;

                        return (
                            <motion.div
                                key={mgr.id || mgr._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800 transition-all group flex flex-col justify-between"
                            >
                                <div>
                                    {/* Header */}
                                    <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-md">
                                                {initials}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                                    {name}
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{mgr.department || 'Production'}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                                            isVerified ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
                                        }`}>
                                            {isVerified ? 'Active Verified' : 'Setup Pending'}
                                        </span>
                                    </div>

                                    {/* Department Banner */}
                                    <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Leadership Allocation
                                        </span>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                            Manager — {mgr.department || 'Production'} Department
                                        </p>
                                    </div>

                                    {/* Metric Badges */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-center">
                                            <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 text-xs mb-1">
                                                <FiMail size={13} />
                                                <span>Email</span>
                                            </div>
                                            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate block" title={mgr.email}>{mgr.email}</span>
                                        </div>

                                        <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-center">
                                            <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 text-xs mb-1">
                                                <FiPhone size={13} />
                                                <span>Phone</span>
                                            </div>
                                            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">{mgr.phone || 'N/A'}</span>
                                        </div>

                                        <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-center">
                                            <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 text-xs mb-1">
                                                <FiCheckSquare size={13} />
                                                <span>Status</span>
                                            </div>
                                            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 uppercase block">{mgr.status || 'Active'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Action Footer */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => handleOpenEditModal(mgr)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <FiEdit3 size={13} /> Edit Manager
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* ADD MANAGER MODAL (Strictly Simplified Garment Factory Form) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans text-xs">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-lg shrink-0">
                                👨‍💼
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">ADD MANAGER</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Create a new production manager account</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <FiX size={18} />
                            </button>
                        </div>

                        {formError && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{formError}</span>
                            </div>
                        )}

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Robert Manager"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. robert@factory.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. +91 98765 43210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Designation *</label>
                                <select
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                                >
                                    {MANAGER_DESIGNATIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={addManagerMutation.isPending} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-extrabold cursor-pointer">
                                    {addManagerMutation.isPending ? 'Creating...' : 'Create Manager'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MANAGER MODAL */}
            {editingManager && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans text-xs">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Edit Manager Details</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Update manager department and contact information</p>
                            </div>
                            <button onClick={() => setEditingManager(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                                <FiX size={18} />
                            </button>
                        </div>

                        {formError && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-bold flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                <span>{formError}</span>
                            </div>
                        )}

                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Phone Number</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Department *</label>
                                <select
                                    value={editDepartment}
                                    onChange={(e) => setEditDepartment(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-bold"
                                >
                                    {DEPARTMENT_OPTIONS.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Status</label>
                                <select
                                    value={editStatus}
                                    onChange={(e: any) => setEditStatus(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-bold"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on_leave">On Leave</option>
                                </select>
                            </div>

                            <div className="flex gap-2 pt-3">
                                <button type="button" onClick={() => setEditingManager(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600">
                                    Cancel
                                </button>
                                <button type="submit" disabled={editManagerMutation.isPending} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold">
                                    {editManagerMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
