'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiCheckCircle, FiClock, FiFilter } from 'react-icons/fi';

export default function ReportsTab() {
    const [downloaded, setDownloaded] = useState<string | null>(null);

    const reports = [
        { id: 'REP-01', title: 'Daily Shift Throughput Audit', date: 'July 23, 2026', type: 'Production Log', size: '2.4 MB' },
        { id: 'REP-02', title: 'Biometric Attendance & Overtime Summary', date: 'July 22, 2026', type: 'HR & Roster', size: '1.8 MB' },
        { id: 'REP-03', title: 'QMS Defect Root Cause Analysis', date: 'July 21, 2026', type: 'Quality Control', size: '4.1 MB' },
        { id: 'REP-04', title: 'Fabric & Thread Stock Valuation', date: 'July 20, 2026', type: 'Inventory', size: '3.2 MB' },
        { id: 'REP-05', title: 'Executive Operations Summary (Q2)', date: 'July 15, 2026', type: 'Executive', size: '5.6 MB' }
    ];

    const handleDownload = (id: string) => {
        setDownloaded(id);
        setTimeout(() => setDownloaded(null), 1500);
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Executive Reports & Compliance Exports
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Download automated shift logs, quality audits, attendance reports, and stock valuations
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <FiFilter size={14} /> Filter Reports
                    </button>
                </div>
            </div>

            {/* Reports List Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
            >
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-4">
                    Available Export Statements
                </h3>

                <div className="space-y-3">
                    {reports.map((rep) => (
                        <div
                            key={rep.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 font-extrabold">
                                    <FiFileText size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-900">{rep.title}</h4>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                                        <span>ID: <strong className="font-mono text-purple-700">{rep.id}</strong></span>
                                        <span>•</span>
                                        <span>{rep.date}</span>
                                        <span>•</span>
                                        <span className="font-semibold text-slate-600">{rep.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <span className="text-xs font-mono text-slate-400 font-medium">{rep.size}</span>
                                <button
                                    onClick={() => handleDownload(rep.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${downloaded === rep.id
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {downloaded === rep.id ? (
                                        <>
                                            <FiCheckCircle size={14} /> Downloaded
                                        </>
                                    ) : (
                                        <>
                                            <FiDownload size={14} /> Export PDF/CSV
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
