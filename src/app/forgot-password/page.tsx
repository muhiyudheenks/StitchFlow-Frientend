import type { Metadata } from 'next';
import { ForgotPasswordPage } from '@/modules/auth';

export const metadata: Metadata = {
    title: 'Forgot Password — StitchFlow',
};

export default function Page() {
    return <ForgotPasswordPage />;
}
