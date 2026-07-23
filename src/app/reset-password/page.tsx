import type { Metadata } from 'next';
import { ResetPasswordPage } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Reset Password — StitchFlow',
};

export default function Page() {
    return <ResetPasswordPage />;
}
