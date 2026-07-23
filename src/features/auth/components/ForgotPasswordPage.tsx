'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../validations/authSchema';
import { useAppDispatch } from '@/store/hooks';
import { otpRequired, setResetEmail } from '../store/authSlice';
import { saveOtpContext } from '@/shared/utils/save-local';
import { FiMail, FiLayers, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

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
            saveOtpContext(variables.email, 'forgot-password');
            dispatch(
                otpRequired({
                    email: variables.email,
                    purpose: 'forgot-password',
                })
            );
            dispatch(setResetEmail(variables.email));
            localStorage.setItem('resetEmail', variables.email);
            router.push('/otp');
        },
    });

    const onSubmit = (data: ForgotPasswordValues) => mutation.mutate(data);

    const inputClass = (hasError?: boolean) =>
        `w-full h-12 rounded-2xl border bg-white/90 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${hasError
            ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
            : 'border-slate-200/90 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
        }`;

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
                            Account Recovery & Security
                        </h1>
                        <p className="text-base text-slate-300 leading-relaxed mb-10">
                            Safely regain access to your enterprise manufacturing workstation with 2FA verification.
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: 'Gmail OTP Verification', desc: 'Secure 6-digit one-time passcode verification' },
                                { title: 'Encrypted Credential Reset', desc: 'End-to-end encrypted password update' },
                                { title: 'Enterprise Access Control', desc: 'Protected workforce access recovery' }
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
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Forgot Password?
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Enter your email address to receive an OTP verification code.
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
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2" htmlFor="fp-email">
                                    Username or Email
                                </label>
                                <div className="relative">
                                    <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                    <input
                                        id="fp-email"
                                        type="email"
                                        placeholder="Enter your registered email"
                                        className={inputClass(!!errors.email)}
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            <button
                                id="fp-submit"
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full h-12 rounded-2xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                        <span>Sending OTP…</span>
                                    </>
                                ) : (
                                    <span>Continue</span>
                                )}
                            </button>

                            <div className="relative my-6 flex items-center justify-center">
                                <div className="w-full border-t border-slate-200/80" />
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    <FiArrowLeft size={14} />
                                    <span>Back to Sign In</span>
                                </Link>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
