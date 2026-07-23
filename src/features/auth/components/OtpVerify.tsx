'use client';

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
    type ClipboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signInSucceeded, authRequestFailed, setResetEmail } from '../store/authSlice';
import api from '@/config/axios';
import { FiLayers, FiClock, FiRefreshCw, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

interface VerifyResponse {
    message: string;
    token?: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
        role: "employee" | "admin" | "manager";
        companyName?: string;
        isVerified: boolean;
        isBlock: boolean;
    };
}

export default function OtpVerify() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { pendingEmail, otpPurpose } = useAppSelector((state) => state.auth);

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const expired = secondsLeft <= 0;

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (!pendingEmail && !isVerified) {
            router.replace("/login");
        }
    }, [pendingEmail, isVerified, router]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        setFormError(null);
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill('');
        pasted.split('').forEach((char, i) => {
            next[i] = char;
        });
        setOtp(next);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleResend = async () => {
        if (!pendingEmail) return;
        setResending(true);
        setFormError(null);
        try {
            await api.post('/api/auth/resend-otp', {
                email: pendingEmail,
                purpose: otpPurpose ?? 'registration',
            });
            setOtp(Array(OTP_LENGTH).fill(''));
            setSecondsLeft(RESEND_SECONDS);
            setFormError(null);
            inputRefs.current[0]?.focus();
        } catch (err) {
            const axErr = err as AxiosError<{ message?: string }>;
            setFormError(axErr.response?.data?.message ?? 'Failed to resend code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (expired) {
            setFormError('Code expired. Please request a new OTP code.');
            return;
        }

        const code = otp.join('');
        if (code.length !== OTP_LENGTH) {
            setFormError('Please enter the complete 6-digit verification code.');
            return;
        }

        if (!pendingEmail) {
            setFormError('Session expired. Please sign in again.');
            router.replace('/login');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post<VerifyResponse>(
                'http://localhost:5000/api/auth/verify-otp',
                {
                    email: pendingEmail,
                    code,
                    purpose: otpPurpose ?? 'registration',
                }
            );

            setIsVerified(true);

            if (otpPurpose === 'forgot-password') {
                dispatch(setResetEmail(pendingEmail));
                localStorage.setItem('resetEmail', pendingEmail);
                router.push('/reset-password');
            } else if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));

                dispatch(
                    signInSucceeded({
                        id: data.user.id,
                        fullName: data.user.fullName,
                        email: data.user.email,
                        role: data.user.role,
                        companyName: data.user.companyName,
                        isVerified: data.user.isVerified,
                        isBlock: data.user.isBlock,
                    })
                );
                router.push('/dashboard');
            } else {
                router.push('/login');
            }

        } catch (err) {
            const axErr = err as AxiosError<{ message?: string }>;
            const msg = axErr.response?.data?.message ?? 'Invalid OTP code. Please try again.';
            setFormError(msg);
            dispatch(authRequestFailed(msg));
        } finally {
            setLoading(false);
        }
    };

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
                            OTP Security Verification
                        </h1>
                        <p className="text-base text-slate-300 leading-relaxed mb-10">
                            Enter the 6-digit passcode sent to your email to verify your identity.
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: 'Gmail Verification Code', desc: 'Sent directly to your registered inbox' },
                                { title: 'Time-Limited Expiry', desc: 'Codes auto-expire for workstation safety' },
                                { title: 'Instant Processing', desc: 'Immediate identity verification & access' }
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
                        <div className="mb-6 text-center">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Verify OTP
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Enter the 6-digit code sent to{' '}
                                {pendingEmail ? (
                                    <span className="font-bold text-slate-800">{pendingEmail}</span>
                                ) : (
                                    'your email'
                                )}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {formError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-semibold text-rose-600 flex items-center gap-2"
                                >
                                    <span>{formError}</span>
                                </motion.div>
                            )}

                            <div className="flex items-center justify-between gap-2 py-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        disabled={expired || loading}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        aria-label={`OTP digit ${index + 1}`}
                                        className="h-13 w-13 rounded-2xl border border-slate-200/90 bg-white/90 text-center font-mono text-xl font-extrabold text-slate-900 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-100 disabled:text-slate-400"
                                    />
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${expired
                                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                        : 'bg-purple-50 text-purple-600 border border-purple-200'
                                        }`}
                                >
                                    <FiClock size={14} />
                                    {expired ? 'Code Expired' : formatTime(secondsLeft)}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || expired}
                                className="w-full h-12 rounded-2xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                        <span>Verifying…</span>
                                    </>
                                ) : (
                                    <span>Verify OTP</span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={!expired || resending}
                                className="w-full h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-40"
                            >
                                <FiRefreshCw size={15} className={resending ? 'animate-spin' : ''} />
                                <span>{resending ? 'Resending…' : 'Resend OTP'}</span>
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
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
