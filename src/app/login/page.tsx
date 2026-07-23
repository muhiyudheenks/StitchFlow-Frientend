import { LoginPage } from "@/features/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in — StitchFlow",
};

export default function Page() {
    return <LoginPage />;
}