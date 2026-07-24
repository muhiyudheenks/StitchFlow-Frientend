import { EmployeeDashboard } from '@/features/employee';
import { EmployeeTab } from '@/features/employee/types';

interface EmployeeTabPageProps {
    params: Promise<{ tab: string }>;
}

export default async function EmployeeTabPage({ params }: EmployeeTabPageProps) {
    const resolvedParams = await params;
    const tab = resolvedParams.tab as EmployeeTab;
    return <EmployeeDashboard initialTab={tab} />;
}
