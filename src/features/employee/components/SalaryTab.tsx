'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FiDollarSign, FiDownload, FiCheckCircle, FiCalendar } from 'react-icons/fi';

export default function SalaryTab() {
    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const sal = dashboardData?.salary || {
        baseSalary: '$3,800.00',
        overtime: '$450.00',
        incentives: '$250.00',
        netPay: '$4,500.00',
        lastPayDate: '15 July 2026',
        payslips: [
            { month: 'June 2026', amount: '$4,500.00', status: 'Paid', downloadUrl: '#' },
            { month: 'May 2026', amount: '$4,350.00', status: 'Paid', downloadUrl: '#' },
            { month: 'April 2026', amount: '$4,400.00', status: 'Paid', downloadUrl: '#' },
        ],
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
                    <FiDollarSign size={14} />
                    <span>Payroll &amp; Compensation</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Salary Summary &amp; Monthly Payslips</h2>
                <p className="text-xs text-slate-500 mt-1">
                    Review base pay breakdown, shift overtime allowances, production incentives, and download PDF payslips.
                </p>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Base Monthly Salary</span>
                    <div className="text-2xl font-extrabold text-slate-900">{sal.baseSalary}</div>
                    <span className="text-[11px] text-slate-500 font-semibold">Contract Base</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Overtime Allowance</span>
                    <div className="text-2xl font-extrabold text-emerald-600">{sal.overtime}</div>
                    <span className="text-[11px] text-emerald-600 font-bold">18 Hours OT</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Production Incentives</span>
                    <div className="text-2xl font-extrabold text-indigo-600">{sal.incentives}</div>
                    <span className="text-[11px] text-indigo-600 font-bold">Line Target Bonus</span>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl space-y-1">
                    <span className="text-xs font-extrabold text-purple-300 uppercase">Total Net Takehome</span>
                    <div className="text-2xl font-extrabold text-white">{sal.netPay}</div>
                    <span className="text-[11px] text-slate-300 font-semibold">Disbursed: {sal.lastPayDate}</span>
                </div>
            </div>

            {/* Payslips Table */}
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">Payslip Download History</h3>
                    <span className="text-xs text-slate-500 font-medium">Verified Direct Deposit</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6">Pay Period</th>
                                <th className="py-4 px-6">Net Amount</th>
                                <th className="py-4 px-6">Disbursement Status</th>
                                <th className="py-4 px-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {sal.payslips.map((ps: any, index: number) => (
                                <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                                        <FiCalendar className="text-slate-400" />
                                        <span>{ps.month}</span>
                                    </td>
                                    <td className="py-4 px-6 font-extrabold text-slate-900">{ps.amount}</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <FiCheckCircle size={12} /> {ps.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => alert(`Downloading Payslip for ${ps.month}...`)}
                                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                                        >
                                            <FiDownload size={13} />
                                            <span>Download PDF</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
