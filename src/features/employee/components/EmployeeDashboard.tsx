'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewTab from './OverviewTab';
import ProfileTab from './ProfileTab';
import TasksTab from './TasksTab';
import AttendanceTab from './AttendanceTab';
import LeaveTab from './LeaveTab';
import ProductionTab from './ProductionTab';
import PerformanceTab from './PerformanceTab';
import SalaryTab from './SalaryTab';
import NotificationsTab from './NotificationsTab';
import SupportTab from './SupportTab';
import { EmployeeTab } from '../types';

interface EmployeeDashboardProps {
    initialTab?: EmployeeTab;
}

export default function EmployeeDashboard({ initialTab = 'dashboard' }: EmployeeDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTabState] = useState<EmployeeTab>(initialTab);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (initialTab) {
            setActiveTabState(initialTab);
        }
    }, [initialTab]);

    const setActiveTab = (tab: EmployeeTab) => {
        setActiveTabState(tab);
        const targetRoute = tab === 'dashboard' ? '/dashboard/employee' : `/dashboard/employee/${tab}`;
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
                return <AttendanceTab />;
            case 'leave':
                return <LeaveTab />;
            case 'production':
                return <ProductionTab />;
            case 'performance':
                return <PerformanceTab />;
            case 'salary':
                return <SalaryTab />;
            case 'notifications':
                return <NotificationsTab />;
            case 'support':
                return <SupportTab />;
            default:
                return <OverviewTab onNavigateTab={setActiveTab} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAFC] font-sans antialiased text-slate-900 selection:bg-purple-500 selection:text-white">
            {/* Employee Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Main Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    activeTab={activeTab}
                    onNavigateTab={setActiveTab}
                />

                <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
                    {renderActiveTab()}
                </main>
            </div>
        </div>
    );
}
