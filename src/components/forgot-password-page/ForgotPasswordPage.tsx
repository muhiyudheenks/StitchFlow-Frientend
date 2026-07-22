'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/utils/authSchema';
import { useAppDispatch } from '@/store/hooks';
import { setResetEmail } from '@/store/slices/authSlice';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onBlur',
        defaultValues: { email: '' },
    });

    const mutation = useMutation<
        unknown,
        AxiosError<{ message?: string }>,
        ForgotPasswordValues
    >({
        mutationFn: async (data) => {
            const response = await axios.post(
                'http://localhost:5000/api/auth/forgot-password',
                { email: data.email }
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            dispatch(setResetEmail(variables.email));
            localStorage.setItem('resetEmail', variables.email);
            router.push('/reset-password');
        },
    });

    const onSubmit = (data: ForgotPasswordValues) => mutation.mutate(data);

    const inputClass = (hasError?: boolean) =>
        `w-full rounded-xl border bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 transition-colors ${hasError
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
        }`;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#eaf7f1] via-[#eef3fb] to-[#eef0fc] px-4 py-8">
            <div className="flex w-full max-w-[480px] flex-col">
                {/* Brand header */}
                <div className="mb-6 flex flex-col items-center gap-1">
                    <span className="text-xl font-extrabold text-blue-600">🧵 StitchFlow AI</span>
                </div>

                {/* Card */}
                <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-900/5">
                    {/* Icon */}
                    <div className="mb-5 flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
                            <svg
                                className="h-7 w-7 text-blue-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="5" y="11" width="14" height="10" rx="2" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                                <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
                            </svg>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-6 text-center">
                        <h1 className="text-xl font-bold text-slate-900">Forgot Password?</h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* API error */}
                        {mutation.isError && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {mutation.error?.response?.data?.message ?? 'Something went wrong. Please try again.'}
                            </div>
                        )}

                        {/* Email field */}
                        <label
                            className="mb-1.5 block text-sm font-semibold text-slate-800"
                            htmlFor="fp-email"
                        >
                            Email Address
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
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m2 7 10 7 10-7" />
                            </svg>
                            <input
                                id="fp-email"
                                type="email"
                                placeholder="name@company.com"
                                className={inputClass(!!errors.email)}
                                {...register('email')}
                            />
                        </div>
                        <p className="mb-5 min-h-[16px] text-xs text-red-500">
                            {errors.email?.message}
                        </p>

                        {/* Submit button */}
                        <button
                            id="fp-submit"
                            type="submit"
                            disabled={mutation.isPending}
                            className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                        >
                            {mutation.isPending ? (
                                'Sending…'
                            ) : (
                                <>
                                    Send Reset Link
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Back to login */}
                        <div className="mb-5 flex justify-center">
                            <Link
                                href="/signin"
                                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
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

                        {/* Security tip */}
                        <div className="flex items-start gap-3 rounded-xl bg-indigo-50 px-4 py-3">
                            <svg
                                className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                            <p className="text-xs text-indigo-700">
                                <span className="font-semibold">Security Tip:</span> Links expire after 60 minutes for your protection.
                            </p>
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
