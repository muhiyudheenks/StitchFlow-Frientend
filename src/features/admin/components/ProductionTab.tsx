'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { mockProductionLines, mockMachineStatuses } from '../data/mockData';
import { FiCpu, FiCheckCircle, FiAlertCircle, FiSettings, FiPlus } from 'react-icons/fi';

interface ProductionTabProps {
    onOpenQuickAction: (actionType: string) => void;
}

export default function ProductionTab({ onOpenQuickAction }: ProductionTabProps) {
    const totalTarget = mockProductionLines.reduce((acc, l) => acc + l.targetPcs, 0);
    const totalCompleted = mockProductionLines.reduce((acc, l) => acc + l.completedPcs, 0);
    const remaining = totalTarget - totalCompleted;
    const overallEfficiency = (totalCompleted / totalTarget) * 100;

    return (
        <div className="space-y-8 font-sans">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Target</span>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">{totalTarget.toLocaleString()} pcs</div>
                    <span className="text-xs text-slate-500 mt-1 block">Assigned for Shift A</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed Output</span>
                    <div className="text-3xl font-extrabold text-emerald-600 mt-2">{totalCompleted.toLocaleString()} pcs</div>
                    <span className="text-xs text-emerald-600/80 mt-1 block">+14% vs Shift Baseline</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Remaining Pcs</span>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">{remaining.toLocaleString()} pcs</div>
                    <span className="text-xs text-slate-500 mt-1 block">Estimated finish: 04:30 PM</span>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-xs">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Overall Efficiency</span>
                    <div className="text-3xl font-extrabold text-purple-700 mt-2">{overallEfficiency.toFixed(1)}%</div>
                    <span className="text-xs text-purple-600/80 mt-1 block">Tact time: 42s per unit</span>
                </div>
            </div>

            {/* Live Assembly Lines Grid */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Assembly Line Throughput & Workstation Balancer
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Real-time workstation cycle analysis and operator allocation</p>
                    </div>

                    <button
                        onClick={() => onOpenQuickAction('Create Production Batch')}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-all shadow-md"
                    >
                        <FiPlus size={16} />
                        <span>Create New Production Batch</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {mockProductionLines.map((line) => (
                        <div key={line.id} className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-lg transition-all space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-extrabold text-base text-slate-900">{line.name}</span>
                                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                                    {line.status}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-slate-500">Output Progress</span>
                                    <span className="text-slate-900 font-mono">{line.completedPcs} / {line.targetPcs} pcs</span>
                                </div>
                                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                                        style={{ width: `${(line.completedPcs / line.targetPcs) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                                <div className="p-3 rounded-xl bg-white border border-slate-100">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Efficiency</span>
                                    <span className="text-sm font-extrabold text-purple-700">{line.efficiencyRate}%</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-slate-100">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Workers</span>
                                    <span className="text-sm font-extrabold text-slate-900">{line.activeWorkers}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Machine & Hardware QMS Status Table */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs overflow-hidden p-6 sm:p-8"
            >
                <div className="mb-6">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                        Floor Hardware & Sewing Machine Statuses
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Automated telemetry monitoring for sewing machines and fabric cutters</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                                <th className="py-4 px-6">Machine ID</th>
                                <th className="py-4 px-6">Hardware Model</th>
                                <th className="py-4 px-6">Machine Type</th>
                                <th className="py-4 px-6">Assigned Line</th>
                                <th className="py-4 px-6">Output Rate</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {mockMachineStatuses.map((m) => (
                                <tr key={m.id} className="hover:bg-purple-50/30 transition-colors">
                                    <td className="py-4 px-6 font-mono font-bold text-purple-700">{m.id}</td>
                                    <td className="py-4 px-6 font-bold text-slate-900">{m.name}</td>
                                    <td className="py-4 px-6 text-slate-600">{m.type}</td>
                                    <td className="py-4 px-6 font-semibold text-slate-800">{m.line}</td>
                                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{m.outputRate}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${m.status === 'Operational' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                m.status === 'Maintenance' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                    'bg-amber-50 text-amber-600 border-amber-200'
                                            }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
