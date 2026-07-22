import AdminDashboard from "@/features/admin-dashboard";

export default function DashboardPage() {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (!user) return;

        router.replace(`/dashboard/${user.role}`);
    }, [user, router]);

    return <div>Loading...</div>;
}