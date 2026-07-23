import type { Metadata } from 'next';
import { ForgotPasswordPage } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Forgot Password — StitchFlow',
};

export default function Page() {
    return <ForgotPasswordPage />;
}
