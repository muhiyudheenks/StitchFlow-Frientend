'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FiCpu, FiTarget, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';

export default function ProductionTab() {
    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const prod = dashboardData?.production || {
        assignedBatchNumber: 'BT-9042',
        productName: 'Men Outerwear Vintage Denim Jacket',
        assignedLine: 'Assembly Line A',
        todayTarget: 420,
        completedQty: 380,
        remainingQty: 40,
        efficiency: 92,
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
                    <FiCpu size={14} />
                    <span>Line Operator Workstation</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">My Production Target &amp; Batch Output</h2>
                <p className="text-xs text-slate-500 mt-1">
                    Real-time fulfillment metrics for assigned garment assembly lines.
                </p>
            </div>

            {/* Main Batch Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-mono font-bold text-xs">
                            Batch #{prod.assignedBatchNumber}
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{prod.productName}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{prod.assignedLine}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-extrabold text-purple-600">{prod.efficiency}%</div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Line Efficiency</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>Assembly Fulfillment Target</span>
                        <span>{prod.completedQty} / {prod.todayTarget} pieces</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${(prod.completedQty / prod.todayTarget) * 100}%` }} />
                    </div>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-extrabold text-slate-400 uppercase">Today Target</span>
                        <div className="text-xl font-extrabold text-slate-900 mt-1">{prod.todayTarget} <span className="text-xs font-normal text-slate-400">pcs</span></div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                        <span className="text-xs font-extrabold text-emerald-800 uppercase">Completed Quantity</span>
                        <div className="text-xl font-extrabold text-emerald-900 mt-1">{prod.completedQty} <span className="text-xs font-normal text-emerald-700">pcs</span></div>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                        <span className="text-xs font-extrabold text-amber-800 uppercase">Remaining Quantity</span>
                        <div className="text-xl font-extrabold text-amber-900 mt-1">{prod.remainingQty} <span className="text-xs font-normal text-amber-700">pcs</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
