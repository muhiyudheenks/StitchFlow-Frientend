import type { Metadata } from 'next';
import { SetPasswordPage } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Set Account Password — StitchFlow AI',
};

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function SetPasswordTokenPage({ params }: PageProps) {
    const resolvedParams = await params;
    return <SetPasswordPage token={resolvedParams.token} />;
}
