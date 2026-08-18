'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewTab from './OverviewTab';
import EmployeesTab from './EmployeesTab';
import ManagersTab from './ManagersTab';
import SupportTicketsTab from './SupportTicketsTab';
import AnalyticsTab from './AnalyticsTab';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import QuickActionModal from './QuickActionModal';
import { AdminTab } from '../types';
import { useOverviewCards } from '../hooks/useOverviewCards';
import { AdminProductionTab as ProductionTab } from '@/modules/production';
import { AdminInventoryTab } from '@/modules/inventory';
import { AdminAttendanceTab } from '@/modules/attendance';

interface AdminDashboardProps {
    initialTab?: AdminTab;
}

export default function AdminDashboard({ initialTab = 'dashboard' }: AdminDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTabState] = useState<AdminTab>(initialTab);
    const [collapsed, setCollapsed] = useState(false);
    const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
    const [quickActionType, setQuickActionType] = useState('Add Employee');

    const [mobileOpen, setMobileOpen] = useState(false);

    // Single overview data fetch using TanStack Query
    const { data: overviewData } = useOverviewCards();

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
        if (actionType === 'Inventory' || actionType === 'Update Stock' || actionType === 'Manage Inventory') {
            setActiveTab('inventory');
            return;
        }
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
                        overviewData={overviewData}
                    />
                );
            case 'employees':
                return <EmployeesTab onOpenQuickAction={handleOpenQuickAction} />;
            case 'managers':
                return <ManagersTab onOpenQuickAction={handleOpenQuickAction} />;
            case 'production':
                return <ProductionTab onOpenQuickAction={handleOpenQuickAction} />;
            case 'inventory':
                return <AdminInventoryTab onOpenQuickAction={handleOpenQuickAction} />;
            case 'attendance':
                return <AdminAttendanceTab />;
            case 'support':
                return <SupportTicketsTab />;
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
                        overviewData={overviewData}
                    />
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAFC] dark:bg-[#090D16] font-sans antialiased text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                overviewData={overviewData}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    activeTab={activeTab}
                    onOpenQuickAction={handleOpenQuickAction}
                    onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
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
