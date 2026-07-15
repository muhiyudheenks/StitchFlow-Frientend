import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import authReducer from "./slices/authSlice"

export const makeStore = () =>
    configureStore({
        reducer: {
            app: appReducer,
            auth: authReducer,
        },
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];