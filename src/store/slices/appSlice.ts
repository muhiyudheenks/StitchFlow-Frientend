import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface HeroStat {
    label: string;
    value: string;
}

export type AuthIntent = 'signin' | 'create-account' | null;

interface AppState {
    edition: string;
    stats: HeroStat[];
    authIntent: AuthIntent;
}

const initialState: AppState = {
    edition: 'Enterprise Edition 2.0',
    stats: [
        { label: 'Units in pipeline', value: '12,402' },
        { label: 'Active lines', value: '48' },
        { label: 'On-time delivery', value: '99.2%' },
    ],
    authIntent: null,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAuthIntent(state, action: PayloadAction<AuthIntent>) {
            state.authIntent = action.payload;
        },
        setStats(state, action: PayloadAction<HeroStat[]>) {
            state.stats = action.payload;
        },
    },
});

export const { setAuthIntent, setStats } = appSlice.actions;
export default appSlice.reducer;