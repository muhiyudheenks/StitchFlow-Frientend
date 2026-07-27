'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';

interface ThemeToggleProps {
    className?: string;
    size?: number;
}

export default function ThemeToggle({ className, size = 17 }: ThemeToggleProps) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={
                className ||
                "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all shadow-2xs cursor-pointer"
            }
            aria-label="Toggle Theme"
            title={mounted ? `Switch to ${isDark ? 'Light' : 'Dark'} Mode` : 'Toggle Theme'}
        >
            {!mounted ? (
                <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-transparent animate-spin" />
            ) : isDark ? (
                <FiSun size={size} className="text-amber-500 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
                <FiMoon size={size} className="text-slate-600 dark:text-slate-300 transition-transform duration-200 -rotate-12 hover:rotate-0" />
            )}
        </button>
    );
}
