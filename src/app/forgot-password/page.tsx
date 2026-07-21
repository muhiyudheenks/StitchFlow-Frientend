import type { Metadata } from 'next';
import ForgotPasswordPage from '@/components/forgot-password-page';

export const metadata: Metadata = {
    title: 'Forgot Password — StitchFlow',
};

export default function Page() {
    return <ForgotPasswordPage />;
}
