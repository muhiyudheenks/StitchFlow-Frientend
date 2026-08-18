'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Employee } from '../types';
import {
    FiSearch,
    FiPlus,
    FiChevronLeft,
    FiChevronRight,
    FiCheckCircle,
    FiClock,
    FiUserX,
    FiAlertCircle,
    FiMail,
    FiEdit3,
    FiTrash2,
    FiX
} from 'react-icons/fi';
import { useEmployees } from '../hooks/useEmployees';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';

interface EmployeesTabProps {
    onOpenQuickAction: (actionType: string) => void;
}

const EMPLOYEE_TYPE_OPTIONS = [
    { value: 'stitching_worker', label: 'Stitching Worker' },
    { value: 'finishing_worker', label: 'Finishing Worker' },
    { value: 'cutting_worker', label: 'Cutting Worker' },
];

const DEPARTMENT_OPTIONS = [
    'Production',
    'Quality Control',
    'Finishing',
    'Inventory',
    'Packing',
    'Maintenance',
];

export default function EmployeesTab({ onOpenQuickAction }: EmployeesTabProps) {
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const [resendingId, setResendingId] = useState<string | null>(null);
    const [resendSuccessMsg, setResendSuccessMsg] = useState<string | null>(null);
    const [resendErrorMsg, setResendErrorMsg] = useState<string | null>(null);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

    // Form fields for Add Employee
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [employeeType, setEmployeeType] = useState('stitching_worker');
    const [designation, setDesignation] = useState('Stitching Operator');

    const handleEmployeeTypeChange = (val: string) => {
        setEmployeeType(val);
        if (val === 'stitching_worker' || val === 'Stitching Worker') setDesignation('Stitching Operator');
        else if (val === 'cutting_worker' || val === 'Cutting Worker') setDesignation('Cutting Operator');
        else if (val === 'finishing_worker' || val === 'Finishing Worker') setDesignation('Finishing Operator');
    };

    const handleDesignationChange = (val: string) => {
        setDesignation(val);
        if (val === 'Stitching Operator') setEmployeeType('stitching_worker');
        else if (val === 'Cutting Operator') setEmployeeType('cutting_worker');
        else if (val === 'Finishing Operator') setEmployeeType('finishing_worker');
    };

    // Form fields for Edit Employee
    const [editDepartment, setEditDepartment] = useState('Production');
    const [editManagerId, setEditManagerId] = useState('');
    const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'on_leave'>('active');

    const [formError, setFormError] = useState<string | null>(null);

    // Fetch Employees list
    const { data, isLoading, isError, error, refetch } = useEmployees({
        search: searchTerm,
        department: selectedDept,
        status: selectedStatus,
        page: currentPage,
        limit: 10,
    });

    // Fetch Active Managers for Edit Employee Reporting Manager Dropdown
    const { data: managersData } = useQuery<any[]>({
        queryKey: ['admin-managers-dropdown'],
        queryFn: async () => {
            const res = await api.get('/api/admin/managers');
            return res.data?.managers || res.data?.data || res.data || [];
        },
    });

    const managersList = Array.isArray(managersData) ? managersData : [];

    // Add Employee Mutation
    const addEmployeeMutation = useMutation({
        mutationFn: async (payload: { fullName: string; email: string; phone?: string; employeeType: string; designation?: string }) => {
            const res = await api.post('/api/admin/employees', payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
            setIsAddModalOpen(false);
            resetForm();
            setResendSuccessMsg('New employee created and invitation link sent successfully!');
            setTimeout(() => setResendSuccessMsg(null), 4000);
        },
        onError: (err: any) => {
            setFormError(err.response?.data?.message || err.message || 'Failed to create employee');
        },
    });

    // Edit Employee Mutation
    const editEmployeeMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
            const res = await api.put(`/api/admin/employees/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
            setEditingEmployee(null);
            resetForm();
            setResendSuccessMsg('Employee details updated successfully!');
            setTimeout(() => setResendSuccessMsg(null), 4000);
        },
        onError: (err: any) => {
            setFormError(err.response?.data?.message || err.message || 'Failed to update employee');
        },
    });

    // Delete Employee Mutation
    const deleteEmployeeMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/api/admin/employees/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
            setResendSuccessMsg('Employee deleted successfully!');
            setTimeout(() => setResendSuccessMsg(null), 4000);
        },
        onError: (err: any) => {
            setResendErrorMsg(err.response?.data?.message || 'Failed to delete employee');
            setTimeout(() => setResendErrorMsg(null), 4000);
        },
    });

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setPhone('');
        setEmployeeType('stitching_worker');
        setDesignation('Stitching Operator');
        setEditDepartment('Production');
        setEditManagerId('');
        setEditStatus('active');
        setFormError(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (emp: any) => {
        resetForm();
        setEditingEmployee(emp);
        setFullName(emp.fullName || emp.name || '');
        setEmail(emp.email || '');
        setPhone(emp.phone || '');
        setEmployeeType(emp.employeeType || 'stitching_worker');
        setDesignation(emp.designation || 'Stitching Operator');
        setEditDepartment(emp.department || 'Production');
        setEditManagerId(emp.managerId || '');
        setEditStatus(emp.status === 'On Leave' ? 'on_leave' : emp.status === 'Inactive' ? 'inactive' : 'active');
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!fullName.trim()) return setFormError('Full Name is required');
        if (!email.trim()) return setFormError('Email Address is required');

        addEmployeeMutation.mutate({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim() || undefined,
            employeeType,
            designation,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEmployee) return;
        setFormError(null);
        if (!fullName.trim()) return setFormError('Full Name is required');

        editEmployeeMutation.mutate({
            id: editingEmployee.id || editingEmployee._id,
            payload: {
                fullName: fullName.trim(),
                phone: phone.trim() || undefined,
                employeeType,
                department: editDepartment,
                managerId: editManagerId || undefined,
                status: editStatus,
            },
        });
    };

    const handleResendSetupLink = async (employeeId: string) => {
        setResendingId(employeeId);
        setResendSuccessMsg(null);
        setResendErrorMsg(null);
        try {
            const { data } = await api.post(`/api/admin/employees/${employeeId}/resend-setup-link`);
            setResendSuccessMsg(data.message || 'New setup password link sent successfully.');
            setTimeout(() => setResendSuccessMsg(null), 5000);
        } catch (err: any) {
            setResendErrorMsg(err.response?.data?.message || 'Failed to resend setup password link.');
            setTimeout(() => setResendErrorMsg(null), 5000);
        } finally {
            setResendingId(null);
        }
    };

    const employeesList: Employee[] = data?.employees || data?.data || [];
    const pagination = data?.pagination || {
        page: 1,
        limit: 10,
        total: employeesList.length,
        totalPages: 1,
    };

    const getStatusBadge = (statusStr?: string) => {
        const normalized = (statusStr || 'active').toLowerCase();
        if (normalized === 'active' || normalized === 'verified') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <FiCheckCircle size={12} /> Active
                </span>
            );
        } else if (normalized === 'on leave' || normalized === 'on_leave') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-600 border border-amber-200">
                    <FiClock size={12} /> On Leave
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-500 border border-slate-200">
                    <FiUserX size={12} /> Inactive
                </span>
            );
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Employee Workforce Directory
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage all {pagination.total} active floor operators and technicians
                    </p>
                </div>

                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Add Employee</span>
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Search */}
                <div className="sm:col-span-6 relative">
                    <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base" />
                    <input
                        type="text"
                        placeholder="Search by ID, name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all shadow-xs"
                    />
                </div>

                {/* Dept Filter */}
                <div className="sm:col-span-3">
                    <select
                        value={selectedDept}
                        onChange={(e) => {
                            setSelectedDept(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-purple-500 shadow-xs cursor-pointer"
                    >
                        <option value="All">All Departments</option>
                        {DEPARTMENT_OPTIONS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="sm:col-span-3">
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-purple-500 shadow-xs cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Success & Error Banners */}
            {resendSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <FiCheckCircle size={16} className="text-emerald-500" />
                    <span>{resendSuccessMsg}</span>
                </div>
            )}
            {resendErrorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <FiAlertCircle size={16} className="text-rose-500" />
                    <span>{resendErrorMsg}</span>
                </div>
            )}

            {/* Employee Table Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xs overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[650px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                                <th className="py-4 px-6">Employee ID</th>
                                <th className="py-4 px-6">Employee Name</th>
                                <th className="py-4 px-6">Department</th>
                                <th className="py-4 px-6">Employee Type</th>
                                <th className="py-4 px-6">Shift</th>
                                <th className="py-4 px-6">Attendance %</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                                            <span>Loading workforce data from server…</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : employeesList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                                        No employee accounts found matching your search or filters.
                                    </td>
                                </tr>
                            ) : (
                                employeesList.map((emp) => {
                                    const displayName = emp.fullName || emp.name || 'Employee';
                                    const displayId = emp.id ? (emp.id.length > 8 ? `EMP-${emp.id.slice(-4).toUpperCase()}` : emp.id) : 'EMP';
                                    const initials = displayName
                                        ? displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                                        : 'EM';

                                    const formattedType = (emp as any).employeeType
                                        ? (emp as any).employeeType.replace(/_/g, ' ')
                                        : 'stitching worker';

                                    return (
                                        <tr key={emp.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors">
                                            <td className="py-4 px-6 font-mono font-bold text-purple-700 dark:text-purple-400">
                                                {displayId}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-sm">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white block">{displayName}</span>
                                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{emp.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                                                {emp.department || 'Production'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50">
                                                    {formattedType}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-300">
                                                {emp.shift || 'Shift A'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-purple-600 rounded-full"
                                                            style={{ width: `${emp.attendanceRate || 95}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{emp.attendanceRate || 95}%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {getStatusBadge(emp.status)}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(emp)}
                                                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                                                        title="Edit Employee"
                                                    >
                                                        <FiEdit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Are you sure you want to delete employee "${displayName}"?`)) {
                                                                deleteEmployeeMutation.mutate(emp.id || (emp as any)._id);
                                                            }
                                                        }}
                                                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold transition-colors cursor-pointer"
                                                        title="Delete Employee"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                    {!emp.isVerified && (
                                                        <button
                                                            onClick={() => handleResendSetupLink(emp.id)}
                                                            disabled={resendingId === emp.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 text-[11px] font-extrabold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all disabled:opacity-50 cursor-pointer"
                                                            title="Resend activation link email"
                                                        >
                                                            <FiMail size={13} />
                                                            <span>{resendingId === emp.id ? 'Sending...' : 'Resend Link'}</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                        Showing {employeesList.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1 || isLoading}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                        >
                            <FiChevronLeft size={16} />
                        </button>
                        <span className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold">
                            {pagination.page} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                            disabled={currentPage >= pagination.totalPages || isLoading}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                        >
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ADD EMPLOYEE MODAL (Simplified Garment Factory Form) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans text-xs">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-lg shrink-0">
                                👤
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">ADD EMPLOYEE</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Create a new production worker account</p>
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
                                    placeholder="e.g. John Operator"
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
                                    placeholder="e.g. john@factory.com"
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
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Employee Type *</label>
                                <select
                                    value={employeeType}
                                    onChange={(e) => handleEmployeeTypeChange(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-bold"
                                >
                                    {EMPLOYEE_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Designation *</label>
                                <select
                                    value={designation}
                                    onChange={(e) => handleDesignationChange(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                                >
                                    <option value="Stitching Operator">Stitching Operator</option>
                                    <option value="Finishing Operator">Finishing Operator</option>
                                    <option value="Cutting Operator">Cutting Operator</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={addEmployeeMutation.isPending} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-extrabold cursor-pointer">
                                    {addEmployeeMutation.isPending ? 'Creating...' : 'Create Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT EMPLOYEE MODAL */}
            {editingEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans text-xs">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Edit Employee Details</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Update operator classification &amp; reporting line</p>
                            </div>
                            <button onClick={() => setEditingEmployee(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
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
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Employee Type *</label>
                                <select
                                    value={employeeType}
                                    onChange={(e) => setEmployeeType(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-bold"
                                >
                                    {EMPLOYEE_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
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
                                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Reporting Manager</label>
                                <select
                                    value={editManagerId}
                                    onChange={(e) => setEditManagerId(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none focus:border-purple-500 font-semibold"
                                >
                                    <option value="">-- None (Unassigned) --</option>
                                    {managersList.map((m: any) => (
                                        <option key={m.id || m._id} value={m.id || m._id}>
                                            {m.fullName || m.name} ({m.department || 'Production'})
                                        </option>
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
                                <button type="button" onClick={() => setEditingEmployee(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600">
                                    Cancel
                                </button>
                                <button type="submit" disabled={editEmployeeMutation.isPending} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold">
                                    {editEmployeeMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
