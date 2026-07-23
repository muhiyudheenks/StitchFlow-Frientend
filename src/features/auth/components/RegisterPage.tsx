'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authRequestFailed, otpRequired } from '../store/authSlice';
import { registerSchema, type RegisterPageValues } from '../validations/authSchema';
import { useRegister } from '../hooks/auth-hooks';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api';

export default function RegisterPage() {
    const registerMutation = useRegister();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { error: reduxError } = useAppSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterPageValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false,
        },
    });

    const onSubmit = (data: RegisterPageValues) => {
        registerMutation.mutate(data, {
            onSuccess: (_, variables) => {
                dispatch(
                    otpRequired({
                        email: variables.email,
                        purpose: "registration",
                    })
                );

                router.push("/otp");
            },

            onError: (error: AxiosError<ApiError>) => {
                dispatch(
                    authRequestFailed(
                        error.response?.data?.message ??
                        "Something went wrong."
                    )
                );
            },
        });
    };

    const inputClass = (hasError?: boolean) =>
        `w-full rounded-lg border bg-white py-1.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 ${hasError
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
        }`;

    return (
        <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#eef0fd] via-[#eef3fb] to-[#d7f3ec] px-3 py-2">
            <div className="flex h-full max-h-[700px] w-full max-w-[380px] flex-col justify-center">
                <div className="rounded-2xl bg-white p-4 shadow-xl shadow-slate-900/5">
                    <div className="mb-2 flex flex-col items-center text-center">
                        <div className="mb-0.5 flex items-center gap-1.5 text-base font-extrabold text-blue-600">
                            <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <rect x="6" y="9" width="12" height="10" rx="2" />
                                <circle cx="9.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
                                <circle cx="14.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
                                <line x1="12" y1="9" x2="12" y2="5" />
                                <circle cx="12" cy="3.5" r="1.5" />
                                <path d="M6 12 L2 10" />
                                <path d="M18 12 L22 10" />
                            </svg>
                            StitchFlow
                        </div>
                        <h1 className="text-base font-bold text-slate-900">Create Account</h1>
                        <p className="text-[10px] text-slate-500">
                            Technical Excellence in Garment Manufacturing
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {(registerMutation.isError || reduxError) && (
                            <div className="mb-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-600">
                                {registerMutation.isError
                                    ? registerMutation.error?.response?.data?.message || 'Something went wrong. Please try again.'
                                    : reduxError}
                            </div>
                        )}

                        <label className="mb-0.5 block text-xs font-semibold text-slate-800" htmlFor="fullName">
                            Full Name
                        </label>
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
                            </svg>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                className={inputClass(!!errors.fullName)}
                                {...register('fullName')}
                            />
                        </div>
                        <p className="min-h-[14px] text-[11px] text-red-500">{errors.fullName?.message}</p>

                        <label className="mb-0.5 block text-xs font-semibold text-slate-800" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <rect x="4" y="6" width="16" height="12" rx="2" />
                                <path d="M4 7l8 6 8-6" />
                            </svg>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                className={inputClass(!!errors.email)}
                                {...register('email')}
                            />
                        </div>
                        <p className="min-h-[14px] text-[11px] text-red-500">{errors.email?.message}</p>

                        <label className="mb-0.5 block text-xs font-semibold text-slate-800" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <rect x="5" y="11" width="14" height="9" rx="2" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                            </svg>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                className={inputClass(!!errors.password).replace('pr-3', 'pr-10')}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                        <line x1="2" y1="2" x2="22" y2="22" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="min-h-[14px] text-[11px] text-red-500">{errors.password?.message}</p>

                        <label className="mb-0.5 block text-xs font-semibold text-slate-800" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <rect x="5" y="11" width="14" height="9" rx="2" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                            </svg>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Re-enter your password"
                                className={inputClass(!!errors.confirmPassword).replace('pr-3', 'pr-10')}
                                {...register('confirmPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                        <line x1="2" y1="2" x2="22" y2="22" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="mb-1 min-h-[14px] text-[11px] text-red-500">{errors.confirmPassword?.message}</p>

                        <label className="mb-1.5 flex items-start gap-2 text-[11px] text-slate-600">
                            <input
                                type="checkbox"
                                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 accent-blue-600"
                                {...register('agreeTerms')}
                            />
                            <span>
                                I agree to the{' '}
                                <Link href="/terms" className="font-semibold text-blue-600">
                                    Terms &amp; Conditions
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="font-semibold text-blue-600">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                        <p className="min-h-[12px] text-[11px] text-red-500">{errors.agreeTerms?.message}</p>

                        <button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="mb-2 mt-1 flex h-[38px] w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {registerMutation.isPending ? 'Creating account…' : 'Create Account'}
                        </button>

                        <div className="mb-2 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-[10px] font-semibold tracking-wide text-slate-400">
                                OR SIGN UP WITH
                            </span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <button
                            type="button"
                            className="flex h-[38px] w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </form>
                </div>

                <p className="mt-1.5 text-center text-[11px] font-semibold text-blue-600">
                    StitchFlow
                </p>
                <p className="text-center text-[9px] text-slate-500">
                    © 2026 StitchFlow AI. Technical Excellence in Garment Manufacturing.
                </p>
                <p className="mt-0.5 text-center text-[11px] text-slate-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-blue-600">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
