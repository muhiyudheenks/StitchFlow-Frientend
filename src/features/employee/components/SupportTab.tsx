'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiHelpCircle,
    FiUserCheck,
    FiMail,
    FiMessageSquare,
    FiChevronDown,
    FiChevronUp,
    FiSend,
    FiCheckCircle
} from 'react-icons/fi';

export default function SupportTab() {
    const [issueText, setIssueText] = useState('');
    const [submittedMsg, setSubmittedMsg] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const faqs = dashboardData?.supportFaqs || [
        { question: 'How do I request a shift swap?', answer: 'Contact your Line Manager at least 24 hours prior to shift startup.' },
        { question: 'Where can I view my monthly payslip breakdown?', answer: 'Go to the Salary tab and click Download Payslip for any previous month.' },
        { question: 'How is my quality score calculated?', answer: 'Quality score is measured by defect-free garments inspected during QC audit.' },
    ];

    const handleReportIssueSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!issueText.trim()) return;
        setSubmittedMsg(true);
        setTimeout(() => {
            setSubmittedMsg(false);
            setIssueText('');
        }, 3000);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
                    <FiHelpCircle size={14} />
                    <span>Help Desk &amp; Workstation Support</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Help &amp; Employee Support</h2>
                <p className="text-xs text-slate-500 mt-1">
                    Reach out to Line Manager Robert Vance or HR, log equipment issues, and read workstation guides.
                </p>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase text-purple-600">Supervisor Contact</span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">Robert Vance (Line Manager)</h3>
                        <p className="text-xs text-slate-500">Available on Assembly Line A</p>
                    </div>
                    <button
                        onClick={() => alert('Opening direct email message to Manager...')}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm shrink-0"
                    >
                        <FiMail size={14} /> <span>Contact Manager</span>
                    </button>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase text-indigo-600">Human Resources</span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">StitchFlow HR Helpdesk</h3>
                        <p className="text-xs text-slate-500">hr@stitchflow.ai • Ext 402</p>
                    </div>
                    <button
                        onClick={() => alert('Opening direct message to HR Helpdesk...')}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm shrink-0"
                    >
                        <FiUserCheck size={14} /> <span>Contact HR</span>
                    </button>
                </div>
            </div>

            {/* Report Issue & FAQs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Report Issue Form */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <FiMessageSquare className="text-purple-600" /> Report Workstation or Machine Issue
                    </h3>

                    {submittedMsg && (
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                            <FiCheckCircle /> <span>Issue report submitted to supervisor.</span>
                        </div>
                    )}

                    <form onSubmit={handleReportIssueSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Describe Issue / Machine Fault</label>
                            <textarea
                                rows={4}
                                required
                                placeholder="e.g. Sewing Machine #12 tension spring slipping during denim stitching..."
                                value={issueText}
                                onChange={(e) => setIssueText(e.target.value)}
                                className="w-full p-3.5 rounded-2xl border border-slate-200 outline-none focus:border-purple-500 font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                        >
                            <FiSend size={14} /> <span>Submit Issue Ticket</span>
                        </button>
                    </form>
                </div>

                {/* FAQs Accordion */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900">Frequently Asked Questions</h3>

                    <div className="space-y-3">
                        {faqs.map((faq: any, idx: number) => {
                            const isExp = expandedFaq === idx;
                            return (
                                <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden text-xs">
                                    <button
                                        onClick={() => setExpandedFaq(isExp ? null : idx)}
                                        className="w-full p-4 text-left font-bold text-slate-900 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        {isExp ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>
                                    {isExp && (
                                        <div className="p-4 bg-white text-slate-600 border-t border-slate-100 leading-relaxed font-medium">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
