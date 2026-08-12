'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = useAppSelector((state) => state.auth.user);
    const pathname = usePathname();
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Wait until pathname is available
        if (!pathname) return;

        const parts = pathname.split('/').filter(Boolean); // ['dashboard', 'manager', ...]
        const roleSegment = parts[1];

        // If user not in redux yet, check localStorage to avoid premature redirect
        const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

        // If there is no stored user and no redux user, redirect to login
        if (!user && !stored) {
            router.replace('/login');
            return;
        }

        // If redux user not loaded yet but localStorage exists, wait for AuthInitializer to populate it
        if (!user && stored) {
            // give some time for AuthInitializer to populate store
            const t = setTimeout(() => setReady(true), 200);
            return () => clearTimeout(t);
        }

        // If no explicit role segment (e.g. /dashboard), allow the page (it will redirect based on user role)
        if (!roleSegment) {
            setReady(true);
            return;
        }

        // Enforce strict role-to-route mapping for known dashboard roles
        const DASHBOARD_ROLES = ['employee', 'manager', 'admin'];
        if (DASHBOARD_ROLES.includes(roleSegment)) {
            if (user && user.role !== roleSegment) {
                // Redirect to user's own dashboard if they try to access a different role's area
                router.replace(`/dashboard/${user.role}`);
                return;
            }
        }

        setReady(true);
    }, [pathname, user, router]);

    if (!ready) return <div />;

    return <>{children}</>;
}
