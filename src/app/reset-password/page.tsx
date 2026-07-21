import type { Metadata } from 'next';
import ResetPasswordPage from '@/components/reset-password-page';

export const metadata: Metadata = {
    title: 'Reset Password — StitchFlow',
};

export default function Page() {
    return <ResetPasswordPage />;
}
