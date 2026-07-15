// import type { Metadata } from 'next';
// import SignInPage from '@/components/SignInPage';

// export const metadata: Metadata = {
//     title: 'Sign in — StitchFlow',
// };

// export default function SignInPage() {
//     return <SignInPage />;
// }

import type { Metadata } from "next";
import SignInPage from "@/components/SignInPage";

export const metadata: Metadata = {
    title: "Sign in — StitchFlow",
};

export default function Page() {
    return <SignInPage />;
}