'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config';
import {
    FiSettings,
    FiClock,
    FiTrendingUp,
    FiBox,
    FiBell,
    FiFileText,
    FiAlertTriangle,
    FiSave,
    FiCheckCircle,
    FiAlertCircle,
    FiRefreshCw,
} from 'react-icons/fi';

interface SystemSettingsData {
    factoryName: string;
    superAdminEmail: string;
    phone: string;
    address: string;

    shiftStartTime: string;
    shiftEndTime: string;
    lateAfterMinutes: number;
    halfDayThresholdHours: number;
    minFullDayHours: number;

    defaultProductionTarget: number;
    efficiencyAlertThreshold: number;

    lowStockThreshold: number;
    criticalStockThreshold: number;

    enableInAppNotifications: boolean;
    enableEmailNotifications: boolean;
    enableProductionAlerts: boolean;
    enableInventoryAlerts: boolean;
    enableAttendanceAlerts: boolean;
    enableSupportTicketNotifications: boolean;

    enableDailyAttendanceSummary: boolean;
    attendanceSummaryTime: string;

    alertSupervisorLowEfficiency: boolean;
    notifyManagerLowStock: boolean;
    automatedDailyAttendancePdf: boolean;
}

const defaultState: SystemSettingsData = {
    factoryName: 'StitchFlow Apparel Plant #01',
    superAdminEmail: 'admin@stitchflow.com',
    phone: '+91 98765 43210',
    address: 'Industrial Plot #42, Garment Tech Zone, Bangalore, Karnataka - 560099',

    shiftStartTime: '09:00 AM',
    shiftEndTime: '05:00 PM',
    lateAfterMinutes: 15,
    halfDayThresholdHours: 4,
    minFullDayHours: 8,

    defaultProductionTarget: 1000,
    efficiencyAlertThreshold: 85,

    lowStockThreshold: 100,
    criticalStockThreshold: 25,

    enableInAppNotifications: true,
    enableEmailNotifications: true,
    enableProductionAlerts: true,
    enableInventoryAlerts: true,
    enableAttendanceAlerts: true,
    enableSupportTicketNotifications: true,

    enableDailyAttendanceSummary: true,
    attendanceSummaryTime: '06:00 PM',

    alertSupervisorLowEfficiency: true,
    notifyManagerLowStock: true,
    automatedDailyAttendancePdf: true,
};

