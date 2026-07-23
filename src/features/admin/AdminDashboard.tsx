'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import UserManagementTab from './components/UserManagementTab';
import EmployeesTab from './components/EmployeesTab';
import ManagersTab from './components/ManagersTab';
import ProductionTab from './components/ProductionTab';
import InventoryTab from './components/InventoryTab';
import AttendanceTab from './components/AttendanceTab';
import AnalyticsTab from './components/AnalyticsTab';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';
import QuickActionModal from './components/QuickActionModal';
import { AdminTab } from './types';

interface AdminDashboardProps {
    initialTab?: AdminTab;
}

export default function AdminDashboard({ initialTab = 'dashboard' }: AdminDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTabState] = useState<AdminTab>(initialTab);
    const [collapsed, setCollapsed] = useState(false);
    const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
    const [quickActionType, setQuickActionType] = useState('Add Employee');

    useEffect(() => {
        if (initialTab) {
            setActiveTabState(initialTab);
        }
    }, [initialTab]);

    const setActiveTab = (tab: AdminTab) => {
        setActiveTabState(tab);
        const targetRoute = tab === 'dashboard' ? '/dashboard/admin' : `/dashboard/admin/${tab}`;
        router.push(targetRoute, { scroll: false });
    };

    const handleOpenQuickAction = (actionType: string) => {
        setQuickActionType(actionType);
        setIsQuickActionOpen(true);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <OverviewTab
                        onOpenQuickAction={handleOpenQuickAction}
                        onNavigateTab={setActiveTab}
                    />
                );
            case 'users':
                return <UserManagementTab />;
            case 'employees':
                return <EmployeesTab onOpenQuickAction={handleOpenQuickAction} />;
            case 'managers':
                return <ManagersTab onOpenQuickAction={handleOpenQuickAction} />;
            case 'production':
                return <ProductionTab onOpenQuickAction={handleOpenQuickAction} />;
            case 'inventory':
                return <InventoryTab onOpenQuickAction={handleOpenQuickAction} />;
            case 'attendance':
                return <AttendanceTab />;
            case 'analytics':
                return <AnalyticsTab />;
            case 'reports':
                return <ReportsTab />;
            case 'settings':
                return <SettingsTab />;
            default:
                return (
                    <OverviewTab
                        onOpenQuickAction={handleOpenQuickAction}
                        onNavigateTab={setActiveTab}
                    />
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAFC] font-sans antialiased text-slate-900 selection:bg-purple-500 selection:text-white">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    activeTab={activeTab}
                    onOpenQuickAction={handleOpenQuickAction}
                />

                <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
                    {renderActiveTab()}
                </main>
            </div>

            {/* Quick Action Modal */}
            <QuickActionModal
                isOpen={isQuickActionOpen}
                actionType={quickActionType}
                onClose={() => setIsQuickActionOpen(false)}
            />
        </div>
    );
}
