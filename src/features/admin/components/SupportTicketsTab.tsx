'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiHelpCircle,
    FiFilter,
    FiSearch,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiUserCheck,
    FiEdit3,
    FiTrash2,
    FiPlus,
    FiFileText,
    FiMessageSquare,
    FiX,
    FiPaperclip,
    FiSave,
} from 'react-icons/fi';

export default function SupportTicketsTab() {
    const queryClient = useQueryClient();

    const [activeSection, setActiveSection] = useState<'tickets' | 'faqs' | 'documents'>('tickets');

    // Ticket Filters & Search State
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Active Selected Ticket Modal
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [editStatus, setEditStatus] = useState<string>('OPEN');
    const [resolutionText, setResolutionText] = useState('');
    const [internalNotesText, setInternalNotesText] = useState('');
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    // FAQ Form State
    const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
    const [faqQuestion, setFaqQuestion] = useState('');
    const [faqAnswer, setFaqAnswer] = useState('');

    // Document Form State
    const [isAddDocOpen, setIsAddDocOpen] = useState(false);
    const [docTitle, setDocTitle] = useState('');
    const [docUrl, setDocUrl] = useState('');
    const [docCategory, setDocCategory] = useState('General');

    // 1. Fetch All Tickets for Admin
    const { data: tickets = [], isLoading: isLoadingTickets } = useQuery({
        queryKey: ['admin-support-tickets', statusFilter, categoryFilter, priorityFilter, roleFilter, searchQuery],
        queryFn: async () => {
            const res = await api.get('/api/support/tickets', {
                params: {
                    status: statusFilter,
                    category: categoryFilter,
                    priority: priorityFilter,
                    role: roleFilter,
                    search: searchQuery || undefined,
                },
            });
            return res.data?.data || [];
        },
    });

    // 2. Fetch FAQs
    const { data: faqs = [] } = useQuery({
        queryKey: ['admin-faqs'],
        queryFn: async () => {
            const res = await api.get('/api/support/faqs');
            return res.data?.data || [];
        },
    });

    // 3. Fetch Company Documents
    const { data: documents = [] } = useQuery({
        queryKey: ['admin-documents'],
        queryFn: async () => {
            const res = await api.get('/api/support/documents');
            return res.data?.data || [];
        },
    });

    // Ticket Update Mutation
    const updateTicketMutation = useMutation({
        mutationFn: async ({ ticketId, payload }: { ticketId: string; payload: any }) => {
            const res = await api.patch(`/api/support/tickets/${ticketId}`, payload);
            return res.data;
        },
        onSuccess: () => {
            setToastMsg('Support ticket updated & user notified!');
            setSelectedTicket(null);
            queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
            setTimeout(() => setToastMsg(null), 3000);
        },
    });

    // FAQ Mutations
    const createFaqMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post('/api/support/faqs', payload);
            return res.data;
        },
        onSuccess: () => {
            setToastMsg('FAQ created successfully!');
            setIsAddFaqOpen(false);
            setFaqQuestion('');
            setFaqAnswer('');
            queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
            setTimeout(() => setToastMsg(null), 3000);
        },
    });

    const deleteFaqMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/api/support/faqs/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
        },
    });

    // Document Mutations
    const createDocMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post('/api/support/documents', payload);
            return res.data;
        },
        onSuccess: () => {
            setToastMsg('Company document published!');
            setIsAddDocOpen(false);
            setDocTitle('');
            setDocUrl('');
            queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
            setTimeout(() => setToastMsg(null), 3000);
        },
    });

    const deleteDocMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/api/support/documents/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
        },
    });

    const handleSelectTicketToInspect = (t: any) => {
        setSelectedTicket(t);
        setEditStatus(t.status || 'OPEN');
        setResolutionText(t.resolution || '');
        setInternalNotesText(t.internalNotes || '');
    };

    const handleSaveTicketUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;
        updateTicketMutation.mutate({
            ticketId: selectedTicket.id,
            payload: {
                status: editStatus,
                resolution: resolutionText.trim(),
                internalNotes: internalNotesText.trim(),
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200';
            case 'IN_PROGRESS':
                return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200';
            case 'RESOLVED':
                return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200';
            case 'CLOSED':
                return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300';
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
        <div className="space-y-6 font-sans">
            {/* Notification Toast */}
            {toastMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-xl animate-fade-in">
                    <div className="flex items-center gap-2">
                        <FiCheckCircle size={18} />
                        <span>{toastMsg}</span>
                    </div>
                    <button onClick={() => setToastMsg(null)} className="p-1 hover:bg-emerald-600 rounded-lg">
                        <FiX size={16} />
                    </button>
                </div>
            )}

            {/* Header branding */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        <FiHelpCircle size={14} />
                        <span>Admin Support Tickets Command Center</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Organization Support &amp; Ticket Operations</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Manage, assign, and resolve support requests from Employees and Managers across all factory lines.
                    </p>
                </div>

                {/* Sub-Section Switcher Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
                    <button
                        onClick={() => setActiveSection('tickets')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeSection === 'tickets'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                            }`}
                    >
                        Tickets ({tickets.length})
                    </button>
                    <button
                        onClick={() => setActiveSection('faqs')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeSection === 'faqs'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                            }`}
                    >
                        Manage FAQs ({faqs.length})
                    </button>
                    <button
                        onClick={() => setActiveSection('documents')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeSection === 'documents'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                            }`}
                    >
                        Company Docs ({documents.length})
                    </button>
                </div>
            </div>

            {/* SECTION 1: TICKETS COMMAND CENTER */}
            {activeSection === 'tickets' && (
                <div className="space-y-6">
                    {/* Filters & Search Toolbar */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1 w-full">
                                <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by ticket subject, category, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                />
                            </div>

                            {/* Filters Dropdowns */}
                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-bold">
                                {/* Role */}
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none"
                                >
                                    <option value="ALL">All Roles</option>
                                    <option value="employee">Employees Only</option>
                                    <option value="manager">Managers Only</option>
                                </select>

                                {/* Status */}
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none"
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>

                                {/* Priority */}
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none"
                                >
                                    <option value="ALL">All Priorities</option>
                                    <option value="High">High Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="Low">Low Priority</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tickets Table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        <th className="py-4 px-5">Ticket ID</th>
                                        <th className="py-4 px-5">Creator &amp; Role</th>
                                        <th className="py-4 px-5">Category &amp; Subject</th>
                                        <th className="py-4 px-5">Priority</th>
                                        <th className="py-4 px-5">Status</th>
                                        <th className="py-4 px-5">Assigned Admin</th>
                                        <th className="py-4 px-5">Created Date</th>
                                        <th className="py-4 px-5">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {isLoadingTickets ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                                                Loading tickets from database...
                                            </td>
                                        </tr>
                                    ) : tickets.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                                                No support tickets matching selected filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        tickets.map((t: any) => (
                                            <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 px-5 font-mono font-extrabold text-purple-600 dark:text-purple-400">{t.ticketId}</td>

                                                <td className="py-4 px-5">
                                                    <div className="font-bold text-slate-900 dark:text-white">{t.createdBy}</div>
                                                    <span className={`text-[10px] uppercase font-extrabold font-mono px-2 py-0.5 rounded-full ${t.role === 'manager' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {t.role}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5">
                                                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{t.subject}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{t.category}</div>
                                                </td>

                                                <td className="py-4 px-5">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getPriorityBadge(t.priority)}`}>
                                                        {t.priority}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(t.status)}`}>
                                                        {t.status}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5 font-semibold text-slate-600 dark:text-slate-300">
                                                    {t.assignedAdmin || <span className="text-slate-400 italic">Unassigned</span>}
                                                </td>

                                                <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">{t.createdAt}</td>

                                                <td className="py-4 px-5">
                                                    <button
                                                        onClick={() => handleSelectTicketToInspect(t)}
                                                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                                                    >
                                                        <FiEdit3 size={13} />
                                                        <span>Manage</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 2: FAQ MANAGEMENT */}
            {activeSection === 'faqs' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Organization Workstation FAQs</h3>
                        <button
                            onClick={() => setIsAddFaqOpen(true)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                            <FiPlus size={16} /> <span>Add New FAQ</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {faqs.map((faq: any) => (
                            <div key={faq.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-start gap-2">
                                        <FiHelpCircle className="text-purple-600 shrink-0 mt-0.5" />
                                        <span>{faq.question}</span>
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-6">{faq.answer}</p>
                                </div>
                                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => deleteFaqMutation.mutate(faq.id)}
                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                                        title="Delete FAQ"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION 3: COMPANY DOCUMENTS MANAGEMENT */}
            {activeSection === 'documents' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Company Documents &amp; Handbooks</h3>
                        <button
                            onClick={() => setIsAddDocOpen(true)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                            <FiPlus size={16} /> <span>Publish New Document</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {documents.map((doc: any) => (
                            <div key={doc.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">{doc.category}</span>
                                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{doc.title}</h4>
                                    <p className="text-[11px] font-mono text-slate-400 truncate">{doc.fileUrl}</p>
                                </div>
                                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => deleteDocMutation.mutate(doc.id)}
                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                                        title="Delete Document"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ADMIN TICKET INSPECTION & RESOLUTION MODAL */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">{selectedTicket.ticketId}</span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                <FiX size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTicketUpdate} className="space-y-4 text-xs font-medium">
                            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl">
                                <div>
                                    <span className="text-slate-400 font-bold block">Logged By:</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedTicket.createdBy} ({selectedTicket.role})</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold block">Category:</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedTicket.category}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-slate-400 font-bold block mb-1">Ticket Description:</span>
                                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                    {selectedTicket.description}
                                </div>
                            </div>

                            {/* Status Changer */}
                            <div>
                                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Update Status *</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="CLOSED">CLOSED</option>
                                </select>
                            </div>

                            {/* Resolution Message */}
                            <div>
                                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Resolution Response (Sent to Employee/Manager)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Explain how the machine fault or payroll discrepancy was resolved..."
                                    value={resolutionText}
                                    onChange={(e) => setResolutionText(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                                />
                            </div>

                            {/* Internal Notes */}
                            <div>
                                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">Internal Admin Notes (Only Visible to Admins)</label>
                                <input
                                    type="text"
                                    placeholder="Internal technical audit notes..."
                                    value={internalNotesText}
                                    onChange={(e) => setInternalNotesText(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTicket(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateTicketMutation.isPending}
                                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold flex items-center justify-center gap-1.5 shadow-md"
                                >
                                    <FiSave size={14} />
                                    <span>{updateTicketMutation.isPending ? 'Saving...' : 'Save & Notify User'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD FAQ MODAL */}
            {isAddFaqOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Add New FAQ</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (faqQuestion.trim() && faqAnswer.trim()) {
                                    createFaqMutation.mutate({ question: faqQuestion.trim(), answer: faqAnswer.trim() });
                                }
                            }}
                            className="space-y-4 text-xs font-medium"
                        >
                            <div>
                                <label className="block font-extrabold mb-1">Question *</label>
                                <input
                                    type="text"
                                    required
                                    value={faqQuestion}
                                    onChange={(e) => setFaqQuestion(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-extrabold mb-1">Answer *</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={faqAnswer}
                                    onChange={(e) => setFaqAnswer(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setIsAddFaqOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold">
                                    Save FAQ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD DOCUMENT MODAL */}
            {isAddDocOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Publish Company Document</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (docTitle.trim() && docUrl.trim()) {
                                    createDocMutation.mutate({ title: docTitle.trim(), fileUrl: docUrl.trim(), category: docCategory });
                                }
                            }}
                            className="space-y-4 text-xs font-medium"
                        >
                            <div>
                                <label className="block font-extrabold mb-1">Document Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Factory Safety Manual 2026"
                                    value={docTitle}
                                    onChange={(e) => setDocTitle(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-extrabold mb-1">File URL *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="/documents/Factory_Safety_Manual_2026.pdf"
                                    value={docUrl}
                                    onChange={(e) => setDocUrl(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-extrabold mb-1">Category</label>
                                <input
                                    type="text"
                                    value={docCategory}
                                    onChange={(e) => setDocCategory(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setIsAddDocOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold">
                                    Publish Document
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
