'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockEmployees } from '../data/mockData';
import { Employee } from '../types';
import {
    FiSearch,
    FiFilter,
    FiPlus,
    FiMoreVertical,
    FiChevronLeft,
    FiChevronRight,
    FiCheckCircle,
    FiClock,
    FiUserX
} from 'react-icons/fi';

interface EmployeesTabProps {
    onOpenQuickAction: (actionType: string) => void;
}

export default function EmployeesTab({ onOpenQuickAction }: EmployeesTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredEmployees = mockEmployees.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
        const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
        return matchesSearch && matchesDept && matchesStatus;
    });

    const getStatusBadge = (status: Employee['status']) => {
        switch (status) {
            case 'Active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <FiCheckCircle size={12} /> Active
                    </span>
                );
            case 'On Leave':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-600 border border-amber-200">
                        <FiClock size={12} /> On Leave
                    </span>
                );
            case 'Inactive':
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
                        Manage all {mockEmployees.length} active floor operators and technicians
                    </p>
                </div>

                <button
                    onClick={() => onOpenQuickAction('Add Employee')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
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
                        placeholder="Search by ID, name, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all shadow-xs"
                    />
                </div>

                {/* Dept Filter */}
                <div className="sm:col-span-3">
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 shadow-xs"
                    >
                        <option value="All">All Departments</option>
                        <option value="Cutting & Laying">Cutting & Laying</option>
                        <option value="Collar Assembly">Collar Assembly</option>
                        <option value="Quality Assurance">Quality Assurance</option>
                        <option value="Sleeve Stitching">Sleeve Stitching</option>
                        <option value="Button & Hemming">Button & Hemming</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div className="sm:col-span-3">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 shadow-xs"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Employee Table Card */}
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
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-purple-50/30 transition-colors">
                                    <td className="py-4 px-6 font-mono font-bold text-purple-700">
                                        {emp.id}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-extrabold text-xs shadow-sm">
                                                {emp.name.split(' ').map((n) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 block">{emp.name}</span>
                                                <span className="text-[10px] text-slate-400">{emp.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-slate-800">
                                        {emp.department}
                                    </td>
                                    <td className="py-4 px-6 text-slate-600">
                                        {emp.role}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                            {emp.shift}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-600 rounded-full"
                                                    style={{ width: `${emp.attendanceRate}%` }}
                                                />
                                            </div>
                                            <span className="font-bold font-mono text-slate-900">{emp.attendanceRate}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {getStatusBadge(emp.status)}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                            <FiMoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
                    <span>Showing 1 to {filteredEmployees.length} of {mockEmployees.length} records</span>
                    <div className="flex items-center gap-2">
                        <button disabled className="p-2 rounded-xl border border-slate-200 text-slate-400 disabled:opacity-40">
                            <FiChevronLeft size={16} />
                        </button>
                        <span className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold">1</span>
                        <button disabled className="p-2 rounded-xl border border-slate-200 text-slate-400 disabled:opacity-40">
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
