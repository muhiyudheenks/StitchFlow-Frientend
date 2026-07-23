'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiUser, FiMail, FiShield, FiAlertCircle } from 'react-icons/fi';
import axios, { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

interface QuickActionModalProps {
    isOpen: boolean;
    actionType: string;
    onClose: () => void;
}

export default function QuickActionModal({ isOpen, actionType, onClose }: QuickActionModalProps) {
    const queryClient = useQueryClient();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'employee' | 'manager'>('employee');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    // Synchronize initial role based on actionType
    useEffect(() => {
        if (actionType.toLowerCase().includes('manager')) {
            setRole('manager');
        } else {
            setRole('employee');
        }
        setFullName('');
        setEmail('');
        setErrorMsg(null);
        setSubmitted(false);
    }, [actionType, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!fullName.trim()) {
            setErrorMsg('Full name is required.');
            return;
        }

        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setErrorMsg('Valid email address is required.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                'http://localhost:5000/api/auth/register',
                {
                    fullName: fullName.trim(),
                    email: email.trim().toLowerCase(),
                    role,
                },
                { withCredentials: true }
            );

            setSubmitted(true);

            // Invalidate React Query cache to refresh lists
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
            queryClient.invalidateQueries({ queryKey: ['admin-managers'] });

            setTimeout(() => {
                setSubmitted(false);
                setLoading(false);
                onClose();
            }, 1500);
        } catch (err) {
            const axErr = err as AxiosError<{ message?: string }>;
            setErrorMsg(
                axErr.response?.data?.message || 'Failed to create user. Please try again.'
            );
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden font-sans"
                >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-0.5">
                                <FiShield size={13} />
                                <span>Admin User Provisioning</span>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                {actionType}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    {submitted ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-fadeIn">
                            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                                <FiCheckCircle size={36} />
                            </div>
                            <h4 className="text-xl font-extrabold text-slate-900">User Invitation Dispatched!</h4>
                            <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
                                An invitation email has been sent to <span className="font-bold text-slate-700">{email}</span> to set up their password.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            {errorMsg && (
                                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                                    <FiAlertCircle className="text-rose-500 shrink-0" size={16} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label className="block font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Jane Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. jane@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            {/* Role Select */}
                            <div>
                                <label className="block font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                                    Role *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole('employee')}
                                        className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${role === 'employee'
                                                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <span>Employee</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('manager')}
                                        className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${role === 'manager'
                                                ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <span>Manager</span>
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 font-bold text-white hover:bg-slate-800 shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                            <span>Sending Invitation…</span>
                                        </>
                                    ) : (
                                        <span>Create &amp; Send Invitation</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
