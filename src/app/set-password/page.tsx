import type { Metadata } from 'next';
import { SetPasswordPage } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Set Account Password — StitchFlow AI',
};

interface PageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function SetPasswordQueryPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    return <SetPasswordPage token={resolvedSearchParams.token || ''} />;
}
