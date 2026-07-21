'use client';

import Link from 'next/link';

export default function PasswordUpdatedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#eaf7f1] via-[#eef3fb] to-[#eef0fc] px-4 py-8">
            <div className="flex w-full max-w-[480px] flex-col">
                {/* Brand header */}
                <div className="mb-6 flex flex-col items-center gap-1">
                    <span className="text-xl font-extrabold text-blue-600">🧵 StitchFlow AI</span>
                </div>

                {/* Card */}
                <div className="rounded-2xl bg-white p-10 shadow-xl shadow-slate-900/5 text-center">
                    {/* Success icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-200">
                            <svg
                                className="h-8 w-8 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="mb-2 text-xl font-bold text-slate-900">
                        Password Updated Successfully
                    </h1>
                    <p className="mb-8 text-sm text-slate-500 leading-relaxed">
                        Your account security has been updated. You can now sign in with your new credentials.
                    </p>

                    {/* Back to Sign In button */}
                    <Link
                        id="pu-signin"
                        href="/signin"
                        className="mb-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
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
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                        </svg>
                        Back to Sign In
                    </Link>

                    {/* Security badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
                        <svg
                            className="h-3.5 w-3.5 text-green-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
                        </svg>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-green-700">
                            Enhanced Security Active
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    © 2026 StitchFlow AI. Technical Excellence in Garment Manufacturing.
                </p>
            </div>
        </div>
    );
}
