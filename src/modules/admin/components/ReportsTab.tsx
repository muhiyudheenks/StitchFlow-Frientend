'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/config';
import { FiFileText, FiDownload, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function ReportsTab() {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [downloadedId, setDownloadedId] = useState<string | null>(null);

    const { data: reportsData, isLoading, isError, error } = useQuery({
        queryKey: ['admin-reports-catalog'],
        queryFn: async () => {
            const response = await api.get('/api/reports');
            return response.data?.data?.reports || [];
        },
    });

    const handleDownload = async (reportId: string, reportTitle: string) => {
        setDownloadingId(reportId);
        try {
            const response = await api.get(`/api/reports/export/${reportId}`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setDownloadedId(reportId);
            setTimeout(() => setDownloadedId(null), 3000);
        } catch (err: any) {
            alert('Failed to download report export.');
        } finally {
            setDownloadingId(null);
        }
    };

    const reports = reportsData || [];

    return (
        <div className="space-y-8 font-sans">
            {/* Header Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Executive Reports &amp; Compliance Exports
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Download automated shift logs, quality audits, attendance reports, and stock valuations generated directly from MongoDB records
                    </p>
                </div>
            </div>

            {/* Reports List Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
            >
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    Available Export Statements
                </h3>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-400 font-semibold">Loading report statements from database...</div>
                ) : isError ? (
                    <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
                        <FiAlertCircle size={16} /> <span>Failed to load reports catalog: {(error as any)?.message}</span>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-semibold">No report statements available yet.</div>
                ) : (
                    <div className="space-y-3">
                        {reports.map((rep: any) => (
                            <div
                                key={rep.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-extrabold shrink-0">
                                        <FiFileText size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{rep.title}</h4>
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                                            <span>Category: <strong className="text-purple-600 dark:text-purple-400">{rep.category}</strong></span>
                                            <span>•</span>
                                            <span>{rep.generatedAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                                    <span className="text-xs font-mono text-slate-400 font-bold uppercase">{rep.format || 'CSV'}</span>
                                    <button
                                        onClick={() => handleDownload(rep.id, rep.title)}
                                        disabled={downloadingId === rep.id}
                                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${downloadedId === rep.id
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-500 text-white shadow-sm'
                                            }`}
                                    >
                                        {downloadedId === rep.id ? (
                                            <>
                                                <FiCheckCircle size={14} /> Downloaded
                                            </>
                                        ) : downloadingId === rep.id ? (
                                            <span>Exporting CSV...</span>
                                        ) : (
                                            <>
                                                <FiDownload size={14} /> Export CSV
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
