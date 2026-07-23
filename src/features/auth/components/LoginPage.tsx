'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiLayers } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authRequestFailed, otpRequired } from '../store/authSlice';
import { useLogin } from '../hooks/auth-hooks';
import { LoginPageValues, LoginSchema } from '../validations/authSchema';
import { saveOtpContext } from '@/shared/utils/save-local';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api';

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
                saveOtpContext(variables.email, "login");
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
        `w-full h-12 rounded-2xl border bg-white/90 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${hasError
            ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
            : 'border-slate-200/90 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
        }`;

    return (
        <div className="relative min-h-screen w-full flex bg-[#FAFAFC] overflow-hidden font-sans">
            {/* Ambient Background Radial Blur Blobs */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-100/40 blur-[150px] pointer-events-none" />

            <div className="relative z-10 flex w-full min-h-screen">
                {/* LEFT SIDE (45%) - Branding & Features */}
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
                            Welcome Back to StitchFlow
                        </h1>
                        <p className="text-base text-slate-300 leading-relaxed mb-10">
                            Manage your workforce, production, inventory and operations from one intelligent platform.
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: 'Employee Management', desc: 'Real-time shift rosters & attendance tracking' },
                                { title: 'Production Tracking', desc: 'Live assembly line throughput analytics' },
                                { title: 'AI Insights', desc: 'Automated bottleneck detection & optimization' }
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

                {/* RIGHT SIDE (55%) - Glass Card */}
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
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Sign In
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Continue to your workspace.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-semibold text-rose-600 flex items-center gap-2"
                                >
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2" htmlFor="email">
                                    Username or Email
                                </label>
                                <div className="relative">
                                    <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                    <input
                                        id="email"
                                        type="text"
                                        placeholder="Enter your username or email"
                                        className={inputClass(!!errors.email)}
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700" htmlFor="password">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className={inputClass(!!errors.password).replace('pr-4', 'pr-12')}
                                        {...register('password')}
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
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded-md border-slate-300 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                                        {...register('remember')}
                                    />
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-2xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                        <span>Signing in…</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>

                            <div className="relative my-6 flex items-center justify-center">
                                <div className="w-full border-t border-slate-200/80" />
                                <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                    OR
                                </span>
                            </div>

                            <button
                                type="button"
                                className="w-full h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-3 shadow-sm cursor-pointer"
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
                                <span>Continue with Google</span>
                            </button>
                        </form>

                        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="font-extrabold text-purple-600 hover:text-purple-700 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
