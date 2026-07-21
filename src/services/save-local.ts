export const saveOtpContext = (
    email: string,
    purpose: "login" | "register" | "forgot-password"
) => {
    localStorage.setItem("pendingEmail", email);
    localStorage.setItem("otpPurpose", purpose);
};