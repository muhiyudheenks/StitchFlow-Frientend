import { ManagerDashboard } from '@/features/manager';
import { ManagerTab } from '@/features/manager/types';

interface ManagerTabPageProps {
    params: Promise<{ tab: string }>;
}

export default async function ManagerTabPage({ params }: ManagerTabPageProps) {
    const resolvedParams = await params;
    const tab = resolvedParams.tab as ManagerTab;
    return <ManagerDashboard initialTab={tab} />;
}
