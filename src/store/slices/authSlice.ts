import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    role: "employee" | "admin" | "manager";
    companyName?: string;
    isVerified: boolean;
    isBlock: boolean;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    /** Email waiting for OTP verification (set after login/register API succeeds) */
    pendingEmail: string | null;
    /** Whether the pending OTP is for 'registration' or 'login' */
    otpPurpose: 'registration' | 'login' | null;
    resetEmail: string | null;

}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
    pendingEmail: null,
    otpPurpose: null,
    resetEmail: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authRequestStarted(state) {
            state.status = 'loading';
            state.error = null;
        },
        /** Called when login API returns 200 with requiresOtp — OTP has been sent */
        otpRequired(state, action: PayloadAction<{ email: string; purpose: 'registration' | 'login' }>) {
            state.status = 'idle';
            state.pendingEmail = action.payload.email;
            state.otpPurpose = action.payload.purpose;
            state.error = null;
        },
        signInSucceeded(state, action: PayloadAction<AuthUser>) {
            state.status = 'succeeded';
            state.user = action.payload;
            state.isAuthenticated = true;
            state.pendingEmail = null;
            state.otpPurpose = null;
            state.error = null;
        },
        registerSucceeded(state, action: PayloadAction<AuthUser>) {
            state.status = 'succeeded';
            state.user = action.payload;
            state.isAuthenticated = true;
            state.pendingEmail = null;
            state.otpPurpose = null;
            state.error = null;
        },
        authRequestFailed(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },
        signedOut(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
            state.pendingEmail = null;
            state.otpPurpose = null;
            state.resetEmail = null;

        },
        setResetEmail(
            state,
            action: PayloadAction<string>
        ) {
            state.resetEmail = action.payload;
        },
    },
});

export const {
    authRequestStarted,
    otpRequired,
    signInSucceeded,
    registerSucceeded,
    authRequestFailed,
    signedOut,
    setResetEmail,

} = authSlice.actions;

export default authSlice.reducer;