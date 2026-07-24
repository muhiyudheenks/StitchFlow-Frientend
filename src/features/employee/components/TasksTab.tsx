'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiCheckSquare,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiCalendar,
    FiSliders,
    FiX
} from 'react-icons/fi';

export default function TasksTab() {
    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const [localTasks, setLocalTasks] = useState([
        { id: 'et1', title: 'Stitch Denim Jacket Collar & Cuffs', description: 'Ensure double-stitching seam strength on Batch #BT-9042.', priority: 'urgent', status: 'in_progress', deadline: 'Today, 04:00 PM', progress: 70 },
        { id: 'et2', title: 'Inspect Machine #12 Tension Springs', description: 'Perform pre-shift calibration check before line startup.', priority: 'medium', status: 'pending', deadline: 'Tomorrow, 10:00 AM', progress: 0 },
        { id: 'et3', title: 'Attach Brass Zippers - Batch #BT-9044', description: 'Align zipper teeth and run pull test on 10 sample pieces.', priority: 'high', status: 'completed', deadline: 'Yesterday', progress: 100 },
    ]);

    const [selectedTask, setSelectedTask] = useState<any>(null);

    const handleProgressChange = (taskId: string, newProgress: number) => {
        setLocalTasks((prev) =>
            prev.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        progress: newProgress,
                        status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'pending',
                    }
                    : t
            )
        );
    };

    const handleMarkComplete = (taskId: string) => {
        handleProgressChange(taskId, 100);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
                        <FiCheckSquare size={14} />
                        <span>Workstation Tasks</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">My Assigned Work Tasks</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Update task completion percentages, inspect deadlines, and notify supervisor upon completion.
                    </p>
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localTasks.map((t) => (
                    <div key={t.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${t.priority === 'urgent'
                                            ? 'bg-rose-100 text-rose-700'
                                            : t.priority === 'high'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}
                                >
                                    {t.priority}
                                </span>

                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${t.status === 'completed'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : t.status === 'in_progress'
                                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    {t.status.replace('_', ' ')}
                                </span>
                            </div>

                            <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{t.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{t.description}</p>

                            <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
                                <span className="flex items-center gap-1">
                                    <FiCalendar size={13} /> {t.deadline}
                                </span>
                                <span className="font-bold text-slate-800">{t.progress}% Progress</span>
                            </div>

                            {/* Progress Slider Bar */}
                            <div className="space-y-1">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${t.progress}%` }} />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="10"
                                    value={t.progress}
                                    onChange={(e) => handleProgressChange(t.id, Number(e.target.value))}
                                    className="w-full accent-purple-600 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                            <button
                                onClick={() => setSelectedTask(t)}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                            >
                                View Details
                            </button>

                            {t.status !== 'completed' ? (
                                <button
                                    onClick={() => handleMarkComplete(t.id)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                                >
                                    <FiCheckCircle size={14} /> Complete
                                </button>
                            ) : (
                                <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                                    <FiCheckCircle /> Done
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* View Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedTask(null)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700">
                                Task Spec
                            </span>
                            <h3 className="text-lg font-extrabold text-slate-900 mt-2">{selectedTask.title}</h3>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                            {selectedTask.description}
                        </p>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
