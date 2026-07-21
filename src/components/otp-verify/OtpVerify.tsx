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
import axios, { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signInSucceeded, authRequestFailed } from '@/store/slices/authSlice';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

interface VerifyResponse {
    message: string;
    token: string;
    user: { fullName: string; email: string; companyName?: string };
}

export default function OtpVerify() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Read email and purpose that the login/register step stored in Redux
    const { pendingEmail, otpPurpose } = useAppSelector((state) => state.auth);

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const expired = secondsLeft <= 0;

    // Countdown timer
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    // Focus first box on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);


    // Guard: if there is no pending email (e.g. direct navigation), go back to signin
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
            await axios.post('http://localhost:5000/api/auth/resend-otp', {
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
            setFormError('Code expired. Please resend a new code.');
            return;
        }

        const code = otp.join('');
        if (code.length !== OTP_LENGTH) {
            setFormError('Please enter the complete 6-digit code.');
            return;
        }

        if (!pendingEmail) {
            setFormError('Session expired. Please sign in again.');
            console.log("Redirecting...");

            router.replace('/');
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
            console.log("OTP Verified:", data);

            console.log("1");

            dispatch(
                signInSucceeded({
                    fullName: data.user.fullName,
                    email: data.user.email,
                    companyName: data.user.companyName,
                })
            );
            console.log("2");
            setIsVerified(true);
            router.push('/dashboard');
            console.log("3");

        } catch (err) {
            const axErr = err as AxiosError<{ message?: string }>;
            const msg = axErr.response?.data?.message ?? 'Invalid code. Please try again.';
            setFormError(msg);
            dispatch(authRequestFailed(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#eef0fd] via-[#eef3fb] to-[#d7f3ec] px-4 py-2">
            <div className="flex max-h-full w-full max-w-[420px] flex-col justify-center overflow-y-auto">
                <div className="mb-3 flex items-center justify-center gap-1.5 text-lg font-extrabold text-blue-600">
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
                    StitchFlow AI
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/5">
                    <div className="mb-4 text-center">
                        <h1 className="text-xl font-bold text-slate-900">Verify Identity</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            We&apos;ve sent a 6-digit verification code to{' '}
                            {pendingEmail ? (
                                <span className="font-semibold text-slate-700">{pendingEmail}</span>
                            ) : (
                                'your email'
                            )}
                            .
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {formError && (
                            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-center text-sm text-red-600">
                                {formError}
                            </div>
                        )}

                        <div className="mb-4 flex items-center justify-center gap-2">
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
                                    className="h-12 w-12 rounded-xl border border-slate-200 bg-white text-center text-lg font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-300"
                                />
                            ))}
                        </div>

                        <div className="mb-4 flex justify-center">
                            <span
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${expired
                                    ? 'bg-red-50 text-red-500'
                                    : 'bg-blue-50 text-blue-600'
                                    }`}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    className="h-3.5 w-3.5"
                                >
                                    <circle cx="12" cy="13" r="8" />
                                    <path d="M12 9v4l3 2" />
                                    <path d="M9 2h6" />
                                </svg>
                                {expired ? 'Code Expired' : formatTime(secondsLeft)}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || expired}
                            className="mb-3 flex h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-bold tracking-wide text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
                        >
                            {loading ? 'VERIFYING…' : 'VERIFY OTP'}
                        </button>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={!expired || resending}
                            className="flex h-[48px] w-full items-center justify-center rounded-xl border border-blue-200 bg-white text-sm font-bold tracking-wide text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                        >
                            {resending ? 'RESENDING…' : 'RESEND OTP'}
                        </button>

                        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4 text-left">
                            <svg
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 8h.01" />
                                <path d="M11 12h1v4h1" />
                            </svg>
                            <p className="text-xs text-slate-500">
                                Security Notice: StitchFlow AI requires multi-factor authentication for all
                                manufacturing terminal access.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}