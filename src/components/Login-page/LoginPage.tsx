'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authRequestFailed, otpRequired } from '@/store/slices/authSlice';
import { useLogin } from '@/hooks/auth-hooks';
import { LoginPageValues, LoginSchema } from '@/utils/authSchema';
import { saveOtpContext } from '@/services/save-local';
import { AxiosError } from 'axios';
import { ApiError } from '@/type/api';

export default function LoginPage() {
    const loginMutation = useLogin();

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.auth);
    const loading = status === 'loading';

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginPageValues>({
        resolver: zodResolver(LoginSchema),
        mode: 'onBlur',
        defaultValues: { email: '', password: '', remember: false },
    });

    const onSubmit = (data: LoginPageValues) => {

        loginMutation.mutate(data, {
            onSuccess: (response, variables) => {
                // LocalStorage
                saveOtpContext(variables.email, "login")
                //redux update
                dispatch(
                    otpRequired({
                        email: variables.email,
                        purpose: "login",
                    })
                );
                router.push("/otp");
            },
            onError: (error: AxiosError<ApiError>) => {
                dispatch(
                    authRequestFailed(
                        error.response?.data?.message ||
                        "Something went wrong."
                    )
                );
            },
        });
    };

    const inputClass = (hasError?: boolean) =>
        `w-full rounded-xl border bg-white py-2 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 ${hasError
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
        }`;

    return (

        <div className="flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#eef0fd] via-[#eef3fb] to-[#d7f3ec] px-4 py-2">
            <div className="flex max-h-full w-full max-w-[400px] flex-col justify-center overflow-y-auto">
                <div className="rounded-3xl bg-white p-5 shadow-xl shadow-slate-900/5">
                    <div className="mb-3 flex flex-col items-center text-center">
                        <div className="mb-1 flex items-center gap-1.5 text-lg font-extrabold text-blue-600">
                            <svg
                                className="h-5 w-5"
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
                        <h1 className="text-lg font-bold text-slate-900">Sign In</h1>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Technical Excellence in Garment Manufacturing
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {error && (
                            <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <label className="mb-1 block text-sm font-semibold text-slate-800" htmlFor="email">
                            Username or Email
                        </label>
                        <div className="mb-0.5 relative">
                            <svg
                                className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
                            </svg>
                            <input
                                id="email"
                                type="text"
                                placeholder="Enter your username"
                                className={inputClass(!!errors.email)}
                                {...register('email')}
                            />
                        </div>
                        <p className="mb-2 min-h-[16px] text-xs text-red-500">{errors.email?.message}</p>

                        <div className="mb-1 flex items-center justify-between">
                            <label className="block text-sm font-semibold text-slate-800" htmlFor="password">
                                Password
                            </label>
                            <Link href="/forgot-password"
                                className="shrink-0 whitespace-nowrap text-xs font-semibold !text-blue-600"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <div className="mb-0.5 relative">
                            <svg
                                className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
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
                                placeholder="Enter your password"
                                className={inputClass(!!errors.password).replace('pr-4', 'pr-11')}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                aria-label="Toggle password visibility"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
                                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        </div>
                        <p className="mb-2 min-h-[16px] text-xs text-red-500">{errors.password?.message}</p>

                        <label className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                                {...register('remember')}
                            />
                            Remember me
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mb-4 flex h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white disabled:opacity-60"
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>

                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs font-semibold tracking-wide text-slate-400">
                                OR SIGN IN WITH
                            </span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <button
                            type="button"
                            className="flex h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-800"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5">
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

                <p className="mt-6 text-center text-sm font-semibold text-blue-600">
                    StitchFlow
                </p>
                <p className="mt-1 text-center text-xs text-slate-500">
                    © 2026 StitchFlow AI. Technical Excellence in Garment Manufacturing.
                </p>
                <p className="mt-3 text-center text-sm text-slate-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-semibold text-blue-600">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}