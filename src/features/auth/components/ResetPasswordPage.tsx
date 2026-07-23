'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { resetPasswordSchema, type ResetPasswordValues } from '../validations/authSchema';
import { useAppSelector } from '@/store/hooks';
import {
    FiLayers,
    FiLock,
    FiEye,
    FiEyeOff,
    FiCheck,
    FiArrowLeft,
    FiCheckCircle
} from 'react-icons/fi';

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

function getStrength(password: string): StrengthLevel {
    if (password.length === 0) return 'weak';
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Za-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return 'weak';
    if (score === 2) return 'fair';
    if (score === 3) return 'good';
    return 'strong';
}

const strengthConfig: Record<StrengthLevel, { label: string; color: string; width: string; barColor: string }> = {
    weak: { label: 'Weak', color: 'text-rose-500', width: 'w-1/4', barColor: 'bg-rose-500' },
    fair: { label: 'Fair', color: 'text-amber-500', width: 'w-2/4', barColor: 'bg-amber-500' },
    good: { label: 'Good', color: 'text-blue-600', width: 'w-3/4', barColor: 'bg-blue-600' },
    strong: { label: 'Strong', color: 'text-emerald-600', width: 'w-full', barColor: 'bg-emerald-500' },
};

export default function ResetPasswordPage() {
    const router = useRouter();
    const reduxEmail = useAppSelector((state) => state.auth.resetEmail);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const [email, setEmail] = useState<string>('');
    const [successMsg, setSuccessMsg] = useState<string>('');

    const strength = getStrength(passwordValue);
    const cfg = strengthConfig[strength];
    const hasMinLength = passwordValue.length >= 8;
    const hasMix = /[A-Za-z]/.test(passwordValue) && /[0-9]/.test(passwordValue);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onBlur',
        defaultValues: { newpassword: '', confirmPassword: '' },
    });

    useEffect(() => {
        const storedEmail = reduxEmail || localStorage.getItem('resetEmail');

        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            router.push('/forgot-password');
        }
    }, [reduxEmail, router]);

    const mutation = useMutation<
        { message?: string },
        AxiosError<{ message?: string }>,
        ResetPasswordValues
    >({
        mutationFn: async (data) => {
            const response = await axios.post(
                'http://localhost:5000/api/auth/reset-password',
                {
                    email,
                    newpassword: data.newpassword,
                }
            );
            return response.data;
        },
        onSuccess: (data: { message?: string }) => {
            localStorage.removeItem('resetEmail');
            setSuccessMsg(data?.message || 'Password reset successfully! Redirecting to login...');

            setTimeout(() => {
                router.push('/login');
            }, 2500);
        },
    });

    const onSubmit = (data: ResetPasswordValues) => mutation.mutate(data);

    const inputClass = (hasError?: boolean) =>
        `w-full h-12 rounded-2xl border bg-white/90 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${hasError
            ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
            : 'border-slate-200/90 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
        }`;

    const CheckItem = ({ passed, label }: { passed: boolean; label: string }) => (
        <div className="flex items-center gap-2">
            <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${passed ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30' : 'bg-slate-100 text-slate-400'
                    }`}
            >
                <FiCheck size={11} />
            </div>
            <span className={`text-xs font-semibold transition-colors ${passed ? 'text-emerald-700' : 'text-slate-500'}`}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="relative min-h-screen w-full flex bg-[#FAFAFC] overflow-hidden font-sans">
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-100/40 blur-[150px] pointer-events-none" />

            <div className="relative z-10 flex w-full min-h-screen">
                <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 lg:p-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden border-r border-white/10">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/30 blur-[130px] pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/30 blur-[130px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/30">
                            <FiLayers size={22} />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-white">
                            StitchFlow
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative z-10 my-auto py-8 max-w-lg"
                    >
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6 text-white">
                            Reset Account Password
                        </h1>
                        <p className="text-base text-slate-300 leading-relaxed mb-10">
                            Set a new strong password to secure your manufacturing workspace.
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: 'Strong Encryption', desc: 'Secure bcrypt password hashing' },
                                { title: 'Complexity Validation', desc: 'Real-time password strength checking' },
                                { title: 'Session Safety', desc: 'Automatic single-use token invalidation' }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all duration-300"
                                >
                                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/40">
                                        <FiCheckCircle size={14} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                                        <p className="text-xs text-slate-300 mt-0.5">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative z-10 text-xs text-slate-400 font-medium">
                        © {new Date().getFullYear()} StitchFlow Inc. All rights reserved.
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative">
                    <div className="lg:hidden mb-8 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                            <FiLayers size={20} />
                        </div>
                        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                            StitchFlow
                        </span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_rgba(124,58,237,0.08)] transition-all duration-300"
                    >
                        {successMsg ? (
                            <div className="text-center py-4">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20">
                                    <FiCheckCircle size={36} />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Password Reset!
                                </h2>
                                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                    {successMsg}
                                </p>
                                <div className="mt-8">
                                    <Link
                                        href="/login"
                                        className="w-full h-12 rounded-2xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>Sign In Now</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                        Reset Password
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Create a new secure password for your account.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                                    {mutation.isError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-semibold text-rose-600 flex items-center gap-2"
                                        >
                                            <span>{mutation.error?.response?.data?.message ?? 'Something went wrong. Please try again.'}</span>
                                        </motion.div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2" htmlFor="rp-password">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                            <input
                                                id="rp-password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter new password"
                                                className={inputClass(!!errors.newpassword)}
                                                {...register('newpassword', {
                                                    onChange: (e) => setPasswordValue(e.target.value),
                                                })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                                            </button>
                                        </div>
                                        {errors.newpassword && (
                                            <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.newpassword.message}</p>
                                        )}
                                    </div>

                                    {passwordValue.length > 0 && (
                                        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-semibold">Password Strength:</span>
                                                <span className={`font-extrabold ${cfg.color}`}>{cfg.label}</span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                                <div className={`h-full rounded-full transition-all duration-300 ${cfg.width} ${cfg.barColor}`} />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                <CheckItem passed={hasMinLength} label="At least 8 characters" />
                                                <CheckItem passed={hasMix} label="Letters & numbers mix" />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2" htmlFor="rp-confirm">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                            <input
                                                id="rp-confirm"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm new password"
                                                className={inputClass(!!errors.confirmPassword)}
                                                {...register('confirmPassword')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                                aria-label="Toggle confirm password visibility"
                                            >
                                                {showConfirmPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    <button
                                        id="rp-submit"
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="w-full h-12 rounded-2xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                                <span>Updating Password…</span>
                                            </>
                                        ) : (
                                            <span>Reset Password</span>
                                        )}
                                    </button>

                                    <div className="text-center pt-2">
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-600 hover:text-purple-700 transition-colors"
                                        >
                                            <FiArrowLeft size={14} />
                                            <span>Back to Sign In</span>
                                        </Link>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
