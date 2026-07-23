'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setAuthIntent } from '@/store/slices/appSlice';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignIn = () => {
        dispatch(setAuthIntent('signin'));
        router.push('/login');
    };

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Solutions', href: '#solutions' },
        { name: 'Industries', href: '#industries' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' }
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
                    isScrolled
                        ? 'border-b border-black/[0.05] bg-white/75 backdrop-blur-md py-4 shadow-[0_2px_20px_rgba(0,0,0,0.02)]'
                        : 'bg-transparent py-6'
                }`}
            >
                <div className="mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary p-[1.5px] shadow-sm">
                            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900">
                                <svg
                                    className="h-4.5 w-4.5 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.2}
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            StitchFlow
                        </span>
                    </div>

                    {/* Center: Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-250"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="hidden md:flex items-center">
                        <button
                            onClick={handleSignIn}
                            className="relative overflow-hidden rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-slate-805 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-700 hover:text-slate-900 transition-colors p-2"
                        >
                            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-[68px] z-40 md:hidden border-b border-black/[0.06] bg-white/95 backdrop-blur-lg px-6 py-8 shadow-lg"
                    >
                        <div className="flex flex-col gap-6 items-center">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors duration-200"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleSignIn();
                                }}
                                className="w-full max-w-[220px] rounded-xl bg-slate-900 py-2.5 text-center text-sm font-bold text-white shadow-sm"
                            >
                                Sign In
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
