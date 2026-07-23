'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    FiUserPlus,
    FiSearch,
    FiFilter,
    FiUser,
    FiMail,
    FiBriefcase,
    FiCheckCircle,
    FiClock,
    FiX,
    FiShield,
    FiRefreshCw
} from 'react-icons/fi';

const addUserSchema = z.object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters.'),
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    role: z.enum(['employee', 'manager']),
    department: z.string().optional(),
    designation: z.string().optional(),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface ManagedUser {
    id: string;
    fullName: string;
    email: string;
    role: 'employee' | 'manager' | 'admin';
    department?: string;
    designation?: string;
    isVerified: boolean;
    isBlock: boolean;
    createdAt?: string;
    setupPasswordExpire?: string;
}

export default function UserManagementTab() {
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'employee' | 'manager'>('all');
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch managed users from backend
    const { data: users = [], isLoading, refetch } = useQuery<ManagedUser[]>({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                withCredentials: true,
            });
            return response.data?.data || [];
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddUserFormValues>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            fullName: '',
            email: '',
            role: 'employee',
            department: 'Production',
            designation: 'Line Operator',
        },
    });

    // Create user mutation
    const createUserMutation = useMutation<
        any,
        AxiosError<{ message?: string }>,
        AddUserFormValues
    >({
        mutationFn: async (data) => {
            const response = await axios.post(
                'http://localhost:5000/api/admin/users/create',
                data,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: (data) => {
            setSuccessMessage(data?.message || 'User created! Invitation email sent.');
            setServerError(null);
            reset();
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            setTimeout(() => setSuccessMessage(null), 5000);
        },
        onError: (err) => {
            const msg = err.response?.data?.message || 'Failed to create user. Please try again.';
            setServerError(msg);
        },
    });

    const onSubmit = (data: AddUserFormValues) => {
        setServerError(null);
        createUserMutation.mutate(data);
    };

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl">
                <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-300 mb-1">
                        <FiShield className="text-purple-400" />
                        <span>Workforce Administration</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Admin User Management</h1>
                    <p className="text-xs text-slate-300 mt-1">
                        Provision new Employee &amp; Manager accounts with email password setup invitations.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setServerError(null);
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                    <FiUserPlus size={16} />
                    <span>Add New User</span>
                </button>
            </div>

            {/* Alert Banner */}
            {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
                    <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-600 text-base" />
                        <span>{successMessage}</span>
                    </div>
                    <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
                        <FiX />
                    </button>
                </div>
            )}

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:bg-white transition-all text-slate-800 font-medium"
                    />
                </div>

                {/* Role Tabs */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-extrabold text-slate-500 flex items-center gap-1">
                        <FiFilter size={12} /> Filter:
                    </span>
                    {(['all', 'employee', 'manager'] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${roleFilter === r
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors ml-auto sm:ml-2"
                        title="Refresh user list"
                    >
                        <FiRefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6">User</th>
                                <th className="py-4 px-6">Role</th>
                                <th className="py-4 px-6">Department</th>
                                <th className="py-4 px-6">Designation</th>
                                <th className="py-4 px-6">Account Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        <div className="inline-flex items-center gap-2 font-semibold">
                                            <span className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                                            <span>Loading user accounts...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-extrabold text-xs">
                                                    {user.fullName.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.fullName}</div>
                                                    <div className="text-[11px] text-slate-400 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider ${user.role === 'manager'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-slate-700">
                                            {user.department || 'General'}
                                        </td>
                                        <td className="py-4 px-6 font-medium text-slate-600">
                                            {user.designation || 'Staff'}
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                                    <FiCheckCircle size={12} /> Active &amp; Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                                                    <FiClock size={12} /> Pending Password Setup
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-3">
                                <FiUserPlus size={20} />
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900">Add New User</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                An invitation email will be sent to the user to set up their password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {serverError && (
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                                    {serverError}
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        className="w-full h-11 pl-10 pr-4 text-xs border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                                        {...register('fullName')}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.fullName.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="email"
                                        placeholder="e.g. john@factory.com"
                                        className="w-full h-11 pl-10 pr-4 text-xs border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Select Role *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-purple-400 cursor-pointer font-bold text-xs text-slate-700 has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50 has-[:checked]:text-purple-700 transition-all">
                                        <input
                                            type="radio"
                                            value="employee"
                                            className="accent-purple-600"
                                            {...register('role')}
                                        />
                                        <span>Employee</span>
                                    </label>
                                    <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-purple-400 cursor-pointer font-bold text-xs text-slate-700 has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50 has-[:checked]:text-purple-700 transition-all">
                                        <input
                                            type="radio"
                                            value="manager"
                                            className="accent-purple-600"
                                            {...register('role')}
                                        />
                                        <span>Manager</span>
                                    </label>
                                </div>
                                {errors.role && (
                                    <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.role.message}</p>
                                )}
                            </div>

                            {/* Department & Designation (Optional) */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Assembly"
                                        className="w-full h-10 px-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-purple-500 transition-all"
                                        {...register('department')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                                        Designation
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Line Lead"
                                        className="w-full h-10 px-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-purple-500 transition-all"
                                        {...register('designation')}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createUserMutation.isPending}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                                >
                                    {createUserMutation.isPending ? (
                                        <>
                                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                            <span>Sending Invitation…</span>
                                        </>
                                    ) : (
                                        <span>Create &amp; Send Email</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
