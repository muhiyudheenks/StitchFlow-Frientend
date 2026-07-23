'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { mockManagers } from '../data/mockData';
import { FiUsers, FiCheckSquare, FiAward, FiPlus, FiSend } from 'react-icons/fi';

interface ManagersTabProps {
    onOpenQuickAction: (actionType: string) => void;
}

export default function ManagersTab({ onOpenQuickAction }: ManagersTabProps) {
    return (
        <div className="space-y-6 font-sans">
            {/* Top Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Line Supervisors & Plant Managers
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage leadership allocations, line productivity, and performance metrics
                    </p>
                </div>

                <button
                    onClick={() => onOpenQuickAction('Add Manager')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
                >
                    <FiPlus size={16} />
                    <span>Assign New Manager</span>
                </button>
            </div>

            {/* Manager Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {mockManagers.map((mgr, idx) => (
                    <motion.div
                        key={mgr.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all group flex flex-col justify-between"
                    >
                        <div>
                            {/* Manager Avatar & Status Header */}
                            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-md">
                                        {mgr.name.split(' ').map((n) => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                                            {mgr.name}
                                        </h3>
                                        <p className="text-xs text-slate-500">{mgr.department}</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                                    {mgr.status}
                                </span>
                            </div>

                            {/* Assigned Line */}
                            <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Assigned Production Line
                                </span>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">
                                    {mgr.assignedLine}
                                </p>
                            </div>

                            {/* 3 Metric Badges */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="p-3 rounded-2xl border border-slate-100 bg-white text-center">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                                        <FiUsers size={13} />
                                        <span>Team</span>
                                    </div>
                                    <span className="text-base font-extrabold text-slate-900">{mgr.employeesCount}</span>
                                    <span className="text-[10px] text-slate-400 block">Workers</span>
                                </div>

                                <div className="p-3 rounded-2xl border border-slate-100 bg-white text-center">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                                        <FiCheckSquare size={13} />
                                        <span>Tasks</span>
                                    </div>
                                    <span className="text-base font-extrabold text-slate-900">{mgr.activeTasksCount}</span>
                                    <span className="text-[10px] text-slate-400 block">Active</span>
                                </div>

                                <div className="p-3 rounded-2xl border border-slate-100 bg-white text-center">
                                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                                        <FiAward size={13} />
                                        <span>Score</span>
                                    </div>
                                    <span className="text-base font-extrabold text-purple-700">{mgr.performanceScore}%</span>
                                    <span className="text-[10px] text-slate-400 block">Quality</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Footer */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <button
                                onClick={() => onOpenQuickAction('Message Manager')}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <FiSend size={13} /> Message
                            </button>
                            <button
                                onClick={() => onOpenQuickAction('Reassign Line')}
                                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition-colors text-center"
                            >
                                Reassign Line
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
