import { z } from 'zod';

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(1, 'Full name is required.')
            .min(2, 'Full name must be at least 2 characters.'),
        email: z
            .string()
            .trim()
            .min(1, 'Email is required.')
            .email('Enter a valid email address.'),
        password: z
            .string()
            .min(1, 'Password is required.')
            .min(8, 'Password must be at least 8 characters.')
            .regex(/[A-Za-z]/, 'Password must contain at least one letter.')
            .regex(/[0-9]/, 'Password must contain at least one number.'),
        confirmPassword: z.string().min(1, 'Please confirm your password.'),
        agreeTerms: z.boolean().refine((val) => val === true, {
            message: 'Please agree to the Terms & Conditions.',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export type RegisterPageValues = z.infer<typeof registerSchema>;

export const LoginSchema = z.object({
    email: z.string().trim().min(1, 'Username or email is required.'),
    password: z.string().min(1, 'Password is required.'),
    remember: z.boolean().optional(),
});

export type LoginPageValues = z.infer<typeof LoginSchema>;

export const otpSchema = z.object({
    otp: z
        .array(z.string())
        .length(6)
        .refine((digits) => digits.every((d) => /^\d$/.test(d)), {
            message: 'Please enter the complete 6-digit code.',
        }),
});

export type OtpValues = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required.')
        .email('Enter a valid email address.'),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(1, 'Password is required.')
            .min(8, 'Password must be at least 8 characters.')
            .regex(/[A-Za-z]/, 'Password must contain at least one letter.')
            .regex(/[0-9]/, 'Password must contain at least one number.'),
        confirmPassword: z.string().min(1, 'Please confirm your password.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;