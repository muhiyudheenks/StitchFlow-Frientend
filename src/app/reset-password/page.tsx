import type { Metadata } from 'next';
import { ResetPasswordPage } from '@/modules/auth';

export const metadata: Metadata = {
    title: 'Reset Password — StitchFlow',
};

export default function Page() {
    return <ResetPasswordPage />;
}
