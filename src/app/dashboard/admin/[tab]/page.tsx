import { AdminDashboard } from "@/modules/admin";
import { AdminTab } from "@/modules/admin/types";

interface PageProps {
    params: Promise<{ tab: string }>;
}

export default async function AdminTabPage({ params }: PageProps) {
    const resolvedParams = await params;
    const tab = resolvedParams.tab as AdminTab;
    return <AdminDashboard initialTab={tab} />;
}
