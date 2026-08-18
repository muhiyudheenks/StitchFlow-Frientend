'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/config';
import {
    FiFileText,
    FiDownload,
    FiBarChart2,
    FiCheckCircle,
    FiClock,
    FiRefreshCw
} from 'react-icons/fi';
import { ManagerReportItem } from '../types';

export default function ReportsTab() {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const { data: reportsData, isLoading } = useQuery<{ reports: ManagerReportItem[] }>({
        queryKey: ['manager-reports'],
        queryFn: async () => {
            const response = await api.get('/api/manager/reports');
            return response.data?.data || { reports: [] };
        },
    });

    const reports = reportsData?.reports || [];

    const handleDownloadReport = async (repId: string, repTitle: string) => {
        try {
            setDownloadingId(repId);
            const response = await api.get(`/api/reports/download/${repId}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${repTitle.replace(/\s+/g, '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error('Failed to download report:', err);
            alert('Failed to download report. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    <FiFileText size={14} />
                    <span>Operational Intelligence</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Manager Reports &amp; Analytics Export</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Generate and download shift production summaries, attendance audits, defect reports, and worker line efficiency.
                </p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {isLoading ? (
                    <div className="col-span-full p-12 text-center text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        Generating report catalog from MongoDB...
                    </div>
                ) : (
                    reports.map((rep) => (
                        <div key={rep.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                                        <FiBarChart2 size={18} />
                                    </div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {rep.category}
                                    </span>
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{rep.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 font-medium">
                                    <FiClock size={12} />
                                    <span>{rep.generatedAt}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDownloadReport(rep.id, rep.title)}
                                disabled={downloadingId === rep.id}
                                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 font-extrabold text-xs hover:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm shrink-0 cursor-pointer transition-colors disabled:opacity-60"
                            >
                                {downloadingId === rep.id ? (
                                    <>
                                        <FiRefreshCw className="animate-spin" size={14} />
                                        <span>Exporting…</span>
                                    </>
                                ) : (
                                    <>
                                        <FiDownload size={14} />
                                        <span>Export {rep.format}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
