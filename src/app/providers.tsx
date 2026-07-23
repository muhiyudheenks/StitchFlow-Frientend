'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthInitializer from '@/features/auth/components/AuthInitializer';

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
                <AuthInitializer />
                {children}
            </QueryClientProvider>
        </Provider>
    );
}