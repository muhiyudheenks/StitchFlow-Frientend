'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewTab from './OverviewTab';
import ProfileTab from './ProfileTab';
import TasksTab from './TasksTab';
import PerformanceTab from './PerformanceTab';
import SalaryTab from './SalaryTab';
import NotificationsTab from './NotificationsTab';
import SupportTab from './SupportTab';
import { EmployeeTab } from '../types';
import { EmployeeAttendanceTab } from '@/features/attendance';
import { EmployeeProductionTab } from '@/features/production';

interface EmployeeDashboardProps {
    initialTab?: EmployeeTab;
}

export default function EmployeeDashboard({ initialTab = 'dashboard' }: EmployeeDashboardProps) {
    const router = useRouter();
    const effectiveInitialTab = initialTab === ('leave' as any) ? 'attendance' : initialTab;
    const [activeTab, setActiveTabState] = useState<EmployeeTab>(effectiveInitialTab);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (initialTab) {
            if ((initialTab as string) === 'leave') {
                setActiveTabState('attendance');
                router.replace('/dashboard/employee/attendance', { scroll: false });
            } else {
                setActiveTabState(initialTab);
            }
        }
    }, [initialTab, router]);

    const setActiveTab = (tab: EmployeeTab) => {
        const targetTab = (tab as string) === 'leave' ? 'attendance' : tab;
        setActiveTabState(targetTab);
        const targetRoute = targetTab === 'dashboard' ? '/dashboard/employee' : `/dashboard/employee/${targetTab}`;
        router.push(targetRoute, { scroll: false });
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return <OverviewTab onNavigateTab={setActiveTab} />;
            case 'profile':
                return <ProfileTab />;
            case 'tasks':
                return <TasksTab />;
            case 'attendance':
                return <EmployeeAttendanceTab />;
            case 'production':
                return <EmployeeProductionTab />;
            case 'performance':
                return <PerformanceTab />;
            case 'salary':
                return <SalaryTab />;
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
