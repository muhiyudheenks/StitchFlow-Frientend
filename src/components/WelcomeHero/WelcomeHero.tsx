'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuthIntent } from '@/store/slices/appSlice';

export default function WelcomeHero() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { edition, stats } = useAppSelector((state) => state.app);

    const handleSignIn = () => {
        dispatch(setAuthIntent('signin'));
        router.push('/signin');
    };

    const handleCreateAccount = () => {
        dispatch(setAuthIntent('create-account'));
        router.push('/register');
    };

    return (
        <>
            <nav className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-7 md:px-14">
                <div className="flex items-center gap-3 text-xl font-bold md:text-[22px]">
                    <svg
                        className="h-7 w-7 text-skyText"
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
                <div className="flex items-center gap-9">
                    <a href="#product" className="hidden text-[15px] font-medium text-slate-200 md:inline">
                        Product
                    </a>
                    <a href="#pricing" className="hidden text-[15px] font-medium text-slate-200 md:inline">
                        Pricing
                    </a>
                    <a href="#about" className="hidden text-[15px] font-medium text-slate-200 md:inline">
                        About
                    </a>
                    <button
                        onClick={handleSignIn}
                        className="rounded-[10px] bg-accent px-[22px] py-[11px] text-sm font-bold text-white"
                    >
                        Sign in
                    </button>
                </div>
            </nav>

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1701328778019-e95dedbf5346?fm=jpg&q=80&w=1800&auto=format&fit=crop"
                        alt="Garment factory floor"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-[center_35%] saturate-[0.9] brightness-[0.85]"
                    />
                </div>
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#030a14]/55 via-[#030a14]/50 to-[#02070e]/95" />

                <div className="relative z-20 flex max-w-3xl flex-col items-center px-6 text-center">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-300/40 bg-blue-900/35 px-[18px] py-2 text-xs font-semibold tracking-[1.5px] text-sky-100">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        {edition.toUpperCase()}
                    </div>

                    <h1 className="mb-6 text-4xl font-extrabold leading-[1.12] tracking-tight md:text-6xl">
                        Welcome to StitchFlow
                    </h1>

                    <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-200">
                        The next generation of garment manufacturing. Empower your factory
                        floor with data-driven workflows, real-time analytics, and
                        automated supply chain orchestration.
                    </p>

                    <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                        <button
                            onClick={handleSignIn}
                            className="flex h-[54px] items-center justify-center gap-2.5 rounded-xl bg-accent px-8 text-base font-bold text-white"
                        >
                            Sign in
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-[18px] w-[18px]">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </button>
                        <button
                            onClick={handleCreateAccount}
                            className="flex h-[54px] items-center justify-center gap-2.5 rounded-xl border border-white/35 bg-white/[0.08] px-8 text-base font-bold text-white"
                        >
                            Create account
                        </button>
                    </div>

                    <div className="mt-[72px] flex flex-wrap justify-center gap-12 border-t border-white/15 pt-8">
                        {stats.map((stat) => (
                            <div className="text-center" key={stat.label}>
                                <div className="text-[28px] font-extrabold text-accentLight">{stat.value}</div>
                                <div className="mt-1 text-[13px] text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="flex flex-col items-center gap-3 bg-panel px-6 py-6 text-center md:flex-row md:justify-between md:px-14 md:text-left">
                <p className="text-[13px] text-slate-400">
                    © 2026 StitchFlow. Technical excellence in garment manufacturing.
                </p>
                <div className="flex gap-8 text-[13px] font-medium text-slate-300">
                    <a href="#privacy">Privacy policy</a>
                    <a href="#terms">Terms of service</a>
                    <a href="#help">Help center</a>
                </div>
            </footer>
        </>
    );
}