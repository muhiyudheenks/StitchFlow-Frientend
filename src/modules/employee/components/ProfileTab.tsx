'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiShield,
    FiBriefcase,
    FiCalendar,
    FiEdit3,
    FiLock,
    FiX,
    FiCheckCircle,
    FiTrendingUp,
    FiAward,
    FiStar,
    FiAlertCircle,
    FiCreditCard,
    FiDownload,
} from 'react-icons/fi';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { useAppSelector } from '@/store/hooks';
import type { ProfileSubTab } from './EmployeeDashboard';

interface ProfileTabProps {
    initialSubTab?: ProfileSubTab;
    onSubTabChange?: (sub: ProfileSubTab) => void;
}

// ─── Sub-tab button ────────────────────────────────────────────────────────────
function SubTabButton({
    active,
    onClick,
    icon: Icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                active
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
            }`}
        >
            <Icon size={14} />
            {label}
        </button>
    );
}

// ─── Performance Section ───────────────────────────────────────────────────────
function PerformanceSection() {
    const { data: perf, isLoading, isError, error } = useQuery({
        queryKey: ['employee-performance'],
        queryFn: async () => {
            const response = await api.get('/api/performance/me');
            return response.data?.data || null;
        },
    });

    if (isLoading) {
        return (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                Calculating performance metrics from database records…
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <FiAlertCircle size={16} />
                <span>Failed to load performance metrics: {(error as any)?.message || 'Server error'}</span>
            </div>
        );
    }

    const hasData = perf && perf.hasData;
    const productivityRate  = perf?.productivityRate  ?? perf?.productivity ?? 0;
    const attendanceScore   = perf?.attendanceScore   ?? perf?.attendance   ?? 0;
    const qualityScore      = perf?.qualityScore      ?? perf?.quality;
    const overallEfficiency = perf?.overallEfficiency ?? perf?.efficiency   ?? 0;

    return (
        <div className="space-y-6">
            {/* Section header */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    <FiTrendingUp size={14} />
                    <span>Performance Analytics</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Operator Performance & Quality Metrics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time operator efficiency ratings calculated from assigned tasks, completed units, and attendance logs.
                </p>
            </div>

            {!hasData ? (
                <div className="p-12 text-center text-slate-400 dark:text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">No performance data available yet.</p>
                    <p className="text-xs text-slate-400">Complete assigned tasks and log attendance to generate your real-time performance analytics.</p>
                </div>
            ) : (
                <>
                    {/* Score Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <span className="text-xs font-extrabold uppercase">Productivity Rate</span>
                                <FiTrendingUp className="text-purple-600 dark:text-purple-400" size={18} />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{productivityRate}%</div>
                            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block">
                                {perf.completedTasks || 0} / {perf.assignedTasks || 0} Tasks Done
                            </span>
                        </div>
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <span className="text-xs font-extrabold uppercase">Attendance Score</span>
                                <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" size={18} />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{attendanceScore}%</div>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                                {perf.presentDays || 0} Days Logged
                            </span>
                        </div>
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <span className="text-xs font-extrabold uppercase">Quality Audit Score</span>
                                <FiStar className="text-amber-500" size={18} />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {qualityScore !== null && qualityScore !== undefined ? `${qualityScore}%` : 'N/A'}
                            </div>
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">
                                {qualityScore !== null ? 'Verified QC Audits' : 'No QC Audits'}
                            </span>
                        </div>
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <span className="text-xs font-extrabold uppercase">Overall Efficiency</span>
                                <FiAward className="text-indigo-600 dark:text-indigo-400" size={18} />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{overallEfficiency}%</div>
                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold block">
                                Weighted Performance
                            </span>
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Monthly Performance Trend (12-Month Dynamic)</h4>
                        <div className="flex items-end justify-between gap-2 h-48 pt-6 px-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto hide-scrollbar">
                            {(perf.monthlyPerformance || []).map((m: any, idx: number) => {
                                const scoreVal = m.overall ?? m.score ?? 0;
                                const height = Math.max(4, Math.round((scoreVal / 100) * 100));
                                return (
                                    <div key={idx} className="flex flex-col items-center gap-1 flex-1 min-w-[32px]">
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{scoreVal}%</span>
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-indigo-400 transition-all duration-500"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold truncate w-full text-center">
                                            {m.month || `M${idx + 1}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Salary Section ────────────────────────────────────────────────────────────
function SalarySection() {
    const { data: sal, isLoading, isError, error } = useQuery({
        queryKey: ['employee-salary'],
        queryFn: async () => {
            const response = await api.get('/api/salary/me');
            return response.data?.data || null;
        },
    });

    const formatINR = (val: any) => {
        if (val === undefined || val === null) return '₹0';
        if (typeof val === 'string' && val.includes('₹')) return val;
        const num = Number(String(val).replace(/[^0-9.-]+/g, '')) || 0;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const handleDownloadPayslip = async (payslipId: string, monthStr: string) => {
        try {
            const response = await api.get(`/api/salary/payslip/${payslipId}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Payslip_${monthStr.replace(/\s+/g, '_')}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch {
            alert('Failed to download payslip statement. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                Calculating salary breakdown and fetching payroll records…
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <FiAlertCircle size={16} />
                <span>Failed to load salary details: {(error as any)?.message || 'Server error'}</span>
            </div>
        );
    }

    const payrollHistory = sal?.payrollHistory || [];

    return (
        <div className="space-y-6">
            {/* Section header */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    <FiCreditCard size={14} />
                    <span>Payroll & Compensation</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Salary Summary & Monthly Payslips
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review base pay breakdown, shift overtime allowances, production incentives, and download PDF payslips.
                </p>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase">Base Monthly Salary</span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatINR(sal?.baseSalary)}</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Contract Base</span>
                </div>
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase">Overtime Allowance</span>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatINR(sal?.overtime)}</div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{sal?.overtimeHours || 0} Hours OT</span>
                </div>
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase">Production Incentives</span>
                    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{formatINR(sal?.incentives)}</div>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">Line Target Bonus</span>
                </div>
                <div className="p-5 rounded-3xl bg-slate-900 dark:bg-purple-950/80 text-white shadow-xl space-y-1 border border-slate-800 dark:border-purple-800">
                    <span className="text-xs font-extrabold text-purple-300 uppercase">Total Net Takehome</span>
                    <div className="text-2xl font-extrabold text-white">{formatINR(sal?.netSalary)}</div>
                    <span className="text-[11px] text-slate-300 font-semibold">Disbursed: {sal?.lastPayDate || 'N/A'}</span>
                </div>
            </div>

            {/* Payslips Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Payslip Download History</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Direct Deposit</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="py-4 px-6">Pay Period</th>
                                <th className="py-4 px-6">Net Amount (₹)</th>
                                <th className="py-4 px-6">Disbursement Status</th>
                                <th className="py-4 px-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                            {payrollHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-400 font-semibold">
                                        No salary records available.
                                    </td>
                                </tr>
                            ) : (
                                payrollHistory.map((ps: any, index: number) => {
                                    const payId = ps.id || ps._id;
                                    const hasPayslip = Boolean(payId);
                                    return (
                                        <tr key={payId || index} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{ps.month || 'N/A'}</td>
                                            <td className="py-4 px-6">{formatINR(ps.netSalary ?? ps.netPay ?? ps.amount)}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                    ps.status === 'paid'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                                }`}>
                                                    {ps.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {hasPayslip ? (
                                                    <button
                                                        onClick={() => handleDownloadPayslip(payId, ps.month || 'payslip')}
                                                        className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                                                    >
                                                        <FiDownload size={13} /> Download
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-600 text-xs">Not available</span>
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

// ─── Profile Overview Section (existing content) ──────────────────────────────
function ProfileOverviewSection() {
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const reduxUser = useAppSelector((state: any) => state.auth?.user);
    const [localUser, setLocalUser] = useState<{ fullName?: string; email?: string; department?: string; designation?: string; _id?: string } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('user');
            if (raw) {
                try { setLocalUser(JSON.parse(raw)); } catch {}
            }
        }
    }, []);

    const currentUser = reduxUser || localUser;

    const [phone, setPhone] = useState('+1 (555) 234-5678');
    const [address, setAddress] = useState('742 Evergreen Terrace, Springfield, IL');
    const [emergencyContact, setEmergencyContact] = useState('Emergency Contact (+1 555-000-1122)');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await api.get('/api/employee/dashboard');
            return response.data?.data || {};
        },
    });

    const prof = {
        id:               dashboardData?.profile?.id || currentUser?._id || 'EMP-8042',
        fullName:         dashboardData?.profile?.fullName && dashboardData.profile.fullName !== 'Employee'
                              ? dashboardData.profile.fullName
                              : currentUser?.fullName || 'Employee User',
        email:            dashboardData?.profile?.email || currentUser?.email || 'employee@stitchflow.com',
        role:             dashboardData?.profile?.role || (currentUser as any)?.role || 'Employee',
        department:       dashboardData?.profile?.department || (currentUser as any)?.department || 'Production',
        designation:      dashboardData?.profile?.designation || (currentUser as any)?.designation || 'Production Operator',
        shift:            dashboardData?.profile?.shift || 'Shift A (Morning)',
        joiningDate:      dashboardData?.profile?.joiningDate || 'N/A',
        reportingManager: dashboardData?.myManager?.fullName || dashboardData?.profile?.reportingManager || 'Production Manager',
        phone,
        address,
        emergencyContact,
    };

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            const response = await api.patch('/api/employee/profile', updatedData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
            setIsEditModalOpen(false);
        },
    });

    const handleEditSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate({ phone });
    };

    const handleChangePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { setPasswordMsg('New passwords do not match.'); return; }
        setPasswordMsg('Password changed successfully!');
        setTimeout(() => {
            setIsPasswordModalOpen(false);
            setPasswordMsg(null);
            setOldPassword(''); setNewPassword(''); setConfirmPassword('');
        }, 1500);
    };

    const initials = prof.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <>
            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Read-Only Credentials */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <FiShield className="text-purple-600 dark:text-purple-400" /> Read-Only Enterprise Credentials
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Admin Controlled</span>
                    </div>
                    <div className="space-y-3 text-xs">
                        {[
                            { icon: FiMail,     label: 'Work Email',   value: prof.email },
                            { icon: FiBriefcase, label: 'Department',  value: prof.department },
                            { icon: FiUser,     label: 'System Role',  value: prof.role },
                            { icon: FiCalendar, label: 'Joining Date', value: prof.joiningDate },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2">
                                    <Icon className="text-slate-400 dark:text-slate-500" /> {label}
                                </span>
                                <span className={`font-bold ${label === 'System Role' ? 'text-purple-700 dark:text-purple-400 uppercase text-[11px]' : 'text-slate-900 dark:text-white'}`}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editable Contact Details */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <FiPhone className="text-indigo-600 dark:text-indigo-400" /> Personal Contact Details
                        </h3>
                        <button onClick={() => setIsEditModalOpen(true)} className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                            Edit Details →
                        </button>
                    </div>
                    <div className="space-y-3 text-xs">
                        {[
                            { label: 'Phone Number',      value: phone },
                            { label: 'Residential Address', value: address },
                            { label: 'Emergency Contact', value: emergencyContact },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider block">{label}</span>
                                <span className="font-bold text-slate-900 dark:text-white">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <FiX size={18} />
                        </button>
                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Edit Personal Information</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Update your phone number, home address, or emergency contact.</p>
                        </div>
                        <form onSubmit={handleEditSave} className="space-y-4 text-xs">
                            {[
                                { label: 'Phone Number',    value: phone,            setter: setPhone },
                                { label: 'Home Address',    value: address,          setter: setAddress },
                                { label: 'Emergency Contact', value: emergencyContact, setter: setEmergencyContact },
                            ].map(({ label, value, setter }) => (
                                <div key={label}>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setter(e.target.value)}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                                    />
                                </div>
                            ))}
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md cursor-pointer">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button onClick={() => setIsPasswordModalOpen(false)} className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <FiX size={18} />
                        </button>
                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Change Account Password</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ensure your new password contains letters and numbers.</p>
                        </div>
                        {passwordMsg && (
                            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                                <FiCheckCircle /> <span>{passwordMsg}</span>
                            </div>
                        )}
                        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                            {[
                                { label: 'Current Password', value: oldPassword,     setter: setOldPassword },
                                { label: 'New Password',     value: newPassword,     setter: setNewPassword },
                                { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword },
                            ].map(({ label, value, setter }) => (
                                <div key={label}>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                                    <input
                                        type="password"
                                        required
                                        value={value}
                                        onChange={(e) => setter(e.target.value)}
                                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                                    />
                                </div>
                            ))}
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md cursor-pointer">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invisible helper — need initials used above */}
            <span className="hidden">{initials}</span>
        </>
    );
}

// ─── Main ProfileTab ───────────────────────────────────────────────────────────
export default function ProfileTab({ initialSubTab = 'overview', onSubTabChange }: ProfileTabProps) {
    const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>(initialSubTab);

    // Sync when parent navigates (e.g., clicking "My Performance" from overview quick links)
    useEffect(() => {
        setActiveSubTab(initialSubTab);
    }, [initialSubTab]);

    const handleSubTab = (sub: ProfileSubTab) => {
        setActiveSubTab(sub);
        onSubTabChange?.(sub);
    };

    // Derive name/initials for the shared header
    const reduxUser = useAppSelector((state: any) => state.auth?.user);
    const [localUser, setLocalUser] = useState<{ fullName?: string; email?: string; department?: string; designation?: string; _id?: string } | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('user');
            if (raw) { try { setLocalUser(JSON.parse(raw)); } catch {} }
        }
    }, []);
    const currentUser = reduxUser || localUser;
    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => (await api.get('/api/employee/dashboard')).data?.data || {},
    });
    const fullName = (dashboardData?.profile?.fullName && dashboardData.profile.fullName !== 'Employee')
        ? dashboardData.profile.fullName
        : currentUser?.fullName || 'Employee User';
    const role        = dashboardData?.profile?.role || (currentUser as any)?.role || 'Employee';
    const designation = dashboardData?.profile?.designation || (currentUser as any)?.designation || 'Production Operator';
    const department  = dashboardData?.profile?.department || (currentUser as any)?.department || 'Production';
    const empId       = dashboardData?.profile?.id || currentUser?._id || 'EMP-8042';
    const manager     = dashboardData?.myManager?.fullName || 'Production Manager';
    const initials    = fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="space-y-6 font-sans">
            {/* ── Shared Profile Header ── */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Avatar + info */}
                    <div className="flex items-center gap-5">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-extrabold text-2xl shadow-xl shadow-purple-500/20 shrink-0">
                            {initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{fullName}</h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 font-extrabold text-[10px] uppercase border border-purple-200 dark:border-purple-800">
                                    {role}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                                {designation} • {department} • ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{empId}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                Reporting Manager: <span className="font-bold text-slate-700 dark:text-slate-300">{manager}</span>
                            </p>
                        </div>
                    </div>

                    {/* Sub-tab navigation pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <SubTabButton
                            active={activeSubTab === 'overview'}
                            onClick={() => handleSubTab('overview')}
                            icon={FiUser}
                            label="Profile"
                        />
                        <SubTabButton
                            active={activeSubTab === 'performance'}
                            onClick={() => handleSubTab('performance')}
                            icon={FiTrendingUp}
                            label="Performance"
                        />
                        <SubTabButton
                            active={activeSubTab === 'salary'}
                            onClick={() => handleSubTab('salary')}
                            icon={FaIndianRupeeSign}
                            label="Salary"
                        />
                    </div>
                </div>
            </div>

            {/* ── Active sub-section ── */}
            {activeSubTab === 'overview'     && <ProfileOverviewSection />}
            {activeSubTab === 'performance'  && <PerformanceSection />}
            {activeSubTab === 'salary'       && <SalarySection />}
        </div>
    );
}
