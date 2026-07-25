export const saveOtpContext = (
    email: string,
    purpose: "login" | "forgot-password"
) => {
    localStorage.setItem("pendingEmail", email);
    localStorage.setItem("otpPurpose", purpose);
};
