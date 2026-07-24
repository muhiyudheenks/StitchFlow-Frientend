'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiCheckSquare,
    FiPlus,
    FiClock,
    FiAlertCircle,
    FiUser,
    FiCalendar,
    FiX,
    FiCheck
} from 'react-icons/fi';
import { ManagerTask } from '../types';

export default function TasksTab() {
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
    const [deadline, setDeadline] = useState('');

    const { data: tasks = [], isLoading } = useQuery<ManagerTask[]>({
        queryKey: ['manager-tasks'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/manager/tasks', {
                withCredentials: true,
            });
            return response.data?.data || [];
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async (newTaskData: any) => {
            const response = await axios.post(
                'http://localhost:5000/api/manager/tasks',
                newTaskData,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-tasks'] });
            setIsCreateModalOpen(false);
            setTitle('');
            setDescription('');
            setAssignee('');
            setDeadline('');
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
            const response = await axios.put(
                `http://localhost:5000/api/manager/tasks/${taskId}`,
                { status },
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manager-tasks'] });
        },
    });

    const handleCreateTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        createTaskMutation.mutate({
            title: title.trim(),
            description: description.trim(),
            priority,
            deadline,
        });
    };

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
                        <FiCheckSquare size={14} />
                        <span>Workflow Control</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Task Dispatch &amp; Execution</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Create, assign, set priority levels, and track task progress for operators.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Create New Task</span>
                </button>
            </div>

            {/* Task Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['pending', 'in_progress', 'completed'] as const).map((colStatus) => {
                    const colTasks = tasks.filter((t) => t.status === colStatus);
                    const colTitles = {
                        pending: { title: 'Pending Tasks', color: 'bg-amber-500' },
                        in_progress: { title: 'In Progress', color: 'bg-indigo-500' },
                        completed: { title: 'Completed Tasks', color: 'bg-emerald-500' },
                    };
                    const colInfo = colTitles[colStatus];

                    return (
                        <div key={colStatus} className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${colInfo.color}`} />
                                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                                        {colInfo.title}
                                    </h3>
                                </div>
                                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                                    {colTasks.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {colTasks.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                                        No tasks in this stage.
                                    </div>
                                ) : (
                                    colTasks.map((t) => (
                                        <div key={t.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="text-xs font-bold text-slate-900 leading-snug">{t.title}</h4>
                                                <span
                                                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase shrink-0 ${t.priority === 'urgent'
                                                            ? 'bg-rose-100 text-rose-700'
                                                            : t.priority === 'high'
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    {t.priority}
                                                </span>
                                            </div>

                                            {t.description && (
                                                <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>
                                            )}

                                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <FiUser size={12} />
                                                    <span>{t.assignee}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FiCalendar size={12} />
                                                    <span>{t.deadline}</span>
                                                </div>
                                            </div>

                                            {/* Status Change Buttons */}
                                            <div className="flex items-center gap-1 pt-1">
                                                {colStatus !== 'pending' && (
                                                    <button
                                                        onClick={() => updateStatusMutation.mutate({ taskId: t.id, status: 'pending' })}
                                                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                                                    >
                                                        Mark Pending
                                                    </button>
                                                )}
                                                {colStatus !== 'in_progress' && (
                                                    <button
                                                        onClick={() => updateStatusMutation.mutate({ taskId: t.id, status: 'in_progress' })}
                                                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                                                    >
                                                        In Progress
                                                    </button>
                                                )}
                                                {colStatus !== 'completed' && (
                                                    <button
                                                        onClick={() => updateStatusMutation.mutate({ taskId: t.id, status: 'completed' })}
                                                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer ml-auto"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Task Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900">Create &amp; Dispatch Task</h3>
                            <p className="text-xs text-slate-500 mt-1">Assign task instructions, set priority and completion deadline.</p>
                        </div>

                        <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Task Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Inspect Fabric Roll #409"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Add task instructions or specification guidelines..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e: any) => setPriority(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Deadline Date</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTaskMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 shadow-md cursor-pointer disabled:opacity-60"
                                >
                                    {createTaskMutation.isPending ? 'Creating…' : 'Dispatch Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
