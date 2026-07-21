import type { Metadata } from 'next';
import PasswordUpdatedPage from '@/components/password-updated-page';

export const metadata: Metadata = {
    title: 'Password Updated — StitchFlow',
};

export default function Page() {
    return <PasswordUpdatedPage />;
}
