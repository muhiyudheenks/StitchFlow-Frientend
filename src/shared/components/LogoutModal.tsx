'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { signedOut } from '@/store/slices/authSlice';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FiLogOut, FiAlertTriangle, FiX } from 'react-icons/fi';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (!isOpen) return null;

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            // 1. Call Backend Logout API to clear cookies
            await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
        } catch (err) {
            console.error('Logout API call error:', err);
        } finally {
            // 2. Clear Redux auth state
            dispatch(signedOut());

            // 3. Clear React Query cache
            queryClient.clear();

            // 4. Clear local and session storage
            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
            }

            setIsLoggingOut(false);
            onClose();

            // 5. Redirect to Login and replace history state
            router.replace('/login');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                <button
                    onClick={onClose}
                    disabled={isLoggingOut}
                    className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                    <FiX size={18} />
                </button>

                <div className="flex items-center gap-3.5 mb-4">
                    <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm shrink-0">
                        <FiLogOut size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Confirm Sign Out</h3>
                        <p className="text-xs text-slate-500 font-medium">StitchFlow AI Authentication</p>
                    </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 font-medium">
                    Are you sure you want to end your current session? You will need to log back in to access your workstation dashboard.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoggingOut}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmLogout}
                        disabled={isLoggingOut}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
                    >
                        {isLoggingOut ? (
                            <span>Signing Out…</span>
                        ) : (
                            <>
                                <FiLogOut size={14} />
                                <span>Sign Out Now</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
