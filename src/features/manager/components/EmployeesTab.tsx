'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiSearch,
    FiFilter,
    FiUserCheck,
    FiShield,
    FiMail,
    FiPhone,
    FiBriefcase,
    FiCheckCircle,
    FiX
} from 'react-icons/fi';
import { ManagerTeamEmployee } from '../types';

export default function EmployeesTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedEmployee, setSelectedEmployee] = useState<ManagerTeamEmployee | null>(null);

    const { data: employees = [], isLoading } = useQuery<ManagerTeamEmployee[]>({
        queryKey: ['manager-employees', searchTerm, departmentFilter],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/manager/employees', {
                params: { search: searchTerm, department: departmentFilter },
                withCredentials: true,
            });
            return response.data?.data || [];
        },
    });

    const filtered = employees.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-6">
            {/* Header & Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
                        <FiUserCheck size={14} />
                        <span>Department Supervision</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Team Employees &amp; Shift Roster</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Monitor worker attendance rates, assigned line departments, and operator performance.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
                    <FiShield className="text-amber-600" size={16} />
                    <span>User Creation Managed by Admin</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search team member by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-extrabold text-slate-500 flex items-center gap-1">
                        <FiFilter size={12} /> Dept:
                    </span>
                    {['all', 'Cutting', 'Assembly', 'Quality'].map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setDepartmentFilter(dept)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${departmentFilter === dept
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6">Employee</th>
                                <th className="py-4 px-6">Department</th>
                                <th className="py-4 px-6">Designation</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Attendance Rate</th>
                                <th className="py-4 px-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                        Loading team roster...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                        No team members found matching search filter.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-xs">
                                                    {emp.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{emp.name}</div>
                                                    <div className="text-[11px] text-slate-400 font-medium">{emp.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-slate-700">{emp.department}</td>
                                        <td className="py-4 px-6 text-slate-600 font-medium">{emp.designation}</td>
                                        <td className="py-4 px-6">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${emp.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    }`}
                                            >
                                                <FiCheckCircle size={12} /> {emp.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${emp.attendanceRate}%` }} />
                                                </div>
                                                <span className="font-extrabold text-slate-800">{emp.attendanceRate}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => setSelectedEmployee(emp)}
                                                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                                            >
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profile Drawer Modal */}
            {selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedEmployee(null)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-md">
                                {selectedEmployee.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">{selectedEmployee.name}</h3>
                                <p className="text-xs text-slate-500 font-medium">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-700">
                                <FiMail className="text-slate-400" />
                                <span className="font-bold">Email:</span> {selectedEmployee.email}
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <FiPhone className="text-slate-400" />
                                <span className="font-bold">Phone:</span> {selectedEmployee.phone}
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <FiBriefcase className="text-slate-400" />
                                <span className="font-bold">Department:</span> {selectedEmployee.department}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
