'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewTab from './OverviewTab';
import ProfileTab from './ProfileTab';
import TasksTab from './TasksTab';
import NotificationsTab from './NotificationsTab';
import SupportTab from './SupportTab';
import { EmployeeTab } from '../types';
import { EmployeeAttendanceTab } from '@/features/attendance';
import { EmployeeProductionTab } from '@/features/production';

// ProfileSubTab: which section inside the Profile page to show
export type ProfileSubTab = 'overview' | 'performance' | 'salary';

interface EmployeeDashboardProps {
    initialTab?: EmployeeTab;
}

export default function EmployeeDashboard({ initialTab = 'dashboard' }: EmployeeDashboardProps) {
    const router = useRouter();

    // Map 'performance' and 'salary' tabs into the profile page with the correct sub-tab
    const resolveTab = (tab: EmployeeTab | string): { tab: EmployeeTab; profileSubTab: ProfileSubTab } => {
        if (tab === 'performance') return { tab: 'profile', profileSubTab: 'performance' };
        if (tab === 'salary')      return { tab: 'profile', profileSubTab: 'salary' };
        if (tab === 'leave')       return { tab: 'attendance', profileSubTab: 'overview' };
        return { tab: tab as EmployeeTab, profileSubTab: 'overview' };
    };

    const initial = resolveTab(initialTab);
    const [activeTab, setActiveTabState] = useState<EmployeeTab>(initial.tab);
    const [profileSubTab, setProfileSubTab] = useState<ProfileSubTab>(initial.profileSubTab);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const resolved = resolveTab(initialTab);
        setActiveTabState(resolved.tab);
        setProfileSubTab(resolved.profileSubTab);

        // Canonicalize URL: redirect /performance and /salary to /profile
        if (initialTab === 'performance' || initialTab === 'salary' || (initialTab as string) === 'leave') {
            const canonicalRoute = resolved.tab === 'dashboard'
                ? '/dashboard/employee'
                : `/dashboard/employee/${resolved.tab}`;
            router.replace(canonicalRoute, { scroll: false });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialTab]);

    const setActiveTab = (tab: EmployeeTab) => {
        const resolved = resolveTab(tab);
        setActiveTabState(resolved.tab);
        setProfileSubTab(resolved.profileSubTab);
        const targetRoute = resolved.tab === 'dashboard'
            ? '/dashboard/employee'
            : `/dashboard/employee/${resolved.tab}`;
        router.push(targetRoute, { scroll: false });
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return <OverviewTab onNavigateTab={setActiveTab} />;
            case 'profile':
                return (
                    <ProfileTab
                        initialSubTab={profileSubTab}
                        onSubTabChange={setProfileSubTab}
                    />
                );
            case 'tasks':
                return <TasksTab />;
            case 'attendance':
                return <EmployeeAttendanceTab />;
            case 'production':
                return <EmployeeProductionTab />;
            case 'notifications':
                return <NotificationsTab onNavigateTab={setActiveTab} />;
            case 'support':
                return <SupportTab />;
            default:
                return <OverviewTab onNavigateTab={setActiveTab} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAFC] dark:bg-[#090D16] font-sans antialiased text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors">
            {/* Employee Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    activeTab={activeTab}
                    onNavigateTab={setActiveTab}
                    onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
                    {renderActiveTab()}
                </main>
            </div>
        </div>
    );
}
