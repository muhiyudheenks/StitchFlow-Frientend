'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthInitializer from './AuthInitializer';
import ThemeProvider from '@/shared/components/ThemeProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }: { children: ReactNode }) {

    const [store] = useState(() => makeStore());

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    }));

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <GoogleOAuthProvider
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
                >
                    <ThemeProvider>
                        <AuthInitializer />

                        {children}

                    </ThemeProvider>
                </GoogleOAuthProvider>
            </QueryClientProvider>
        </Provider>
    );
}