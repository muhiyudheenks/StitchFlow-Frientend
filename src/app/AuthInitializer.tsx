'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { signInSucceeded } from '@/store/slices/authSlice';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log("AuthInitializer Running");

        const user = localStorage.getItem("user");

        console.log("Local Storage User:", user);

        if (user) {
            const parsedUser = JSON.parse(user);

            console.log("Parsed User:", parsedUser);

            dispatch(signInSucceeded(parsedUser));
        }
    }, [dispatch]);
    return null;
}