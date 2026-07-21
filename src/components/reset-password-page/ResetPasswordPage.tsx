'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { resetPasswordSchema, type ResetPasswordValues } from '@/utils/authSchema';

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
    weak:   { label: 'Weak',   color: 'text-red-500',    width: 'w-1/4',  barColor: 'bg-red-400' },
    fair:   { label: 'Fair',   color: 'text-orange-500', width: 'w-2/4',  barColor: 'bg-orange-400' },
    good:   { label: 'Good',   color: 'text-blue-500',   width: 'w-3/4',  barColor: 'bg-blue-400' },
    strong: { label: 'Strong', color: 'text-green-500',  width: 'w-full', barColor: 'bg-green-500' },
};

export default function ResetPasswordPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

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
        defaultValues: { password: '', confirmPassword: '' },
    });

    const mutation = useMutation<
        unknown,
        AxiosError<{ message?: string }>,
        ResetPasswordValues
    >({
        mutationFn: async (data) => {
            const response = await axios.post(
                'http://localhost:5000/api/auth/reset-password',
                { password: data.password }
            );
            return response.data;
        },
        onSuccess: () => {
            router.push('/password-updated');
        },
    });

    const onSubmit = (data: ResetPasswordValues) => mutation.mutate(data);

    const inputClass = (hasError?: boolean) =>
        `w-full rounded-xl border bg-white py-2.5 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 transition-colors ${
            hasError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
        }`;

    const EyeIcon = ({ show }: { show: boolean }) =>
        show ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
        ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        );

    const CheckItem = ({ passed, label }: { passed: boolean; label: string }) => (
        <div className="flex items-center gap-1.5">
            <svg
                className={`h-3.5 w-3.5 transition-colors ${passed ? 'text-green-500' : 'text-slate-300'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className={`text-xs transition-colors ${passed ? 'text-green-600' : 'text-slate-400'}`}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#eaf7f1] via-[#eef3fb] to-[#eef0fc] px-4 py-8">
            <div className="flex w-full max-w-[480px] flex-col">
                {/* Brand header */}
                <div className="mb-6 flex flex-col items-center gap-1">
                    <span className="text-xl font-extrabold text-blue-600">🧵 StitchFlow AI</span>
                </div>

                {/* Card */}
                <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-900/5">
                    {/* Heading */}
                    <div className="mb-6 text-center">
                        <h1 className="text-xl font-bold text-slate-900">Reset Password</h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Choose a strong password to protect your manufacturing data.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* API error */}
                        {mutation.isError && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {mutation.error?.response?.data?.message ?? 'Something went wrong. Please try again.'}
                            </div>
                        )}

                        {/* New password field */}
                        <label
                            className="mb-1.5 block text-sm font-semibold text-slate-800"
                            htmlFor="rp-password"
                        >
                            New Password
                        </label>
                        <div className="relative mb-0.5">
                            <svg
                                className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="5" y="11" width="14" height="9" rx="2" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                            </svg>
                            <input
                                id="rp-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a strong password"
                                className={inputClass(!!errors.password)}
                                {...register('password', {
                                    onChange: (e) => setPasswordValue(e.target.value),
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                aria-label="Toggle password visibility"
                            >
                                <EyeIcon show={showPassword} />
                            </button>
                        </div>
                        <p className="mb-2 min-h-[16px] text-xs text-red-500">{errors.password?.message}</p>

                        {/* Strength meter */}
                        {passwordValue.length > 0 && (
                            <div className="mb-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Strength:</span>
                                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${cfg.width} ${cfg.barColor}`}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <CheckItem passed={hasMinLength} label="At least 8 characters" />
                                    <CheckItem passed={hasMix} label="Mix of letters and numbers" />
                                </div>
                            </div>
                        )}

                        {/* Confirm password field */}
                        <label
                            className="mb-1.5 block text-sm font-semibold text-slate-800"
                            htmlFor="rp-confirm"
                        >
                            Confirm Password
                        </label>
                        <div className="relative mb-0.5">
                            <svg
                                className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="5" y="11" width="14" height="9" rx="2" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                            </svg>
                            <input
                                id="rp-confirm"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Repeat your password"
                                className={inputClass(!!errors.confirmPassword)}
                                {...register('confirmPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                aria-label="Toggle confirm password visibility"
                            >
                                <EyeIcon show={showConfirmPassword} />
                            </button>
                        </div>
                        <p className="mb-5 min-h-[16px] text-xs text-red-500">{errors.confirmPassword?.message}</p>

                        {/* Submit button */}
                        <button
                            id="rp-submit"
                            type="submit"
                            disabled={mutation.isPending}
                            className="mb-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                        >
                            {mutation.isPending ? (
                                'Updating…'
                            ) : (
                                <>
                                    Update Password
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="mb-4 h-px bg-slate-100" />

                        {/* Back to login */}
                        <div className="flex justify-center">
                            <Link
                                href="/signin"
                                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    © 2026 StitchFlow AI. Technical Excellence in Garment Manufacturing.
                </p>
            </div>
        </div>
    );
}
