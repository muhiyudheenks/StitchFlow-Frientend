'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/config';
import { FiDownload, FiCheckCircle, FiCalendar, FiAlertCircle, FiCreditCard } from 'react-icons/fi';

export default function SalaryTab() {
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
            const response = await api.get(`/api/salary/payslip/${payslipId}`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Payslip_${monthStr.replace(/\s+/g, '_')}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            alert('Failed to download payslip statement. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
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
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    <FiCreditCard size={14} />
                    <span>Payroll &amp; Compensation</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Salary Summary &amp; Monthly Payslips</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review base pay breakdown, shift overtime allowances, production incentives, and download PDF payslips.
                </p>
            </div>

            {/* Financial Summary Cards (Indian Rupee ₹) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Base Salary */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase">Base Monthly Salary</span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatINR(sal?.baseSalary)}</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Contract Base</span>
                </div>

                {/* Overtime Allowance */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase">Overtime Allowance</span>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatINR(sal?.overtime)}</div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {sal?.overtimeHours || 0} Hours OT
                    </span>
                </div>

                {/* Production Incentives */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase">Production Incentives</span>
                    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{formatINR(sal?.incentives)}</div>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">Line Target Bonus</span>
                </div>

                {/* Total Net Takehome */}
                <div className="p-5 rounded-3xl bg-slate-900 dark:bg-purple-950/80 text-white shadow-xl space-y-1 border border-slate-800 dark:border-purple-800">
                    <span className="text-xs font-extrabold text-purple-300 uppercase">Total Net Takehome</span>
                    <div className="text-2xl font-extrabold text-white">{formatINR(sal?.netSalary)}</div>
                    <span className="text-[11px] text-slate-300 font-semibold">Disbursed: {sal?.lastPayDate || 'N/A'}</span>
                </div>
            </div>

            {/* Payslips Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Payslip Download History</h3>
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
                                        <tr key={payId || index} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <FiCalendar className="text-slate-400 dark:text-slate-500" />
                                                <span>{ps.month}</span>
                                            </td>

                                            <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">
                                                {formatINR(ps.netSalary || ps.amount)}
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                                                    <FiCheckCircle size={12} /> {ps.status || 'Paid'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                {hasPayslip ? (
                                                    <button
                                                        onClick={() => handleDownloadPayslip(payId, ps.month)}
                                                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                                                    >
                                                        <FiDownload size={13} />
                                                        <span>Download Statement</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs flex items-center gap-1.5 opacity-60 cursor-not-allowed"
                                                    >
                                                        <FiDownload size={13} />
                                                        <span>No payslip available</span>
                                                    </button>
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
