'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiUser, FiMail, FiAlertCircle, FiPhone } from 'react-icons/fi';
import api from '@/config';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

import { MANAGER_DESIGNATIONS } from '@/shared/constants/userSchema.constants';

interface QuickActionModalProps {
    isOpen: boolean;
    actionType: string;
    onClose: () => void;
}

const EMPLOYEE_TYPE_OPTIONS = [
    { value: 'stitching_worker', label: 'Stitching Worker' },
    { value: 'finishing_worker', label: 'Finishing Worker' },
    { value: 'cutting_worker', label: 'Cutting Worker' },
];

export default function QuickActionModal({ isOpen, actionType, onClose }: QuickActionModalProps) {
    const queryClient = useQueryClient();

    const isManagerForm = actionType.toLowerCase().includes('manager');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [employeeType, setEmployeeType] = useState<string>('stitching_worker');
    const [designation, setDesignation] = useState<string>('Production Manager');

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setFullName('');
        setEmail('');
        setPhone('');
        setEmployeeType('stitching_worker');
        setDesignation('Production Manager');
        setErrorMsg(null);
        setSubmitted(false);
    }, [actionType, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!fullName.trim()) {
            setErrorMsg('Full Name is required.');
            return;
        }

        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setErrorMsg('Valid email address is required.');
            return;
        }

        setLoading(true);

        try {
            if (isManagerForm) {
                // Post to Managers endpoint with strictly allowed fields
                await api.post('/api/admin/managers', {
                    fullName: fullName.trim(),
                    email: email.trim().toLowerCase(),
                    phone: phone.trim() || undefined,
                    designation,
                });
            } else {
                // Post to Employees endpoint with strictly allowed fields
                await api.post('/api/admin/employees', {
                    fullName: fullName.trim(),
                    email: email.trim().toLowerCase(),
                    phone: phone.trim() || undefined,
                    employeeType,
                });
            }

            setSubmitted(true);

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
                axErr.response?.data?.message || 'Failed to submit. Please try again.'
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
                    className="relative w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl font-sans text-xs"
                >
                    {/* Top Bar */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 text-lg shrink-0">
                            {isManagerForm ? '👨‍💼' : '👤'}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
                                {isManagerForm ? 'ADD MANAGER' : 'ADD EMPLOYEE'}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {isManagerForm ? 'Create a new production manager account' : 'Create a new production worker account'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    {submitted ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-fadeIn">
                            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                                <FiCheckCircle size={36} />
                            </div>
                            <h4 className="text-xl font-extrabold text-slate-900">Invitation Dispatched!</h4>
                            <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
                                An invitation email has been sent to <span className="font-bold text-slate-700">{email}</span> to set up their password.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errorMsg && (
                                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-semibold flex items-center gap-2">
                                    <FiAlertCircle className="text-rose-500 shrink-0" size={16} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="text"
                                        required
                                        placeholder={isManagerForm ? "e.g. Robert Manager" : "e.g. Jane Doe"}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. user@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="text"
                                        placeholder="e.g. +91 98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            {/* Designation (Only for Manager form) */}
                            {isManagerForm && (
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Designation *
                                    </label>
                                    <select
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold text-slate-900 bg-white cursor-pointer"
                                    >
                                        {MANAGER_DESIGNATIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Employee Type (Only for Employee form) */}
                            {!isManagerForm && (
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Employee Type *
                                    </label>
                                    <select
                                        value={employeeType}
                                        onChange={(e) => setEmployeeType(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold text-slate-900 bg-white cursor-pointer"
                                    >
                                        {EMPLOYEE_TYPE_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-extrabold text-white shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                            <span>Creating…</span>
                                        </>
                                    ) : (
                                        <span>{isManagerForm ? 'Create Manager' : 'Create Employee'}</span>
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
