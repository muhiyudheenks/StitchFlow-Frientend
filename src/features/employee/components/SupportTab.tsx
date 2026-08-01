'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiHelpCircle,
    FiUser,
    FiMail,
    FiPhone,
    FiMessageSquare,
    FiChevronDown,
    FiChevronUp,
    FiSend,
    FiCheckCircle,
    FiAlertCircle,
    FiPaperclip,
    FiFileText,
    FiShield,
    FiTool,
    FiCrosshair,
    FiDownload,
    FiEye,
    FiX,
} from 'react-icons/fi';

export default function SupportTab() {
    const queryClient = useQueryClient();

    // Form State
    const [category, setCategory] = useState('Attendance');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [attachmentName, setAttachmentName] = useState('');

    // Table Filter State
    const [statusFilter, setStatusFilter] = useState('ALL');

    // UI Accordion & Modal States
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [successToast, setSuccessToast] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Employee Ticket Categories
    const employeeCategories = [
        'Attendance',
        'Leave',
        'Salary',
        'Production',
        'Machine Issue',
        'Inventory',
        'Login/System',
        'Quality',
        'Other',
    ];

    // 1. Fetch Line Manager
    const { data: manager } = useQuery({
        queryKey: ['support-manager'],
        queryFn: async () => {
            const res = await api.get('/api/support/manager');
            return res.data?.data || null;
        },
    });

    // 2. Fetch HR Contact
    const { data: hrInfo } = useQuery({
        queryKey: ['support-hr'],
        queryFn: async () => {
            const res = await api.get('/api/support/hr');
            return res.data?.data || null;
        },
    });

    // 3. Fetch My Tickets
    const { data: allMyTickets = [], isLoading: isLoadingTickets } = useQuery({
        queryKey: ['employee-my-tickets'],
        queryFn: async () => {
            const res = await api.get('/api/support/my-tickets');
            return res.data?.data || [];
        },
    });

    // Filter tickets on client
    const tickets = allMyTickets.filter((t: any) => {
        if (statusFilter === 'ALL') return true;
        return t.status === statusFilter;
    });

    // 4. Fetch FAQs
    const { data: faqs = [] } = useQuery({
        queryKey: ['support-faqs'],
        queryFn: async () => {
            const res = await api.get('/api/support/faqs');
            return res.data?.data || [];
        },
    });

    // 5. Fetch Emergency Contacts
    const { data: contacts } = useQuery({
        queryKey: ['support-contacts'],
        queryFn: async () => {
            const res = await api.get('/api/support/contacts');
            return res.data?.data || null;
        },
    });

    // 6. Fetch Company Documents
    const { data: documents = [] } = useQuery({
        queryKey: ['support-documents'],
        queryFn: async () => {
            const res = await api.get('/api/support/documents');
            return res.data?.data || [];
        },
    });

    // Ticket Creation Mutation
    const createTicketMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post('/api/support/tickets', payload);
            return res.data;
        },
        onSuccess: () => {
            setSuccessToast('Support ticket submitted to Admin! Line Manager & HR notified.');
            setSubject('');
            setDescription('');
            setAttachmentName('');
            setErrorMsg(null);
            queryClient.invalidateQueries({ queryKey: ['employee-my-tickets'] });

            setTimeout(() => setSuccessToast(null), 4000);
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Failed to submit support ticket.');
        },
    });

    const handleCreateTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim()) {
            setErrorMsg('Subject and Description are required.');
            return;
        }

        createTicketMutation.mutate({
            category,
            subject: subject.trim(),
            description: description.trim(),
            priority,
            attachment: attachmentName || undefined,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachmentName(e.target.files[0].name);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50';
            case 'IN_PROGRESS':
                return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50';
            case 'RESOLVED':
                return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50';
            case 'CLOSED':
                return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPriorityBadge = (p: string) => {
        switch (p) {
            case 'High':
                return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200';
            case 'Medium':
                return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200';
            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200';
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Success Toast */}
            {successToast && (
                <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-xl animate-fade-in">
                    <div className="flex items-center gap-2">
                        <FiCheckCircle size={18} />
                        <span>{successToast}</span>
                    </div>
                    <button onClick={() => setSuccessToast(null)} className="p-1 hover:bg-emerald-600 rounded-lg">
                        <FiX size={16} />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    <FiHelpCircle size={14} />
                    <span>Employee Help Desk &amp; Support OS</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Help &amp; Support Center</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Raise support requests directly to Admin, contact your Line Manager &amp; HR, read factory FAQs, and download company policies.
                </p>
            </div>

            {/* Quick Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Line Manager */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">My Line Manager</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {manager?.status || 'Online'}
                        </span>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-md">
                            {manager?.fullName ? manager.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'LM'}
                        </div>
                        <div className="space-y-1 min-w-0">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{manager?.fullName || 'Production Manager'}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{manager?.designation || 'Line Manager'}</p>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-mono">
                                <span>ID: {manager?.employeeId || 'EMP-MGR'}</span>
                                <span>•</span>
                                <span>{manager?.department || 'Production'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <a
                            href={`mailto:${manager?.email || 'manager@stitchflow.com'}`}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                            <FiMail size={14} /> <span>Contact Manager</span>
                        </a>
                        <button
                            onClick={() => alert(`Manager Profile:\nName: ${manager?.fullName}\nPhone: ${manager?.phone}\nEmail: ${manager?.email}`)}
                            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                            <FiUser size={14} /> <span>View Profile</span>
                        </button>
                    </div>
                </div>

                {/* HR Contact */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Human Resources (HR)</span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{hrInfo?.workingHours || '08:00 AM - 06:00 PM'}</span>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-purple-950 text-white flex items-center justify-center font-extrabold text-base shadow-md">
                            HR
                        </div>
                        <div className="space-y-1 min-w-0">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{hrInfo?.hrName || 'StitchFlow HR Helpdesk'}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{hrInfo?.email || 'hr@stitchflow.ai'}</p>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-3 pt-1 font-mono">
                                <span>Phone: {hrInfo?.phone || '+91 98765 43210'}</span>
                                <span>•</span>
                                <span>{hrInfo?.officeExtension || 'Ext 402'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <a
                            href={`mailto:${hrInfo?.email || 'hr@stitchflow.ai'}?subject=HR Inquiry from Employee`}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                            <FiPhone size={14} /> <span>Contact HR</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Ticket Creation & My Tickets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Raise Ticket Form */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <FiMessageSquare className="text-purple-600 dark:text-purple-400" /> Raise Support Ticket
                    </h3>

                    {errorMsg && (
                        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
                            <FiAlertCircle size={16} /> <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs font-medium">
                        {/* Category */}
                        <div>
                            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-bold"
                            >
                                {employeeCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Priority *</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['Low', 'Medium', 'High'] as const).map((p) => (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={`py-2 rounded-xl font-extrabold text-xs transition-all border ${priority === p
                                                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Subject *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Discrepancy in June attendance hours"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="Provide detailed information regarding the support request..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Attachment */}
                        <div>
                            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Optional Attachment</label>
                            <div className="flex items-center gap-2">
                                <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                                    <FiPaperclip size={14} /> <span>Choose File</span>
                                    <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                                </label>
                                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                                    {attachmentName || 'No file selected'}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={createTicketMutation.isPending}
                            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                        >
                            <FiSend size={14} />
                            <span>{createTicketMutation.isPending ? 'Submitting Ticket...' : 'Submit Support Ticket'}</span>
                        </button>
                    </form>
                </div>

                {/* My Tickets Table */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">My Support Tickets</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">View status of tickets raised to ERP Admin.</p>
                        </div>

                        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase transition-colors border ${statusFilter === st
                                            ? 'bg-slate-900 text-white dark:bg-purple-600 border-transparent'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    {st.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoadingTickets ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-semibold">Loading ticket history...</div>
                    ) : tickets.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-semibold space-y-2">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No support tickets logged yet.</p>
                            <p className="text-xs text-slate-400">Use the form to raise a support ticket to ERP Admin.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        <th className="py-3 px-3">Ticket ID</th>
                                        <th className="py-3 px-3">Category / Subject</th>
                                        <th className="py-3 px-3">Priority</th>
                                        <th className="py-3 px-3">Status</th>
                                        <th className="py-3 px-3">Date</th>
                                        <th className="py-3 px-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {tickets.map((t: any) => (
                                        <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3.5 px-3 font-mono font-extrabold text-purple-600 dark:text-purple-400">{t.ticketId}</td>
                                            <td className="py-3.5 px-3">
                                                <div className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">{t.subject}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{t.category}</div>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getPriorityBadge(t.priority)}`}>
                                                    {t.priority}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(t.status)}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3 text-slate-400 text-[11px] font-mono">{t.createdAt}</td>
                                            <td className="py-3.5 px-3">
                                                <button
                                                    onClick={() => setSelectedTicket(t)}
                                                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* FAQs & Emergency Contacts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* FAQs */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                        {faqs.map((faq: any, idx: number) => {
                            const isExp = expandedFaq === idx;
                            return (
                                <div key={faq.id || idx} className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                                    <button
                                        onClick={() => setExpandedFaq(isExp ? null : idx)}
                                        className="w-full p-4 text-left font-bold text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        {isExp ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>
                                    {isExp && (
                                        <div className="p-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed font-medium">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Emergency Contacts</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-1">
                            <FiShield className="text-rose-600 dark:text-rose-400" size={18} />
                            <span className="text-[10px] font-extrabold uppercase text-rose-700 dark:text-rose-300 block">Security</span>
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">{contacts?.security || '+91 98765 00001'}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
                            <FiTool className="text-amber-600 dark:text-amber-400" size={18} />
                            <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-300 block">Maintenance</span>
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">{contacts?.maintenance || '+91 98765 00002'}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                            <FiCrosshair className="text-emerald-600 dark:text-emerald-400" size={18} />
                            <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300 block">First Aid</span>
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">{contacts?.firstAid || '+91 98765 00003'}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 space-y-1">
                            <FiPhone className="text-indigo-600 dark:text-indigo-400" size={18} />
                            <span className="text-[10px] font-extrabold uppercase text-indigo-700 dark:text-indigo-300 block">HR Hotline</span>
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">{contacts?.hr || '+91 98765 43210'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiFileText className="text-purple-600 dark:text-purple-400" /> Company Policy &amp; Factory Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 flex items-center justify-between gap-3">
                            <div className="min-w-0 space-y-0.5">
                                <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">{doc.category}</span>
                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{doc.title}</h4>
                            </div>
                            <a
                                href={doc.fileUrl}
                                download
                                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shrink-0 transition-colors"
                                title="Download Document"
                            >
                                <FiDownload size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ticket Details Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">{selectedTicket.ticketId}</span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-400">Category:</span>
                                <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedTicket.category}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-400">Priority:</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getPriorityBadge(selectedTicket.priority)}`}>
                                    {selectedTicket.priority}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-400">Status:</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(selectedTicket.status)}`}>
                                    {selectedTicket.status}
                                </span>
                            </div>

                            <div>
                                <span className="font-bold text-slate-400 block mb-1">Description:</span>
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {selectedTicket.description}
                                </div>
                            </div>

                            {selectedTicket.resolution && (
                                <div>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Admin Resolution Response:</span>
                                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 leading-relaxed border border-emerald-200">
                                        {selectedTicket.resolution}
                                    </div>
                                </div>
                            )}

                            {selectedTicket.attachment && (
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-bold text-slate-400">Attachment:</span>
                                    <span className="font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                        <FiPaperclip size={12} /> {selectedTicket.attachment}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedTicket(null)}
                            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
                        >
                            Close Ticket View
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
