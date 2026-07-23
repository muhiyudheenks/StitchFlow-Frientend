import { AdminDashboard } from "@/features/admin";
import { AdminTab } from "@/features/admin/types";

interface PageProps {
    params: Promise<{ tab: string }>;
}

export default async function AdminTabPage({ params }: PageProps) {
    const resolvedParams = await params;
    const tab = resolvedParams.tab as AdminTab;
    return <AdminDashboard initialTab={tab} />;
}