export default function SettingsTab() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<SystemSettingsData>(defaultState);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Fetch System Settings from Backend
    const { data: fetchedSettings, isLoading, isError, refetch } = useQuery({
        queryKey: ['system-settings'],
        queryFn: async () => {
            const res = await api.get('/api/settings');
            return res.data?.data as SystemSettingsData;
        },
    });

    useEffect(() => {
        if (fetchedSettings) {
            setFormData({
                factoryName: fetchedSettings.factoryName || defaultState.factoryName,
                superAdminEmail: fetchedSettings.superAdminEmail || defaultState.superAdminEmail,
                phone: fetchedSettings.phone || defaultState.phone,
                address: fetchedSettings.address || defaultState.address,

                shiftStartTime: fetchedSettings.shiftStartTime || defaultState.shiftStartTime,
                shiftEndTime: fetchedSettings.shiftEndTime || defaultState.shiftEndTime,
                lateAfterMinutes: fetchedSettings.lateAfterMinutes ?? defaultState.lateAfterMinutes,
                halfDayThresholdHours: fetchedSettings.halfDayThresholdHours ?? defaultState.halfDayThresholdHours,
                minFullDayHours: fetchedSettings.minFullDayHours ?? defaultState.minFullDayHours,

                defaultProductionTarget: fetchedSettings.defaultProductionTarget ?? defaultState.defaultProductionTarget,
                efficiencyAlertThreshold: fetchedSettings.efficiencyAlertThreshold ?? defaultState.efficiencyAlertThreshold,

                lowStockThreshold: fetchedSettings.lowStockThreshold ?? defaultState.lowStockThreshold,
                criticalStockThreshold: fetchedSettings.criticalStockThreshold ?? defaultState.criticalStockThreshold,

                enableInAppNotifications: fetchedSettings.enableInAppNotifications ?? defaultState.enableInAppNotifications,
                enableEmailNotifications: fetchedSettings.enableEmailNotifications ?? defaultState.enableEmailNotifications,
                enableProductionAlerts: fetchedSettings.enableProductionAlerts ?? defaultState.enableProductionAlerts,
                enableInventoryAlerts: fetchedSettings.enableInventoryAlerts ?? defaultState.enableInventoryAlerts,
                enableAttendanceAlerts: fetchedSettings.enableAttendanceAlerts ?? defaultState.enableAttendanceAlerts,
                enableSupportTicketNotifications: fetchedSettings.enableSupportTicketNotifications ?? defaultState.enableSupportTicketNotifications,

                enableDailyAttendanceSummary: fetchedSettings.enableDailyAttendanceSummary ?? defaultState.enableDailyAttendanceSummary,
                attendanceSummaryTime: fetchedSettings.attendanceSummaryTime || defaultState.attendanceSummaryTime,

                alertSupervisorLowEfficiency: fetchedSettings.alertSupervisorLowEfficiency ?? defaultState.alertSupervisorLowEfficiency,
                notifyManagerLowStock: fetchedSettings.notifyManagerLowStock ?? defaultState.notifyManagerLowStock,
                automatedDailyAttendancePdf: fetchedSettings.automatedDailyAttendancePdf ?? defaultState.automatedDailyAttendancePdf,
            });
        }
    }, [fetchedSettings]);

    // Save Settings Mutation
    const updateMutation = useMutation({
        mutationFn: async (payload: SystemSettingsData) => {
            const res = await api.patch('/api/settings', payload);
            return res.data;
        },
        onSuccess: () => {
            setStatusMsg({ type: 'success', text: 'System Configuration Saved Successfully!' });
            queryClient.invalidateQueries({ queryKey: ['system-settings'] });
            setTimeout(() => setStatusMsg(null), 4000);
        },
        onError: (err: any) => {
            setStatusMsg({
                type: 'error',
                text: err.response?.data?.message || 'Failed to save settings. Please try again.',
            });
        },
    });

    const handleChange = (field: keyof SystemSettingsData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMsg(null);
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px] text-slate-500 gap-2 text-xs font-bold">
                <FiRefreshCw className="animate-spin text-purple-600" size={18} />
                <span>Loading system settings from database...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans max-w-4xl pb-12">
            {/* Top Banner Header */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <FiSettings className="text-purple-600 dark:text-purple-400" />
                        <span>System & Organization Configuration</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Manage plant parameters, attendance thresholds, QMS alerts, inventory limits, and automated reports
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="self-start sm:self-center px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Reload from DB"
                >
                    <FiRefreshCw size={13} /> Reload
                </button>
            </div>

            {/* Status Alert Message */}
            {statusMsg && (
                <div
                    className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-sm transition-all ${
                        statusMsg.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                    }`}
                >
                    {statusMsg.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
                    <span>{statusMsg.text}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                {/* 1. PLANT & ENTERPRISE DETAILS */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <FiSettings className="text-purple-600 dark:text-purple-400" size={20} />
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">1. Plant &amp; Enterprise Details</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Core factory identity and contact parameters</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Factory Name</label>
                            <input
                                type="text"
                                value={formData.factoryName}
                                onChange={(e) => handleChange('factoryName', e.target.value)}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Super Admin Contact Email</label>
                            <input
                                type="email"
                                value={formData.superAdminEmail}
                                onChange={(e) => handleChange('superAdminEmail', e.target.value)}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Factory Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 2. ATTENDANCE SETTINGS */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <FiClock className="text-indigo-600 dark:text-indigo-400" size={20} />
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">2. Attendance Settings</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Shift timing, late arrival tolerance, and work hour thresholds</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Shift Start Time</label>
                            <input
                                type="text"
                                placeholder="09:00 AM"
                                value={formData.shiftStartTime}
                                onChange={(e) => handleChange('shiftStartTime', e.target.value)}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Shift End Time</label>
                            <input
                                type="text"
                                placeholder="05:00 PM"
                                value={formData.shiftEndTime}
                                onChange={(e) => handleChange('shiftEndTime', e.target.value)}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Late After (Minutes)</label>
                            <input
                                type="number"
                                min="0"
                                max="120"
                                value={formData.lateAfterMinutes}
                                onChange={(e) => handleChange('lateAfterMinutes', Number(e.target.value))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Half Day Threshold (Hours)</label>
                            <input
                                type="number"
                                min="1"
                                max="12"
                                step="0.5"
                                value={formData.halfDayThresholdHours}
                                onChange={(e) => handleChange('halfDayThresholdHours', Number(e.target.value))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Min Full Day Work Hours</label>
                            <input
                                type="number"
                                min="1"
                                max="16"
                                step="0.5"
                                value={formData.minFullDayHours}
                                onChange={(e) => handleChange('minFullDayHours', Number(e.target.value))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 3. PRODUCTION SETTINGS */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <FiTrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">3. Production Settings</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Target daily production goals and assembly line efficiency trigger limits</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Default Production Target (Units/Day)</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.defaultProductionTarget}
                                onChange={(e) => handleChange('defaultProductionTarget', Number(e.target.value))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Efficiency Alert Threshold (%)</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={formData.efficiencyAlertThreshold}
                                onChange={(e) => handleChange('efficiencyAlertThreshold', Number(e.target.value))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 4. INVENTORY SETTINGS */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <FiBox className="text-amber-600 dark:text-amber-400" size={20} />
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">4. Inventory Settings</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Stock level warning &amp; emergency replenishment thresholds</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Low Stock Threshold (Units)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.lowStockThreshold}
                                onChange={(e) => handleChange('lowStockThreshold', Number(e.target.value))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Critical Stock Threshold (Units)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.criticalStockThreshold}
                                onChange={(e) => handleChange('criticalStockThreshold', Number(e.target.value))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                                required
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 5. NOTIFICATION SETTINGS */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <FiBell className="text-purple-600 dark:text-purple-400" size={20} />
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">5. Notification Settings</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Channel preferences and module notification toggles</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Enable In-App Notifications</span>
                            <input
                                type="checkbox"
                                checked={formData.enableInAppNotifications}
                                onChange={(e) => handleChange('enableInAppNotifications', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Enable Email Notifications</span>
                            <input
                                type="checkbox"
                                checked={formData.enableEmailNotifications}
                                onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Enable Production Alerts</span>
                            <input
                                type="checkbox"
                                checked={formData.enableProductionAlerts}
                                onChange={(e) => handleChange('enableProductionAlerts', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Enable Inventory Alerts</span>
                            <input
                                type="checkbox"
                                checked={formData.enableInventoryAlerts}
                                onChange={(e) => handleChange('enableInventoryAlerts', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Enable Attendance Alerts</span>
                            <input
                                type="checkbox"
                                checked={formData.enableAttendanceAlerts}
                                onChange={(e) => handleChange('enableAttendanceAlerts', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Enable Support Ticket Notifications</span>
                            <input
                                type="checkbox"
                                checked={formData.enableSupportTicketNotifications}
                                onChange={(e) => handleChange('enableSupportTicketNotifications', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>
                    </div>
                </motion.div>

                {/* 6. AUTOMATED REPORT SETTINGS */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <FiFileText className="text-blue-600 dark:text-blue-400" size={20} />
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">6. Automated Report Settings</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Daily attendance summary report schedule and delivery settings</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Enable Daily Attendance Summary</span>
                            <input
                                type="checkbox"
                                checked={formData.enableDailyAttendanceSummary}
                                onChange={(e) => handleChange('enableDailyAttendanceSummary', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Attendance Summary Delivery Time</label>
                            <input
                                type="text"
                                placeholder="06:00 PM"
                                value={formData.attendanceSummaryTime}
                                onChange={(e) => handleChange('attendanceSummaryTime', e.target.value)}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 7. AUTOMATED ALERT TRIGGERS */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs space-y-4"
                >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <FiAlertTriangle className="text-amber-500" size={20} />
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">7. Automated Alert Triggers</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Automatic floor notifications linked to configured thresholds</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                Alert supervisors when line efficiency drops below configured threshold ({formData.efficiencyAlertThreshold}%)
                            </span>
                            <input
                                type="checkbox"
                                checked={formData.alertSupervisorLowEfficiency}
                                onChange={(e) => handleChange('alertSupervisorLowEfficiency', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                Notify inventory manager on raw thread low stock threshold ({formData.lowStockThreshold} units)
                            </span>
                            <input
                                type="checkbox"
                                checked={formData.notifyManagerLowStock}
                                onChange={(e) => handleChange('notifyManagerLowStock', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                Automated daily attendance PDF summary at {formData.attendanceSummaryTime}
                            </span>
                            <input
                                type="checkbox"
                                checked={formData.automatedDailyAttendancePdf}
                                onChange={(e) => handleChange('automatedDailyAttendancePdf', e.target.checked)}
                                className="h-4 w-4 accent-purple-600 cursor-pointer"
                            />
                        </label>
                    </div>
                </motion.div>

                {/* 8. SAVE CHANGES BUTTON */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className={`px-8 py-3.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                            updateMutation.isPending
                                ? 'bg-purple-400 text-white cursor-not-allowed'
                                : statusMsg?.type === 'success'
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-slate-900 dark:bg-purple-600 text-white hover:bg-slate-800 dark:hover:bg-purple-700'
                        }`}
                    >
                        {updateMutation.isPending ? (
                            <>
                                <FiRefreshCw className="animate-spin" size={16} /> Saving Configuration...
                            </>
                        ) : statusMsg?.type === 'success' ? (
                            <>
                                <FiCheckCircle size={16} /> Saved to Database!
                            </>
                        ) : (
                            <>
                                <FiSave size={16} /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
