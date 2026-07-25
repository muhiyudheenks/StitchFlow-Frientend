'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Employee } from '../types';
import {
    FiSearch,
    FiPlus,
    FiMoreVertical,
    FiChevronLeft,
    FiChevronRight,
    FiCheckCircle,
    FiClock,
    FiUserX,
    FiAlertCircle,
    FiMail
} from 'react-icons/fi';
import { useEmployees } from '../hooks/useEmployees';
import api from '@/config';

interface EmployeesTabProps {
    onOpenQuickAction: (actionType: string) => void;
}

export default function EmployeesTab({ onOpenQuickAction }: EmployeesTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const [resendingId, setResendingId] = useState<string | null>(null);
    const [resendSuccessMsg, setResendSuccessMsg] = useState<string | null>(null);
    const [resendErrorMsg, setResendErrorMsg] = useState<string | null>(null);

    const { data, isLoading, isError, error, refetch } = useEmployees({
        search: searchTerm,
        department: selectedDept,
        status: selectedStatus,
        page: currentPage,
        limit: 10,
    });

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

    const getStatusBadge = (status?: string) => {
        const normalized = (status || 'active').toLowerCase();
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Employee Workforce Directory
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage all {pagination.total} active floor operators and technicians
                    </p>
                </div>

                <button
                    onClick={() => onOpenQuickAction('Add Employee')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Add New Employee</span>
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Search */}
                <div className="sm:col-span-6 relative">
                    <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                        type="text"
                        placeholder="Search by ID, name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all shadow-xs"
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
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 shadow-xs cursor-pointer"
                    >
                        <option value="All">All Departments</option>
                        <option value="General">General</option>
                        <option value="Cutting & Laying">Cutting & Laying</option>
                        <option value="Collar Assembly">Collar Assembly</option>
                        <option value="Quality Assurance">Quality Assurance</option>
                        <option value="Sleeve Stitching">Sleeve Stitching</option>
                        <option value="Button & Hemming">Button & Hemming</option>
                        <option value="Finishing & Pressing">Finishing & Pressing</option>
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
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 shadow-xs cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Success & Error Banners for Resend Link */}
            {resendSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                    <FiCheckCircle size={16} className="text-emerald-500" />
                    <span>{resendSuccessMsg}</span>
                </div>
            )}
            {resendErrorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                    <FiAlertCircle size={16} className="text-rose-500" />
                    <span>{resendErrorMsg}</span>
                </div>
            )}

            {/* Error Message */}
            {isError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FiAlertCircle size={16} className="text-rose-500" />
                        <span>Failed to load employee directory: {(error as any)?.message || 'Server error'}</span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Employee Table Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[650px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                                <th className="py-4 px-6">Employee ID</th>
                                <th className="py-4 px-6">Employee Name</th>
                                <th className="py-4 px-6">Department</th>
                                <th className="py-4 px-6">Role</th>
                                <th className="py-4 px-6">Shift</th>
                                <th className="py-4 px-6">Attendance %</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
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

                                    return (
                                        <tr key={emp.id} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="py-4 px-6 font-mono font-bold text-purple-700">
                                                {displayId}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-extrabold text-xs shadow-sm">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">{displayName}</span>
                                                        <span className="text-[10px] text-slate-400">{emp.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                {emp.department || 'General'}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 font-medium">
                                                {emp.designation || emp.role}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                    {emp.shift || 'Shift A'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-purple-600 rounded-full"
                                                            style={{ width: `${emp.attendanceRate || 95}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold font-mono text-slate-900">{emp.attendanceRate || 95}%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {getStatusBadge(emp.status)}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!emp.isVerified && (
                                                        <button
                                                            onClick={() => handleResendSetupLink(emp.id)}
                                                            disabled={resendingId === emp.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-extrabold hover:bg-purple-100 transition-all disabled:opacity-50 cursor-pointer"
                                                            title="Resend activation link email"
                                                        >
                                                            <FiMail size={13} />
                                                            <span>{resendingId === emp.id ? 'Sending...' : 'Resend Link'}</span>
                                                        </button>
                                                    )}
                                                    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer">
                                                        <FiMoreVertical size={16} />
                                                    </button>
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
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
                    <span>
                        Showing {employeesList.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1 || isLoading}
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                            <FiChevronLeft size={16} />
                        </button>
                        <span className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold">
                            {pagination.page} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                            disabled={currentPage >= pagination.totalPages || isLoading}
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
