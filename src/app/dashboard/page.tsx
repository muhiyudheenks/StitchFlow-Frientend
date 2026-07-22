import AdminDashboard from "@/features/admin-dashboard";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardPage() {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (!user) return;

        router.replace(`/dashboard/${user.role}`);
    }, [user, router]);

    return <div>Loading...</div>;
}