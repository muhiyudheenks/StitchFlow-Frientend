import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
    fullName: string;
    email: string;
    companyName?: string;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authRequestStarted(state) {
            state.status = 'loading';
            state.error = null;
        },
        signInSucceeded(state, action: PayloadAction<AuthUser>) {
            state.status = 'succeeded';
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        registerSucceeded(state, action: PayloadAction<AuthUser>) {
            state.status = 'succeeded';
            state.user = action.payload;
            state.isAuthenticated = true;
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
        },
    },
});

export const {
    authRequestStarted,
    signInSucceeded,
    registerSucceeded,
    authRequestFailed,
    signedOut,
} = authSlice.actions;

export default authSlice.reducer;