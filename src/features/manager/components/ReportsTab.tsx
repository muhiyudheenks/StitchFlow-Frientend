'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiFileText,
    FiDownload,
    FiBarChart2,
    FiCheckCircle,
    FiClock
} from 'react-icons/fi';
import { ManagerReportItem } from '../types';

export default function ReportsTab() {
    const { data: reportsData, isLoading } = useQuery<{ reports: ManagerReportItem[] }>({
        queryKey: ['manager-reports'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/manager/reports', {
                withCredentials: true,
            });
            return response.data?.data || { reports: [] };
        },
    });

    const reports = reportsData?.reports || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
                    <FiFileText size={14} />
                    <span>Operational Intelligence</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Manager Reports &amp; Analytics Export</h2>
                <p className="text-xs text-slate-500 mt-1">
                    Generate and download shift production summaries, attendance audits, defect reports, and worker line efficiency.
                </p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-slate-400 font-semibold">
                        Generating report catalog...
                    </div>
                ) : (
                    reports.map((rep) => (
                        <div key={rep.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                        <FiBarChart2 size={18} />
                                    </div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                        {rep.category}
                                    </span>
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900">{rep.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                    <FiClock size={12} />
                                    <span>Last Generated: {rep.generatedAt}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => alert(`Downloading ${rep.title} (${rep.format})...`)}
                                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 flex items-center gap-2 shadow-sm shrink-0 cursor-pointer transition-colors"
                            >
                                <FiDownload size={14} />
                                <span>Export {rep.format}</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
