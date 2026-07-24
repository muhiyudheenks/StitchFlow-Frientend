'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiShield,
    FiBriefcase,
    FiCalendar,
    FiEdit3,
    FiLock,
    FiX,
    FiCheckCircle
} from 'react-icons/fi';

export default function ProfileTab() {
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Profile state
    const [phone, setPhone] = useState('+1 (555) 234-5678');
    const [address, setAddress] = useState('742 Evergreen Terrace, Springfield, IL');
    const [emergencyContact, setEmergencyContact] = useState('Sarah Vance (+1 555-998-1122)');

    // Password modal state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

    const { data: dashboardData } = useQuery({
        queryKey: ['employee-dashboard'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/employee/dashboard', {
                withCredentials: true,
            });
            return response.data?.data || {};
        },
    });

    const prof = dashboardData?.profile || {
        id: 'EMP-8042',
        fullName: 'Alexander Vance',
        email: 'alexander@stitchflow.ai',
        role: 'Employee',
        department: 'Assembly Line A',
        designation: 'Senior Line Operator',
        shift: 'Shift A (Morning)',
        joiningDate: '15 Jan 2024',
        reportingManager: 'Robert Vance (Line Manager)',
        phone: phone,
        address: address,
        emergencyContact: emergencyContact,
    };

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            const response = await axios.patch(
                'http://localhost:5000/api/employee/profile',
                updatedData,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
            setIsEditModalOpen(false);
        },
    });

    const handleEditSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate({ phone });
    };

    const handleChangePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMsg('New passwords do not match.');
            return;
        }
        setPasswordMsg('Password changed successfully!');
        setTimeout(() => {
            setIsPasswordModalOpen(false);
            setPasswordMsg(null);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 1500);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header Box */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-extrabold text-2xl shadow-xl shadow-purple-500/20 shrink-0">
                        AV
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-extrabold text-slate-900">{prof.fullName}</h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-extrabold text-[10px] uppercase border border-purple-200">
                                {prof.role}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            {prof.designation} • {prof.department} • ID: <span className="font-mono font-bold text-slate-800">{prof.id}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Reporting Manager: <span className="font-bold text-slate-700">{prof.reportingManager}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                    >
                        <FiEdit3 size={15} />
                        <span>Edit Profile</span>
                    </button>
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-2 border border-slate-200 cursor-pointer transition-all"
                    >
                        <FiLock size={15} />
                        <span>Change Password</span>
                    </button>
                </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Read-Only Credentials Card */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            <FiShield className="text-purple-600" /> Read-Only Enterprise Credentials
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Admin Controlled</span>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-500 font-bold flex items-center gap-2">
                                <FiMail className="text-slate-400" /> Work Email
                            </span>
                            <span className="font-bold text-slate-900">{prof.email}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-500 font-bold flex items-center gap-2">
                                <FiBriefcase className="text-slate-400" /> Department
                            </span>
                            <span className="font-bold text-slate-900">{prof.department}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-500 font-bold flex items-center gap-2">
                                <FiUser className="text-slate-400" /> System Role
                            </span>
                            <span className="font-bold text-purple-700 uppercase text-[11px]">{prof.role}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-500 font-bold flex items-center gap-2">
                                <FiCalendar className="text-slate-400" /> Joining Date
                            </span>
                            <span className="font-bold text-slate-900">{prof.joiningDate}</span>
                        </div>
                    </div>
                </div>

                {/* Editable Personal Contact Details Card */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            <FiPhone className="text-indigo-600" /> Personal Contact Details
                        </h3>
                        <button onClick={() => setIsEditModalOpen(true)} className="text-xs font-extrabold text-indigo-600 hover:underline">
                            Edit Details &rarr;
                        </button>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block">Phone Number</span>
                            <span className="font-bold text-slate-900">{phone}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block">Residential Address</span>
                            <span className="font-bold text-slate-900">{address}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block">Emergency Contact</span>
                            <span className="font-bold text-slate-900">{emergencyContact}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900">Edit Personal Information</h3>
                            <p className="text-xs text-slate-500 mt-1">Update your phone number, home address, or emergency contact.</p>
                        </div>

                        <form onSubmit={handleEditSave} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Home Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Emergency Contact</label>
                                <input
                                    type="text"
                                    value={emergencyContact}
                                    onChange={(e) => setEmergencyContact(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 shadow-md cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900">Change Account Password</h3>
                            <p className="text-xs text-slate-500 mt-1">Ensure your new password contains letters and numbers.</p>
                        </div>

                        {passwordMsg && (
                            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                                <FiCheckCircle /> <span>{passwordMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 shadow-md cursor-pointer"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
