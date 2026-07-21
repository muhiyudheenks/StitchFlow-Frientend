import type { Metadata } from 'next';
import RegisterPage from '@/components/register-page';

export const metadata: Metadata = {
    title: 'Create account — StitchFlow',
};

export default function CreateAccount() {
    return <RegisterPage />;
}