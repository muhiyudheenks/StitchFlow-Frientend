import LoginPage from "@/components/Login-page/LoginPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in — StitchFlow",
};

export default function Page() {
    return <LoginPage />;
}